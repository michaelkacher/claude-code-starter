# Getting Started

This guide will help you set up and start developing with this template.

## Prerequisites

- **Node.js** 20+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **pnpm** 9+ (`npm install -g pnpm`)
- **PostgreSQL** 14+ (or use Supabase)
- **Git**

## Installation

### 1. Clone or Create from Template

```bash
# Option A: Use as template on GitHub
# Click "Use this template" button

# Option B: Clone directly
git clone <your-repo-url>
cd web-project-template
```

### 2. Install Dependencies

```bash
pnpm install
```

This installs dependencies for all packages in the monorepo.

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and configure:

```bash
# Required
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
JWT_SECRET=your-super-secret-key-min-32-chars

# Optional
API_PORT=3001
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Set Up Database

**Option A: Local PostgreSQL**

```bash
# Create database
createdb myapp

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp

# Run migrations
pnpm db:generate
pnpm db:migrate
```

**Option B: Supabase (Recommended)**

1. Create a project at [supabase.com](https://supabase.com)
2. Get the connection string from Settings > Database
3. Update `.env`:
   ```bash
   DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
   ```
4. Run migrations:
   ```bash
   pnpm db:migrate
   ```

### 5. Start Development

```bash
# Start both frontend and backend
pnpm dev
```

Visit:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001/health

## Verify Setup

### Test the API

```bash
curl http://localhost:3001/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Test the Frontend

1. Open http://localhost:3000
2. Click "Register"
3. Create an account
4. You should be redirected to the dashboard

### Run Tests

```bash
# Unit tests
pnpm test:unit

# E2E tests (make sure dev server is running)
pnpm test:e2e
```

## Next Steps

### Create Your First Feature

1. **Design the feature**:
   ```bash
   # In Claude Code
   /design-feature
   ```

2. **Add database migration** (if needed):
   ```bash
   /add-migration
   ```

3. **Add API endpoint**:
   ```bash
   /add-endpoint
   ```

4. **Add frontend component**:
   ```bash
   /add-component
   ```

5. **Test it**:
   ```bash
   /test-feature
   ```

### Customize the Template

- **Branding**: Update `apps/web/src/app/layout.tsx` metadata
- **Styling**: Modify `apps/web/tailwind.config.js`
- **Remove Task Example**: Delete task-related files if not needed

### Learn the Patterns

- Read [ARCHITECTURE.md](./ARCHITECTURE.md) for system design
- Read [API_CONVENTIONS.md](./API_CONVENTIONS.md) for backend patterns
- Read [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) for frontend patterns

## Common Issues

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 3001
npx kill-port 3001
```

### Database Connection Failed

- Verify PostgreSQL is running
- Check DATABASE_URL is correct
- Test connection: `psql $DATABASE_URL`

### TypeScript Errors

```bash
# Rebuild all packages
pnpm clean
pnpm install
pnpm build
```

### Module Not Found

```bash
# Clear turbo cache
rm -rf .turbo
pnpm clean
pnpm install
```

## Development Workflow

### Making Changes

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Run tests: `pnpm test`
4. Commit: `git commit -m "Add feature"`
5. Push and create PR

### Before Committing

```bash
# Type check
pnpm typecheck

# Lint
pnpm lint

# Format
pnpm format

# Test
pnpm test
```

### Working with Database

```bash
# Make schema changes in packages/db/src/schema/

# Generate migration
pnpm db:generate

# Review migration in packages/db/drizzle/

# Apply migration
pnpm db:migrate

# Open database GUI
pnpm db:studio
```

## IDE Setup

### VS Code (Recommended)

Install extensions:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Playwright Test for VSCode

Recommended settings (`.vscode/settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib"
}
```

## Getting Help

- Check [docs/](./docs/) directory
- Read `.claude/README.md` for Claude Code workflows
- Open an issue on GitHub
- Ask Claude Code for help!
