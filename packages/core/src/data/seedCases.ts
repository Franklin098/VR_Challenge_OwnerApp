import { caseSchema, type Case } from '../schema/case';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** ISO timestamp `days` from now (negative = past). Keeps demo data fresh. */
function isoInDays(days: number): string {
  return new Date(Date.now() + days * MS_PER_DAY).toISOString();
}

/**
 * Stable placeholder image. Swapped for bundled local assets (or Supabase
 * Storage URLs in production) without touching consumers.
 */
function placeholderPhoto(seed: string): string {
  return `https://picsum.photos/seed/${seed}/1200/800`;
}

/**
 * Seeded demo cases across real LocalVR properties, with a deliberate mix of
 * statuses and urgencies. Dates are relative to "now" so the urgency sort always
 * has a believably imminent guest check-in (the dishwasher hero floats to the top).
 */
const rawSeedCases: Case[] = [
  {
    id: 'case-dishwasher-shockhill',
    title: 'Repair dishwasher',
    status: 'pending',
    category: 'appliance',
    origin: 'pre_arrival_inspection',
    description:
      'Dishwasher is not draining; standing water in the basin. Flagged during the pre-arrival inspection. Recommend replacing the drain pump before the next guest arrives.',
    estimatedCostCents: 14500,
    currency: 'USD',
    property: { id: 'prop-shockhill', name: 'Shock Hill Manor', location: 'Breckenridge, CO' },
    assignee: { name: 'Andy Dinger', role: 'Maintenance Manager' },
    photos: [placeholderPhoto('dishwasher-1'), placeholderPhoto('dishwasher-2')],
    guestContext: { nextCheckInISO: isoInDays(2) },
    createdAtISO: isoInDays(-1),
  },
  {
    id: 'case-furnace-westvail',
    title: 'Furnace service before cold snap',
    status: 'pending',
    category: 'hvac',
    origin: 'vacancy_check',
    description:
      'Annual furnace service is overdue and ignition was intermittent during the vacancy check. A cold front is forecast this week.',
    estimatedCostCents: 32000,
    currency: 'USD',
    property: { id: 'prop-westvail', name: 'West Vail Retreat', location: 'Vail, CO' },
    assignee: { name: 'Maria Salas', role: 'Maintenance Lead' },
    photos: [placeholderPhoto('furnace-1')],
    guestContext: { nextCheckInISO: isoInDays(6) },
    createdAtISO: isoInDays(-2),
  },
  {
    id: 'case-leak-aeriedrive',
    title: 'Master-bath leak repair',
    status: 'pending',
    category: 'plumbing',
    origin: 'vacancy_check',
    description:
      'Slow leak under the master-bath vanity with minor cabinet water damage. Needs a plumber to replace the supply line.',
    estimatedCostCents: 48000,
    currency: 'USD',
    property: { id: 'prop-aeriedrive', name: 'Aerie Drive Estate', location: 'Park City, UT' },
    assignee: { name: 'Tom Becker', role: 'Maintenance Lead' },
    vendor: { name: 'Summit Plumbing', company: 'Summit Plumbing Co.' },
    photos: [placeholderPhoto('leak-1')],
    guestContext: { nextCheckInISO: isoInDays(9) },
    createdAtISO: isoInDays(-3),
  },
  {
    id: 'case-hottub-adamsranch',
    title: 'Hot-tub GFCI replacement',
    status: 'approved',
    category: 'electrical',
    origin: 'post_departure_inspection',
    description:
      'Hot-tub GFCI breaker was tripping repeatedly and was replaced for guest safety. Flagged after the last departure.',
    estimatedCostCents: 21000,
    currency: 'USD',
    property: { id: 'prop-adamsranch', name: 'Adams Ranch Lodge', location: 'Telluride, CO' },
    assignee: { name: 'Andy Dinger', role: 'Maintenance Manager' },
    photos: [placeholderPhoto('hottub-1')],
    createdAtISO: isoInDays(-5),
    decision: { atISO: isoInDays(-4) },
  },
  {
    id: 'case-deck-southlake',
    title: 'Deck railing fix',
    status: 'denied',
    category: 'general',
    origin: 'post_departure_inspection',
    description:
      'Loose railing post on the lakeside deck. Cosmetic, with no immediate safety concern for the current bookings.',
    estimatedCostCents: 9000,
    currency: 'USD',
    property: { id: 'prop-southlake', name: 'South Lake Escape', location: 'Lake Tahoe, CA' },
    assignee: { name: 'Dana Whitfield', role: 'Maintenance Lead' },
    photos: [placeholderPhoto('deck-1')],
    createdAtISO: isoInDays(-7),
    decision: { atISO: isoInDays(-6), reason: 'Owner will handle directly during next visit.' },
  },
];

/** Validated at module load so a malformed fixture fails fast, not in the UI. */
export const seedCases: readonly Case[] = rawSeedCases.map((value) => caseSchema.parse(value));
