# Claude Code Workflows

This guide explains how to effectively use Claude Code with this template.

## Available Commands

### `/design-feature`

**Purpose**: Plan a feature before implementation.

**When to use**:
- Starting any new feature
- Need to think through architecture
- Want to define API contracts
- Multiple people/AIs will work on it

**Output**: Design document in `.claude/designs/[feature-name].md`

**Example**:
```
You: /design-feature

Claude: I'll help you design a new feature. What feature would you like to design?

You: I want to add a commenting system where users can comment on tasks.

Claude: [Asks clarifying questions, then creates design document with]:
- Database schema (comments table)
- API endpoints (POST /tasks/:id/comments, GET /tasks/:id/comments)
- Type definitions
- Component structure
```

### `/add-endpoint`

**Purpose**: Add a new backend API endpoint.

**When to use**:
- Adding REST endpoints
- After designing API contracts
- Following backend patterns

**Example**:
```
You: /add-endpoint

Claude: What endpoint would you like to add?

You: POST /api/comments to create a comment on a task

Claude: [Creates]:
- apps/api/src/routes/comments/index.ts
- apps/api/src/routes/comments/handlers.ts
- apps/api/src/routes/comments/schemas.ts
- apps/api/src/routes/comments/handlers.test.ts
[Registers route in server.ts]
```

### `/add-component`

**Purpose**: Add a React component to the frontend.

**When to use**:
- Creating new UI components
- Building new pages
- After backend is ready

**Example**:
```
You: /add-component

Claude: What component would you like to add?

You: CommentList to display comments on a task

Claude: [Creates]:
- apps/web/src/components/CommentList.tsx
[Shows integration example]
```

### `/add-migration`

**Purpose**: Create database migration.

**When to use**:
- Adding tables
- Modifying columns
- Before backend implementation

**Example**:
```
You: /add-migration

Claude: What schema changes do you need?

You: Add a comments table with task_id, user_id, content, created_at

Claude: [Creates]:
- packages/db/src/schema/comments.ts
[Runs db:generate]
[Shows migration SQL]
```

### `/test-feature`

**Purpose**: Run tests for a feature.

**When to use**:
- After implementing a feature
- Debugging failures
- Verifying changes

**Example**:
```
You: /test-feature

Claude: What would you like to test?

You: The comments feature

Claude: [Runs]:
- Unit tests for comments handlers
- Frontend component tests
- Reports results
```

## Recommended Workflows

### 1. Adding a New Feature (Full Flow)

**Steps**:
```
1. /design-feature
   → Define requirements, architecture, API contracts

2. Review and approve design
   → Claude presents design document
   → Make changes if needed

3. /add-migration (if database changes needed)
   → Create schema
   → Generate migration
   → Apply migration

4. /add-endpoint (for each endpoint)
   → POST /api/resource
   → GET /api/resource/:id
   → PATCH /api/resource/:id
   → etc.

5. /add-component (for each component)
   → Create UI components
   → Integrate with API

6. /test-feature
   → Run tests
   → Fix failures
   → Verify coverage
```

**Example Session**:
```
You: I want to add a commenting system for tasks

Claude Code:
1. Uses /design-feature
   - Asks questions
   - Creates design doc
   - Defines API contracts

2. After approval, uses /add-migration
   - Creates comments table

3. Uses /add-endpoint
   - POST /api/tasks/:id/comments
   - GET /api/tasks/:id/comments

4. Uses /add-component
   - Creates CommentList component
   - Creates CommentForm component

5. Uses /test-feature
   - Writes and runs tests
   - Verifies everything works
```

### 2. Fixing a Bug

**Steps**:
```
1. Reproduce the bug
   → Write a failing test

2. Fix the code
   → Update the implementation

3. /test-feature
   → Verify test passes
   → Check for regressions
```

### 3. Refactoring Code

**Steps**:
```
1. /test-feature first
   → Ensure tests pass before refactoring

2. Make changes
   → Refactor code

3. /test-feature again
   → Ensure tests still pass
   → No behavior changes
```

### 4. Adding an Endpoint Only

**Quick workflow when you just need an API endpoint**:

```
You: Add a GET /api/users/:id/stats endpoint that returns user task statistics

Claude: [Without slash command, directly]:
1. Checks packages/types/src/api.ts
2. Adds types if needed
3. Creates route structure
4. Implements handler
5. Writes tests
6. Runs tests
```

## Token Efficiency Tips

### Work in Focused Sessions

❌ **Don't**:
```
You: Add comments, notifications, user profiles, and settings
```

