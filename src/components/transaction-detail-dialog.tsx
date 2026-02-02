"use client";

import { Transaction, TransactionType } from "@prisma/client";
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

interface TransactionDetailDialogProps {
    transaction: Transaction;
    trigger?: React.ReactNode;
}

export function TransactionDetailDialog({ transaction, trigger }: TransactionDetailDialogProps) {
    const isIncome = transaction.type === TransactionType.INCOME;

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
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Detail Transaksi</DialogTitle>
                </DialogHeader>
                <div className="grid gap-3 py-4">
                    <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Tanggal</span>
                        <span className="col-span-2 text-sm font-semibold">{format(new Date(transaction.date), "dd MMMM yyyy")}</span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Tipe</span>
                        <span className={`col-span-2 text-sm font-bold ${isIncome ? "text-green-600 font-bold" : "text-red-600 font-bold"}`}>
                            {isIncome ? "Pemasukan (MASUK)" : "Pengeluaran (KELUAR)"}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">{isIncome ? "Sumber" : "Kategori"}</span>
                        <span className="col-span-2 text-sm font-semibold">{transaction.source || transaction.category || "-"}</span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2 border-b pb-2">
                        <span className="text-sm font-medium text-muted-foreground">Jumlah</span>
                        <span className="col-span-2 text-lg font-bold">Rp {transaction.amount.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-3 items-start gap-2">
                        <span className="text-sm font-medium text-muted-foreground">Keterangan</span>
                        <span className="col-span-2 text-sm text-slate-700 italic">
                            {transaction.description || "-"}
                        </span>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
