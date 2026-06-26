import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { MockCaseRepository, type Case, type CaseRepository } from '@/core';

type CasesContextValue = {
  cases: Case[];
  isLoading: boolean;
  isRefreshing: boolean;
  hasError: boolean;
  refresh: () => Promise<void>;
  getById: (id: string) => Case | undefined;
  approve: (id: string) => Promise<void>;
  deny: (id: string, reason: string) => Promise<void>;
};

const CasesContext = createContext<CasesContextValue | null>(null);

/** Optimistic shape of a decided case, mirroring what the repository will return. */
function withDecision(maintenanceCase: Case, status: 'approved' | 'denied', reason?: string): Case {
  return {
    ...maintenanceCase,
    status,
    decision: { atISO: new Date().toISOString(), ...(reason ? { reason } : {}) },
  };
}

export function CasesProvider({
  children,
  repository,
}: {
  children: ReactNode;
  /** Defaults to the in-memory mock; a Supabase adapter can be injected here. */
  repository?: CaseRepository;
}) {
  const [dataSource] = useState<CaseRepository>(() => repository ?? new MockCaseRepository());

  const [cases, setCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Awaits first, so no state is set synchronously inside the mount effect.
  const fetchCases = useCallback(
    async (mode: 'initial' | 'refresh') => {
      try {
        const data = await dataSource.listCases();
        setCases(data);
        setHasError(false);
      } catch {
        setHasError(true);
      } finally {
        if (mode === 'refresh') {
          setIsRefreshing(false);
        } else {
          setIsLoading(false);
        }
      }
    },
    [dataSource],
  );

  useEffect(() => {
    void (async () => {
      await fetchCases('initial');
    })();
  }, [fetchCases]);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    return fetchCases('refresh');
  }, [fetchCases]);

  const getById = useCallback(
    (id: string) => cases.find((maintenanceCase) => maintenanceCase.id === id),
    [cases],
  );

  // Optimistically apply the decision, then reconcile with the repository. On
  // failure we re-read the repository (which never changed) to roll back.
  const decide = useCallback(
    async (id: string, status: 'approved' | 'denied', reason?: string) => {
      setCases((current) =>
        current.map((item) => (item.id === id ? withDecision(item, status, reason) : item)),
      );
      try {
        const updated =
          status === 'approved'
            ? await dataSource.approveCase(id)
            : await dataSource.denyCase(id, reason ?? '');
        setCases((current) => current.map((item) => (item.id === id ? updated : item)));
      } catch (error) {
        const restored = await dataSource.listCases();
        setCases(restored);
        throw error;
      }
    },
    [dataSource],
  );

  const approve = useCallback((id: string) => decide(id, 'approved'), [decide]);
  const deny = useCallback((id: string, reason: string) => decide(id, 'denied', reason), [decide]);

  const value = useMemo<CasesContextValue>(
    () => ({ cases, isLoading, isRefreshing, hasError, refresh, getById, approve, deny }),
    [cases, isLoading, isRefreshing, hasError, refresh, getById, approve, deny],
  );

  return <CasesContext.Provider value={value}>{children}</CasesContext.Provider>;
}

export function useCases(): CasesContextValue {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
}
