import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = new Proxy({} as PrismaClient, {
  get(_, prop) {
    if (!globalForPrisma.prisma) {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        // Mock prisma during build if DATABASE_URL is missing
        const mockProxy: any = new Proxy(
          () => Promise.resolve([]),
          { get: () => mockProxy }
        );
        return mockProxy;
      }
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool);
      globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return (globalForPrisma.prisma as any)[prop];
  }
});
