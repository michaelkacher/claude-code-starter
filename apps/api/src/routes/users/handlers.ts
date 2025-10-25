import type { FastifyRequest, FastifyReply } from 'fastify';
import { db, users } from '@repo/db';
import { eq } from 'drizzle-orm';
import { getUserIdFromToken } from '../../lib/auth.js';
import type { UsersAPI } from '@repo/types';

/**
 * GET /api/users/me
 */
export async function getUserHandler(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<UsersAPI.GetUserResponse> {
  const userId = await getUserIdFromToken(request);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) {
    return reply.notFound('User not found');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * PATCH /api/users/me
 */
export async function updateUserHandler(
  request: FastifyRequest<{ Body: UsersAPI.UpdateUserRequest }>,
  reply: FastifyReply
): Promise<UsersAPI.UpdateUserResponse> {
  const userId = await getUserIdFromToken(request);
  const { name, email } = request.body;

  if (!name && !email) {
    return reply.badRequest('At least one field must be provided');
  }

  const updateData: Partial<{ name: string; email: string; updatedAt: Date }> =
    {};
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  updateData.updatedAt = new Date();

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning();

  if (!updatedUser) {
    return reply.notFound('User not found');
  }

  return {
    id: updatedUser.id,
    email: updatedUser.email,
    name: updatedUser.name,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  };
}
