"use client";

import { useEffect, useState } from "react";
import { getClinicTransactions } from "@/app/actions/clinic";
import { ClinicTransaction } from "@prisma/client";
import { AddClinicTransactionDialog } from "@/components/add-clinic-transaction-dialog";
import { EditClinicTransactionDialog } from "@/components/edit-clinic-transaction-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Stethoscope, TrendingUp, Calendar, Filter } from "lucide-react";
import { ClinicChart } from "@/components/clinic-chart";

export default function ClinicFinancePage() {
    const [transactions, setTransactions] = useState<ClinicTransaction[]>([]);
    const [filterDate, setFilterDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());

    const fetchTransactions = async () => {
        const filters: any = {};
        if (filterDate) {
            filters.date = new Date(filterDate);
        } else if (filterMonth !== "all" && filterYear !== "") {
            filters.month = parseInt(filterMonth);
            filters.year = parseInt(filterYear);
        } else if (filterYear !== "") {
            filters.year = parseInt(filterYear);
        }

        const t = await getClinicTransactions(filters);
        setTransactions(t);
    };

    useEffect(() => {
        fetchTransactions();

        // Auto-refresh interval (30 seconds)
        const intervalId = setInterval(fetchTransactions, 30000);
        return () => clearInterval(intervalId);
    }, [filterDate, filterMonth, filterYear]);

    const totalIncome = transactions.reduce((acc, curr) => acc + curr.fee, 0);

    // Group by day for daily summary
    const dailySummary = transactions.reduce((acc: any, curr) => {
        const date = format(new Date(curr.date), "yyyy-MM-dd");
        if (!acc[date]) acc[date] = 0;
        acc[date] += curr.fee;
        return acc;
    }, {});

    const currentDayIncome = dailySummary[format(new Date(), "yyyy-MM-dd")] || (filterDate ? (transactions.length > 0 ? totalIncome : 0) : 0);

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Keuangan <span className="text-primary font-black">Klinik</span>
                    </h2>
                    <p className="text-slate-500 mt-2 text-base">
                        Pantau rekapitulasi pendapatan tindakan medis Anda secara real-time.
                    </p>
                </div>
                <AddClinicTransactionDialog />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Statistics Side */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider opacity-80">Pendapatan Hari Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {currentDayIncome.toLocaleString()}</div>
                            <Calendar className="h-8 w-8 mt-4 opacity-20" />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-indigo-50 text-indigo-700">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Total (Periode)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">Rp {totalIncome.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <div className="pt-2">
                        <div className="p-4 bg-white rounded-2xl shadow-sm space-y-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-3 h-3 text-slate-400" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Filter Data</span>
                            </div>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Harian</label>
                                    <Input
                                        type="date"
                                        value={filterDate}
                                        className="bg-slate-50 border-none h-10 text-xs"
                                        onChange={(e) => {
                                            setFilterDate(e.target.value);
                                            setFilterMonth("all");
                                        }}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Pilih Bulan</label>
                                    <Select
                                        value={filterMonth}
                                        onValueChange={(val) => {
                                            setFilterMonth(val);
                                            setFilterDate("");
                                        }}
                                    >
                                        <SelectTrigger className="bg-slate-50 border-none h-10">
                                            <SelectValue placeholder="Semua Bulan" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua Bulan</SelectItem>
                                            {Array.from({ length: 12 }).map((_, i) => (
                                                <SelectItem key={i} value={i.toString()}>
                                                    {format(new Date(2000, i, 1), "MMMM")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Tahun</label>
                                    <Input
                                        type="number"
                                        value={filterYear}
                                        className="bg-slate-50 border-none h-10"
                                        onChange={(e) => setFilterYear(e.target.value)}
                                        placeholder="Tahun"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Table Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Chart Section */}
                    <div className="h-[350px]">
                        <ClinicChart transactions={transactions} filterDate={filterDate} />
                    </div>

                    <Card className="border-none shadow-sm overflow-hidden min-h-[400px]">
                        <div className="p-4 border-b bg-white flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Riwayat Tindakan</h3>
                            <div className="text-[10px] font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">
                                {transactions.length} Tindakan
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-6">Tindakan</TableHead>
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">Metode</TableHead>
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Biaya</TableHead>
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center px-6">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-12 text-slate-400 text-sm">
                                                    Belum ada data tindakan di periode ini.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            transactions.map((t) => (
                                                <TableRow key={t.id} className="hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 text-sm">
                                                    <TableCell className="py-4 px-6">
                                                        <div className="flex flex-col">
                                                            <span className="font-bold text-slate-800">{t.procedureName}</span>
                                                            {!filterDate && (
                                                                <span className="text-[10px] text-slate-400">
                                                                    {format(new Date(t.date), "dd MMM yyyy")}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-4">
                                                        <span className="px-2 py-1 rounded-[4px] text-[10px] font-bold bg-indigo-50 text-indigo-500 uppercase tracking-tight">
                                                            {t.paymentMethod || "CASH"}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="py-4 text-right font-black text-slate-700">
                                                        Rp {t.fee.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-center px-6">
                                                        <EditClinicTransactionDialog transaction={t} />
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
