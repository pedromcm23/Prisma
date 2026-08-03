import { prisma } from "./lib/prisma";

async function main() {
  await prisma.user.updateMany({
    where: { 
      email: { in: ["pedromcm23@gmail.com", "pedromcm1823@gmail.com", "pedromcm1623@gmail.com", "pedromcm1723@gmail.com"] }
    },
    data: { role: "CUSTOMER" },
  });
  console.log("Updated all testing accounts to CUSTOMER");
}

main().catch(console.error);
