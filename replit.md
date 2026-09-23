# Him&I

Him&I is a private, mobile-first couple space for Ahmed and Mariam to share moods, memories, streaks, and everyday moments.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/him-and-i/src/` — the Him&I web app, routes, shell, dashboard, memories, reels, chat, and settings surfaces.
- `artifacts/api-server/src/routes/couple.ts` — the first couple overview, moods, memories, and shared-list API.
- `lib/api-spec/openapi.yaml` — the source-of-truth API contract used to generate typed client hooks.
- `artifacts/him-and-i/src/index.css` — the shared Him&I visual theme and responsive styling.

## Architecture decisions

- The first slice uses a shared couple identity rather than local account flows; authentication can be added before private rollout.
- The frontend consumes generated API hooks from the OpenAPI contract instead of hand-written request types.
- Navigation is built mobile-first with a bottom dock on small screens and a persistent rail on larger screens.

## Product

The current product slice includes a shared home dashboard with the anniversary counter, streaks, mood prompt, memories preview, shared list, and routes for Memories, Our Reels, Private Chat, and customization settings. The API already exposes the couple overview, mood submission, memories, and shared-list flows.

## User preferences

The user requested a highly customizable private couple app for exactly Ahmed and Mariam, with a polished, vibrant, mobile-first experience.

## Gotchas

- After changing `lib/api-spec/openapi.yaml`, run `pnpm --filter @workspace/api-spec run codegen` before using new client hooks.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
