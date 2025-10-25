/**
 * API contract types for request/response payloads
 * These define the shape of data exchanged between frontend and backend
 */

import type { User, Task } from './models';
import type { PaginatedResponse } from './common';

// ============================================================================
// Auth API
// ============================================================================

export namespace AuthAPI {
  export interface LoginRequest {
    email: string;
    password: string;
  }

  export interface LoginResponse {
    user: User;
    token: string;
    expiresIn: number;
  }

  export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
  }

  export interface RegisterResponse {
    user: User;
    token: string;
    expiresIn: number;
  }

  export interface RefreshTokenRequest {
    token: string;
  }

  export interface RefreshTokenResponse {
    token: string;
    expiresIn: number;
  }
}

// ============================================================================
// Users API
// ============================================================================

export namespace UsersAPI {
  export type GetUserResponse = User;

  export interface UpdateUserRequest {
    name?: string;
    email?: string;
  }

  export type UpdateUserResponse = User;

  export interface ListUsersParams {
    page?: number;
    limit?: number;
    search?: string;
  }

  export type ListUsersResponse = PaginatedResponse<User>;
}

// ============================================================================
// Tasks API (Example Feature)
// ============================================================================

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
