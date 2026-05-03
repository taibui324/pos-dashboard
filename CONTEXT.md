# Daspace Brand Sales Dashboard

This context defines the language for a Daspace POS dashboard that shows brand-scoped revenue and inventory data derived from Sapo POS data.

## Language

**Brand**:
A business whose products are sold through Daspace and whose users may view only that brand's sales performance.
_Avoid_: Vendor, tenant, shop

**Brand User**:
A user who belongs to exactly one **Brand** and can view that brand's dashboard and suggest mapping corrections.
_Avoid_: Brand admin, multi-brand user

**Brand User Account**:
A Supabase Auth account created by a **Daspace Admin** and assigned to exactly one **Brand**.
_Avoid_: Self-signup account, vendor account

**Daspace Admin**:
A Daspace operator who can view all brand data, manage mappings, inspect sync health, and use audited impersonation.
_Avoid_: Super user, staff user

**POS Sale Line**:
An individual sold item line from Sapo POS that is the authoritative unit for brand visibility.
_Avoid_: Receipt, order, transaction

**Brand Mapping**:
An admin-approved, effective-dated relationship between a Sapo product or SKU and a **Brand**.
_Avoid_: Tag, category, ownership

**Unmapped Sale Line**:
A **POS Sale Line** whose product or SKU has no approved **Brand Mapping** for the sale timestamp.
_Avoid_: Unknown brand sale, unassigned brand sale

**Reporting Category**:
A Daspace-managed category used for dashboard breakdowns, mapped from Sapo products.
_Avoid_: Raw POS category, brand category

**Daspace POS Source**:
The single Sapo POS account/API connection owned by Daspace and used as the source of sales data.
_Avoid_: Brand store connection, multi-store marketplace connection, partner POS account

**Dashboard Surface**:
A brand-scoped screen in the POS dashboard, currently either the **Revenue Overview** or **Inventory Overview**.
_Avoid_: Page, report, module

**Revenue Overview**:
The dashboard surface for sales performance, revenue metrics, product sold metrics, cancellation metrics, revenue charting, and the revenue detail table.
_Avoid_: Sales page, order report

**Inventory Overview**:
The dashboard surface for product stock visibility, low-stock counts, out-of-stock counts, product search, category filtering, and the inventory product table.
_Avoid_: Stock page, warehouse report

**Data Freshness**:
The visible timestamp and status that tells users when Sapo-derived dashboard data was last successfully updated.
_Avoid_: Sync time, updated at

**Branch**:
A Sapo location or sales branch used to filter revenue and inventory views.
_Avoid_: Store, warehouse, chi nhanh

**Revenue Detail Row**:
A brand-visible tabular row derived from a mapped **POS Sale Line** and used for revenue drilldown, including the real Sapo order code.
_Avoid_: Full receipt, raw transaction, customer order

**Inventory Product Row**:
A brand-visible tabular row derived from a Sapo product or variant and its latest available stock state.
_Avoid_: Stock ledger row, inventory movement

**Available Stock**:
The Sapo inventory quantity that can currently be sold, sourced from Sapo's `available` inventory value.
_Avoid_: On-hand stock, committed stock, incoming stock

**Low Stock Product**:
A brand-mapped product whose **Available Stock** is above zero and below the dashboard's low-stock threshold.
_Avoid_: Almost sold out, warning stock

**Out-of-Stock Product**:
A brand-mapped product whose **Available Stock** is zero.
_Avoid_: Unavailable product, missing inventory

**Dashboard Export**:
A CSV or PDF file generated from a dashboard surface using the same permissions and filters as the on-screen view.
_Avoid_: Raw dump, database export

## Relationships

- A **Brand User** belongs to exactly one **Brand**.
- A **Brand User Account** is created, assigned, disabled, or reactivated only by a **Daspace Admin**.
- A **Brand** has zero or more effective-dated **Brand Mappings**.
- A **POS Sale Line** is visible to a **Brand** only when an approved **Brand Mapping** applies at the sale timestamp.
- An **Unmapped Sale Line** is hidden from all **Brand Users** until a **Daspace Admin** approves a mapping.
- A **Reporting Category** is managed by Daspace and may group many Sapo products.
- The **Daspace POS Source** feeds all **POS Sale Lines** for the dashboard.
- The POS dashboard has two current **Dashboard Surfaces**: **Revenue Overview** and **Inventory Overview**.
- **Revenue Overview** is filtered by date, order state, and **Branch**.
- **Inventory Overview** is filtered by product name, **Reporting Category**, product creation date, and sort order.
- A **Revenue Detail Row** is visible to a **Brand User** only when its **POS Sale Line** is visible to that user's **Brand**.
- A **Revenue Detail Row** may show the real Sapo order code, but must not expose customer information or other brands' sale lines from the same order.
- An **Inventory Product Row** is visible to a **Brand User** only when the product or SKU has an approved **Brand Mapping** to that user's **Brand**.
- Inventory metrics and inventory rows use **Available Stock**, not on-hand, committed, or incoming stock.
- A **Dashboard Export** must never include data that is not visible in the user's current filtered dashboard view.

## Example Dialogue

> **Dev:** "This Sapo order has items from three brands. Should each Brand User see the order?"
> **Domain expert:** "No. Brand visibility is based on POS Sale Lines. Each Brand User sees only the aggregated performance of their mapped sale lines, not the full mixed-brand receipt."

> **Dev:** "The Inventory Overview says a product is low stock. Is that based on total Sapo inventory?"
> **Domain expert:** "No. A Brand User only sees inventory rows for products mapped to their Brand. The low-stock count is computed after brand scoping."

## Flagged Ambiguities

- "Sales data" means aggregated metrics and product-level breakdowns in v1, not raw sale-line exports or customer-level data.
- "Real time" means near-real-time with a target latency under 60 seconds, plus visible freshness status.
- "Sapo integration" means direct API access using Daspace's Sapo credentials, not per-brand Sapo accounts.
- The current UI references include **Inventory Overview**, so inventory is part of the v1 dashboard design.
- The current Revenue Overview UI reference intentionally includes the real Sapo order code for each brand-visible **Revenue Detail Row**.
- Earlier Inventory Overview wireframes labeled the table "PRODUCT SOLD + REV"; the intended domain term is **Inventory Product Row**.
