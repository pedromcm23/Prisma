import { prisma } from '../lib/prisma';

async function main() {
  const email = 'pedromcm23@gmail.com';
  
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) {
    console.log("User not found!");
    return;
  }
  
  console.log(`Found user: ${user.id} (${user.email}) - Role: ${user.role}`);
  
  const deletedProperties = await prisma.property.deleteMany({
    where: { hostId: user.id }
  });
  console.log(`Deleted ${deletedProperties.count} properties for this user.`);
  
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { role: 'CUSTOMER' }
  });
  
  console.log(`Updated user role to: ${updatedUser.role}`);
}

main().catch(console.error).finally(() => process.exit(0));
