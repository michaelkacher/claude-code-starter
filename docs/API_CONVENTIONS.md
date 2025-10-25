# API Conventions

Backend patterns and conventions for the Fastify API.

## Route Structure

### Directory Organization

Each resource gets its own directory:

```
apps/api/src/routes/[resource]/
├── index.ts          # Route registration
├── handlers.ts       # Business logic
├── schemas.ts        # Validation schemas
└── handlers.test.ts  # Unit tests
```

### Route Registration (index.ts)

```typescript
import type { FastifyInstance } from 'fastify';
import { createHandler, listHandler, getHandler } from './handlers.js';

export async function resourceRoutes(fastify: FastifyInstance) {
  // Optional: Add authentication hook
  fastify.addHook('onRequest', async (request) => {
    await request.jwtVerify();
  });

  // Register routes
  fastify.get('/', listHandler);
  fastify.post('/', createHandler);
  fastify.get('/:id', getHandler);
  fastify.patch('/:id', updateHandler);
  fastify.delete('/:id', deleteHandler);
}
```

### Handler Implementation (handlers.ts)

```typescript
import type { FastifyRequest, FastifyReply } from 'fastify';
import { db, resources } from '@repo/db';
import { getUserIdFromToken } from '../../lib/auth.js';
import type { ResourceAPI } from '@repo/types';

export async function createHandler(
  request: FastifyRequest<{ Body: ResourceAPI.CreateRequest }>,
  reply: FastifyReply
): Promise<ResourceAPI.CreateResponse> {
  const userId = await getUserIdFromToken(request);
  const { name, description } = request.body;

  const [resource] = await db
    .insert(resources)
    .values({ userId, name, description })
    .returning();

  return resource;
}
```

### Validation (schemas.ts)

```typescript
import { z } from 'zod';

const createBodySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export const createSchema = {
  body: createBodySchema,
} as const;

export type CreateBody = z.infer<typeof createBodySchema>;
```

## HTTP Methods

Follow RESTful conventions:

| Method | Endpoint | Purpose | Returns |
|--------|----------|---------|---------|
| GET | `/resources` | List resources | Array + pagination |
| GET | `/resources/:id` | Get single resource | Object |
| POST | `/resources` | Create resource | Created object |
| PATCH | `/resources/:id` | Update resource | Updated object |
| DELETE | `/resources/:id` | Delete resource | Success message |

## Response Formats

### Success Response

**Single Resource**:
```json
{
  "id": "uuid",
  "name": "Resource Name",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**List (with pagination)**:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "error": "ValidationError",
  "message": "Invalid input",
  "statusCode": 400
}
```

## Status Codes

Use appropriate HTTP status codes:

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Valid token, insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate resource |
| 500 | Server Error | Unexpected error |

## Authentication

### Protecting Routes

**All routes in resource**:
```typescript
export async function resourceRoutes(fastify: FastifyInstance) {
  fastify.addHook('onRequest', async (request) => {
    await request.jwtVerify();
  });

  // All routes here are protected
}
```

**Specific routes**:
```typescript
export async function resourceRoutes(fastify: FastifyInstance) {
  // Public
  fastify.get('/', listHandler);

  // Protected
  fastify.post('/', {
    onRequest: [fastify.authenticate]
  }, createHandler);
}
```

### Getting Current User

```typescript
import { getUserIdFromToken } from '../../lib/auth.js';

export async function handler(request: FastifyRequest) {
  const userId = await getUserIdFromToken(request);
  // Use userId for authorization
}
```

## Authorization

Always filter by user:

```typescript
// ✅ Correct: User can only see their own resources
const [resource] = await db
  .select()
  .from(resources)
  .where(and(
    eq(resources.id, id),
    eq(resources.userId, userId)  // Important!
  ))
  .limit(1);

// ❌ Wrong: User could see anyone's resource
const [resource] = await db
  .select()
  .from(resources)
  .where(eq(resources.id, id))
  .limit(1);
```

## Validation

### Using Zod

```typescript
import { z } from 'zod';
import { emailSchema, uuidSchema } from '../../lib/validation.js';

const createSchema = z.object({
  email: emailSchema,
  name: z.string().min(1).max(100),
  age: z.number().int().positive().optional(),
  tags: z.array(z.string()).max(10),
});

export const createBodySchema = {
  body: createSchema,
} as const;
```

### Common Validators

Reuse common validators from `apps/api/src/lib/validation.ts`:

```typescript
export const emailSchema = z.string().email();
export const passwordSchema = z.string().min(8);
export const uuidSchema = z.string().uuid();
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
```

## Pagination

### Implementation

```typescript
export async function listHandler(
  request: FastifyRequest<{ Querystring: { page?: number; limit?: number } }>
): Promise<PaginatedResponse<Resource>> {
  const { page = 1, limit = 20 } = request.query;
  const offset = (page - 1) * limit;

  const items = await db
    .select()
    .from(resources)
    .limit(limit)
    .offset(offset);

  const [{ value: total }] = await db
    .select({ value: count() })
    .from(resources);

  return {
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
```

## Error Handling

### Using Fastify Sensible

