"use client";

import { useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { Transaction, TransactionType } from "@/types/prisma";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TransactionChartProps {
    transactions: Transaction[];
}

export function TransactionChart({ transactions }: TransactionChartProps) {
    // Aggregate data by type
    const data = useMemo(() => {
        const totalIncome = transactions
            .filter((t) => t.type === TransactionType.INCOME)
            .reduce((acc, curr) => acc + curr.amount, 0);

        const totalExpense = transactions
            .filter((t) => t.type === TransactionType.EXPENSE)
            .reduce((acc, curr) => acc + curr.amount, 0);

        return [
            {
                name: "Pemasukan",
                amount: totalIncome,
                color: "#10b981", // emerald-500
            },
            {
                name: "Pengeluaran",
                amount: totalExpense,
                color: "#f43f5e", // rose-500
            },
        ];
    }, [transactions]);

    // Format tooltip value
    const formatCurrency = (value: number) => {
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Statistik Periode Ini
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    {transactions.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            Belum ada data
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 10 }}
                                    tickFormatter={(value) => `Rp${(value / 1000).toLocaleString()}k`}
                                />
                                <Tooltip
                                    cursor={{ fill: "transparent" }}
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        borderRadius: "8px",
                                        border: "none",
                                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                    }}
                                    formatter={(value: any) => [formatCurrency(Number(value) || 0), "Jumlah"]}
                                />
                                <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={50} animationDuration={1000}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
