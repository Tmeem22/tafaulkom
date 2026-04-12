const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const tiktoks = await prisma.service.findMany({
    where: { category: { contains: 'TikTok', mode: 'insensitive' } },
    select: { id: true, name: true, originalRate: true },
    take: 5
  });
  console.log("TIKTOK:", tiktoks);
}
main().finally(() => prisma.$disconnect());
