# ADR 0001: POS Dashboard Tech Stack

## Status

Accepted

## Context

The POS dashboard must ingest data from Daspace's Sapo POS account, enforce brand-scoped access, support near-real-time updates, show revenue and inventory dashboards, and provide filtered exports without leaking other brands' data.

The repository is currently greenfield, so the stack should optimize for speed of implementation, strong access-control boundaries, and enough background processing reliability for Sapo webhooks and backfills.

## Decision

Use a managed-first TypeScript stack:

- **Application framework**: Next.js App Router with TypeScript.
- **UI**: Tailwind CSS, shadcn/ui, Radix primitives, lucide-react icons.
- **Tables**: TanStack Table.
- **Charts**: Recharts through shadcn/ui chart patterns.
- **Database**: Supabase Postgres.
- **Auth**: Supabase Auth.
- **Authorization**: Postgres Row Level Security plus server-side brand checks.
- **ORM/query layer**: Drizzle ORM and SQL migrations.
- **Queue infrastructure**: Supabase Queues, backed by Postgres `pgmq`.
- **Job consumers**: Supabase Edge Functions for queue draining and Sapo processing, invoked immediately after webhook enqueue when possible and by Supabase Cron for reconciliation/backfill.
- **Sapo integration**: Next.js Route Handler for webhook receipt, Supabase Queue messages for async work, Edge Function consumers for processing, and direct Sapo Admin REST API calls from server-only code.
- **Exports**: Server-generated CSV in v1; PDF can be added later.
- **Deployment default**: Vercel for the Next.js app and Supabase for database, auth, queues, cron, and edge job consumers.

## Consequences

- The dashboard can be built as one full-stack app while still keeping Sapo credentials and brand authorization server-side.
- Supabase Postgres and RLS provide defense-in-depth for brand data isolation.
- Supabase Queues keeps queue storage inside Postgres and avoids adding Redis/BullMQ or Inngest as a separate vendor in v1.
- Supabase Queues is pull-based, so the system must provide reliable consumers; queue messages are not processed unless an Edge Function, scheduled job, or worker reads them.
- Queue consumers must implement idempotency, retry/backoff, dead-letter or archive handling, and metrics for stale queue depth.
- Drizzle keeps schema and query code close to TypeScript without forcing a heavy data framework.
- The stack depends on managed services; if Daspace later needs more complex durable workflow orchestration, the likely upgrade path is Inngest or a dedicated Node worker with Redis/BullMQ.

## Alternatives Considered

- **Next.js + Clerk + Neon + Inngest**: excellent developer experience, but brand-level database authorization requires extra JWT/RLS wiring compared with Supabase Auth.
- **NestJS API + React frontend + Postgres + BullMQ/Redis**: strong control and clean backend boundaries, but slower for v1 and more infrastructure to operate.
- **Inngest for jobs**: stronger durable workflow features and operational visibility, but adds another managed vendor when Supabase Queues is sufficient for v1 queueing.
