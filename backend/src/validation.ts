import { z } from 'zod';

export const createReleaseSchema = z.object({
  name: z.string().min(1),
  date: z.string(),
  additionalInfo: z.string().optional()
});

export const updateReleaseSchema = z.object({
  id: z.string(),
  additionalInfo: z.string().optional(),
  completedSteps: z.string().optional()
});
