# Frontend

Next.js app (React 19) with Tailwind CSS, TanStack Query, and NextAuth. Talks to the backend API configured via environment variables.

## Prerequisites

- Backend running when you use authenticated or API-backed features (see `apps/backend/README.md`)
- Environment configured (see below)

## Configuration

1. Copy `.env.example` to `.env`.
2. Set `NEXT_PUBLIC_API_URL` to your API origin (e.g. `http://localhost:4000`).
3. Set `NEXTAUTH_SECRET` and `NEXTAUTH_URL` (e.g. `http://localhost:3000` for local dev).

## Commands

Run from **`apps/frontend`** (or use `pnpm --filter frontend <script>` from the repo root):

| Script | Description |
|--------|-------------|
| `pnpm run dev` | Development server (default [http://localhost:3000](http://localhost:3000)) |
| `pnpm run build` | Production build |
| `pnpm run start` | Serve the production build |
| `pnpm run lint` | ESLint |

For a full stack setup (Docker DBs, env files, Prisma), follow the root `README.md` in the repository.
