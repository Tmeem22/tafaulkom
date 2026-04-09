import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';

async function setBalance() {
    // Manually load env
    const env = await readFile('.env', 'utf-8');
    const lines = env.split('\n');
    lines.forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            const k = parts[0].trim();
            const v = parts.slice(1).join('=').trim().replace(/"/g, '').replace(/'/g, '');
            process.env[k] = v;
        }
    });

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: process.env.DATABASE_URL
            }
        }
    });

    try {
        const username = 'tymlghby_o1602t';
        console.log(`Searching for user: ${username}`);
        
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (user) {
            const updatedUser = await prisma.user.update({
                where: { id: user.id },
                data: { balance: 100.0 }
            });
            console.log(`Success! New balance for ${username}: ${updatedUser.balance} SAR`);
        } else {
            console.error(`User ${username} not found in database.`);
            const allUsers = await prisma.user.findMany({ select: { username: true } });
            console.log("Available users:", allUsers.map(u => u.username).join(', '));
        }
    } catch (e) {
        console.error("Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

setBalance();
