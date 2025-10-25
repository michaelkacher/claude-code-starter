import type { FastifyInstance } from 'fastify';
import { loginHandler, registerHandler } from './handlers.js';
import { loginSchema, registerSchema } from './schemas.js';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', { schema: loginSchema }, loginHandler);
  fastify.post('/register', { schema: registerSchema }, registerHandler);
}
