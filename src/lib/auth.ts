import { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Google from "next-auth/providers/google"
import { db } from "@/lib/db"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      organizationId?: string | null
      role?: string | null
    }
  }
}

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(db),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
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