import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import type { Provider } from "next-auth/providers";
import { verifyPassword } from "./util";

const providers: Provider[] = [
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
  GitHub,
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
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
    signIn: "/login",
    error: "/login",
    newUser: "/onboarding",
    signOut: "/",
  },
});
