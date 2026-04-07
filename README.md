# Sama Energy

Sama Energy is a small monorepo prototype I built after learning more about the kinds of frontend problems involved in battery market and forecasting products.

I wanted to build something concrete that showed how I would approach that space in practice: structuring a data-heavy frontend, defining typed UI-to-API boundaries, designing reusable dashboard primitives, and making analytical workflows feel clear and responsive.

Rather than trying to simulate a full production energy platform, I kept the backend deterministic and focused the project on the interface and architecture decisions I thought were most important to demonstrate.

## Why I Built This

I built this project as a practical way to show how I think about frontend engineering in a product like this.

A lot of the interesting challenges in this space are not just about rendering charts. They are about:

- shaping data into usable workflows
- keeping filters, views, and contracts consistent
- building reusable UI patterns without overengineering
- handling loading, refetching, errors, and empty states well
- making dense analytical interfaces still feel clear and intentional

This project was my way of showing how I would approach those decisions in code, rather than only talking about them abstractly.

## What the Product Covers

The current version includes two main flows:

- **Market Overview**  
  A single-market dashboard for KPI summaries, historical trends, forecast preview, and recent market summary data.

- **Market Comparison**  
  A multi-market dashboard for comparing 2 to 3 regions across the same battery duration and time range.

I intentionally kept the scope focused. The goal was not to build every possible feature. It was to build a realistic product slice with enough depth to show architectural judgement, product thinking, and frontend craft.

## Architecture

```text
.
|-- apps
|   |-- web        # Next.js frontend
|   `-- api        # Fastify mock API
`-- packages
    |-- contracts  # shared TypeBox schemas and TypeScript types
    `-- ui         # shared MUI-based theme and dashboard primitives
```

## Packages

### `apps/web`

The frontend is built with Next.js, React, TypeScript, Material UI, Recharts, React Query, and `nuqs`.

This is where I focused most of the work. I wanted the pages to feel like real product surfaces rather than static demos, so I leaned into:

- reusable dashboard primitives
- URL-synchronised filters
- server-prefetched initial data
- responsive refetch behaviour
- consistent loading, empty, and error states

### `apps/api`

The API is a Fastify service serving deterministic fixture data for markets, overview views, and comparison views.

I chose to put the mock layer behind a real API boundary instead of importing mock objects directly into the frontend. That let me model request/response contracts properly, validate query params, and build the UI against something closer to a real backend shape.

### `packages/contracts`

This package holds the shared schemas and TypeScript contracts for market metadata, overview responses, comparison responses, and API errors.

This was one of the key decisions in the repo. I wanted the frontend and backend to agree on the domain explicitly, not rely on loose assumptions.

### `packages/ui`

This package contains shared UI pieces like the dashboard shell, controls, panels, metric cards, navigation, and theme tokens.

I added this because I wanted to keep page code focused on composition and product logic, while still showing how I think about reusable frontend foundations.

## Technical Decisions

### Shared contracts first

I introduced a dedicated contracts package so the frontend and backend evolve against the same domain definitions. For a product like this, I think clear typed boundaries matter more than adding lots of internal layers.

### Mock API on purpose

The backend is intentionally deterministic. I was not trying to prove a forecasting model here. I was trying to show how I would structure the frontend and API boundary around one.

### URL-driven filters

I used `nuqs` so the filter state lives in the URL. That makes the dashboards shareable, reload-safe, and easier to reason about than local-only state.

### Reusable primitives before page sprawl

Rather than letting each page grow bespoke JSX, I pushed repeated dashboard patterns into shared UI primitives. That made the feature code easier to read and the product feel more coherent.

### Responsive data-fetching UX

I used React Query for prefetching, hydration, caching, and refetch handling. I wanted filter changes to feel smooth and product-like rather than like full page resets.

## What I Wanted This Project To Demonstrate

More than anything, I wanted this repo to show how I think.

In particular:

- how I structure a small monorepo without adding unnecessary complexity
- how I define and preserve typed boundaries between UI and API
- how I build reusable product primitives instead of one-off page code
- how I think about analytical UX beyond the happy path
- how I balance product clarity, implementation discipline, and speed

## Local Development

### Prerequisites

- Node.js
- `pnpm` 10

### Install

```bash
pnpm install
```

### Run the full monorepo

```bash
pnpm dev
```

This starts:

- the web app on `http://localhost:3000`
- the API on `http://localhost:3001`

### Environment

If your API is running elsewhere, set:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
```

The API supports:

```bash
PORT=3001
WEB_ORIGIN=http://localhost:3000
```

See `apps/api/.env.example`.

## Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm test
```

## Testing

The repo currently includes API tests covering:

- market metadata responses
- overview payload shape
- comparison payload shape
- validation and unsupported-filter failures

Frontend component and end-to-end coverage are still areas I would add next.

## What I Would Build Next

If I continued this project, I would:

- replace deterministic fixtures with real market and forecast data sources
- add frontend interaction and end-to-end test coverage
- profile rendering behaviour with larger datasets
- deepen the comparison and scenario analysis flows
- introduce saved views and more persistent workflows
- explore AI-assisted workflows like grounded market summaries and typed analyst copilots
