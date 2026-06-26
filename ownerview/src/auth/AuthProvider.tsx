import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { authenticateWithBiometrics, isBiometricAvailable } from '@/lib/biometrics';
import { getSessionToken, saveSessionToken } from '@/lib/sessionStore';

type AuthStatus = 'loading' | 'locked' | 'unlocked';

/** `device` uses real biometrics; `simulated` mocks Face ID (simulators / web). */
type BiometricMode = 'device' | 'simulated';

type AuthContextValue = {
  status: AuthStatus;
  biometricMode: BiometricMode;
  /** Attempt to unlock the stored session (Face ID prompt, then reveal app). */
  unlock: () => Promise<void>;
  lock: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** A short delay so simulated Face ID feels like a real scan. */
const SIMULATED_SCAN_MS = 600;

/** A stand-in for the refresh token a real Supabase sign-in would return. */
function createMockRefreshToken(): string {
  return `mock-refresh-${Date.now()}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [biometricMode, setBiometricMode] = useState<BiometricMode>('simulated');

  // On launch we assume the owner already signed in (on web) and we hold a
  // session: ensure a refresh token exists, then require an unlock.
  useEffect(() => {
    let active = true;
    (async () => {
      const available = await isBiometricAvailable();
      const existing = await getSessionToken();
      if (!existing) {
        await saveSessionToken(createMockRefreshToken());
      }
      if (!active) return;
      setBiometricMode(available ? 'device' : 'simulated');
      setStatus('locked');
    })();
    return () => {
      active = false;
    };
  }, []);

  const unlock = useCallback(async () => {
    if (biometricMode === 'device') {
      const passed = await authenticateWithBiometrics();
      if (!passed) return; // stay locked on cancel / failure
    } else {
      await new Promise((resolve) => setTimeout(resolve, SIMULATED_SCAN_MS));
    }
    setStatus('unlocked');
  }, [biometricMode]);

  const lock = useCallback(() => setStatus('locked'), []);

  const value = useMemo<AuthContextValue>(
    () => ({ status, biometricMode, unlock, lock }),
    [status, biometricMode, unlock, lock],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
