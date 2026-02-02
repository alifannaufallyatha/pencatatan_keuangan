"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Wallet, Stethoscope } from "lucide-react";

const navItems = [
    { href: "/", label: "Pribadi", icon: Wallet },
    { href: "/clinic", label: "Klinik", icon: Stethoscope },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-xl border border-slate-200/50 px-4 py-2 flex justify-between items-center z-50 rounded-3xl shadow-2xl shadow-indigo-200/50 w-[90%] max-w-sm">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "relative flex flex-col items-center gap-1 p-2 rounded-2xl transition-all duration-300 flex-1",
                            isActive
                                ? "text-primary scale-110"
                                : "text-slate-400 opacity-60 hover:opacity-100"
                        )}
                    >
                        {isActive && (
                            <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full" />
                        )}
                        <Icon className={cn("w-5 h-5 transition-all", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                        <span className={cn("text-[9px] font-bold uppercase tracking-tighter", isActive ? "block" : "hidden")}>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
}
