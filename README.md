# ReleaseCheck

ReleaseCheck is a modern, single-page web application to manage release checklists for software teams.

## Tech Stack
**Frontend:** React, Vite, TypeScript, Material-UI, Apollo Client, `@mui/x-date-pickers` (with Moment.js)
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
4. Run `npx tsx src/setupDb.ts` to initialize the database tables.
5. `npm run dev` to start the GraphQL server on `http://localhost:4000/graphql`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev` to start the Vite dev server

## API Endpoints (GraphQL)
Endpoint: `POST /graphql`

**Queries:**
- `getReleases`: Fetch all releases with their associated tickets.
- `getRelease(id: ID!)`: Fetch a specific release by its ID with its associated tickets.

**Mutations:**
- `createRelease(input: CreateReleaseInput!)`: Creates a new release (starts empty, without any tickets).
- `updateRelease(input: UpdateReleaseInput!)`: Updates an existing release's additional info.
- `deleteRelease(id: ID!)`: Deletes a release.
- `createTicket(releaseId: ID!, title: String!)`: Creates a custom ticket inside a release.
- `updateTicket(id: ID!, isCompleted: Boolean, title: String)`: Updates a ticket's title or completion status.
- `deleteTicket(id: ID!)`: Deletes a ticket from a release.

## Database Schema (PostgreSQL)

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS releases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    "additionalInfo" TEXT,
    status INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_id UUID NOT NULL REFERENCES releases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

*Note: `status` logic (0: planned, 1: ongoing, 2: done) is computed dynamically based on the completion state of the tickets inside a release.*
