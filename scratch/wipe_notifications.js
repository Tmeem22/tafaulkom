const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function wipe() {
  const result = await prisma.notification.deleteMany();
  console.log('Deleted notifications:', result.count);
}

wipe()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
