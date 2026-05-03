# POS Dashboard Design

## Source Documents

- `CONTEXT.md`
- `docs/adr/0001-pos-dashboard-tech-stack.md`
- `docs/specs/pos-dashboard/requirements.md`
- `DESIGN.md`
- `revenue_overview/code.html` and `revenue_overview/screen.png`
- `inventory_overview/code.html` and `inventory_overview/screen.png`
- `user_management/DESIGN.md`, `user_management/code.html`, and `user_management/screen.png`

## Overview

The POS dashboard is a full-stack Next.js application backed by Supabase Postgres, Supabase Auth, Supabase RLS, Supabase Queues, Supabase Edge Functions, and Drizzle migrations. Sapo is treated as an external source system. Dashboard requests never call Sapo directly; they read normalized, brand-scoped data from Postgres.

## Architecture

```text
Sapo Admin REST API + Webhooks
  -> Next.js webhook route
  -> Supabase Queue messages
  -> Supabase Edge Function consumers
  -> normalized Postgres source tables
  -> Brand Mapping and Reporting Category rules
  -> dashboard aggregate/detail query layer
  -> Next.js Revenue Overview / Inventory Overview
  -> CSV exports
```

The webhook route verifies the raw Sapo webhook body, writes a queue message, and returns immediately. Queue consumers fetch source records from Sapo when needed, normalize data, apply idempotent upserts, and update sync status. Supabase Cron invokes reconciliation/backfill jobs so missed webhooks do not leave dashboards stale indefinitely.

## Components and Interfaces

### Next.js App

- Uses App Router, TypeScript, Tailwind, shadcn/ui, Radix primitives, and lucide-react.
- Provides authenticated dashboard layouts with the shared shell from the UI references.
- Uses server components/actions for initial dashboard data where practical.
- Uses client components for filters, tables, and charts.
- Uses TanStack Table for Revenue Detail Rows and Inventory Product Rows.
- Uses Recharts for the Revenue Overview column/bar chart.

### UI Reference Implementation

The implementation must translate the provided HTML references into reusable React components rather than inventing a new visual system.

Shared layout:

- 240px fixed dark slate sidebar.
- Daspace brand block at top.
- Active nav row with white text, translucent active background, and blue left border.
- Sticky top app bar per surface.
- Light `#fcf8fa`/slate workspace background.
- White cards with subtle slate borders and 8px radius.
- Manrope headings and Inter body/table text.
- Blue primary action buttons, ghost/outline secondary buttons, and compact status chips.
- Material Symbols in the HTML references should be replaced with equivalent lucide-react icons where available, matching size and intent.

Brand User navigation:

- Revenue
- Inventory
- Settings
- Logout

Daspace Admin navigation:

- Revenue
- Inventory
- User Management
- Settings
- Help Center where applicable
- Logout

Reference precedence:

- `DESIGN.md` controls design tokens and visual style.
- Each screen's `code.html` and `screen.png` control layout, component hierarchy, and interaction affordances.
- This spec controls functional behavior where reference mock data conflicts with requirements, including the 30-row default table pagination.

### Auth and Authorization

- Supabase Auth is the identity provider.
- Daspace Admins create Brand User Accounts through an admin-only account management surface.
- Brand User self-signup does not grant dashboard access; dashboard access requires an active admin-created Brand User Account.
- Brand User account creation uses Supabase Auth admin APIs to create/invite the user and trigger a password setup or invite flow.
- `brand_users` maps each authenticated user to exactly one Brand and stores account status.
- `daspace_admins` identifies admin users.
- Supabase RLS policies protect all brand-scoped tables and views.
- Server-side query helpers must also require current user role and Brand before querying dashboard data.
- Disabled Brand User Accounts are blocked by server-side role resolution and RLS claims/checks before any dashboard query returns data.
- Admin impersonation uses an audited "view as brand" session context and never changes the admin's actual role.

### User Management Surface

User Management is an admin-only dashboard surface matching `user_management/code.html` and `user_management/screen.png`.

It includes:

