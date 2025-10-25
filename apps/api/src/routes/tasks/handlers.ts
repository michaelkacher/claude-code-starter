import type { FastifyRequest, FastifyReply } from 'fastify';
import { db, tasks } from '@repo/db';
import { eq, and, desc, count } from 'drizzle-orm';
import { getUserIdFromToken } from '../../lib/auth.js';
import type { TasksAPI } from '@repo/types';

/**
 * GET /api/tasks
 */
export async function listTasksHandler(
  request: FastifyRequest<{ Querystring: TasksAPI.ListTasksParams }>,
  reply: FastifyReply
): Promise<TasksAPI.ListTasksResponse> {
  const userId = await getUserIdFromToken(request);
  const { page = 1, limit = 20, completed } = request.query;

  const offset = (page - 1) * limit;

  // Build where clause
  const whereClause =
    completed !== undefined
      ? and(eq(tasks.userId, userId), eq(tasks.completed, completed))
      : eq(tasks.userId, userId);

  // Get tasks
  const taskList = await db
    .select()
    .from(tasks)
    .where(whereClause)
    .orderBy(desc(tasks.createdAt))
    .limit(limit)
    .offset(offset);

  // Get total count
  const [{ value: total }] = await db
    .select({ value: count() })
    .from(tasks)
    .where(whereClause);

  return {
    data: taskList,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * GET /api/tasks/:id
 */
export async function getTaskHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<TasksAPI.GetTaskResponse> {
  const userId = await getUserIdFromToken(request);
  const { id } = request.params;

  const [task] = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .limit(1);

  if (!task) {
    return reply.notFound('Task not found');
  }

  return task;
}

/**
 * POST /api/tasks
 */
export async function createTaskHandler(
  request: FastifyRequest<{ Body: TasksAPI.CreateTaskRequest }>,
  reply: FastifyReply
): Promise<TasksAPI.CreateTaskResponse> {
  const userId = await getUserIdFromToken(request);
  const { title, description } = request.body;

  const [task] = await db
    .insert(tasks)
    .values({
      userId,
      title,
      description: description || null,
    })
    .returning();

  return task;
}

/**
 * PATCH /api/tasks/:id
 */
export async function updateTaskHandler(
  request: FastifyRequest<{
    Params: { id: string };
    Body: TasksAPI.UpdateTaskRequest;
  }>,
  reply: FastifyReply
): Promise<TasksAPI.UpdateTaskResponse> {
  const userId = await getUserIdFromToken(request);
  const { id } = request.params;
  const { title, description, completed } = request.body;

  if (title === undefined && description === undefined && completed === undefined) {
    return reply.badRequest('At least one field must be provided');
  }

  const updateData: Partial<{
    title: string;
    description: string | null;
    completed: boolean;
    updatedAt: Date;
  }> = { updatedAt: new Date() };

  if (title !== undefined) updateData.title = title;
  if (description !== undefined) updateData.description = description;
  if (completed !== undefined) updateData.completed = completed;

  const [updatedTask] = await db
    .update(tasks)
    .set(updateData)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  if (!updatedTask) {
    return reply.notFound('Task not found');
  }

  return updatedTask;
}

/**
 * DELETE /api/tasks/:id
 */
export async function deleteTaskHandler(
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
): Promise<TasksAPI.DeleteTaskResponse> {
  const userId = await getUserIdFromToken(request);
  const { id } = request.params;

  const [deletedTask] = await db
    .delete(tasks)
    .where(and(eq(tasks.id, id), eq(tasks.userId, userId)))
    .returning();

  if (!deletedTask) {
    return reply.notFound('Task not found');
  }

  return { success: true };
}
