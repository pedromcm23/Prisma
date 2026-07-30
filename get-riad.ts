import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const p = await prisma.property.findFirst({ where: { name: "Riad Nour" } });
  console.log(JSON.stringify(p?.landingPageJson, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