- Header with "User Management", total user count badge, Export, and Create User.
- Search input for user names and emails.
- Brand and Status filters.
- Active filter chips.
- User table with user identity/avatar initials, email, Brand name, role, last active date, status chip, and row actions.
- Pagination defaulting to 30 users per page.

Create User uses Supabase Auth admin APIs and the internal `brand_users` table in one admin action. The user must be assigned exactly one Brand before dashboard access is granted.

### Sapo Integration

- Sapo access token and webhook secret are server-side secrets.
- Required source data includes orders, refunds/cancellations, products, variants, locations, inventory items, and inventory levels.
- Sapo webhooks enqueue events for order, refund, product, location, inventory item, and inventory level changes.
- Backfill jobs query Sapo by modified timestamps and process source objects through the same normalization path as webhooks.
- Sapo timestamps are stored in UTC and displayed in Vietnam local time.

### Queue and Job Processing

- Supabase Queues stores durable messages in Postgres via `pgmq`.
- Queue names:
  - `sapo-webhooks`
  - `sapo-backfill`
  - `dashboard-recompute`
- Edge Function consumers read batches, process idempotently, and delete/archive messages only after success.
- Failed messages remain visible after the visibility timeout and retry.
- Messages exceeding the retry threshold are archived and surfaced in admin sync health.
- Supabase Cron invokes queue drains and reconciliation jobs.

### Data Model

Core entities:

- `brands`: Daspace brands.
- `brand_users`: one authenticated user to one Brand, with active/disabled status and invitation metadata.
- `daspace_admins`: admin user registry.
- `account_audits`: Brand User Account creation, invitation, Brand reassignment, disable, and reactivate activity.
- `sapo_products`: normalized Sapo product records.
- `sapo_variants`: normalized Sapo variant/SKU records.
- `sapo_locations`: normalized Sapo Branch records.
- `sapo_orders`: source-level order metadata without customer PII exposed to dashboard views.
- `pos_sale_lines`: normalized sale-line facts with order code, timestamps, state, branch, SKU, barcode, quantity, unit price, discounts, tax, gross amount, and net amount.
- `inventory_snapshots`: latest available stock by variant/SKU and Branch.
- `brand_mappings`: effective-dated mapping from Sapo product or SKU to Brand, with approval audit fields.
- `reporting_categories`: Daspace-managed categories.
- `product_category_mappings`: Sapo product/SKU to Reporting Category.
- `sync_runs`: job and webhook processing status.
- `export_audits`: export activity.
- `impersonation_audits`: admin "view as brand" activity.

Dashboard-facing views or query helpers:

- `brand_revenue_detail_rows`
- `brand_revenue_summary`
- `brand_revenue_timeseries`
- `brand_inventory_product_rows`
- `brand_inventory_summary`
- `admin_user_management_rows`

### Revenue Overview

The Revenue Overview query layer accepts:

- Brand context from the authenticated user.
- Date range preset or custom range.
- Order state filter.
- Branch filter.

It returns:

- Data Freshness.
- Total net revenue excluding tax after discounts, refunds, and cancellations.
- Total product sold.
- Total product cancelled.
- Previous-period comparison where available.
- Revenue chart grouped by day or month.
- Paginated Revenue Detail Rows, defaulting to 30 rows per page.

The UI matches the Revenue reference: filter card, three KPI cards, chart card with Daily/Monthly toggle, Revenue Detail Rows card, table search, pagination, and footer. The real Sapo order code is shown. Customer information, full basket context, and other Brands' sale lines are never returned.

### Inventory Overview

The Inventory Overview query layer accepts:

- Brand context from the authenticated user.
- Product name search.
- Reporting Category filter.
- Product creation date filter.
- Sort order.

It returns:

- Data Freshness.
- Total products in inventory.
- Products with Available Stock greater than zero and less than 10.
- Products with Available Stock equal to zero.
- Paginated Inventory Product Rows, defaulting to 30 rows per page.
- Top Categories by Stock.
- Inventory Insights panel data.

The UI matches the Inventory reference: top search, KPI cards, filter card, table, pagination, Top Categories by Stock, Inventory Insights, and contextual add button treatment. Inventory uses Sapo `available` as Available Stock. The v1 low-stock threshold is globally fixed at 10. The contextual add-product action must not write to Sapo in v1; render it as disabled, admin-only, or a non-mutating placeholder until product creation is explicitly in scope.

