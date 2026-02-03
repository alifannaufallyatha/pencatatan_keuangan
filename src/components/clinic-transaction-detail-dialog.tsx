"use client";

import { ClinicTransaction } from "@prisma/client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClinicTransactionDetailDialogProps {
    transaction: ClinicTransaction;
    trigger?: React.ReactNode;
}

export function ClinicTransactionDetailDialog({ transaction, trigger }: ClinicTransactionDetailDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 gap-1 sm:gap-2">
                        <Info className="w-3.5 h-3.5" />
                        <span className="text-xs sm:text-sm">Detail</span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <div className="p-6 text-white bg-gradient-to-br from-indigo-500 to-indigo-600">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Detail Tindakan</DialogTitle>
                    </DialogHeader>
                    <p className="text-white/80 text-sm mt-1">Informasi lengkap transaksi klinik.</p>
                </div>
                <div className="grid gap-3 p-6 pt-4">
                    <div className="grid grid-cols-3 items-start gap-2 border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tanggal</span>
                        <span className="col-span-2 text-sm font-semibold text-slate-700">{format(new Date(transaction.date), "dd MMMM yyyy")}</span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Tindakan</span>
                        <span className="col-span-2 text-sm font-bold text-slate-800">{transaction.procedureName}</span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Pasien</span>
                        <span className="col-span-2 text-sm font-semibold text-slate-700">
                            {transaction.patientName || "-"}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 border-b border-slate-100 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Metode</span>
                        <span className="col-span-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-500 uppercase tracking-tight">
                                {transaction.paymentMethod || "CASH"}
                            </span>
                        </span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 pt-1">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Biaya</span>
                        <span className="col-span-2 text-lg font-black text-indigo-600">Rp {transaction.fee.toLocaleString()}</span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
