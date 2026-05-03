# POS Dashboard Implementation Tasks

## Source Documents

- `CONTEXT.md`
- `docs/adr/0001-pos-dashboard-tech-stack.md`
- `docs/specs/pos-dashboard/requirements.md`
- `docs/specs/pos-dashboard/design.md`
- `DESIGN.md`
- `revenue_overview/code.html` and `revenue_overview/screen.png`
- `inventory_overview/code.html` and `inventory_overview/screen.png`
- `user_management/DESIGN.md`, `user_management/code.html`, and `user_management/screen.png`

## Tasks

- [ ] 1. Scaffold the application foundation
  - Create a Next.js App Router project with TypeScript, Tailwind, ESLint, and path aliases.
  - Add shadcn/ui, Radix primitives, lucide-react, TanStack Table, Recharts, Supabase client packages, Drizzle, and CSV export utilities.
  - Configure Tailwind theme tokens from `DESIGN.md`, including colors, spacing, radii, Manrope headings, and Inter body/table typography.
  - Configure environment variables for Supabase, Sapo credentials, Sapo webhook secret, and app URL.
  - _Requirements: Shared UI Shell 1, Shared UI Shell 5, Non-Functional 3, Non-Functional 4_

- [ ] 2. Set up Supabase and Drizzle schema management
  - Add Drizzle config and migration scripts.
  - Create base tables for Brands, Brand Users, Daspace Admins, account audits, Sapo source records, Brand Mappings, Reporting Categories, dashboard facts, sync runs, export audits, and impersonation audits.
  - Enable RLS on brand-scoped tables and views.
  - _Requirements: Brand User 1-7, Account Management 1-7, Brand Mapping 1-5_

- [ ] 3. Implement authentication and role resolution
  - Wire Supabase Auth into Next.js SSR/App Router.
  - Create server helpers to resolve current user role and Brand.
  - Block dashboard access for users without an active admin-created Brand User Account or Daspace Admin role.
  - Create protected route groups for Brand User dashboards and Daspace Admin surfaces.
  - Add tests for role resolution and unauthorized access.
  - _Requirements: Brand User 1-7, Daspace Admin 5, Account Management 3, Account Management 6-7_

- [ ] 3.1 Implement admin Brand User Account management
  - Build admin-only account creation using Supabase Auth admin APIs.
  - Require email, display name, and exactly one Brand.
  - Send invite or password setup flow after account creation.
  - Support disable, reactivate, and Brand reassignment with audit records.
  - Prevent duplicate Brand User Accounts for the same email.
  - Add tests for create, invite, duplicate email, disable, reactivate, reassignment, and self-signup denial.
  - _Requirements: Daspace Admin 6-7, Account Management 1-7_

- [ ] 3.2 Build shared dashboard shell from UI references
  - Create reusable sidebar, top app bar, page canvas, card, filter bar, table shell, pagination, status chip, and action button components.
  - Match `DESIGN.md` and the HTML/screenshot references for spacing, color, typography, active nav treatment, card borders, table headers, and button states.
  - Use lucide-react icons equivalent to the reference Material Symbols.
  - Render Brand User navigation and Daspace Admin navigation according to role.
  - Add responsive checks so table/content areas scroll horizontally instead of overlapping.
  - _Requirements: Shared UI Shell 1-7_

- [ ] 4. Implement Brand Mapping foundation
  - Build data model and admin query helpers for effective-dated Brand Mappings.
  - Implement mapping resolution for POS Sale Lines and Inventory Product Rows.
  - Build audit records for create, update, retire, and undo actions.
  - Add unit tests for effective date boundaries and mapping changes.
  - _Requirements: Daspace Admin 1-3, Brand Mapping 1-5_

