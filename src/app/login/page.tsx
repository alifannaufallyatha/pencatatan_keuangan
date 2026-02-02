"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { login } from "@/app/actions/login";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof LoginSchema>) {
        setIsLoading(true);
        const result = await login(values);
        setIsLoading(false);

        if (result?.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20 mb-4 animate-bounce">
                        <span className="font-black text-xl">K</span>
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Selamat Datang</h2>
                    <p className="text-slate-500">Masuk untuk mengelola keuangan Anda</p>
                </div>

                <Card className="border-none shadow-2xl shadow-slate-200/50 rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm">
                    <CardHeader className="pb-2 pt-8">
                        <CardTitle className="text-xl font-bold px-4">Login</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem className="space-y-1.5">
                                            <FormLabel className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} className="bg-slate-50 border-none h-12 rounded-2xl focus-visible:ring-primary/20" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full h-12 rounded-2xl text-base font-bold shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" disabled={isLoading}>
                                    {isLoading ? "Memuat..." : "Masuk Sekarang"}
                                </Button>
                            </form>
                        </Form>
                        <div className="mt-8 text-center text-sm">
                            <span className="text-slate-400">Belum punya akun?</span>{" "}
                            <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                                Daftar Gratis
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
