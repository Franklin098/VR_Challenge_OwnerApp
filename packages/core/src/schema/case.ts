import { z } from 'zod';

/**
 * Domain schemas for a maintenance case.
 *
 * Types are derived from these schemas via `z.infer`, so runtime validation and
 * the compile-time types share one source of truth — consumed unchanged by both
 * the mobile app and a future web surface.
 */

export const caseStatusSchema = z.enum(['pending', 'approved', 'denied']);

export const caseCategorySchema = z.enum([
  'appliance',
  'plumbing',
  'hvac',
  'electrical',
  'general',
]);

/** How the case was discovered — mirrors LocalVR's triple-tier inspections. */
export const caseOriginSchema = z.enum([
  'pre_arrival_inspection',
  'post_departure_inspection',
  'vacancy_check',
  'guest_report',
]);

export const propertySchema = z.object({
  id: z.string(),
  name: z.string(), // "Shock Hill Manor"
  location: z.string(), // "Breckenridge, CO"
});

/** In-house maintenance staff who own the work. */
export const assigneeSchema = z.object({
  name: z.string(),
  role: z.string(), // "Maintenance Manager"
});

/** Optional external specialist, present only when work is outsourced. */
export const vendorSchema = z.object({
  name: z.string(),
  company: z.string(),
});

/** A guest stay that makes a case time-sensitive. */
export const guestContextSchema = z.object({
  nextCheckInISO: z.string().datetime(),
});

/** The owner's decision. A reason is required when a case is denied. */
export const decisionSchema = z.object({
  atISO: z.string().datetime(),
  reason: z.string().min(1).optional(),
});

export const caseSchema = z
  .object({
    id: z.string(),
    title: z.string(), // "Repair dishwasher"
    status: caseStatusSchema,
    category: caseCategorySchema,
    origin: caseOriginSchema,
    description: z.string(),
    estimatedCostCents: z.number().int().nonnegative(), // money as integer cents
    currency: z.literal('USD'),
    property: propertySchema,
    assignee: assigneeSchema,
    vendor: vendorSchema.optional(),
    photos: z.array(z.string().url()),
    guestContext: guestContextSchema.optional(),
    createdAtISO: z.string().datetime(),
    decision: decisionSchema.optional(),
  })
  .superRefine((value, ctx) => {
    if (value.status === 'denied' && !value.decision?.reason) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['decision', 'reason'],
        message: 'A denied case must include a reason.',
      });
    }
  });

export type CaseStatus = z.infer<typeof caseStatusSchema>;
export type CaseCategory = z.infer<typeof caseCategorySchema>;
export type CaseOrigin = z.infer<typeof caseOriginSchema>;
export type Property = z.infer<typeof propertySchema>;
export type Assignee = z.infer<typeof assigneeSchema>;
export type Vendor = z.infer<typeof vendorSchema>;
export type GuestContext = z.infer<typeof guestContextSchema>;
export type Decision = z.infer<typeof decisionSchema>;
export type Case = z.infer<typeof caseSchema>;
