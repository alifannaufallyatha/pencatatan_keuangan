import * as XLSX from "xlsx";
import { format } from "date-fns";

export function exportToExcel(data: any[], filename: string) {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data");
    const dateStr = format(new Date(), "yyyy-MM-dd");
    XLSX.writeFile(wb, `${filename}_${dateStr}.xlsx`);
}
