import { describe, expect, it } from "vitest";
import { classifyAvailableStock, summarizeInventory } from "@/lib/domain/inventory";

describe("inventory calculations", () => {
  it("classifies available stock using the v1 thresholds", () => {
    expect(classifyAvailableStock(0)).toBe("out_of_stock");
    expect(classifyAvailableStock(1)).toBe("low_stock");
    expect(classifyAvailableStock(9)).toBe("low_stock");
    expect(classifyAvailableStock(10)).toBe("in_stock");
  });

  it("summarizes only inventory rows visible to a brand", () => {
    const summary = summarizeInventory(
      [
        { sku: "A-0", brandId: "brand-a", category: "Footwear", available: 0 },
        { sku: "A-8", brandId: "brand-a", category: "Footwear", available: 8 },
        { sku: "A-20", brandId: "brand-a", category: "Audio", available: 20 },
        { sku: "B-1", brandId: "brand-b", category: "Audio", available: 1 }
      ],
      { brandId: "brand-a" }
    );

    expect(summary.totalProducts).toBe(3);
    expect(summary.lowStockProducts).toBe(1);
    expect(summary.outOfStockProducts).toBe(1);
    expect(summary.topCategoriesByStock).toEqual([
      { category: "Audio", available: 20 },
      { category: "Footwear", available: 8 }
    ]);
  });
});
