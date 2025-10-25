# Component Guide

Frontend patterns and conventions for React/Next.js components.

## Component Structure

### File Organization

```
apps/web/src/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   ├── [route]/
│   │   ├── page.tsx          # Route page
│   │   └── layout.tsx        # Route layout (optional)
│   └── api/                  # API routes (if needed)
├── components/               # Reusable components
│   ├── TaskList.tsx
│   ├── TaskList.test.tsx
│   └── Button.tsx
├── contexts/                 # React contexts
│   └── AuthContext.tsx
└── lib/                      # Utilities
    ├── api.ts                # API client
    └── utils.ts
```

## Page Components

### Server Components (Default)

Use server components by default for better performance:

```typescript
// apps/web/src/app/tasks/page.tsx
import { TaskList } from '@/components/TaskList';

export default function TasksPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <TaskList />
    </div>
  );
}
```

### Client Components

Add `'use client'` directive when needed:

```typescript
'use client';

import { useState } from 'react';

export default function InteractivePage() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}
```

**When to use 'use client'**:
- Need useState, useEffect, or other React hooks
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Third-party libraries that use client features

## Component Patterns

### Data Fetching Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { Resource } from '@repo/types';

interface ResourceListProps {
  userId?: string;
}

export function ResourceList({ userId }: ResourceListProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadResources();
  }, [userId]);

  const loadResources = async () => {
    try {
      setLoading(true);
      const response = await apiClient.resources.list({ userId });
      setResources(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 py-8">{error}</div>;
  }

  if (resources.length === 0) {
    return <div className="text-gray-500 py-8">No resources found</div>;
  }

  return (
    <div className="space-y-4">
      {resources.map((resource) => (
        <ResourceCard key={resource.id} resource={resource} />
      ))}
    </div>
  );
}
```

### Form Component

```typescript
'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api';
import type { ResourceAPI } from '@repo/types';

interface ResourceFormProps {
  onSuccess?: (resource: Resource) => void;
}

export function ResourceForm({ onSuccess }: ResourceFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const resource = await apiClient.resources.create({
        name,
        description,
      });
      setName('');
      setDescription('');
      onSuccess?.(resource);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">
          Name
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating...' : 'Create Resource'}
      </button>
    </form>
  );
}
```

### Card/Display Component

```typescript
import type { Resource } from '@repo/types';

interface ResourceCardProps {
  resource: Resource;
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: string) => void;
}

export function ResourceCard({ resource, onEdit, onDelete }: ResourceCardProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{resource.name}</h3>
          {resource.description && (
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {resource.description}
            </p>
          )}
        </div>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(resource)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(resource.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-gray-500 mt-4">
        Created {new Date(resource.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
```

## TypeScript Patterns

### Component Props

```typescript
// ✅ Good: Explicit interface
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  disabled?: boolean;
}

export function Button({ children, variant = 'primary', onClick, disabled }: ButtonProps) {
  return <button onClick={onClick} disabled={disabled}>{children}</button>;
}

// ❌ Bad: No types
export function Button({ children, variant, onClick }: any) {
  // ...
}
```

### Using Shared Types

```typescript
import type { Task, TasksAPI } from '@repo/types';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, data: TasksAPI.UpdateTaskRequest) => Promise<void>;
}
```

## Styling with Tailwind

### Layout Classes

```typescript
// Container
<div className="container mx-auto px-4">

// Flexbox
<div className="flex items-center justify-between gap-4">

// Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Spacing
<div className="p-6 mb-4 space-y-4">
```

### Responsive Design

```typescript
// Mobile-first breakpoints
<div className="text-sm md:text-base lg:text-lg">

// Show/hide at breakpoints
<div className="hidden md:block">
<div className="block md:hidden">
```

### Dark Mode

```typescript
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

### Common Patterns

```typescript
// Button
<button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors">

// Input
<input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800">

// Card
<div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm">
```

## State Management

### Local State (useState)

For component-specific state:

```typescript
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

### Context API

For global state (like auth):

```typescript
// contexts/ThemeContext.tsx
'use client';

import { createContext, useContext, useState } from 'react';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
```

## API Integration

### Using the API Client

```typescript
import { apiClient } from '@/lib/api';

// List
const tasks = await apiClient.tasks.list({ page: 1, limit: 20 });

// Get single
const task = await apiClient.tasks.get(taskId);

// Create
const newTask = await apiClient.tasks.create({ title: 'New Task' });

// Update
const updated = await apiClient.tasks.update(taskId, { completed: true });

// Delete
await apiClient.tasks.delete(taskId);
```

### Error Handling

```typescript
try {
  const data = await apiClient.resources.create(formData);
  // Success
} catch (error) {
  if (error instanceof Error) {
    setError(error.message);
  } else {
    setError('An unexpected error occurred');
  }
}
```

## Authentication

### Protected Pages

```typescript
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <div>Loading...</div>;
  }

  return <div>Protected content for {user.name}</div>;
}
```

### Using Auth Context

```typescript
import { useAuth } from '@/contexts/AuthContext';

function Header() {
  const { user, logout } = useAuth();

  if (!user) {
    return <LoginButton />;
  }

  return (
    <div>
      <span>Welcome, {user.name}</span>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## Testing

### Component Test

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click</Button>);

    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

## Performance

### Memoization

```typescript
import { useMemo, useCallback } from 'react';

function ExpensiveComponent({ items }) {
  // Memoize expensive calculations
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name));
  }, [items]);

  // Memoize callbacks
  const handleClick = useCallback((id: string) => {
    // Handle click
  }, []);

  return <div>{/* ... */}</div>;
}
```

### Code Splitting

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/HeavyChart'), {
  loading: () => <div>Loading chart...</div>,
  ssr: false, // Disable SSR for client-only components
});
```

## Best Practices

1. ✅ **Use TypeScript** - Define prop interfaces
2. ✅ **Keep components focused** - Single responsibility
3. ✅ **Use server components** by default
4. ✅ **Handle loading states** - Show feedback
5. ✅ **Handle error states** - Show meaningful errors
6. ✅ **Handle empty states** - "No results" messages
7. ✅ **Use shared types** - Import from @repo/types
8. ✅ **Write tests** - Especially for complex logic
9. ✅ **Use Tailwind** - Consistent styling
10. ✅ **Accessibility** - Labels, ARIA attributes

## Anti-Patterns

❌ **Don't**:
- Use 'use client' unnecessarily
- Fetch data in useEffect (use React Query or similar)
- Store auth tokens in state (use context/cookies)
- Hard-code API URLs (use env variables)
- Ignore loading/error states
- Use inline styles (use Tailwind)
- Put business logic in components
- Use `any` type

## Code Style

```typescript
// ✅ Good
interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => Promise<void>;
}

export function TaskCard({ task, onComplete }: TaskCardProps) {
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onComplete(task.id);
    } catch (error) {
      console.error('Failed to complete task', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg">
      <h3 className="font-semibold">{task.title}</h3>
      <button onClick={handleComplete} disabled={loading}>
        {loading ? 'Completing...' : 'Complete'}
      </button>
    </div>
  );
}

// ❌ Bad
export function TaskCard(props: any) {
  const complete = () => {
    props.onComplete(props.task.id);
  };

  return <div onClick={complete}>{props.task.title}</div>;
}
```
