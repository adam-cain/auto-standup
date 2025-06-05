import NextAuth, { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { SessionUser } from "@/types"

declare module "next-auth" {
  interface Session {
    user: SessionUser
  }
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null
        }
        const user = await db.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user || !user.hashedPassword) {
          return null
        }
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword as string
        )
        if (!isValid) {
          return null
        }
        return user
      },
    }),
  ],
  // Custom sign in page
  pages: {
    signIn: "/signin",
    error: "/signin",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id

        // Get user's organization roles
        const userRoles = await db.userRole.findMany({
          where: { userId: user.id },
          include: {
            organization: true,
            team: true,
            role: true,
          },
        })

        // Add organization context to session
        if (userRoles.length > 0) {
          const primaryRole = userRoles[0] // Use first organization as primary
          session.user.organizationId = primaryRole.organizationId
          session.user.role = primaryRole.role.name
        }
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id
      }
      return token
    },
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard')
      const isOnAuth = nextUrl.pathname.startsWith('/auth')

      if (isOnDashboard) {
        return isLoggedIn
      }

      if (isOnAuth && isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }

      return true
    },
  },
  session: {
    strategy: "database",
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig) 