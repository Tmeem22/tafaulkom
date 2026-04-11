const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const services = await prisma.service.findMany({
    where: {
      name: { contains: 'مشترك' }
    }
  });
  
  console.log('--- YouTube Subscriber Original Rates from Provider ---');
  services.forEach(s => {
    console.log(`[${s.id}] ${s.name}: $${s.originalRate} (~${(s.originalRate*3.75).toFixed(2)} SAR)`);
  });
}

check().finally(() => prisma.$disconnect());
