# Feature: Task Management

## Overview
A simple task management feature that allows users to create, view, update, and delete tasks. Each task belongs to a user and can be marked as completed.

## User Story
As a logged-in user, I want to manage my personal tasks so that I can track what I need to do.

## Architecture

### Database Changes
- **New table**: `tasks`
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key to users)
  - `title` (text, not null)
  - `description` (text, nullable)
  - `completed` (boolean, default false)
  - `created_at` (timestamp)
  - `updated_at` (timestamp)

### API Endpoints
- `GET /api/tasks` - List all tasks for the current user (with pagination)
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Frontend Components
- `TaskList` - Display list of tasks with create/update/delete actions
- Dashboard page integration

## API Contracts

### Types (in packages/types/src/api.ts)
```typescript
export namespace TasksAPI {
  export interface CreateTaskRequest {
    title: string;
    description?: string;
  }

  export type CreateTaskResponse = Task;

  export interface UpdateTaskRequest {
    title?: string;
    description?: string;
    completed?: boolean;
  }

  export type UpdateTaskResponse = Task;

  export interface ListTasksParams {
    page?: number;
    limit?: number;
    completed?: boolean;
  }

  export type ListTasksResponse = PaginatedResponse<Task>;

  export type GetTaskResponse = Task;

  export interface DeleteTaskResponse {
    success: boolean;
  }
}
```

## Implementation Steps
1. ✅ Create `tasks` schema in `packages/db/src/schema/tasks.ts`
2. ✅ Generate and run migration
3. ✅ Add TasksAPI types to `packages/types/src/api.ts`
4. ✅ Implement task routes in `apps/api/src/routes/tasks/`
5. ✅ Add tests for task endpoints
6. ✅ Create `TaskList` component
7. ✅ Integrate into dashboard page
8. ✅ Add e2e tests for task workflow

## Status
✅ **Implemented** - This serves as an example feature in the template.
