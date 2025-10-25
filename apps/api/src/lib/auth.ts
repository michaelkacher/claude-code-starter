import type { FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Extract user ID from JWT token in request
 */
export async function getUserIdFromToken(
  request: FastifyRequest
): Promise<string> {
  try {
    await request.jwtVerify();
    const payload = request.user as { userId: string };
    return payload.userId;
  } catch (error) {
    throw new Error('Invalid or missing token');
  }
}

/**
 * Generate JWT token
 */
export function generateToken(
  request: FastifyRequest,
  userId: string
): string {
  return request.server.jwt.sign({ userId }, { expiresIn: '7d' });
}