```typescript
import type { FastifyReply } from 'fastify';

export async function handler(
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Not found
  if (!resource) {
    return reply.notFound('Resource not found');
  }

  // Unauthorized
  if (!hasPermission) {
    return reply.unauthorized('Access denied');
  }

  // Bad request
  if (invalid) {
    return reply.badRequest('Invalid input');
  }

  // Conflict
  if (duplicate) {
    return reply.conflict('Resource already exists');
  }
}
```

### Custom Errors

```typescript
export class ResourceNotFoundError extends Error {
  statusCode = 404;
  constructor(id: string) {
    super(`Resource ${id} not found`);
  }
}

// In handler
throw new ResourceNotFoundError(id);
```

## Database Queries

### Basic CRUD

**Create**:
```typescript
const [item] = await db
  .insert(resources)
  .values({ userId, name })
  .returning();
```

**Read**:
```typescript
const items = await db
  .select()
  .from(resources)
  .where(eq(resources.userId, userId));
```

**Update**:
```typescript
const [updated] = await db
  .update(resources)
  .set({ name: 'New Name', updatedAt: new Date() })
  .where(eq(resources.id, id))
  .returning();
```

**Delete**:
```typescript
const [deleted] = await db
  .delete(resources)
  .where(eq(resources.id, id))
  .returning();
```

### Relations

```typescript
// Join example
const results = await db
  .select({
    task: tasks,
    user: users,
  })
  .from(tasks)
  .leftJoin(users, eq(tasks.userId, users.id))
  .where(eq(tasks.completed, false));
```

### Filtering

```typescript
import { and, or, eq, like, gte, lte } from 'drizzle-orm';

// Multiple conditions
const results = await db
  .select()
  .from(resources)
  .where(and(
    eq(resources.userId, userId),
    eq(resources.active, true),
    gte(resources.createdAt, startDate)
  ));

// Search
const results = await db
  .select()
  .from(resources)
  .where(like(resources.name, `%${searchTerm}%`));
```

## Testing

### Unit Test Pattern

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('Resource Handlers', () => {
  describe('createHandler', () => {
    it('should create a resource', async () => {
      // Arrange
      const mockRequest = {
        body: { name: 'Test' },
        user: { userId: 'user-123' }
      };
      const mockReply = {};

      // Act
      const result = await createHandler(mockRequest, mockReply);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test');
    });

    it('should require authentication', async () => {
      // Test authentication
    });

    it('should validate input', async () => {
      // Test validation
    });
  });
});
```

### Integration Test

```typescript
import { build } from '../server.js';

describe('Resource API', () => {
  let app;

  beforeAll(async () => {
    app = await build();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create a resource', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/resources',
      headers: {
        authorization: `Bearer ${token}`
      },
      payload: {
        name: 'Test Resource'
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toHaveProperty('id');
  });
});
```

## Performance

### Database Indexes

Add indexes for frequently queried columns:

```typescript
import { pgTable, index } from 'drizzle-orm/pg-core';

export const resources = pgTable('resources', {
  // ... columns
}, (table) => ({
  userIdIdx: index('resources_user_id_idx').on(table.userId),
  createdAtIdx: index('resources_created_at_idx').on(table.createdAt),
}));
```

### Query Optimization

```typescript
// ✅ Select only needed columns
const resources = await db
  .select({
    id: resources.id,
    name: resources.name,
  })
  .from(resources);

// ❌ Select all columns when not needed
const resources = await db
  .select()
  .from(resources);
```

## Logging

```typescript
// Use Fastify's logger
fastify.log.info('Processing request');
fastify.log.error({ err: error }, 'Request failed');

// In handlers
request.log.info('Creating resource');
request.log.error({ err }, 'Failed to create resource');
```

## Environment Variables

Access via `process.env`:

```typescript
const port = parseInt(process.env.API_PORT || '3001', 10);
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error('JWT_SECRET is required');
}
```

## Best Practices

1. ✅ **Always filter by user** for authorization
2. ✅ **Use TypeScript types** from @repo/types
3. ✅ **Validate all inputs** with Zod
4. ✅ **Return appropriate status codes**
5. ✅ **Handle errors gracefully**
6. ✅ **Add pagination** to list endpoints
7. ✅ **Write tests** for all handlers
8. ✅ **Use async/await** consistently
9. ✅ **Log important events**
10. ✅ **Keep handlers focused** (single responsibility)

## Anti-Patterns

❌ **Don't**:
- Return passwords or sensitive data
- Trust client-provided user IDs
- Skip input validation
- Catch and ignore errors
- Use `any` type
- Put business logic in route registration
- Hard-code secrets
- Skip authorization checks

## Code Style

```typescript
// ✅ Good
export async function createResourceHandler(
  request: FastifyRequest<{ Body: ResourceAPI.CreateRequest }>,
  reply: FastifyReply
): Promise<ResourceAPI.CreateResponse> {
  const userId = await getUserIdFromToken(request);
  const { name, description } = request.body;

  const [resource] = await db
    .insert(resources)
    .values({ userId, name, description })
    .returning();

  return resource;
}

// ❌ Bad
export async function create(req: any, res: any): Promise<any> {
  const data = await db.insert(resources).values(req.body).returning();
  return data[0];
}
```
