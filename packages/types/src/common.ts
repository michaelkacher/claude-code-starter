/**
 * Common utility types used across the application
 */

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
}

export type Result<T, E = ApiError> =
  | { success: true; data: T }
  | { success: false; error: E };
