---
description: Add a new API endpoint with tests
---

You are helping add a new API endpoint to the Fastify backend.

# Add Endpoint Workflow

Follow these steps:

1. **Verify Design**
   - Check if types exist in `packages/types/src/api.ts`
   - If not, ask user to run `/design-feature` first

2. **Create Route Structure**
   - Create folder: `apps/api/src/routes/[resource]/`
   - Create files:
     - `index.ts` - Route registration
     - `handlers.ts` - Business logic
     - `schemas.ts` - Validation schemas (using Zod)
     - `handlers.test.ts` - Unit tests

3. **Implement Handler**
   - Use shared types from `@repo/types`
   - Use database client from `@repo/db`
   - Follow existing patterns in other routes
   - Handle errors appropriately

4. **Write Tests**
   - Test successful cases
   - Test error cases
   - Test validation

5. **Register Route**
   - Add route registration in `apps/api/src/server.ts`
   - Use appropriate prefix (e.g., `/api/resource`)

6. **Run Tests**
   - Execute `pnpm --filter=api test`
   - Ensure all tests pass

## Example Structure

```typescript
// apps/api/src/routes/posts/handlers.ts
import type { FastifyRequest, FastifyReply } from 'fastify';
import { db, posts } from '@repo/db';
import type { PostsAPI } from '@repo/types';

export async function createPostHandler(
  request: FastifyRequest<{ Body: PostsAPI.CreateRequest }>,
  reply: FastifyReply
): Promise<PostsAPI.CreateResponse> {
  const userId = await getUserIdFromToken(request);
  const { title, content } = request.body;

  const [post] = await db
    .insert(posts)
    .values({ userId, title, content })
    .returning();

  return post;
}
```

Ask the user what endpoint they want to add, then implement it following this workflow.
