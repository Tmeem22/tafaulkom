import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // First delete dependent records
  await prisma.order.deleteMany({});
  await prisma.deposit.deleteMany({});
  await prisma.ticket.deleteMany({});
  
  // Now delete all users
  const deletedUsers = await prisma.user.deleteMany({});
  console.log(`Deleted ${deletedUsers.count} users.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
