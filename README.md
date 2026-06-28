# ReleaseCheck

ReleaseCheck is a modern, single-page web application to manage release checklists for software teams.

## Tech Stack
**Frontend:** React, Vite, TypeScript, Material-UI, Apollo Client
**Backend:** Node.js, Express, TypeScript, Apollo Server, Zod
**Database:** Neon PostgreSQL (using `@neondatabase/serverless`)

## Architecture
The repository contains a monorepo setup with two distinct packages:
- `backend`: The Node.js Express/Apollo GraphQL server.
- `frontend`: The React Vite SPA.

## Getting Started

### Backend
1. `cd backend`
2. `npm install`
3. Configure your Neon Database URI in a `.env` file (e.g., `DATABASE_URL=...`)
4. `npm run dev` to start the GraphQL server on `http://localhost:4000/graphql`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the Vite dev server

## API Endpoints (GraphQL)
Endpoint: `POST /graphql`

**Queries:**
- `getReleases`: Fetch all releases.
- `getRelease(id: ID!)`: Fetch a specific release by its ID.

**Mutations:**
- `createRelease(input: CreateReleaseInput!)`: Creates a new release.
- `updateRelease(input: UpdateReleaseInput!)`: Updates an existing release's status, steps, or additional info.
- `deleteRelease(id: ID!)`: Deletes a release.

## Database Schema (PostgreSQL)
The application relies on a single `releases` table tracking the fixed steps as a JSON object/array.

```sql
CREATE TABLE releases (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    "additionalInfo" TEXT,
    "completedSteps" JSON DEFAULT '[]',
    status INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL
);
```

*Note: `status` logic (0: planned, 1: ongoing, 2: done) is managed via the GraphQL resolvers.*
