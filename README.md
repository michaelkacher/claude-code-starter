# Web Project Template

A production-ready full-stack TypeScript template optimized for rapid development with Claude Code.

## Features

- **Frontend**: Next.js 16 with App Router, React 19, TypeScript, Tailwind CSS
- **Backend**: Fastify 5 with TypeScript, JWT authentication
- **Database**: PostgreSQL with Drizzle ORM (type-safe migrations)
- **Monorepo**: pnpm workspaces + Turborepo for optimal build caching
- **Testing**: Vitest (unit) + Playwright (e2e)
- **Type Safety**: Shared TypeScript types across frontend and backend
- **Claude Code**: Optimized workflows and slash commands

## Quick Start

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env

# Set up database (update DATABASE_URL in .env first)
pnpm db:generate
pnpm db:migrate

# Start development servers (both frontend and backend)
pnpm dev
```

Visit:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- API Health: http://localhost:3001/health

## Project Structure

```
.
├── apps/
│   ├── web/              # Next.js frontend
│   └── api/              # Fastify backend
├── packages/
│   ├── types/            # Shared TypeScript types
│   └── db/               # Database schema and client
├── .claude/              # Claude Code configuration
│   ├── commands/         # Slash commands for workflows
│   └── designs/          # Feature design documents
├── tests/                # Shared test utilities
└── docs/                 # Documentation
```

## Development

### Run Individual Apps

```bash
# Frontend only
pnpm dev:web

# Backend only
pnpm dev:api
```

### Testing

```bash
# All tests
pnpm test

# Unit tests only
pnpm test:unit

# E2E tests only
pnpm test:e2e

# Watch mode for development
cd apps/api && pnpm test:watch
```

### Database

```bash
# Generate migration after schema changes
pnpm db:generate

# Run migrations
pnpm db:migrate

# Open Drizzle Studio (database GUI)
pnpm db:studio
```

## Claude Code Integration

This template is optimized for development with Claude Code. Available commands:

- `/design-feature` - Plan a new feature with architecture
- `/add-endpoint` - Add a new API endpoint
- `/add-component` - Add a new React component
- `/add-migration` - Create a database migration
- `/test-feature` - Run tests for a feature

See [.claude/README.md](.claude/README.md) for detailed workflow documentation.

## Documentation

- [Getting Started](docs/GETTING_STARTED.md) - Detailed setup guide
- [Architecture](docs/ARCHITECTURE.md) - System design and patterns
- [Claude Workflows](docs/CLAUDE_WORKFLOWS.md) - Using Claude Code effectively
- [API Conventions](docs/API_CONVENTIONS.md) - Backend patterns
- [Component Guide](docs/COMPONENT_GUIDE.md) - Frontend patterns

## Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5.7
- **Styling**: Tailwind CSS 3.4
- **State**: React 19 hooks + Context API
- **Testing**: Vitest + Playwright

### Backend
- **Framework**: Fastify 5
- **Language**: TypeScript 5.7
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM
- **Auth**: JWT via @fastify/jwt
- **Validation**: Zod
- **Testing**: Vitest

### Tooling
- **Package Manager**: pnpm 9
- **Build System**: Turborepo
- **Linting**: ESLint + TypeScript
- **Formatting**: Prettier

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all apps for production |
| `pnpm test` | Run all tests |
| `pnpm lint` | Lint all packages |
| `pnpm typecheck` | Type-check all packages |
| `pnpm clean` | Clean all build artifacts |
| `pnpm format` | Format code with Prettier |

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `DATABASE_URL` - PostgreSQL connection string
- `API_PORT` - Backend server port (default: 3001)
- `JWT_SECRET` - Secret key for JWT tokens
- `NEXT_PUBLIC_API_URL` - API URL for frontend

## Deployment

### Vercel (Recommended for Frontend)

```bash
cd apps/web
vercel
```

### Docker (Full Stack)

```bash
# Coming soon
docker-compose up
```

## License

MIT

## Contributing

This is a template repository. Fork it and make it your own!
