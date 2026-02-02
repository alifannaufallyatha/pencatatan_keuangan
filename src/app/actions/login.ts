"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { z } from "zod";

const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export async function login(formData: z.infer<typeof LoginSchema>) {
    const validatedFields = LoginSchema.safeParse(formData);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { email, password } = validatedFields.data;

    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: "/",
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" };
                default:
                    return { error: "Something went wrong!" };
            }
        }

        throw error;
    }
}
