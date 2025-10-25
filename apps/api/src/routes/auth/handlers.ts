import type { FastifyRequest, FastifyReply } from 'fastify';
import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, generateToken } from '../../lib/auth.js';
import type { LoginBody, RegisterBody } from './schemas.js';
import type { AuthAPI } from '@repo/types';

/**
 * POST /api/auth/login
 */
export async function loginHandler(
  request: FastifyRequest<{ Body: LoginBody }>,
  reply: FastifyReply
): Promise<AuthAPI.LoginResponse> {
  const { email, password } = request.body;

  // Find user by email
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    return reply.unauthorized('Invalid email or password');
  }

  // Verify password
  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return reply.unauthorized('Invalid email or password');
  }

  // Generate token
  const token = generateToken(request, user.id);

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    },
    token,
    expiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
  };
}

/**
 * POST /api/auth/register
 */
export async function registerHandler(
  request: FastifyRequest<{ Body: RegisterBody }>,
  reply: FastifyReply
): Promise<AuthAPI.RegisterResponse> {
  const { email, password, name } = request.body;

  // Check if user already exists
  const [existingUser] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser) {
    return reply.conflict('User with this email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [newUser] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      name,
    })
    .returning();

  // Generate token
  const token = generateToken(request, newUser.id);

  return {
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
    token,
    expiresIn: 7 * 24 * 60 * 60,
  };
}
