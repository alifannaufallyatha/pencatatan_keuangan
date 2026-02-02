"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { TransactionType } from "@prisma/client";
import { z } from "zod";

const TransactionSchema = z.object({
    walletId: z.string().min(1),
    type: z.nativeEnum(TransactionType),
    amount: z.coerce.number().positive(),
    date: z.coerce.date(),
    source: z.string().optional(),
    category: z.string().optional(),
    description: z.string().optional(),
});

export async function createTransaction(values: z.infer<typeof TransactionSchema>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = TransactionSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields" };

    const { walletId, type, amount, date, source, category, description } = validatedFields.data;

    // Verify wallet belongs to user
    const wallet = await prisma.wallet.findUnique({
        where: { id: walletId, userId: session.user.id },
    });

    if (!wallet) return { error: "Wallet not found" };

    if (type === TransactionType.EXPENSE && !description) {
        return { error: "Description is required for expenses" };
    }

    try {
        await prisma.transaction.create({
            data: {
                type,
                amount,
                date,
                source,
                category,
                description,
                walletId,
            },
        });
        revalidatePath("/");
        return { success: "Transaction recorded" };
    } catch (error) {
        return { error: "Failed to record transaction" };
    }
}

export async function updateTransaction(id: string, values: z.infer<typeof TransactionSchema>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = TransactionSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields" };

    const { walletId, type, amount, date, source, category, description } = validatedFields.data;

    // Verify wallet belongs to user
    const wallet = await prisma.wallet.findUnique({
        where: { id: walletId, userId: session.user.id },
    });

    if (!wallet) return { error: "Wallet not found" };

    if (type === TransactionType.EXPENSE && !description) {
        return { error: "Description is required for expenses" };
    }

    try {
        await prisma.transaction.update({
            where: { id },
            data: {
                type,
                amount,
                date,
                source,
                category,
                description,
                walletId,
            },
        });
        revalidatePath("/");
        return { success: "Transaction updated" };
    } catch (error) {
        return { error: "Failed to update transaction" };
    }
}

export async function getTransactions(walletId: string, filters?: { date?: Date, month?: number, year?: number }) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const where: any = { walletId };

    if (filters?.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);
        where.date = { gte: start, lte: end };
    } else if (filters?.month !== undefined && filters?.year !== undefined) {
        const start = new Date(filters.year, filters.month, 1);
        const end = new Date(filters.year, filters.month + 1, 0, 23, 59, 59, 999);
        where.date = { gte: start, lte: end };
    } else if (filters?.year !== undefined) {
        const start = new Date(filters.year, 0, 1);
        const end = new Date(filters.year, 11, 31, 23, 59, 59, 999);
        where.date = { gte: start, lte: end };
    }

    return await prisma.transaction.findMany({
        where,
        orderBy: { date: "desc" },
    });
}
