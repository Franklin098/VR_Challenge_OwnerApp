import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Persists the owner's session **refresh token** — never a password, never in
 * AsyncStorage. On native it lives in the Keychain/Keystore via SecureStore; on
 * web (where SecureStore is unavailable) it falls back to in-memory for the demo.
 */

const SESSION_KEY = 'ownerview.session.refreshToken';

let webMemorySession: string | null = null;

export async function getSessionToken(): Promise<string | null> {
  if (Platform.OS === 'web') return webMemorySession;
  return SecureStore.getItemAsync(SESSION_KEY);
}

export async function saveSessionToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    webMemorySession = token;
    return;
  }
  await SecureStore.setItemAsync(SESSION_KEY, token);
}

export async function clearSessionToken(): Promise<void> {
  if (Platform.OS === 'web') {
    webMemorySession = null;
    return;
  }
  await SecureStore.deleteItemAsync(SESSION_KEY);
}
