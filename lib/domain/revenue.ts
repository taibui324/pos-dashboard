export type RevenueEventType = "sale" | "refund" | "cancel";
export type RevenueState = "completed" | "pending" | "cancelled" | "refunded";

export type RevenueLineInput = {
  orderCode: string;
  brandId: string;
  eventAt: string;
  sku: string;
  quantity: number;
  unitPriceCents: number;
  discountCents: number;
  taxCents: number;
  eventType: RevenueEventType;
  state: RevenueState;
};

export type LineAmountInput = Pick<RevenueLineInput, "quantity" | "unitPriceCents" | "discountCents" | "taxCents" | "eventType">;

export type RevenueSummary = {
  netSalesCents: number;
  grossSalesCents: number;
  refundsCents: number;
  unitsSold: number;
  unitsCancelled: number;
  visibleRows: RevenueLineInput[];
};

export function calculateNetLineCents(line: LineAmountInput): number {
  const merchandiseCents = Math.max(0, line.quantity * line.unitPriceCents - line.discountCents);
  return line.eventType === "refund" || line.eventType === "cancel" ? -merchandiseCents : merchandiseCents;
}

export function summarizeRevenue(
  lines: RevenueLineInput[],
  filter: {
    brandId: string;
    start: string;
    end: string;
  }
): RevenueSummary {
  const start = new Date(filter.start).getTime();
  const end = new Date(filter.end).getTime();
  const visibleRows = lines.filter((line) => {
    const eventAt = new Date(line.eventAt).getTime();
    return line.brandId === filter.brandId && start <= eventAt && eventAt < end;
  });

  return visibleRows.reduce<RevenueSummary>(
    (summary, line) => {
      const netLineCents = calculateNetLineCents(line);
      const merchandiseCents = Math.max(0, line.quantity * line.unitPriceCents - line.discountCents);

      summary.netSalesCents += netLineCents;
      if (line.eventType === "sale") {
        summary.grossSalesCents += merchandiseCents;
        summary.unitsSold += line.quantity;
      }
      if (line.eventType === "refund" || line.eventType === "cancel") {
        summary.refundsCents += merchandiseCents;
      }
      if (line.eventType === "cancel" || line.state === "cancelled") {
        summary.unitsCancelled += line.quantity;
      }

      return summary;
    },
    {
      netSalesCents: 0,
      grossSalesCents: 0,
      refundsCents: 0,
      unitsSold: 0,
      unitsCancelled: 0,
      visibleRows
    }
  );
}
