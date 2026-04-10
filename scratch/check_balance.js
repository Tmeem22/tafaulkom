const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    select: { username: true, balance: true, points: true, role: true }
  });
  console.log('Users Data:', JSON.stringify(users, null, 2));
}

checkUsers().finally(() => prisma.$disconnect());
