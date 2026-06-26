import { canApprove, canDeny } from '../domain/caseRules';
import type { Case, CaseStatus } from '../schema/case';
import type { CaseRepository } from './caseRepository';
import { seedCases } from './seedCases';

/** Simulated network latency so skeletons and optimistic writes are visible. */
const SIMULATED_LATENCY_MS = 400;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * In-memory repository over a mutable copy of the seed data. The default data
 * source: it runs instantly with no keys, in Expo Go and on the web.
 */
export class MockCaseRepository implements CaseRepository {
  private cases: Case[];

  constructor(seed: readonly Case[] = seedCases) {
    this.cases = seed.map((maintenanceCase) => ({ ...maintenanceCase }));
  }

  async listCases(): Promise<Case[]> {
    await wait(SIMULATED_LATENCY_MS);
    return this.cases.map((maintenanceCase) => ({ ...maintenanceCase }));
  }

  async getCase(id: string): Promise<Case | null> {
    await wait(SIMULATED_LATENCY_MS);
    const found = this.findCase(id);
    return found ? { ...found } : null;
  }

  async approveCase(id: string): Promise<Case> {
    return this.recordDecision(id, 'approved');
  }

  async denyCase(id: string, reason: string): Promise<Case> {
    return this.recordDecision(id, 'denied', reason);
  }

  private findCase(id: string): Case | undefined {
    return this.cases.find((maintenanceCase) => maintenanceCase.id === id);
  }

  private async recordDecision(
    id: string,
    status: Extract<CaseStatus, 'approved' | 'denied'>,
    reason?: string,
  ): Promise<Case> {
    await wait(SIMULATED_LATENCY_MS);

    const current = this.findCase(id);
    if (!current) {
      throw new Error(`Case ${id} not found`);
    }

    const allowed = status === 'approved' ? canApprove(current) : canDeny(current);
    if (!allowed) {
      throw new Error(`Case ${id} is already ${current.status}`);
    }

    const decided: Case = {
      ...current,
      status,
      decision: { atISO: new Date().toISOString(), ...(reason ? { reason } : {}) },
    };
    this.cases = this.cases.map((maintenanceCase) =>
      maintenanceCase.id === id ? decided : maintenanceCase,
    );
    return { ...decided };
  }
}
