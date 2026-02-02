"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ClinicTransactionSchema = z.object({
    date: z.coerce.date(),
    procedureName: z.string().min(1, "Procedure name is required"),
    patientName: z.string().optional(),
    fee: z.coerce.number().positive(),
    paymentMethod: z.string().optional(),
});

export async function createClinicTransaction(values: z.infer<typeof ClinicTransactionSchema>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = ClinicTransactionSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields" };

    try {
        await prisma.clinicTransaction.create({
            data: {
                ...validatedFields.data,
                userId: session.user.id,
            },
        });
        revalidatePath("/clinic");
        return { success: "Clinic transaction recorded" };
    } catch (error) {
        return { error: "Failed to record clinic transaction" };
    }
}

export async function updateClinicTransaction(id: string, values: z.infer<typeof ClinicTransactionSchema>) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const validatedFields = ClinicTransactionSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Invalid fields" };

    try {
        await prisma.clinicTransaction.update({
            where: { id, userId: session.user.id },
            data: validatedFields.data,
        });
        revalidatePath("/clinic");
        return { success: "Clinic transaction updated" };
    } catch (error) {
        return { error: "Failed to update clinic transaction" };
    }
}

export async function getClinicTransactions(filters?: { date?: Date, month?: number, year?: number }) {
    const session = await auth();
    if (!session?.user?.id) return [];

    const where: any = { userId: session.user.id };

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

    return await prisma.clinicTransaction.findMany({
        where,
        orderBy: { date: "desc" },
    });
}
