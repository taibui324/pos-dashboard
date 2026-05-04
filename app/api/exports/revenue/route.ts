import { csvResponse, rowsToCsv } from "@/lib/domain/csv";
import { getRevenueRows } from "@/lib/repositories/mock-dashboard";

export function GET() {
  const rows = getRevenueRows();
  const csv = rowsToCsv(rows, [
    ["Mã Đơn hàng", "orderCode"],
    ["Ngày chứng từ", "date"],
    ["Trạng thái đơn hàng", "status"],
    ["Chi Nhánh", "branch"],
    ["Mã Hàng (SKU)", "sku"],
    ["Mã Barcode", "barcode"],
    ["Tên Hàng", "productName"],
    ["Số Lượng", "quantity"],
    ["Đơn giá", "unitPrice"],
    ["Tổng chiết khấu sản phẩm (%)", "discount"],
    ["Tổng tiền hàng", "lineRevenue"]
  ]);

  return csvResponse("daspace-revenue-overview.csv", csv);
}
