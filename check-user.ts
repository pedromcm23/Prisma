import { prisma } from "./lib/prisma";

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: "pedromcm23@gmail.com" },
    select: { email: true, role: true }
  });
  console.log("DB USER:", user);
}

main().catch(console.error);
