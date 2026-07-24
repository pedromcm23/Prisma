import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({
  // Prisma 7 configuration for dynamic URL
  adapter: null as any, // Placeholder if adapter is strictly required, but usually 'datasourceUrl' is what it needs
  datasourceUrl: process.env.DATABASE_URL
})

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma
