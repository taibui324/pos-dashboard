import { z } from "zod";

export const DEFAULT_TABLE_PAGE_SIZE = 30;

const pageSchema = z.coerce.number().int().positive().catch(1);
const pageSizeSchema = z.coerce
  .number()
  .int()
  .positive()
  .catch(DEFAULT_TABLE_PAGE_SIZE)
  .transform((value) => Math.min(value, DEFAULT_TABLE_PAGE_SIZE));

export const dateRangeSchema = z.object({
  start: z.string().optional(),
  end: z.string().optional(),
  preset: z.enum(["today", "yesterday", "last_7_days", "month_to_date", "last_month", "custom"]).default("last_7_days")
});

export const revenueFilterSchema = z.object({
  page: pageSchema.default(1),
  pageSize: pageSizeSchema.default(DEFAULT_TABLE_PAGE_SIZE),
  branch: z.string().optional(),
  state: z.string().optional(),
  search: z.string().optional(),
  range: dateRangeSchema.default({ preset: "last_7_days" })
});

export const inventoryFilterSchema = z.object({
  page: pageSchema.default(1),
  pageSize: pageSizeSchema.default(DEFAULT_TABLE_PAGE_SIZE),
  search: z.string().optional(),
  category: z.string().optional(),
  createdAt: z.string().optional(),
  sort: z.enum(["newest", "oldest", "stock_asc", "stock_desc", "name_asc"]).default("newest")
});

export type RevenueFilters = z.infer<typeof revenueFilterSchema>;
export type InventoryFilters = z.infer<typeof inventoryFilterSchema>;
