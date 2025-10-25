# Architecture

This document describes the system architecture and design patterns used in this template.

## Overview

This is a **monorepo** containing a full-stack TypeScript application with:
- Next.js frontend
- Fastify backend
- Shared type definitions
- Shared database layer

## System Architecture

```
┌─────────────────┐
│   Browser       │
│  (React/Next)   │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│   Next.js App   │
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐      ┌──────────────┐
│  Fastify API    │◄────►│  PostgreSQL  │
│  (Port 3001)    │      │   Database   │
└─────────────────┘      └──────────────┘
         │
         ▼
┌─────────────────┐
│  Shared Types   │
│   (@repo/types) │
└─────────────────┘
```

## Monorepo Structure

### Workspaces

```
root/
├── apps/          # Applications
│   ├── web/       # Frontend app
│   └── api/       # Backend app
├── packages/      # Shared packages
│   ├── types/     # TypeScript types
│   └── db/        # Database layer
```

### Benefits

- **Code Sharing**: Types, utilities, and configs shared across apps
- **Atomic Changes**: Change types once, affects both frontend and backend
- **Caching**: Turborepo caches builds and tests
- **Type Safety**: End-to-end type safety from DB to UI

## Frontend Architecture (Next.js)

### App Router Structure

```
apps/web/src/
├── app/                  # Next.js App Router
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   ├── login/
│   ├── register/
│   └── dashboard/
├── components/           # Reusable components
├── contexts/             # React contexts (auth, etc.)
└── lib/                  # Utilities
    └── api.ts            # API client
```

### Data Flow

```
Component → API Client → Backend API → Database
                ↓
            Shared Types
```

### State Management

- **Server State**: Server Components + Server Actions (when possible)
- **Client State**: React hooks (useState, useReducer)
- **Global State**: Context API (AuthContext)
- **Form State**: Controlled components

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: CSS variables + prefers-color-scheme
- **Responsive**: Mobile-first breakpoints

## Backend Architecture (Fastify)

### Route Structure

```
apps/api/src/
├── server.ts             # Entry point
├── routes/               # Feature routes
│   ├── auth/
│   │   ├── index.ts      # Route registration
│   │   ├── handlers.ts   # Business logic
│   │   ├── schemas.ts    # Validation
│   │   └── *.test.ts     # Tests
│   ├── users/
│   └── tasks/
└── lib/                  # Shared utilities
    ├── auth.ts
    └── validation.ts
```

### Request Flow

```
Request → Fastify → Validation → Handler → Database → Response
                        ↓
                    Zod Schema
                        ↓
                   Type Safety
```

### Plugin Architecture

Fastify plugins used:
- `@fastify/cors` - CORS handling
- `@fastify/jwt` - JWT authentication
- `@fastify/sensible` - Error helpers

### Authentication

1. User logs in with credentials
2. Backend validates and returns JWT token
3. Frontend stores token in localStorage
4. Frontend sends token in Authorization header
5. Backend verifies token on protected routes

## Database Architecture

### ORM: Drizzle

Why Drizzle?
- **Type-safe**: Full TypeScript support
- **Lightweight**: No runtime overhead
- **SQL-like**: Familiar syntax
- **Migrations**: Built-in migration system

### Schema Organization

```
packages/db/src/schema/
├── index.ts        # Export all schemas
├── users.ts        # User table
├── sessions.ts     # Session table
└── tasks.ts        # Task table
```

### Migration Workflow

1. Update schema files
2. Run `pnpm db:generate` - creates SQL migration
3. Review migration in `packages/db/drizzle/`
4. Run `pnpm db:migrate` - applies migration

### Relations

```typescript
users ─┬─► tasks (one-to-many)
       └─► sessions (one-to-many)
```

## Type System

### Shared Types (@repo/types)

```typescript
packages/types/src/
├── index.ts        # Export all
├── models.ts       # Database models
├── api.ts          # API contracts
└── common.ts       # Shared utilities
```

### Type Flow

```
Database Schema (Drizzle)
    ↓
Model Types (packages/types/src/models.ts)
    ↓
API Contracts (packages/types/src/api.ts)
    ↓
Frontend Components (use API types)
    ↓
Backend Handlers (use API types)
```

