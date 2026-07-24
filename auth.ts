import NextAuth, { type DefaultSession } from "next-auth"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }
}

import { authConfig } from "./auth.config"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" }, // usually required for edge middleware when using adapter, let's keep it safe or we can rely on standard
  ...authConfig,
})
