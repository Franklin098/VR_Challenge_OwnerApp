import type { Case } from '../schema/case';

/**
 * The single boundary the app reads and writes cases through. Screens never know
 * whether data comes from a mock or Supabase — they depend on this interface, so
 * a real adapter (or a web surface) can be swapped in without touching the UI.
 */
export interface CaseRepository {
  listCases(): Promise<Case[]>;
  getCase(id: string): Promise<Case | null>;
  approveCase(id: string): Promise<Case>;
  denyCase(id: string, reason: string): Promise<Case>;
}
