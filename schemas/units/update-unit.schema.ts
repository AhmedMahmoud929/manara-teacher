import { z } from "zod";

export const updateUnitSchema = z.object({
  title: z
    .string()
    .min(3, "Unit title must be at least 3 characters")
    .max(100, "Unit title must not exceed 100 characters")
    .optional(),
  description: z
    .string()
    .min(10, "Unit description must be at least 10 characters")
    .max(500, "Unit description must not exceed 500 characters")
    .optional(),
  order: z
    .number()
    .min(1, "Order must be at least 1")
    .max(100, "Order must not exceed 100")
    .optional(),
  is_active: z.boolean().optional(),
});

export type UpdateUnitFormData = z.infer<typeof updateUnitSchema>;