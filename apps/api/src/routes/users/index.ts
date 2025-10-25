import type { FastifyInstance } from 'fastify';
import { getUserHandler, updateUserHandler } from './handlers.js';

export async function usersRoutes(fastify: FastifyInstance) {
  // All user routes require authentication
  fastify.addHook('onRequest', async (request) => {
    await request.jwtVerify();
  });

  fastify.get('/me', getUserHandler);
  fastify.patch('/me', updateUserHandler);
}
