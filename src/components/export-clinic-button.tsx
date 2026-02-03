"use client";

import { Button } from "@/components/ui/button";
import { FileSpreadsheet } from "lucide-react";
import { ClinicTransaction } from "@prisma/client";
import { exportToExcel } from "@/lib/export";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ExportClinicButtonProps {
    transactions: ClinicTransaction[];
}

export function ExportClinicButton({ transactions }: ExportClinicButtonProps) {
    const { toast } = useToast();

    const handleExport = () => {
        if (transactions.length === 0) {
            toast({
                variant: "destructive",
                title: "Gagal Export",
                description: "Tidak ada data untuk diexport",
            });
            return;
        }

        const dataToExport = transactions.map((t) => ({
            "Tanggal": format(new Date(t.date), "dd/MM/yyyy"),
            "Tindakan": t.procedureName,
            "Pasien": t.patientName || "-",
            "Metode Pembayaran": t.paymentMethod || "CASH",
            "Biaya": t.fee,
        }));

        exportToExcel(dataToExport, "Laporan_Klinik");

        toast({
            title: "Export Berhasil",
            description: "Data berhasil diexport ke Excel",
        });
    };

    return (
        <Button
            size="sm"
            className="gap-2 h-8 text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20 shadow-lg border-none active:scale-[0.98] transition-all"
            onClick={handleExport}
        >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export Excel</span>
        </Button>
    );
}
