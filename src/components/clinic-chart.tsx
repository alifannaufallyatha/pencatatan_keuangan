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
import { ClinicTransaction } from "@prisma/client";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ClinicChartProps {
    transactions: ClinicTransaction[];
    filterDate?: string; // If set, we are in daily view
}

export function ClinicChart({ transactions, filterDate }: ClinicChartProps) {
    // Determine view mode: 'daily-trend' or 'procedure-breakdown'
    // If filterDate is present (user selected a specific day), we show breakdown.
    // Otherwise, we show simple daily trend.
    const isDailyView = !!filterDate && filterDate.length > 0;

    const data = useMemo(() => {
        if (isDailyView) {
            // Group by Procedure Name
            const grouped = transactions.reduce((acc: Record<string, number>, curr) => {
                const name = curr.procedureName;
                acc[name] = (acc[name] || 0) + curr.fee;
                return acc;
            }, {});

            return Object.entries(grouped)
                .map(([name, amount]) => ({
                    name,
                    amount,
                }))
                .sort((a, b) => b.amount - a.amount); // Sort by highest revenue
        } else {
            // Group by Date
            const grouped = transactions.reduce((acc: Record<string, number>, curr) => {
                const date = format(new Date(curr.date), "dd MMM");
                acc[date] = (acc[date] || 0) + curr.fee;
                return acc;
            }, {});

            // Fill missing days? No, just show days with data for simplicity, sorted by date.
            // Actually, sorting by date string 'dd MMM' is tricky if spanning years, but usually filters are monthly/yearly.
            // Let's rely on transaction order if they are sorted from DB.
            // Or better, let's just map the entries.
            // Since `transactions` might not be sorted, let's sort by date first to be safe if we want chronological order.

            const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

            // Re-reduce sorted
            const groupedSorted = sortedTx.reduce((acc: Record<string, number>, curr) => {
                const date = format(new Date(curr.date), "dd MMM");
                acc[date] = (acc[date] || 0) + curr.fee;
                return acc;
            }, {});

            return Object.entries(groupedSorted).map(([name, amount]) => ({
                name,
                amount,
            }));
        }
    }, [transactions, isDailyView]);

    const formatCurrency = (value: number) => {
        return `Rp ${value.toLocaleString("id-ID")}`;
    };

    return (
        <Card className="border-none shadow-sm h-full">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    {isDailyView ? "Pendapatan per Tindakan" : "Tren Pendapatan Harian"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    {data.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                            Belum ada data
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 10 }}
                                    dy={10}
                                    angle={-45}
                                    textAnchor="end"
                                    interval={0}
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
                                    formatter={(value: any) => [formatCurrency(Number(value) || 0), "Pendapatan"]}
                                />
                                <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40} animationDuration={1000}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill="#6366f1" /> // indigo-500
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
