---
description: Add a database migration for schema changes
---

You are helping add a database migration using Drizzle ORM.

# Add Migration Workflow

Follow these steps:

1. **Update Schema**
   - Edit or create schema file in `packages/db/src/schema/`
   - Define tables using Drizzle syntax
   - Export TypeScript types

2. **Generate Migration**
   - Run `pnpm --filter=@repo/db db:generate`
   - This creates a SQL migration file in `packages/db/drizzle/`

3. **Review Migration**
   - Check the generated SQL in `packages/db/drizzle/`
   - Ensure it matches your intent
   - Edit if necessary (rare)

4. **Apply Migration**
   - Development: `pnpm db:migrate`
   - The migration runs automatically

5. **Update Types**
   - If new models are added, export types from schema
   - Update `packages/types/src/models.ts` if needed

## Example Schema

```typescript
// packages/db/src/schema/posts.ts
import { pgTable, text, timestamp, uuid, boolean } from 'drizzle-orm/pg-core';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';
import { users } from './users';

export const posts = pgTable('posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  published: boolean('published').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Post = InferSelectModel<typeof posts>;
export type NewPost = InferInsertModel<typeof posts>;
```

Ask the user what schema changes they need, then implement the migration following this workflow.