### Contract-Driven Development

API contracts define the interface between frontend and backend:

```typescript
export namespace UsersAPI {
  export interface UpdateUserRequest {
    name?: string;
    email?: string;
  }

  export type UpdateUserResponse = User;
}
```

Frontend:
```typescript
const user = await apiClient.users.updateMe({ name: 'New Name' });
// user is typed as User
```

Backend:
```typescript
async function updateUserHandler(
  request: FastifyRequest<{ Body: UsersAPI.UpdateUserRequest }>
): Promise<UsersAPI.UpdateUserResponse> {
  // TypeScript knows the shape of body and return type
}
```

## Testing Strategy

### Unit Tests (Vitest)

- **Backend**: Test handlers, utilities, business logic
- **Frontend**: Test components, hooks, utilities
- **Location**: Colocated with code (*.test.ts)

### E2E Tests (Playwright)

- **Purpose**: Test user workflows end-to-end
- **Location**: `apps/web/tests/e2e/`
- **Runs**: Against real frontend + backend

### Testing Pyramid

```
        ▲
       ╱E2E╲          Few, slow, high-value
      ╱─────╲
     ╱ Integ.╲        Some, medium speed
    ╱─────────╲
   ╱   Unit    ╲      Many, fast, focused
  ╱─────────────╲
```

## Build System (Turborepo)

### Pipeline

```
packages/types (build)
        ↓
packages/db (build)
        ↓
    ┌───┴───┐
apps/api  apps/web
 (build)   (build)
```

### Caching

Turborepo caches:
- Build outputs
- Test results
- Lint results

Benefits:
- Skip unchanged packages
- Parallel execution
- Faster CI/CD

## Security

### Authentication

- Passwords hashed with bcrypt (10 rounds)
- JWT tokens with expiration (7 days)
- Tokens stored in localStorage (consider httpOnly cookies for production)

### Authorization

- JWT verified on protected routes
- User ID extracted from token
- Database queries filtered by user ID

### Best Practices

- ✅ Use environment variables for secrets
- ✅ Validate all inputs with Zod
- ✅ Use parameterized queries (Drizzle handles this)
- ✅ CORS configured
- ✅ HTTPS in production (Vercel handles this)

## Performance

### Frontend

- Server Components by default (where possible)
- Code splitting (automatic with Next.js)
- Image optimization (next/image)
- Bundle size monitoring

### Backend

- Connection pooling (postgres client)
- Async/await everywhere
- Fastify is inherently fast
- Database indexing (add as needed)

### Database

- Indexes on foreign keys
- Pagination on list endpoints
- Efficient queries with Drizzle

## Deployment

### Frontend (Vercel)

- Push to GitHub
- Vercel auto-deploys
- Environment variables in Vercel dashboard

### Backend (Options)

- **Vercel** (serverless functions)
- **Railway** (containers)
- **Fly.io** (containers)
- **AWS/GCP** (containers/VMs)

### Database

- **Supabase** (managed Postgres)
- **Neon** (serverless Postgres)
- **Railway** (managed Postgres)

## Scalability Considerations

### Current Limits

- Single database
- Monolithic API
- No caching layer

### Future Enhancements

- Add Redis for caching
- Separate read/write databases
- Microservices (if needed)
- Message queue for async tasks
- CDN for static assets

## Claude Code Optimization

### Token Efficiency

- `.claudeignore` excludes generated files
- Focused workspace structure
- Commands scope to specific tasks
- Design documents reduce refactoring

### Workflows

1. Design → Types → Database → Backend → Frontend → Tests
2. Each step is a separate focused task
3. Claude works on one workspace at a time
4. Shared types ensure consistency

## Design Principles

1. **Type Safety First**: Leverage TypeScript everywhere
2. **Separation of Concerns**: Clear boundaries between layers
3. **Convention Over Configuration**: Follow established patterns
4. **DRY but Pragmatic**: Share code, but don't over-abstract
5. **Test at the Right Level**: Unit for logic, E2E for workflows
6. **Performance by Default**: Choose fast tools and patterns
