import { z } from 'zod';
import { emailSchema, passwordSchema } from '../../lib/validation.js';

const loginBodySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const registerBodySchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(1),
});

export const loginSchema = {
  body: loginBodySchema,
} as const;

export const registerSchema = {
  body: registerBodySchema,
} as const;

export type LoginBody = z.infer<typeof loginBodySchema>;
export type RegisterBody = z.infer<typeof registerBodySchema>;
