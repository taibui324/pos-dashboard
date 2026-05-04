import { describe, expect, it } from "vitest";
import { DEFAULT_TABLE_PAGE_SIZE, revenueFilterSchema } from "@/lib/domain/filters";

describe("dashboard filters", () => {
  it("defaults table pagination to 30 rows", () => {
    expect(revenueFilterSchema.parse({}).pageSize).toBe(DEFAULT_TABLE_PAGE_SIZE);
  });

  it("caps custom page sizes to the v1 table maximum", () => {
    expect(revenueFilterSchema.parse({ pageSize: "250" }).pageSize).toBe(30);
  });
});
