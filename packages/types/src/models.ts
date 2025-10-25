/**
 * Domain models representing database entities
 */

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Example: Task model for demonstration
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
