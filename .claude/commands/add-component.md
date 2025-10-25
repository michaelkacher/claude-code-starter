---
description: Add a new React component with proper structure
---

You are helping add a new React component to the Next.js frontend.

# Add Component Workflow

Follow these steps:

1. **Determine Component Location**
   - Page component? → `apps/web/src/app/[route]/page.tsx`
   - Reusable component? → `apps/web/src/components/[ComponentName].tsx`
   - Layout component? → `apps/web/src/app/[route]/layout.tsx`

2. **Create Component File**
   - Use TypeScript
   - Use 'use client' directive if component needs interactivity
   - Import types from `@repo/types`
   - Use Tailwind CSS for styling

3. **Implement Component**
   - Follow existing patterns
   - Use the API client from `@/lib/api` for data fetching
   - Use `useAuth` hook if authentication is needed
   - Add proper TypeScript types for props

4. **Add Tests (Optional but Recommended)**
   - Create `[ComponentName].test.tsx` next to the component
   - Test rendering
   - Test user interactions
   - Test API calls (mock them)

5. **Integrate Component**
   - Import and use in the appropriate page
   - Test in browser with `pnpm dev`

## Example Component

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { Post } from '@repo/types';

interface PostListProps {
  userId?: string;
}

export function PostList({ userId }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const loadPosts = async () => {
    try {
      const response = await apiClient.posts.list({ userId });
      setPosts(response.data);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-white rounded-lg shadow">
          <h3 className="font-semibold">{post.title}</h3>
          <p className="text-gray-600">{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

Ask the user what component they want to add, then implement it following this workflow.