- [ ] 5. Configure Supabase Queues and job infrastructure
  - Enable Supabase Queues/`pgmq`.
  - Create `sapo-webhooks`, `sapo-backfill`, and `dashboard-recompute` queues.
  - Implement queue helper functions for send, read, delete/archive, retry threshold, and queue metrics.
  - Create admin-visible sync status records.
  - _Requirements: Sapo Ingestion 1-6, Non-Functional 6_

- [ ] 6. Implement Sapo webhook receipt
  - Create Next.js route handler for Sapo webhook requests.
  - Verify HMAC using the raw request body.
  - Store a minimal webhook receipt record and enqueue a `sapo-webhooks` message.
  - Return quickly after enqueue.
  - Add tests for valid HMAC, invalid HMAC, duplicate delivery, and malformed payloads.
  - _Requirements: Sapo Ingestion 1, Error Handling webhook HMAC_

- [ ] 7. Implement Sapo API client
  - Create server-only Sapo REST client with token header, base store URL, rate-limit awareness, and structured errors.
  - Add methods for orders, products, variants, locations, inventory items, and inventory levels.
  - Ensure Sapo credentials never reach client bundles, logs, or exports.
  - Add tests with mocked Sapo responses and error cases.
  - _Requirements: Sapo Ingestion 3-5, Non-Functional 4_

- [ ] 8. Implement queue consumers and backfill jobs
  - Create Supabase Edge Function consumer for `sapo-webhooks`.
  - Create Supabase Cron-triggered reconciliation/backfill jobs.
  - Normalize Sapo orders into `pos_sale_lines`.
  - Normalize products, variants, locations, and inventory levels into dashboard source tables.
  - Implement idempotent upserts and stale Data Freshness updates.
  - _Requirements: Sapo Ingestion 2-6, Non-Functional 1, Non-Functional 6_

- [ ] 9. Implement revenue calculations
  - Compute net sales excluding tax after discounts, refunds, and cancellations.
  - Apply refunds and cancellations on event date.
  - Compute total product sold and total product cancelled.
  - Compute previous-period comparison.
  - Add unit tests for discounts, refunds, cancellations, mixed-brand orders, and UTC/Vietnam date boundaries.
  - _Requirements: Revenue Overview 2-8, Non-Functional 5_

- [ ] 10. Implement inventory calculations
  - Use Sapo `available` as Available Stock.
  - Compute total products in inventory, low-stock products where available is greater than zero and less than 10, and out-of-stock products where available is zero.
  - Compute Top Categories by Stock from visible brand-scoped inventory rows.
  - Apply Brand Mapping and Reporting Category filters.
  - Add unit tests for stock classification and brand scoping.
  - _Requirements: Inventory Overview 1-12_

- [ ] 11. Build dashboard API/query layer
  - Create shared filter schemas for date range, order state, Branch, product search, Reporting Category, product creation date, and sort.
  - Default dashboard table pagination to 30 rows per page.
  - Create server query helpers for Revenue Overview summary, chart, detail rows, and Inventory Overview summary/table.
  - Create admin query helpers for User Management rows, counts, search, Brand filter, Status filter, and 30-row pagination.
  - Ensure every query resolves Brand from session/admin impersonation context server-side.
  - Add integration tests for RLS and cross-brand denial.
  - _Requirements: Brand User 2-7, Revenue Overview 1-9, Inventory Overview 1-12, User Management 1-7_

- [ ] 12. Build Revenue Overview UI
  - Implement the Revenue Overview layout from `revenue_overview/code.html` and `revenue_overview/screen.png`.
  - Add Data Freshness display, date filter, order state filter, Branch filter, clear filter, and export button.
  - Add summary cards, Recharts revenue chart, and TanStack revenue detail table.
  - Include real Sapo order code while excluding customer data and other Brands' rows.
  - Add row search, Daily/Monthly toggle, footer, 30-row pagination, and status-chip styling matching the reference.
  - Add responsive desktop-first layout with no text overlap and horizontal table scrolling.
  - _Requirements: Shared UI Shell 1-7, Revenue Overview 1-10, Exports 1_

