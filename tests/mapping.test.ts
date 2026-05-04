import { describe, expect, it } from "vitest";
import { resolveBrandMapping } from "@/lib/domain/mapping";

const mappings = [
  {
    id: "map-1",
    brandId: "brand-a",
    sku: "SKU-1",
    effectiveFrom: "2024-01-01T00:00:00.000Z",
    effectiveTo: "2024-04-01T00:00:00.000Z",
    status: "approved" as const,
    approvedBy: "admin-1"
  },
  {
    id: "map-2",
    brandId: "brand-b",
    sku: "SKU-1",
    effectiveFrom: "2024-04-01T00:00:00.000Z",
    effectiveTo: null,
    status: "approved" as const,
    approvedBy: "admin-1"
  },
  {
    id: "draft-map",
    brandId: "brand-c",
    sku: "SKU-2",
    effectiveFrom: "2024-01-01T00:00:00.000Z",
    effectiveTo: null,
    status: "draft" as const,
    approvedBy: null
  }
];

describe("resolveBrandMapping", () => {
  it("uses effective dates without rewriting historical ownership", () => {
    expect(resolveBrandMapping(mappings, "SKU-1", "2024-03-31T23:59:59.000Z")?.brandId).toBe("brand-a");
    expect(resolveBrandMapping(mappings, "SKU-1", "2024-04-01T00:00:00.000Z")?.brandId).toBe("brand-b");
  });

  it("hides unmapped and unapproved SKUs from brand dashboards", () => {
    expect(resolveBrandMapping(mappings, "SKU-404", "2024-04-01T00:00:00.000Z")).toBeNull();
    expect(resolveBrandMapping(mappings, "SKU-2", "2024-04-01T00:00:00.000Z")).toBeNull();
  });
});
