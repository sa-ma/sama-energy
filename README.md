# sama-energy

Lean `pnpm`/Turbo monorepo with a Next.js frontend and a Fastify mock API for battery forecast data.

## Apps

- `apps/web`: Next.js 16 App Router app using TypeScript and Material UI
- `apps/api`: Fastify API serving deterministic mock market and forecast data
- `packages/contracts`: shared TypeBox schemas and TypeScript contracts

## Commands

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`

## Local development

- Web: `http://localhost:3000`
- API: `http://localhost:3001`
- Configure the web app with `NEXT_PUBLIC_API_BASE_URL` if the API is not running on port `3001`.
