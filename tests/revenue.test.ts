import { describe, expect, it } from "vitest";
import { calculateNetLineCents, summarizeRevenue } from "@/lib/domain/revenue";

describe("revenue calculations", () => {
  it("computes net sales excluding tax after line discounts", () => {
    expect(
      calculateNetLineCents({
        quantity: 2,
        unitPriceCents: 100_000,
        discountCents: 25_000,
        taxCents: 16_000,
        eventType: "sale"
      })
    ).toBe(175_000);
  });

  it("scopes mixed-brand orders to the requested brand and applies refunds on refund event date", () => {
    const summary = summarizeRevenue(
      [
        {
          orderCode: "SO-1",
          brandId: "brand-a",
          eventAt: "2024-05-24T08:00:00.000Z",
          sku: "A-1",
          quantity: 2,
          unitPriceCents: 100_000,
          discountCents: 0,
          taxCents: 16_000,
          eventType: "sale",
          state: "completed"
        },
        {
          orderCode: "SO-1",
          brandId: "brand-b",
          eventAt: "2024-05-24T08:00:00.000Z",
          sku: "B-1",
          quantity: 1,
          unitPriceCents: 999_000,
          discountCents: 0,
          taxCents: 79_920,
          eventType: "sale",
          state: "completed"
        },
        {
          orderCode: "SO-2",
          brandId: "brand-a",
          eventAt: "2024-05-25T08:00:00.000Z",
          sku: "A-2",
          quantity: 1,
          unitPriceCents: 50_000,
          discountCents: 0,
          taxCents: 4_000,
          eventType: "refund",
          state: "refunded"
        }
      ],
      {
        brandId: "brand-a",
        start: "2024-05-24T00:00:00.000Z",
        end: "2024-05-26T00:00:00.000Z"
      }
    );

    expect(summary.netSalesCents).toBe(150_000);
    expect(summary.grossSalesCents).toBe(200_000);
    expect(summary.refundsCents).toBe(50_000);
    expect(summary.unitsSold).toBe(2);
    expect(summary.visibleRows.map((row) => row.sku)).toEqual(["A-1", "A-2"]);
  });
});
