import { prisma } from "./lib/prisma";

async function main() {
  await prisma.user.updateMany({
    where: { email: "pedromcm1823@gmail.com" },
    data: { role: "CUSTOMER" },
  });
  console.log("Updated pedromcm1823@gmail.com to CUSTOMER");
}

main().catch(console.error);
