import type { FastifyInstance } from 'fastify';
import {
  listTasksHandler,
  getTaskHandler,
  createTaskHandler,
  updateTaskHandler,
  deleteTaskHandler,
} from './handlers.js';

export async function tasksRoutes(fastify: FastifyInstance) {
  // All task routes require authentication
  fastify.addHook('onRequest', async (request) => {
    await request.jwtVerify();
  });

  fastify.get('/', listTasksHandler);
  fastify.post('/', createTaskHandler);
  fastify.get('/:id', getTaskHandler);
  fastify.patch('/:id', updateTaskHandler);
  fastify.delete('/:id', deleteTaskHandler);
}
