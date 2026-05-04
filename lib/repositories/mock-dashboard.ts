import { inventoryRows, revenueRows, userRows } from "@/lib/mock-data";
import type { InventoryRow, RevenueRow, UserRow } from "@/lib/mock-data";

export const DEFAULT_PAGE_SIZE = 30;

export type DataFreshness = {
  lastSuccessfulSyncAt: string;
  status: "fresh" | "stale";
  targetLagSeconds: number;
};

export function getMockFreshness(): DataFreshness {
  return {
    lastSuccessfulSyncAt: "2024-05-24T14:30:00.000+07:00",
    status: "fresh",
    targetLagSeconds: 60
  };
}

export function getRevenueRows(): RevenueRow[] {
  return revenueRows.slice(0, DEFAULT_PAGE_SIZE);
}

export function getInventoryRows(): InventoryRow[] {
  return inventoryRows.slice(0, DEFAULT_PAGE_SIZE);
}

export function getUserRows(): UserRow[] {
  return userRows.slice(0, DEFAULT_PAGE_SIZE);
}