✅ **Do**:
```
Session 1: Add comments feature
Session 2: Add notifications
Session 3: Add user profiles
Session 4: Add settings
```

### Use Design Documents

❌ **Don't**:
```
You: Start coding a complex feature
[Claude explores, makes mistakes, refactors]
[Uses lots of tokens]
```

✅ **Do**:
```
You: /design-feature
[Define everything upfront]
[Then implement with clear plan]
[Much fewer tokens]
```

### Leverage Existing Patterns

❌ **Don't**:
```
You: Create a completely new architecture for this feature
```

✅ **Do**:
```
You: Follow the same pattern as the tasks feature
```

### Scope Commands to Workspaces

When using Task tool or exploring:
- Backend work → Only `apps/api/` + `packages/types/` + `packages/db/`
- Frontend work → Only `apps/web/` + `packages/types/`
- Database work → Only `packages/db/`

## Best Practices

### 1. Design First, Code Second

Always use `/design-feature` for non-trivial features. Prevents:
- Rework and refactoring
- Missed edge cases
- Type mismatches
- Poor architecture

### 2. One Feature at a Time

Complete features before starting new ones:
- Design → Database → Backend → Frontend → Tests
- Each step fully done before next
- Easier to track and debug

### 3. Write Tests Alongside Code

Don't defer testing:
- Write tests in `/add-endpoint`
- Write tests in `/add-component`
- Use `/test-feature` frequently

### 4. Use Shared Types

Always use types from `@repo/types`:
- Prevents duplication
- Ensures consistency
- Catches errors at compile time

### 5. Follow Patterns

Look at existing code:
- Tasks feature (full example)
- Auth routes (authentication pattern)
- TaskList component (data fetching pattern)

## Common Patterns

### Adding a CRUD Feature

1. `/design-feature` → Define resource
2. `/add-migration` → Create table
3. `/add-endpoint` → Create POST endpoint
4. `/add-endpoint` → List GET endpoint
5. `/add-endpoint` → Single GET endpoint
6. `/add-endpoint` → Update PATCH endpoint
7. `/add-endpoint` → Delete DELETE endpoint
8. `/add-component` → List component
9. `/add-component` → Form component
10. `/test-feature` → E2E test

### Adding Authentication to a Route

```typescript
// apps/api/src/routes/resource/index.ts
export async function resourceRoutes(fastify: FastifyInstance) {
  // Require auth for all routes in this resource
  fastify.addHook('onRequest', async (request) => {
    await request.jwtVerify();
  });

  // Routes here are protected
  fastify.get('/', listHandler);
  fastify.post('/', createHandler);
}
```

### Fetching Data in Frontend

```typescript
'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import type { Resource } from '@repo/types';

export function ResourceList() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const response = await apiClient.resources.list();
      setResources(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return <div>{/* Render resources */}</div>;
}
```

## Troubleshooting

### "Types not found"

```bash
# Rebuild types package
pnpm --filter=@repo/types build
```

### "Database migration failed"

```bash
# Check DATABASE_URL is correct
echo $DATABASE_URL

# Re-run migration
pnpm db:migrate
```

### "Tests failing"

```bash
# Run specific test
cd apps/api
pnpm test handlers.test.ts

# Check test output
# Fix code or test
```

### "Component not rendering"

1. Check browser console for errors
2. Verify API is running (localhost:3001/health)
3. Check Network tab for API calls
4. Verify types match between frontend/backend

## Advanced Workflows

### Creating Custom Slash Commands

1. Create file in `.claude/commands/my-command.md`
2. Add frontmatter with description
3. Write command instructions
4. Use in Claude Code with `/my-command`

### Creating Design Templates

1. Create templates in `.claude/designs/templates/`
2. Reference when using `/design-feature`
3. Customize per project needs

### Automating Common Tasks

Add npm scripts for repetitive tasks:

```json
{
  "scripts": {
    "new:endpoint": "node scripts/scaffold-endpoint.js",
    "new:component": "node scripts/scaffold-component.js"
  }
}
```

## Tips for Success

1. **Be specific**: "Add a comment form to the task detail page" > "Add comments"
2. **Reference existing code**: "Like the TaskList component but for comments"
3. **Approve designs**: Review design docs before implementation
4. **Test frequently**: Don't accumulate untested code
5. **Ask questions**: Claude can explain anything in the codebase
6. **Iterate**: Start simple, add complexity gradually

## Getting Help

Ask Claude:
- "How does the task feature work?"
- "What's the pattern for adding a new resource?"
- "Show me an example of a form component"
- "How do I add validation to an endpoint?"
- "What's the best way to handle errors?"

Claude has full context of this template and can guide you through any workflow!