### Exports

- CSV exports are generated server-side.
- Export endpoints reuse the same query helpers and authorization path as the dashboard.
- Exports include only visible filtered rows and summary metrics.
- Export generation writes an audit record.
- PDF export is intentionally excluded from v1.
- User Management exports are admin-only and include only the currently filtered user list.

## Error Handling

- **Sapo 401/403**: mark POS Source as authorization failed, alert admins, keep serving latest verified data.
- **Sapo 429**: retry with backoff and preserve queue message.
- **Sapo 5xx/network failure**: retry with backoff and mark affected Data Freshness stale.
- **Webhook HMAC failure**: reject request and write a security event without enqueueing.
- **Duplicate webhook**: detect by source event/object version or idempotency key and no-op safely.
- **Out-of-order webhook**: refetch current Sapo object before upsert when payload version cannot be trusted.
- **Unmapped sale line/product**: hide from Brand Users and surface in admin mapping queue.
- **Mapping changed**: recompute affected revenue and inventory scopes from effective dates.
- **Export too large**: require narrower filters or enqueue export generation if needed.
- **RLS denial**: return unauthorized/not found without revealing whether data exists.

## Testing Strategy

### Unit Tests

- Brand Mapping effective-date resolution.
- Revenue net amount calculations.
- Refund and cancellation event-date handling.
- Available Stock low/out-of-stock classification.
- Date range and previous-period calculations.
- Sapo webhook HMAC verification.

### Integration Tests

- Webhook route enqueues valid messages and rejects invalid HMAC.
- Queue consumer processes order, product, and inventory messages idempotently.
- Brand User cannot access another Brand's dashboard data.
- Same Sapo order code can appear for multiple Brands while rows remain isolated.
- Export endpoints match visible filtered dashboard rows.
- RLS policies deny cross-brand reads.

### End-to-End Tests

- Brand User views Revenue Overview, applies date/state/Branch filters, exports CSV.
- Brand User views Inventory Overview, searches product, filters category/date, exports CSV.
- Daspace Admin maps an unmapped SKU and sees historical data become visible to the mapped Brand.
- Sapo sync failure shows stale Data Freshness to Brand Users and diagnostics to admins.

## Decisions

### Decision: Use Supabase Queues for v1 Jobs

**Context:** The app needs webhook processing, backfills, retries, and queue visibility without adding extra infrastructure.

**Options Considered:**

1. Supabase Queues + Edge Functions - Pros: one platform, Postgres-native, durable queue; Cons: pull-based consumers and custom retry/dead-letter handling.
2. Inngest - Pros: stronger durable workflow orchestration; Cons: adds another vendor.
3. Redis/BullMQ - Pros: mature queue pattern; Cons: extra infrastructure and worker deployment.

**Decision:** Use Supabase Queues + Edge Functions + Cron for v1.

**Rationale:** It keeps the stack small and aligns with the accepted ADR while still meeting v1 reliability needs.

### Decision: Use Available Stock for Inventory

**Context:** Sapo inventory includes multiple stock quantities.

**Options Considered:**

1. `available` - Pros: best reflects sellable stock; Cons: may differ from physical count.
2. `on_hand` - Pros: closer to physical stock; Cons: can include committed units.

**Decision:** Use Sapo `available`.

**Rationale:** The dashboard is for brand operational visibility, and sellable stock is more useful than physical stock for low/out-of-stock status.

### Decision: Show Real Sapo Order Code

**Context:** The revenue table requires `Mã Đơn hàng`.

**Options Considered:**

1. Real Sapo order code - Pros: supports reconciliation with Daspace/Sapo operations; Cons: same code may be visible to multiple Brands.
2. Masked internal reference - Pros: lower leakage risk; Cons: less useful for reconciliation.

**Decision:** Show real Sapo order code in Revenue Detail Rows.

**Rationale:** The order code is operationally useful, and row-level brand scoping prevents exposure of other Brands' sale lines or customer data.
