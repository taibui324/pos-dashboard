import { csvResponse, rowsToCsv } from "@/lib/domain/csv";
import { getInventoryRows } from "@/lib/repositories/mock-dashboard";

export function GET() {
  const rows = getInventoryRows();
  const csv = rowsToCsv(rows, [
    ["Mã SKU Sản Phẩm", "sku"],
    ["Mã Barcode", "barcode"],
    ["Tên Sản Phẩm", "productName"],
    ["Loại Sản Phẩm", "category"],
    ["Nhãn Hiệu", "brand"],
    ["Tồn Kho", "stock"],
    ["Ngày Khởi tạo", "createdAt"]
  ]);

  return csvResponse("daspace-inventory-overview.csv", csv);
}
