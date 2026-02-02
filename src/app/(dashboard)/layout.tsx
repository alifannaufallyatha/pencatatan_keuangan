"use client";

import { Sidebar } from "@/components/sidebar";
import { BottomNav } from "@/components/bottom-nav";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-slate-50 flex-col lg:flex-row">
            {/* Mobile Header */}
            <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200/50 sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-md shadow-primary/20">
                        <span className="font-black text-xs">K</span>
                    </div>
                    <h1 className="text-lg font-bold tracking-tight text-slate-800">Keuangan<span className="text-primary">Ku</span></h1>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="p-2.5 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-xl transition-all active:scale-95"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </header>

            <Sidebar />
            <main className="flex-1 lg:ml-64 p-4 md:p-10 pb-32 lg:pb-10">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}
