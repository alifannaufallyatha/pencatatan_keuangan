"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TransactionType } from "@prisma/client";
import { createTransaction } from "@/app/actions/transactions";
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
import { Input } from "@/components/ui/input";
import { CurrencyInput } from "@/components/ui/currency-input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, MinusCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TransactionSchema = z.object({
    amount: z.number().positive("Jumlah harus lebih dari 0"),
    date: z.string(),
    source: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
});

interface AddTransactionDialogProps {
    walletId: string;
    type: TransactionType;
}

export function AddTransactionDialog({ walletId, type }: AddTransactionDialogProps) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();
    const isIncome = type === TransactionType.INCOME;

    const form = useForm<z.infer<typeof TransactionSchema>>({
        resolver: zodResolver(TransactionSchema),
        defaultValues: {
            amount: 0,
            date: new Date().toISOString().split("T")[0],
            source: "",
            category: "",
            description: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof TransactionSchema>) => {
        if (!isIncome && !values.description) {
            form.setError("description", { message: "Keterangan wajib untuk pengeluaran" });
            return;
        }

        const result = await createTransaction({
            ...values,
            walletId,
            type,
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
                description: `Berhasil mencatat ${isIncome ? "pemasukan" : "pengeluaran"}`,
            });
            form.reset();
            setOpen(false);
            router.refresh(); // Refresh data tanpa reload halaman
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        "h-12 rounded-2xl gap-2 font-bold transition-all active:scale-[0.98] border-none shadow-sm",
                        isIncome
                            ? "bg-primary text-white hover:bg-primary/90 shadow-primary/20"
                            : "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-200"
                    )}
                >
                    {isIncome ? <PlusCircle className="w-5 h-5" /> : <MinusCircle className="w-5 h-5" />}
                    {isIncome ? "Pemasukan" : "Pengeluaran"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <div className={cn(
                    "p-6 text-white bg-gradient-to-br",
                    isIncome ? "from-indigo-500 to-indigo-600" : "from-rose-500 to-rose-600"
                )}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">
                            {isIncome ? "Catat Pemasukan" : "Catat Pengeluaran"}
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-white/80 text-sm mt-1">Masukkan detail transaksi Anda secara akurat.</p>
                </div>
                <div className="p-8">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                Simpan Transaksi
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
