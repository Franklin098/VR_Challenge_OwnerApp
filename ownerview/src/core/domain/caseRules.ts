import type { Case } from '../schema/case';

/** A case can only be acted on while it is still pending. */
export function canApprove(maintenanceCase: Case): boolean {
  return maintenanceCase.status === 'pending';
}

export function canDeny(maintenanceCase: Case): boolean {
  return maintenanceCase.status === 'pending';
}

export function isDecided(maintenanceCase: Case): boolean {
  return maintenanceCase.status !== 'pending';
}
