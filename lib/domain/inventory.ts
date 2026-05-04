export type StockStatus = "out_of_stock" | "low_stock" | "in_stock";

export type InventoryInput = {
  sku: string;
  brandId: string;
  category: string;
  available: number;
};

export type InventorySummary = {
  totalProducts: number;
  lowStockProducts: number;
  outOfStockProducts: number;
  topCategoriesByStock: Array<{
    category: string;
    available: number;
  }>;
  visibleRows: InventoryInput[];
};

export function classifyAvailableStock(available: number): StockStatus {
  if (available <= 0) {
    return "out_of_stock";
  }

  return available < 10 ? "low_stock" : "in_stock";
}

export function summarizeInventory(rows: InventoryInput[], filter: { brandId: string }): InventorySummary {
  const visibleRows = rows.filter((row) => row.brandId === filter.brandId);
  const categoryTotals = new Map<string, number>();

  for (const row of visibleRows) {
    categoryTotals.set(row.category, (categoryTotals.get(row.category) ?? 0) + Math.max(0, row.available));
  }

  return {
    totalProducts: visibleRows.length,
    lowStockProducts: visibleRows.filter((row) => classifyAvailableStock(row.available) === "low_stock").length,
    outOfStockProducts: visibleRows.filter((row) => classifyAvailableStock(row.available) === "out_of_stock").length,
    topCategoriesByStock: [...categoryTotals.entries()]
      .map(([category, available]) => ({ category, available }))
      .sort((left, right) => right.available - left.available),
    visibleRows
  };
}
