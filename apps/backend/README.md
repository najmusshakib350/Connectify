# Backend

NestJS REST API with Prisma (PostgreSQL), Redis, and JWT auth. Serves static uploads under `/uploads/`.

## Prerequisites

- PostgreSQL and Redis running (e.g. `pnpm run db:up` from the **repository root**)
- Environment configured (see below)

## Configuration

1. Copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your Postgres instance (Docker Compose uses user/password/db `appifylab` on `localhost:5432` by default).
3. Set `JWT_SECRET`, `REDIS_HOST`, and `REDIS_PORT` as needed.

Default HTTP port is `4000` (`PORT` in `.env`).

## Commands

Run from **`apps/backend`** (or use `pnpm --filter backend <script>` from the repo root):

| Script | Description |
|--------|-------------|
| `pnpm run start:dev` | Dev server with reload |
| `pnpm run build` | Compile for production |
| `pnpm run start:prod` | Run compiled app (`node dist/main`) |
| `pnpm run prisma:generate` | Generate Prisma Client |
| `pnpm run prisma:migrate` | Create/apply migrations in development |
| `pnpm run test` | Unit tests |
| `pnpm run lint` | ESLint |

The frontend expects the API base URL you configure in `NEXT_PUBLIC_API_URL` (see `apps/frontend/.env.example`).
