import { prisma } from "./lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    select: { email: true, role: true }
  });
  console.log("ALL USERS:", users);
}

main().catch(console.error);