- [ ] 13. Build Inventory Overview UI
  - Implement the Inventory Overview layout from `inventory_overview/code.html` and `inventory_overview/screen.png`.
  - Add Data Freshness display, inventory summary cards, product search, Reporting Category filter, product creation date filter, sort, clear filter, and export button.
  - Add TanStack Inventory Product Row table with SKU, barcode, product name, Reporting Category, Brand, Available Stock, and creation date.
  - Add Top Categories by Stock, Inventory Insights, 30-row pagination, and stock badge styling matching the reference.
  - Use inventory-specific table labeling rather than "Product Sold + Rev."
  - Render the contextual add-product treatment as disabled, admin-only, or non-mutating in v1.
  - Add responsive desktop-first layout with no text overlap.
  - _Requirements: Shared UI Shell 1-7, Inventory Overview 1-12, Exports 2_

- [ ] 14. Implement CSV exports
  - Add server-side CSV export endpoints for Revenue Overview and Inventory Overview.
  - Add admin-only User Management CSV export endpoint.
  - Reuse the same authorization and filter query helpers as dashboard views.
  - Add export audit records.
  - Return a clear v1 unsupported response for PDF export.
  - Add tests proving exports match visible rows and omit disallowed fields.
  - _Requirements: Exports 1-5, User Management 6_

- [ ] 15. Build Daspace Admin support surfaces
  - Build User Management from `user_management/code.html` and `user_management/screen.png`.
  - Add user count badge, search, Brand filter, Status filter, active filter chips, Create User button, Export button, user table, row actions, and 30-row pagination.
  - Build unmapped product/sale-line queue.
  - Build Brand Mapping create/update/retire workflow.
  - Build sync health screen with queue metrics, stale data status, failed message archive, and Sapo auth status.
  - Build audited "view as brand" entry point.
  - _Requirements: Daspace Admin 1-7, Account Management 1-7, User Management 1-7, Sapo Ingestion 6_

- [ ] 16. Add observability and operational safeguards
  - Track webhook receipts, queue depths, oldest message age, sync runs, stale dashboard surfaces, and export events.
  - Add admin alerts for Sapo auth failure, repeated Sapo rate limits, dead-letter/archive growth, and stale data over threshold.
  - Add structured server logs without Sapo tokens or customer PII.
  - _Requirements: Sapo Ingestion 4-6, Non-Functional 2, Non-Functional 4_

- [ ] 17. Complete end-to-end QA
  - Seed sample data with multiple Brands, mixed-brand orders, unmapped SKUs, refunds, cancellations, low-stock products, and out-of-stock products.
  - Verify Brand User Revenue Overview and Inventory Overview flows.
  - Verify Daspace Admin mapping and impersonation flows.
  - Verify User Management create, filter, export, row action, disable/reactivate, and pagination flows.
  - Verify cross-brand access denial at UI, API, and RLS layers.
  - Verify CSV exports and stale Data Freshness behavior.
  - Compare implemented screens against `revenue_overview/screen.png`, `inventory_overview/screen.png`, and `user_management/screen.png` for layout, typography, spacing, colors, active nav, cards, tables, and controls.
  - _Requirements: All_

- [ ] 18. Prepare deployment
  - Configure Vercel environment variables and Supabase project secrets.
  - Deploy database migrations, RLS policies, queues, Edge Functions, and Cron jobs.
  - Register Sapo webhooks against the production app URL.
  - Run initial Sapo backfill and verify dashboard freshness.
  - _Requirements: Sapo Ingestion 1-6, Non-Functional 1-6_

## Implementation Notes

- Tasks should be completed in order because auth, schema, mapping, queueing, and ingestion are foundations for dashboard UI.
- Each task should include tests before moving to dependent tasks.
- Any implementation discovery that changes requirements should update `requirements.md` and `design.md` before code proceeds.
