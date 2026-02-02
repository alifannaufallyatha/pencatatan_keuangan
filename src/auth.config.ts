import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                // This will be overridden in auth.ts with full logic
                return null;
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isPublicRoute = ["/login", "/register"].includes(nextUrl.pathname);
            const isAuthRoute = nextUrl.pathname.startsWith("/api/auth");

            if (isAuthRoute) return true;

            if (isPublicRoute) {
                if (isLoggedIn) {
                    return Response.redirect(new URL("/", nextUrl));
                }
                return true;
            }

            return isLoggedIn;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
