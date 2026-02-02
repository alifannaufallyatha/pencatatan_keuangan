"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const WalletSchema = z.object({
    name: z.string().min(1, "Wallet name is required"),
});

export async function createWallet(formData: z.infer<typeof WalletSchema>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = WalletSchema.safeParse(formData);
    if (!validatedFields.success) return { error: "Invalid fields" };

    try {
        await prisma.wallet.create({
            data: {
                name: validatedFields.data.name,
                userId: session.user.id,
            },
        });
        revalidatePath("/");
        return { success: "Wallet created" };
    } catch (error) {
        return { error: "Failed to create wallet" };
    }
}

export async function getWallets() {
    const session = await auth();
    if (!session?.user?.id) return [];

    return await prisma.wallet.findMany({
        where: { userId: session.user.id },
        include: {
            _count: {
                select: { transactions: true },
            },
        },
        orderBy: { createdAt: "desc" },
    });
}
