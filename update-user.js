const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const user = await prisma.user.update({
      where: { email: 'pedromcm23@gmail.com' },
      data: { name: 'Pedro Marques' }
    });
    console.log("Success! Updated user:", user.email, "to name:", user.name);
  } catch(e) {
    console.error("Error updating user:", e);
  }
}

main().finally(() => prisma.$disconnect());
