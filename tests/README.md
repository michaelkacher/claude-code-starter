# Testing

This directory contains shared testing utilities and e2e tests for the entire application.

## Test Structure

- `apps/api/src/**/*.test.ts` - API unit tests (Vitest)
- `apps/web/src/**/*.test.tsx` - Frontend component tests (Vitest)
- `apps/web/tests/e2e/**/*.spec.ts` - End-to-end tests (Playwright)

## Running Tests

```bash
# Run all tests
pnpm test

# Run unit tests only
pnpm test:unit

# Run e2e tests only
pnpm test:e2e

# Run tests in watch mode (for development)
cd apps/api && pnpm test:watch
cd apps/web && pnpm test:watch
```

## Writing Tests

### Unit Tests

Unit tests are colocated with the code they test. For example:

- `apps/api/src/routes/auth/handlers.ts` → `apps/api/src/routes/auth/handlers.test.ts`
- `apps/web/src/components/TaskList.tsx` → `apps/web/src/components/TaskList.test.tsx`

### E2E Tests

E2E tests simulate real user workflows and are located in `apps/web/tests/e2e/`.

Example:
```typescript
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[type="email"]', 'test@example.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```
