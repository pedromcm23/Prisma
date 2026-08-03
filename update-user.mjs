import { PrismaClient } from "@prisma/client";
import pg from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = "postgres://a19dc792d76362b85b33034b8854690143a2678b4505b8ce11c342546b409ae7:sk_PEWN14UoY4S9cZln8vhkI@db.prisma.io:5432/postgres?sslmode=require";
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: 'pedromcm23@gmail.com' },
      data: { name: 'Pedro Marques' }
    });
    console.log("Updated user:", user.email, "to name:", user.name);
  } catch(e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}
main();
