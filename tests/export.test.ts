import { describe, expect, it } from "vitest";
import { rowsToCsv } from "@/lib/domain/csv";

describe("rowsToCsv", () => {
  it("exports only requested dashboard columns and escapes CSV values", () => {
    const csv = rowsToCsv(
      [
        {
          orderCode: "SO-1",
          productName: "Blend, Large",
          netSales: "175000",
          customerEmail: "private@example.com"
        }
      ],
      [
        ["Mã Đơn hàng", "orderCode"],
        ["Tên Hàng", "productName"],
        ["Tổng tiền hàng", "netSales"]
      ]
    );

    expect(csv).toBe('Mã Đơn hàng,Tên Hàng,Tổng tiền hàng\nSO-1,"Blend, Large",175000');
    expect(csv).not.toContain("private@example.com");
    expect(csv).not.toContain("customerEmail");
  });
});
