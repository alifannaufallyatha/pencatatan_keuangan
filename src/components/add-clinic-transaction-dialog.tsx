"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClinicTransaction } from "@/app/actions/clinic";
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
import { PlusCircle } from "lucide-react";

const ClinicTransactionSchema = z.object({
    date: z.string(),
    procedureName: z.string().min(1, "Nama tindakan wajib diisi"),
    patientName: z.string().optional(),
    fee: z.number().positive("Biaya harus lebih dari 0"),
    paymentMethod: z.string().optional(),
});

export function AddClinicTransactionDialog() {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<z.infer<typeof ClinicTransactionSchema>>({
        resolver: zodResolver(ClinicTransactionSchema),
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
            procedureName: "",
            patientName: "",
            fee: 0,
            paymentMethod: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof ClinicTransactionSchema>) => {
        const result = await createClinicTransaction({
            ...values,
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
                description: "Pendapatan klinik berhasil dicatat",
            });
            form.reset();
            setOpen(false);
            router.refresh();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 rounded-2xl gap-2 font-bold bg-primary text-white shadow-lg shadow-primary/20 transition-all active:scale-[0.98] border-none">
                    <PlusCircle className="w-5 h-5" />
                    Catat Pendapatan
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] rounded-3xl border-none shadow-2xl p-0 overflow-hidden">
                <div className="p-6 text-white bg-gradient-to-br from-indigo-500 to-indigo-600">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight">Catat Pendapatan Klinik</DialogTitle>
                    </DialogHeader>
                    <p className="text-white/80 text-sm mt-1">Rekap pendapatan dari tindakan medis Anda.</p>
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
                                name="fee"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Biaya Tindakan (Rp)</FormLabel>
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
                            <FormField
                                control={form.control}
                                name="procedureName"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Tindakan Medis</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Misal: Pembersihan Karang Gigi, dll" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="patientName"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nama Pasien (Opsional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan nama pasien" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentMethod"
                                render={({ field }) => (
                                    <FormItem className="space-y-1.5">
                                        <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Metode Pembayaran (Opsional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tunai, Transfer, QRIS, dll" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full h-14 rounded-2xl text-lg font-bold shadow-lg shadow-primary/30 transition-all active:scale-[0.98] mt-4 bg-primary hover:bg-primary/90">
                                Simpan Pendapatan
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
