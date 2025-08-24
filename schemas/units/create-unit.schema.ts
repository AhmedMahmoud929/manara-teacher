import { z } from "zod";

export const createUnitSchema = z.object({
  title: z
    .string()
    .min(1, "Unit title is required")
    .min(3, "Unit title must be at least 3 characters")
    .max(100, "Unit title must not exceed 100 characters"),
  description: z
    .string()
    .min(1, "Unit description is required")
    .min(10, "Unit description must be at least 10 characters")
    .max(500, "Unit description must not exceed 500 characters"),
  order: z
    .number()
    .min(1, "Order must be at least 1")
    .max(100, "Order must not exceed 100"),
  is_active: z.boolean().default(true),
});

export type CreateUnitFormData = z.infer<typeof createUnitSchema>;