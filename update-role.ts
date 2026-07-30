import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.update({
    where: { email: "pedromcm23@gmail.com" },
    data: { role: "CUSTOMER" }
  });
  console.log("Updated pedromcm23@gmail.com to CUSTOMER");
}

main().catch(console.error).finally(() => prisma.$disconnect());
