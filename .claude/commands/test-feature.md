---
description: Run tests for a specific feature
---

You are helping test a feature in this application.

# Test Workflow

Follow these steps:

1. **Identify What to Test**
   - Ask user which feature/component to test
   - Determine test type needed:
     - Unit tests (backend/frontend logic)
     - E2E tests (user workflows)

2. **Run Appropriate Tests**

   **Backend Unit Tests:**
   ```bash
   pnpm --filter=api test
   ```

   **Frontend Unit Tests:**
   ```bash
   pnpm --filter=web test:unit
   ```

   **E2E Tests:**
   ```bash
   pnpm --filter=web test:e2e
   ```

   **All Tests:**
   ```bash
   pnpm test
   ```

3. **Analyze Results**
   - If tests fail, review the error messages
   - Identify which tests are failing and why

4. **Fix Issues**
   - Fix the code or tests based on failures
   - Re-run tests to verify fixes

5. **Add Missing Tests**
   - If coverage is low, suggest additional test cases
   - Write new tests following existing patterns

## Test Patterns

### Backend Unit Test
```typescript
import { describe, it, expect } from 'vitest';
import { someFunction } from './module.js';

describe('someFunction', () => {
  it('should do something', () => {
    const result = someFunction('input');
    expect(result).toBe('expected');
  });
});
```

### E2E Test
```typescript
import { test, expect } from '@playwright/test';

test('user can complete workflow', async ({ page }) => {
  await page.goto('/');
  await page.click('button');
  await expect(page).toHaveURL('/success');
});
```

Run tests and report results to the user.
