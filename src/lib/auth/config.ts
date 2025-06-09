"use server"
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { verifyPassword } from "./util";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        let user = null;

        user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) {
          throw new Error("email or password is incorrect");
        }

        const isValidPassword = verifyPassword(
          credentials.password as string,
          user.hashedPassword as string
        );
        if (!isValidPassword) {
          throw new Error("email or password is incorrect");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 1 * 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
    newUser: "/onboarding",
    signOut: "/",
  },
});
