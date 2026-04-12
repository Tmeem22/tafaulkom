import prisma from './src/lib/prisma.ts';

async function makeAdmin() {
    const user = await prisma.user.update({
        where: { email: 'audit@test.com' },
        data: { role: 'ADMIN', balance: 1000.0 }
    });
    console.log('User promoted to ADMIN:', user.email);
}

makeAdmin()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
