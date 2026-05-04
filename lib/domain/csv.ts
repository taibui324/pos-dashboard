type CsvColumn<T extends Record<string, unknown>> = [header: string, key: keyof T];

function escapeCsvCell(value: unknown): string {
  const text = value == null ? "" : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function rowsToCsv<T extends Record<string, unknown>>(rows: T[], columns: Array<CsvColumn<T>>): string {
  const header = columns.map(([label]) => escapeCsvCell(label)).join(",");
  const body = rows.map((row) => columns.map(([, key]) => escapeCsvCell(row[key])).join(","));

  return [header, ...body].join("\n");
}

export function csvResponse(filename: string, csv: string): Response {
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`
    }
  });
}
