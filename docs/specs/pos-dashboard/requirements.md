# POS Dashboard Requirements

## Source Documents

- `CONTEXT.md`
- `docs/adr/0001-pos-dashboard-tech-stack.md`
- `DESIGN.md`
- `revenue_overview/code.html` and `revenue_overview/screen.png`
- `inventory_overview/code.html` and `inventory_overview/screen.png`
- `user_management/DESIGN.md`, `user_management/code.html`, and `user_management/screen.png`

## Overview

Build a Daspace POS dashboard that ingests data from the single Daspace-owned Sapo POS account, scopes revenue and inventory data by Brand Mapping, and gives Brand Users access only to their own brand-visible data. The dashboard has two v1 surfaces: Revenue Overview and Inventory Overview.

The UI implementation SHALL follow the provided Precision Analytical design system and screen references. Where mock data or pagination text in the HTML conflicts with product decisions in this spec, this spec wins; specifically, dashboard tables default to 30 rows per page.

## Roles

### Daspace Admin

**User Story:** As a Daspace Admin, I want to manage product-to-brand mappings and monitor Sapo sync health, so that brand dashboards show correct and fresh data.

**Acceptance Criteria:**

1. WHEN an admin views unmapped Sapo products or sale lines THEN the system SHALL show an admin-only mapping queue.
2. WHEN an admin approves a Brand Mapping THEN the system SHALL store the brand, Sapo product or SKU, effective date range, approver, and audit timestamp.
3. WHEN an admin changes or retires a Brand Mapping THEN the system SHALL preserve audit history and recalculate affected brand-visible dashboard data.
4. WHEN Sapo ingestion is delayed or failed THEN the system SHALL expose admin-only diagnostics and alerts.
5. WHEN an admin uses "view as brand" THEN the system SHALL audit the admin, brand viewed, timestamp, reason, and viewed dashboard surface.
6. WHEN an admin creates a Brand User Account THEN the system SHALL create a Supabase Auth user, assign exactly one Brand, and audit the creator, Brand, email, timestamp, and invitation status.
7. WHEN an admin disables or reactivates a Brand User Account THEN the system SHALL update access immediately and audit the action.

### Brand User

**User Story:** As a Brand User, I want to view my brand's revenue and inventory performance, so that I can understand product sales and stock health at Daspace.

**Acceptance Criteria:**

1. WHEN a Brand User signs in THEN the system SHALL allow access only if a Daspace Admin created or activated that Brand User Account.
2. WHEN a Brand User signs in THEN the system SHALL associate the user with exactly one Brand.
3. WHEN a Brand User views any dashboard surface THEN the system SHALL show only rows and metrics scoped to that user's Brand.
4. WHEN a Brand User uses filters THEN the system SHALL apply filters only within that user's brand-scoped dataset.
5. WHEN a Brand User exports data THEN the system SHALL export only the currently permitted and filtered data.
6. IF a Brand User attempts to access another Brand's data THEN the system SHALL deny the request server-side and at the database authorization layer.
7. IF a disabled Brand User Account attempts to sign in or access dashboard data THEN the system SHALL deny access.

## Account Management

**User Story:** As a Daspace Admin, I want to create and manage Brand User Accounts, so that only approved brand representatives can access the dashboard.

**Acceptance Criteria:**

1. WHEN creating a Brand User Account THEN a Daspace Admin SHALL provide email, display name, and exactly one Brand.
2. WHEN the account is created THEN the system SHALL send an invitation or password setup flow through Supabase Auth.
3. WHEN the invited user completes setup THEN the system SHALL allow sign-in with the assigned Brand permissions.
4. WHEN the email already belongs to an existing Brand User Account THEN the system SHALL prevent duplicate account creation.
5. WHEN an admin changes a Brand User Account's assigned Brand THEN the system SHALL audit the previous Brand, new Brand, admin, timestamp, and reason.
6. WHEN a Brand User Account is disabled THEN active sessions SHALL be revoked or blocked from dashboard data on the next authorization check.
7. IF self-signup is attempted THEN the system SHALL reject dashboard access unless a Daspace Admin has assigned the user to a Brand.

## Shared UI Shell

**User Story:** As a dashboard user, I want a consistent admin-style shell, so that navigation and controls feel predictable across Revenue, Inventory, and User Management.

**Acceptance Criteria:**

