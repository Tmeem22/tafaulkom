const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  try {
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: '0551499154' },
          { email: '0551499154' },
          { username: 'tamim' }
        ]
      }
    });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          isProfitViewer: true,
          role: 'ADMIN'
        }
      });
      console.log('--- SUCCESS: User Activated ---');
      console.log('Username: ' + user.username);
    } else {
      console.log('--- ERROR: User Not Found ---');
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

run();
