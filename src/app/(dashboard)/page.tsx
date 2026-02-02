"use client";

import { useEffect, useState } from "react";
import { getWallets } from "@/app/actions/wallets";
import { getTransactions } from "@/app/actions/transactions";
import { Transaction, TransactionType, Wallet } from "@/types/prisma";
import { CreateWalletDialog } from "@/components/create-wallet-dialog";
import { AddTransactionDialog } from "@/components/add-transaction-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Wallet as WalletIcon, TrendingUp, TrendingDown, Scale, Filter } from "lucide-react";

import { TransactionDetailDialog } from "@/components/transaction-detail-dialog";
import { EditTransactionDialog } from "@/components/edit-transaction-dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit2 } from "lucide-react";

import { TransactionChart } from "@/components/transaction-chart";

export default function PersonalFinancePage() {
    const [wallets, setWallets] = useState<Wallet[]>([]);
    const [selectedWalletId, setSelectedWalletId] = useState<string>("");
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [filterDate, setFilterDate] = useState<string>(format(new Date(), "yyyy-MM-dd"));
    const [filterMonth, setFilterMonth] = useState<string>("all");
    const [filterYear, setFilterYear] = useState<string>(new Date().getFullYear().toString());
    const [filterType, setFilterType] = useState<string>("all");

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const w = await getWallets();
            setWallets(w);
            if (w.length > 0 && !selectedWalletId) {
                setSelectedWalletId(w[0].id);
            }
        };
        fetchData();

        // Auto-refresh interval (30 seconds)
        const intervalId = setInterval(fetchData, 30000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const fetchTransactions = async () => {
            if (!selectedWalletId) return;

            const filters: any = {};
            if (filterDate) filters.date = new Date(filterDate);
            if (filterMonth !== "all" && filterYear !== "") {
                filters.month = parseInt(filterMonth);
                filters.year = parseInt(filterYear);
            } else if (filterYear !== "") {
                filters.year = parseInt(filterYear);
            }

            const t = await getTransactions(selectedWalletId, filters);
            setTransactions(t);
        };
        fetchTransactions();

        // Auto-refresh interval (30 seconds)
        const intervalId = setInterval(fetchTransactions, 30000);
        return () => clearInterval(intervalId);
    }, [selectedWalletId, filterDate, filterMonth, filterYear]);

    const filteredTransactions = transactions.filter((t) => {
        if (filterType === "all") return true;
        return t.type === filterType;
    });

    const totalIncome = transactions
        .filter((t) => t.type === TransactionType.INCOME)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const totalExpense = transactions
        .filter((t) => t.type === TransactionType.EXPENSE)
        .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = totalIncome - totalExpense;

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                        Keuangan <span className="text-primary">Pribadi</span>
                    </h2>
                    <p className="text-slate-500 mt-2 text-base">
                        Kelola dompet dan pantau arus kas harian Anda dengan mudah.
                    </p>
                </div>
                <CreateWalletDialog />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Statistics Side */}
                <div className="lg:col-span-1 space-y-4">
                    <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium opacity-90">Sisa Saldo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">Rp {balance.toLocaleString()}</div>
                            <Scale className="h-8 w-8 mt-4 opacity-20" />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-emerald-50 text-emerald-700">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Pemasukan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">Rp {totalIncome.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-rose-50 text-rose-700">
                        <CardHeader className="pb-1">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider">Pengeluaran</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl font-bold">Rp {totalExpense.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col gap-2 pt-2">
                        {selectedWalletId && (
                            <>
                                <AddTransactionDialog walletId={selectedWalletId} wallets={wallets} type={TransactionType.INCOME} />
                                <AddTransactionDialog walletId={selectedWalletId} wallets={wallets} type={TransactionType.EXPENSE} />
                            </>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Chart Section */}
                    <div className="h-[300px]">
                        <TransactionChart transactions={transactions} />
                    </div>

                    {/* Toolbar */}
                    <Card className="border-none shadow-sm bg-white overflow-hidden">
                        <div className="p-1 bg-slate-50 border-b flex items-center px-4 py-2 gap-2">
                            <Filter className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Filter Transaksi</span>
                        </div>
                        <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Dompet</label>
                                    <Select value={selectedWalletId} onValueChange={setSelectedWalletId}>
                                        <SelectTrigger className="bg-slate-50 border-none h-10">
                                            <SelectValue placeholder="Pilih Dompet" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wallets.map((w) => (
                                                <SelectItem key={w.id} value={w.id}>
                                                    {w.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex-1 min-w-[150px]">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Tipe Transaksi</label>
                                    <Select value={filterType} onValueChange={setFilterType}>
                                        <SelectTrigger className="bg-slate-50 border-none h-10">
                                            <SelectValue placeholder="Semua" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Semua</SelectItem>
                                            <SelectItem value={TransactionType.INCOME}>Pemasukan</SelectItem>
                                            <SelectItem value={TransactionType.EXPENSE}>Pengeluaran</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Harian</label>
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
                                    <div className="col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Bulanan</label>
                                        <Select
                                            value={filterMonth}
                                            onValueChange={(val) => {
                                                setFilterMonth(val);
                                                setFilterDate("");
                                            }}
                                        >
                                            <SelectTrigger className="bg-slate-50 border-none h-10 text-xs text-left">
                                                <SelectValue placeholder="Semua" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Semua</SelectItem>
                                                {Array.from({ length: 12 }).map((_, i) => (
                                                    <SelectItem key={i} value={i.toString()}>
                                                        {format(new Date(2000, i, 1), "MMMM")}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1.5 block">Tahun</label>
                                        <Input
                                            type="number"
                                            value={filterYear}
                                            className="bg-slate-50 border-none h-10 text-xs"
                                            onChange={(e) => setFilterYear(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Table View */}
                    <Card className="border-none shadow-sm overflow-hidden">
                        <div className="p-4 border-b bg-white flex justify-between items-center">
                            <h3 className="font-bold text-slate-800">Riwayat Transaksi</h3>
                            <div className="text-[10px] font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">
                                {filteredTransactions.length} Transaksi
                            </div>
                        </div>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader className="bg-slate-50/50">
                                        <TableRow className="hover:bg-transparent border-none">
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 px-6">Tanggal</TableHead>
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right">Jumlah</TableHead>
                                            <TableHead className="py-4 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-right px-6">Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredTransactions.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center py-12 text-slate-400 text-sm">
                                                    Belum ada transaksi di periode ini.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredTransactions.map((t, index) => (
                                                <TableRow key={t.id} className={cn(
                                                    "hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0",
                                                )}>
                                                    <TableCell className="py-4 px-6 font-medium text-slate-600">
                                                        {format(new Date(t.date), "dd MMM yyyy")}
                                                    </TableCell>
                                                    <TableCell className={cn(
                                                        "py-4 text-right font-bold transition-all",
                                                        t.type === TransactionType.INCOME ? "text-emerald-500" : "text-rose-500"
                                                    )}>
                                                        {t.type === TransactionType.INCOME ? "+" : "-"} Rp {t.amount.toLocaleString()}
                                                    </TableCell>
                                                    <TableCell className="py-4 text-center px-6">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-1">
                                                                <TransactionDetailDialog transaction={t} trigger={
                                                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="rounded-lg gap-2 cursor-pointer">
                                                                        <Eye className="w-4 h-4 text-slate-400" />
                                                                        <span>Detail</span>
                                                                    </DropdownMenuItem>
                                                                } />
                                                                <DropdownMenuItem
                                                                    className="rounded-lg gap-2 cursor-pointer text-indigo-600"
                                                                    onSelect={() => {
                                                                        setSelectedTransaction(t);
                                                                        setIsEditOpen(true);
                                                                    }}
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                    <span>Edit</span>
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
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

            {selectedTransaction && (
                <EditTransactionDialog
                    transaction={selectedTransaction}
                    wallets={wallets}
                    open={isEditOpen}
                    onOpenChange={setIsEditOpen}
                />
            )}
        </div>
    );
}

// Helper function for class names
function cn(...classes: any[]) {
    return classes.filter(Boolean).join(" ");
}
