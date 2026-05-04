import { csvResponse, rowsToCsv } from "@/lib/domain/csv";
import { getUserRows } from "@/lib/repositories/mock-dashboard";

export function GET() {
  const rows = getUserRows();
  const csv = rowsToCsv(rows, [
    ["User Name", "name"],
    ["Email", "email"],
    ["Brand Name", "brand"],
    ["Role", "role"],
    ["Last Active Date", "lastActive"],
    ["Status", "status"]
  ]);

  return csvResponse("daspace-user-management.csv", csv);
}