1. WHEN any dashboard surface renders THEN the system SHALL use the Precision Analytical design system from `DESIGN.md`.
2. WHEN any dashboard surface renders THEN the system SHALL use a fixed 240px dark left sidebar with Daspace branding and active navigation state.
3. WHEN a Brand User views the sidebar THEN the system SHALL show Revenue, Inventory, Settings, and Logout navigation.
4. WHEN a Daspace Admin views the sidebar THEN the system SHALL show Revenue, Inventory, User Management, Settings, Help Center where applicable, and Logout navigation.
5. WHEN a dashboard surface renders THEN the system SHALL use Manrope for headings, Inter for body/table text, compact white cards, slate dividers, blue primary actions, and status chips matching the reference screens.
6. WHEN a table renders THEN the system SHALL use horizontal dividers, sticky or visually distinct header rows, no vertical borders, and pagination controls matching the provided references.
7. WHEN a screen includes refresh or notification controls in the reference UI THEN the system SHALL render those controls; notification content may be a later enhancement but the control must not expose unauthorized data.

## Sapo Ingestion

**User Story:** As Daspace, I want Sapo data ingested into our own database, so that dashboards are fast, secure, and not dependent on live Sapo requests.

**Acceptance Criteria:**

1. WHEN Sapo sends a webhook THEN the system SHALL verify the webhook, enqueue a message, and respond quickly.
2. WHEN a queue message is available THEN a Supabase Edge Function consumer SHALL process the message asynchronously.
3. WHEN Sapo webhook delivery is missed or delayed THEN scheduled reconciliation SHALL backfill modified orders, products, inventory levels, and locations.
4. WHEN Sapo API returns rate limiting or transient errors THEN the system SHALL retry with backoff without exposing internal errors to Brand Users.
5. WHEN ingestion succeeds THEN the system SHALL update Data Freshness for affected dashboard surfaces.
6. WHEN ingestion partially fails THEN the system SHALL keep serving the latest verified data and mark affected metrics stale.

## Brand Mapping and Visibility

**User Story:** As Daspace, I want brand visibility determined by sale-line and product mapping, so that each Brand sees only its own data.

**Acceptance Criteria:**

1. WHEN a POS Sale Line has an approved effective Brand Mapping at the sale timestamp THEN the system SHALL include it in that Brand's Revenue Overview.
2. WHEN a POS Sale Line is unmapped or ambiguously mapped THEN the system SHALL hide it from all Brand Users.
3. WHEN a Sapo product or SKU has an approved Brand Mapping THEN the system SHALL include its inventory row in that Brand's Inventory Overview.
4. WHEN one Sapo order contains products from multiple Brands THEN each Brand User SHALL see only their own mapped sale lines.
5. WHEN the same Sapo order contains multiple Brands THEN the real Sapo order code MAY appear to multiple Brand Users, but each user SHALL see only their own brand-visible rows and totals.

## Revenue Overview

**User Story:** As a Brand User, I want a Revenue Overview, so that I can track sales performance over time and by product.

**Acceptance Criteria:**

1. WHEN a Brand User opens Revenue Overview THEN the system SHALL show Data Freshness, date filter, order state filter, Branch filter, clear filter, and export controls.
2. WHEN filters are applied THEN the system SHALL update total net revenue, total product sold, total product cancelled, revenue chart, and revenue detail table.
3. WHEN computing primary revenue THEN the system SHALL use net sales excluding tax after discounts, refunds, and cancellations.
4. WHEN refunds occur THEN the system SHALL reduce net sales on the refund event date.
5. WHEN displaying the revenue chart THEN the system SHALL show revenue by day or month depending on the selected date range.
6. WHEN previous-period comparison is available THEN the system SHALL show comparison values for the selected range.
7. WHEN displaying Revenue Detail Rows THEN the system SHALL include real Sapo order code, order creation date, order state, Branch, SKU, barcode, product name, quantity, unit price, product discount value, product discount percent, and line net amount.
8. WHEN displaying the Revenue Detail table THEN the system SHALL default to 30 rows per page.
9. WHEN displaying Revenue Overview THEN the system SHALL match `revenue_overview/code.html` and `revenue_overview/screen.png`: filter card, three KPI cards, revenue bar chart with Daily/Monthly toggle, Revenue Detail Rows card, row search, pagination, and footer.
10. IF a Sapo order has customer data THEN the system SHALL NOT expose customer name, phone, email, address, or payment identifiers to Brand Users.

## Inventory Overview

**User Story:** As a Brand User, I want an Inventory Overview, so that I can see which of my mapped products are in stock, low stock, or out of stock.

**Acceptance Criteria:**

