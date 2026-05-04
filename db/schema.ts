import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid
} from "drizzle-orm/pg-core";

export const accountRole = pgEnum("account_role", ["daspace_admin", "brand_user"]);
export const accountStatus = pgEnum("account_status", ["active", "disabled", "invited"]);
export const brandStatus = pgEnum("brand_status", ["active", "inactive"]);
export const mappingStatus = pgEnum("mapping_status", ["draft", "approved", "retired"]);
export const saleEventType = pgEnum("sale_event_type", ["sale", "refund", "cancel"]);
export const orderState = pgEnum("order_state", ["completed", "pending", "cancelled", "refunded"]);

export const brands = pgTable("brands", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  status: brandStatus("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const accountProfiles = pgTable(
  "account_profiles",
  {
    userId: uuid("user_id").primaryKey(),
    email: text("email").notNull(),
    displayName: text("display_name").notNull(),
    role: accountRole("role").notNull(),
    status: accountStatus("status").notNull().default("invited"),
    brandId: uuid("brand_id").references(() => brands.id),
    createdByAdmin: boolean("created_by_admin").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    emailIdx: uniqueIndex("account_profiles_email_idx").on(table.email),
    brandIdx: index("account_profiles_brand_idx").on(table.brandId)
  })
);

export const accountAudits = pgTable("account_audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").notNull(),
  targetUserId: uuid("target_user_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const sapoSources = pgTable("sapo_sources", {
  id: uuid("id").primaryKey().defaultRandom(),
  storeUrl: text("store_url").notNull(),
  status: text("status").notNull().default("configured"),
  lastSuccessfulSyncAt: timestamp("last_successful_sync_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const reportingCategories = pgTable("reporting_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const brandMappings = pgTable(
  "brand_mappings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    brandId: uuid("brand_id").notNull().references(() => brands.id),
    sku: text("sku").notNull(),
    sapoProductId: text("sapo_product_id"),
    reportingCategoryId: uuid("reporting_category_id").references(() => reportingCategories.id),
    effectiveFrom: timestamp("effective_from", { withTimezone: true }).notNull(),
    effectiveTo: timestamp("effective_to", { withTimezone: true }),
    status: mappingStatus("status").notNull().default("draft"),
    approvedBy: uuid("approved_by"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    skuDateIdx: index("brand_mappings_sku_date_idx").on(table.sku, table.effectiveFrom, table.effectiveTo),
    brandIdx: index("brand_mappings_brand_idx").on(table.brandId)
  })
);

export const mappingAudits = pgTable("mapping_audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  mappingId: uuid("mapping_id").notNull().references(() => brandMappings.id),
  actorUserId: uuid("actor_user_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before"),
  after: jsonb("after"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const posSaleLines = pgTable(
  "pos_sale_lines",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: uuid("source_id").notNull().references(() => sapoSources.id),
    sapoOrderId: text("sapo_order_id").notNull(),
    orderCode: text("order_code").notNull(),
    eventAt: timestamp("event_at", { withTimezone: true }).notNull(),
    eventType: saleEventType("event_type").notNull(),
    state: orderState("state").notNull(),
    locationId: text("location_id"),
    locationName: text("location_name"),
    sku: text("sku").notNull(),
    barcode: text("barcode"),
    productName: text("product_name").notNull(),
    brandId: uuid("brand_id").references(() => brands.id),
    quantity: integer("quantity").notNull(),
    unitPriceCents: integer("unit_price_cents").notNull(),
    discountCents: integer("discount_cents").notNull().default(0),
    taxCents: integer("tax_cents").notNull().default(0),
    netSalesCents: integer("net_sales_cents").notNull(),
    raw: jsonb("raw"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    brandDateIdx: index("pos_sale_lines_brand_date_idx").on(table.brandId, table.eventAt),
    skuDateIdx: index("pos_sale_lines_sku_date_idx").on(table.sku, table.eventAt),
    orderIdx: index("pos_sale_lines_order_idx").on(table.orderCode)
  })
);

export const inventoryItems = pgTable(
  "inventory_items",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: uuid("source_id").notNull().references(() => sapoSources.id),
    sku: text("sku").notNull(),
    barcode: text("barcode"),
    productName: text("product_name").notNull(),
    reportingCategoryId: uuid("reporting_category_id").references(() => reportingCategories.id),
    brandId: uuid("brand_id").references(() => brands.id),
    locationId: text("location_id"),
    locationName: text("location_name"),
    available: integer("available").notNull().default(0),
    sapoCreatedAt: timestamp("sapo_created_at", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
  },
  (table) => ({
    brandSkuIdx: index("inventory_items_brand_sku_idx").on(table.brandId, table.sku),
    availableIdx: index("inventory_items_available_idx").on(table.available)
  })
);

export const syncRuns = pgTable("sync_runs", {
  id: uuid("id").primaryKey().defaultRandom(),
  sourceId: uuid("source_id").references(() => sapoSources.id),
  jobType: text("job_type").notNull(),
  status: text("status").notNull(),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp("finished_at", { withTimezone: true }),
  errorCode: text("error_code"),
  errorMessage: text("error_message")
});

export const exportAudits = pgTable("export_audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  actorUserId: uuid("actor_user_id").notNull(),
  brandId: uuid("brand_id"),
  exportType: text("export_type").notNull(),
  filters: jsonb("filters"),
  rowCount: integer("row_count").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});

export const impersonationAudits = pgTable("impersonation_audits", {
  id: uuid("id").primaryKey().defaultRandom(),
  adminUserId: uuid("admin_user_id").notNull(),
  brandId: uuid("brand_id").notNull().references(() => brands.id),
  reason: text("reason").notNull(),
  actions: jsonb("actions").notNull().default([]),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true })
});

export const dashboardFreshness = pgTable("dashboard_freshness", {
  id: uuid("id").primaryKey().defaultRandom(),
  surface: text("surface").notNull(),
  brandId: uuid("brand_id"),
  lastSuccessfulSyncAt: timestamp("last_successful_sync_at", { withTimezone: true }),
  status: text("status").notNull().default("fresh"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
