import { z } from 'zod';

/**
 * Common validation schemas
 */

export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);
export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
