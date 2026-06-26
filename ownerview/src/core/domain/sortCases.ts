import type { Case, CaseCategory } from '../schema/case';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** How far out a check-in still adds urgency. Beyond this it no longer matters. */
const CHECK_IN_HORIZON_DAYS = 30;

/** A small, fixed bump so a leak outranks a cosmetic fix at equal timing. */
const CATEGORY_SEVERITY: Record<CaseCategory, number> = {
  plumbing: 4,
  electrical: 4,
  hvac: 3,
  appliance: 2,
  general: 1,
};

/**
 * Higher = more urgent. Decided cases sink below every pending one. For pending
 * cases, a sooner guest check-in dominates, nudged by category severity — so the
 * dishwasher with a guest arriving in two days surfaces above a distant leak.
 */
export function urgencyScore(maintenanceCase: Case, now: number = Date.now()): number {
  if (maintenanceCase.status !== 'pending') {
    return -1;
  }

  let score = CATEGORY_SEVERITY[maintenanceCase.category];

  if (maintenanceCase.guestContext) {
    const checkInAt = new Date(maintenanceCase.guestContext.nextCheckInISO).getTime();
    const daysUntilCheckIn = (checkInAt - now) / MS_PER_DAY;
    score += Math.max(0, CHECK_IN_HORIZON_DAYS - daysUntilCheckIn);
  }

  return score;
}

/** Returns a new array sorted most-urgent first; does not mutate the input. */
export function sortCasesByUrgency(cases: readonly Case[]): Case[] {
  return [...cases].sort((a, b) => urgencyScore(b) - urgencyScore(a));
}
