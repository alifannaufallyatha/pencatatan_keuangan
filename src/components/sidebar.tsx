"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, Stethoscope, LogOut, LayoutDashboard } from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
    { href: "/", label: "Keuangan Pribadi", icon: Wallet },
    { href: "/clinic", label: "Keuangan Klinik", icon: Stethoscope },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="hidden lg:flex flex-col w-64 border-r bg-white h-screen fixed left-0 top-0 shadow-sm z-50">
            <div className="p-8 pb-10">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                        <LayoutDashboard className="w-4 h-4" />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-slate-800">Keuangan<span className="text-primary font-black">Ku</span></h1>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1.5 focus:outline-none">
                <div className="px-4 mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Menu Utama</span>
                </div>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-2xl transition-all duration-200 group",
                                isActive
                                    ? "bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]"
                                    : "text-slate-500 hover:bg-slate-50 hover:text-primary"
                            )}
                        >
                            <Icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "text-white" : "text-slate-400 group-hover:text-primary")} />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto">
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 rounded-2xl w-full transition-all duration-200 group"
                >
                    <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                        <LogOut className="w-4 h-4" />
                    </div>
                    Keluar
                </button>
            </div>
        </div>
    );
}
