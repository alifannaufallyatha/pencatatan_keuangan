"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWallet } from "@/app/actions/wallets";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function CreateWalletDialog() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        setLoading(true);
        const result = await createWallet({ name });
        setLoading(false);

        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
        } else {
            toast({
                title: "Success",
                description: "Wallet created successfully",
            });
            setName("");
            setOpen(false);
            router.refresh(); // Refresh data tanpa reload halaman
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Dompet Baru
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleCreate}>
                    <DialogHeader>
                        <DialogTitle>Buat Dompet Baru</DialogTitle>
                        <DialogDescription>
                            Buat dompet baru untuk memisahkan pencatatan keuangan Anda.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Nama Dompet</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="misal: Tabungan, Harian, dll"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading || !name}>
                            {loading ? "Menyimpan..." : "Simpan"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
