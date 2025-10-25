# Claude Code Configuration

This directory contains configuration and workflows optimized for Claude Code.

## Directory Structure

```
.claude/
├── commands/          # Slash commands for common workflows
│   ├── design-feature.md
│   ├── add-endpoint.md
│   ├── add-component.md
│   ├── add-migration.md
│   └── test-feature.md
├── designs/           # Feature design documents
│   ├── README.md
│   └── example-tasks-feature.md
└── README.md         # This file
```

## Available Commands

### `/design-feature`
Design a new feature with architecture and API contracts before implementation.

**Use when:**
- Starting a new feature
- Need to plan database schema changes
- Want to define API contracts
- Need architectural guidance

### `/add-endpoint`
Add a new API endpoint to the Fastify backend with proper structure and tests.

**Use when:**
- Adding a new REST endpoint
- Need to follow backend patterns
- Want proper error handling

### `/add-component`
Add a new React component following Next.js and project conventions.

**Use when:**
- Creating a new UI component
- Building a new page
- Need to integrate with API

### `/add-migration`
Create a database migration using Drizzle ORM.

**Use when:**
- Adding new tables
- Modifying schema
- Need to update database structure

### `/test-feature`
Run tests for a specific feature or component.

**Use when:**
- Verifying a feature works
- Debugging test failures
- Checking test coverage

## Workflow Recommendations

### For New Features

1. **Design First**: Use `/design-feature` to plan the feature
   - Define requirements and architecture
   - Create API contracts
   - Get approval before coding

2. **Database Changes**: Use `/add-migration` if schema changes needed
   - Update schema files
   - Generate migration
   - Apply migration

3. **Backend Implementation**: Use `/add-endpoint` for each API endpoint
   - Create route structure
   - Implement handlers
   - Write tests

4. **Frontend Implementation**: Use `/add-component` for UI components
   - Create components
   - Integrate with API
   - Style with Tailwind

5. **Testing**: Use `/test-feature` to verify everything works
   - Run unit tests
   - Run e2e tests
   - Fix any failures

### For Bug Fixes

1. Write a failing test that reproduces the bug
2. Fix the code
3. Verify the test passes
4. Check for regressions

## Token Efficiency Tips

- **Work on one workspace at a time**: Focus on either `apps/api` or `apps/web`
- **Use focused commands**: Commands are scoped to specific tasks
- **Leverage .claudeignore**: Large files are already excluded
- **Design before coding**: Prevents costly refactoring

## Best Practices

1. **Always design first** for non-trivial features
2. **Write tests alongside code**, not after
3. **Use shared types** from `@repo/types`
4. **Follow existing patterns** in the codebase
5. **Keep components small** and focused
6. **Use TypeScript strictly** - no `any` types

## Need Help?

Ask Claude to:
- Explain a command: "How does /design-feature work?"
- Create a custom command: "Create a command for adding a new database seed"
- Improve a workflow: "How can I make the testing workflow better?"
