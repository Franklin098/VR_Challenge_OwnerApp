import type { CaseOrigin, CaseStatus } from '../schema/case';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

// Hoisted formatters: creating an Intl instance is expensive, so do it once.
const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});
const weekdayFormatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' });
const monthDayFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

/** Integer cents → "$145". USD-only for the demo. */
export function formatMoney(cents: number): string {
  return usdFormatter.format(cents / 100);
}

function atMidnight(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** A short, human check-in label: "Today" · "Tomorrow" · "Fri" · "Jul 5". */
export function formatCheckIn(iso: string, now: Date = new Date()): string {
  const checkIn = new Date(iso);
  const daysAway = Math.round((atMidnight(checkIn) - atMidnight(now)) / MS_PER_DAY);

  if (daysAway <= 0) return 'Today';
  if (daysAway === 1) return 'Tomorrow';
  if (daysAway < 7) return weekdayFormatter.format(checkIn);
  return monthDayFormatter.format(checkIn);
}

const STATUS_LABELS: Record<CaseStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
  denied: 'Denied',
};

export function formatStatus(status: CaseStatus): string {
  return STATUS_LABELS[status];
}

const ORIGIN_LABELS: Record<CaseOrigin, string> = {
  pre_arrival_inspection: 'Pre-arrival inspection',
  post_departure_inspection: 'Post-departure inspection',
  vacancy_check: 'Vacancy check',
  guest_report: 'Guest report',
};

export function formatOrigin(origin: CaseOrigin): string {
  return ORIGIN_LABELS[origin];
}
