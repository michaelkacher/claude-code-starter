import type { AuthAPI, UsersAPI, TasksAPI } from '@repo/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new ApiError(error.message || 'Request failed', response.status);
  }

  return response.json();
}

export const apiClient = {
  auth: {
    login: (email: string, password: string) =>
      fetchApi<AuthAPI.LoginResponse>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }),

    register: (email: string, password: string, name: string) =>
      fetchApi<AuthAPI.RegisterResponse>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      }),
  },

  users: {
    getMe: () => fetchApi<UsersAPI.GetUserResponse>('/api/users/me'),

    updateMe: (data: UsersAPI.UpdateUserRequest) =>
      fetchApi<UsersAPI.UpdateUserResponse>('/api/users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  tasks: {
    list: (params?: TasksAPI.ListTasksParams) => {
      const searchParams = new URLSearchParams();
      if (params?.page) searchParams.set('page', params.page.toString());
      if (params?.limit) searchParams.set('limit', params.limit.toString());
      if (params?.completed !== undefined)
        searchParams.set('completed', params.completed.toString());

      const query = searchParams.toString();
      return fetchApi<TasksAPI.ListTasksResponse>(
        `/api/tasks${query ? `?${query}` : ''}`
      );
    },

    get: (id: string) =>
      fetchApi<TasksAPI.GetTaskResponse>(`/api/tasks/${id}`),

    create: (data: TasksAPI.CreateTaskRequest) =>
      fetchApi<TasksAPI.CreateTaskResponse>('/api/tasks', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: (id: string, data: TasksAPI.UpdateTaskRequest) =>
      fetchApi<TasksAPI.UpdateTaskResponse>(`/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetchApi<TasksAPI.DeleteTaskResponse>(`/api/tasks/${id}`, {
        method: 'DELETE',
      }),
  },
};
