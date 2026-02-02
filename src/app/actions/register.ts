"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function register(formData: z.infer<typeof RegisterSchema>) {
    const validatedFields = RegisterSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password, name } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return { error: "Email already in use!" };
    }

    await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    return { success: "User created!" };
}
