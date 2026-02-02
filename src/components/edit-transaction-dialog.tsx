"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionType, Transaction } from "@prisma/client";
import { updateTransaction } from "@/app/actions/transactions";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Edit2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Wallet } from "@/types/prisma";

const TransactionSchema = z.object({
    amount: z.number().positive("Jumlah harus lebih dari 0"),
    date: z.string(),
    source: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
    walletId: z.string().min(1, "Dompet wajib dipilih"),
});

interface EditTransactionDialogProps {
    transaction: Transaction;
    wallets: Wallet[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export function EditTransactionDialog({ transaction, wallets, open: externalOpen, onOpenChange: setExternalOpen, trigger }: EditTransactionDialogProps) {
    const [internalOpen, setInternalOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const open = externalOpen !== undefined ? externalOpen : internalOpen;
    const setOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

    const isIncome = transaction.type === TransactionType.INCOME;

    const form = useForm<z.infer<typeof TransactionSchema>>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            amount: transaction.amount,
            date: new Date(transaction.date).toISOString().split("T")[0],
            source: transaction.source || "",
            category: transaction.category || "",
            description: transaction.description || "",
            walletId: transaction.walletId,
        },
    });

    const onSubmit = async (values: z.infer<typeof TransactionSchema>) => {
        if (!isIncome && !values.description) {
            form.setError("description", { message: "Keterangan wajib untuk pengeluaran" });
            return;
        }

        const result = await updateTransaction(transaction.id, {
            ...values,
            type: transaction.type,
            date: new Date(values.date),
        });

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
        } else {
            toast({
                title: "Success",
                description: `Berhasil memperbarui ${isIncome ? "pemasukan" : "pengeluaran"}`,
            });
            setOpen(false);
            router.refresh(); // Refresh data tanpa reload halaman
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            {!trigger && (
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                        <Edit2 className="w-4 h-4" />
                    </Button>
                </DialogTrigger>
            )}
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <div className={cn(
                    "p-6 text-white bg-gradient-to-br",
                    isIncome ? "from-indigo-500 to-indigo-600" : "from-rose-500 to-rose-600"
                )}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            Edit {isIncome ? "Pemasukan" : "Pengeluaran"}
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-white/80 text-sm mt-1">Perbarui detail transaksi Anda.</p>
                </div>
                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="walletId"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Dompet</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20 font-medium">
                                                    <SelectValue placeholder="Pilih dompet" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {wallets.map((wallet) => (
                                                    <SelectItem key={wallet.id} value={wallet.id}>
                                                        {wallet.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="date"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Pilih Tanggal</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20 font-medium" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jumlah (Rp)</FormLabel>
                                        <FormControl>
                                            <CurrencyInput
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="0"
                                                className="bg-slate-50 border-none h-14 rounded-2xl focus-visible:ring-primary/20"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isIncome ? (
                                <FormField
                                    control={form.control}
                                    name="source"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Sumber Pemasukan</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Misal: Gaji, Jualan, dll" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <FormField
                                    control={form.control}
                                    name="category"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Jenis Pengeluaran</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Misal: Makan, Transport, dll" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Keterangan {!isIncome && "(Wajib)"}</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tulis catatan singkat..." {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className={cn(
                                "w-full h-14 rounded-2xl text-lg font-bold shadow-lg transition-all active:scale-[0.98] mt-4",
                                isIncome ? "bg-primary shadow-primary/30" : "bg-rose-500 shadow-rose-500/30"
                            )}>
                                Simpan Perubahan
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