1. WHEN a Brand User opens Inventory Overview THEN the system SHALL show Data Freshness, total products in inventory, low-stock count, out-of-stock count, search, category filter, creation date filter, sort, clear filter, and export controls.
2. WHEN computing inventory metrics THEN the system SHALL use Sapo `available` stock as Available Stock.
3. WHEN Available Stock is zero THEN the product SHALL count as Out-of-Stock.
4. WHEN Available Stock is greater than zero and less than 10 THEN the product SHALL count as Low Stock.
5. WHEN displaying Inventory Product Rows THEN the system SHALL include SKU, barcode, product name, Reporting Category, Brand, Available Stock, and product creation date.
6. WHEN displaying the Inventory Product table THEN the system SHALL default to 30 rows per page.
7. WHEN search or filters are applied THEN the system SHALL update inventory metrics and table rows within the Brand User's permitted data.
8. IF a product is not mapped to the Brand User's Brand THEN the system SHALL hide that product from the Inventory Overview.
9. WHEN displaying Inventory Overview THEN the system SHALL match `inventory_overview/code.html` and `inventory_overview/screen.png`: top search, three KPI cards, filter card, Inventory Product table, pagination, Top Categories by Stock panel, Inventory Insights panel, and contextual add button treatment.
10. WHEN rendering Top Categories by Stock THEN the system SHALL aggregate visible brand-scoped inventory by Reporting Category.
11. WHEN rendering Inventory Insights in v1 THEN the system SHALL use deterministic summary text from visible inventory data or a static placeholder; it SHALL NOT claim AI recommendations unless an implemented insight service exists.
12. IF the contextual add-product action is shown in v1 THEN the system SHALL be disabled or admin-only and SHALL NOT write products back to Sapo.

## User Management

**User Story:** As a Daspace Admin, I want a User Management surface matching the provided reference, so that I can create, filter, audit, and manage Brand User Accounts.

**Acceptance Criteria:**

1. WHEN a Daspace Admin opens User Management THEN the system SHALL match `user_management/code.html` and `user_management/screen.png`: title, total user count badge, Export button, Create User button, search, Brand filter, Status filter, active filter chips, user table, and pagination.
2. WHEN displaying the User Management table THEN the system SHALL include user name, email, Brand name, role, last active date, status, and row actions.
3. WHEN displaying the User Management table THEN the system SHALL default to 30 rows per page.
4. WHEN filtering users THEN the system SHALL support search by name/email, filter by Brand, filter by status, and active filter chips.
5. WHEN an admin clicks Create User THEN the system SHALL open an account creation flow requiring email, display name, and exactly one Brand.
6. WHEN an admin exports users THEN the system SHALL generate a CSV of the currently filtered user list and audit the export.
7. WHEN row actions are used THEN the system SHALL support edit, disable/reactivate, resend invite where applicable, and audit each action.

## Exports

**User Story:** As a Brand User, I want to export dashboard data, so that I can share or analyze permitted brand performance outside the app.

**Acceptance Criteria:**

1. WHEN a Brand User exports Revenue Overview THEN the system SHALL generate a CSV containing only visible, filtered Revenue Detail Rows and summary metrics.
2. WHEN a Brand User exports Inventory Overview THEN the system SHALL generate a CSV containing only visible, filtered Inventory Product Rows and summary metrics.
3. WHEN exporting any dashboard data THEN the system SHALL omit customer data, hidden raw Sapo payloads, internal IDs not shown in the UI, and other Brands' data.
4. WHEN an export is generated THEN the system SHALL audit user, Brand, dashboard surface, filters, row count, timestamp, and export format.
5. IF PDF export is requested in v1 THEN the system SHALL return "not available yet"; PDF export is a later enhancement.

## Non-Functional Requirements

1. WHEN data is current THEN dashboard Data Freshness SHOULD be under 60 seconds behind Sapo changes.
2. WHEN Sapo or queue processing is degraded THEN Brand Users SHALL see stale status without internal error details.
3. WHEN API routes query dashboard data THEN they SHALL enforce authorization using both server-side brand checks and Supabase RLS.
4. WHEN storing Sapo credentials THEN the system SHALL store them server-side only and never expose them to browsers, logs, exports, or Brand User sessions.
5. WHEN date-times are shown to users THEN the system SHALL display them in Vietnam local time while storing source timestamps in UTC.
6. WHEN processing webhooks or backfills THEN the system SHALL be idempotent and safe for duplicate or out-of-order events.

## Out of Scope for v1

- Brand-managed categories.
- Multi-brand Brand User accounts.
- Customer-level analytics.
- Raw full-receipt views.
- PDF exports.
- Real-time browser push updates; dashboards may poll or refresh data on navigation.
- Writing data back to Sapo.
