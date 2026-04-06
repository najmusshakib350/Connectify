# Appifylab

Monorepo with a **NestJS** API (`apps/backend`), a **Next.js** web app (`apps/frontend`), and **Docker** services for PostgreSQL and Redis.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/) 10.x (see `packageManager` in `package.json`)
- [Docker](https://www.docker.com/) (for local Postgres and Redis)

## Setup

1. **Install dependencies** (from the repository root):

   ```bash
   pnpm install
   ```

2. **Start databases** (Postgres on `5432`, Redis on `6379`):

   ```bash
   pnpm run docker:up:all
   ```

3. **Environment files**

   - Copy `apps/backend/.env.example` to `apps/backend/.env` and set `DATABASE_URL`, JWT secrets, and Redis settings to match Docker (see `.env.example` comments).
   - Copy `apps/frontend/.env.example` to `apps/frontend/.env` and set the API URL and NextAuth values.

4. **Database schema** (backend): from the **repository root**, run these after Postgres is up and **`DATABASE_URL`** is set in `apps/backend/.env` (step 3). Prisma needs that URL to connect before migrations or client generation can succeed.

   ```bash
   pnpm run prisma:migrate
   pnpm run prisma:generate
   ```

   `prisma migrate dev` applies pending migrations in development; `prisma generate` refreshes the Prisma Client.

   If pnpm reports no `prisma` script, use `exec` before `prisma` (for example, `pnpm --filter backend exec prisma migrate dev`). More backend-specific notes are in `apps/backend/README.md`.

## Development

Run these from the **repository root**:

| Command | What it does |
|--------|----------------|
| `pnpm run dev:backend` | API in watch mode (default port `4000`) |
| `pnpm run dev:frontend` | Next.js dev server (default port `3000`) |
| `pnpm run build:backend` | Production build of the API |
| `pnpm run build:frontend` | Production build of the web app |

| Command | What it does |
|--------|----------------|
| `pnpm run docker:down` | Stop Docker services |

More detail for each app lives in `apps/backend/README.md` and `apps/frontend/README.md`.
