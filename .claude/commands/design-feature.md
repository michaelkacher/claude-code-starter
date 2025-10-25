---
description: Design a new feature with architecture and API contracts
---

You are helping design a new feature for this full-stack application.

# Feature Design Workflow

Follow these steps to design the feature:

1. **Gather Requirements**
   - Ask the user to describe the feature
   - Clarify the user story and acceptance criteria
   - Identify affected parts of the system

2. **Design Architecture**
   - Database schema changes (if any)
   - API endpoints needed
   - Frontend components needed
   - Authentication/authorization requirements

3. **Define API Contracts**
   - Add new types to `packages/types/src/api.ts`
   - Define request/response shapes
   - Ensure type safety across frontend/backend

4. **Create Design Document**
   - Create a markdown file in `.claude/designs/[feature-name].md`
   - Document the architecture decisions
   - Include database schema, API contracts, and component structure

5. **Get Approval**
   - Present the design to the user
   - Ask for feedback and approval before proceeding

**After approval**, the user can use `/add-endpoint` and `/add-component` commands to implement the feature.

## Design Document Template

```markdown
# Feature: [Name]

## Overview
Brief description of the feature

## User Story
As a [user type], I want to [action] so that [benefit]

## Architecture

### Database Changes
- New tables or columns needed
- Relationships
- Migrations required

### API Endpoints
- `POST /api/resource` - Description
- `GET /api/resource/:id` - Description

### Frontend Components
- ComponentName - Purpose
- ComponentName - Purpose

## API Contracts

### Types (add to packages/types/src/api.ts)
\`\`\`typescript
export namespace FeatureAPI {
  export interface CreateRequest { ... }
  export type CreateResponse = ...;
}
\`\`\`

## Implementation Steps
1. Database migration
2. Backend implementation
3. Frontend implementation
4. Tests

## Open Questions
- Any unresolved decisions
```

Start by asking the user to describe the feature they want to design.
