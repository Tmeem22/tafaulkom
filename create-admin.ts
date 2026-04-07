import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DIRECT_URL // Try direct connection
    },
  },
});

async function main() {
    const password = 'dev'; // Set your password here
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.upsert({
        where: { email: '321' }, // Using the special ID email
        update: {
            role: 'ADMIN',
            balance: 1000000.0, 
        },
        create: {
            username: 'developer',
            email: '321', // Special email
            password: hashedPassword,
            role: 'ADMIN',
            balance: 1000000.0,
            emailVerified: true
        }
    });

    console.log('✅ Admin / Developer account created:');
    console.log('Email / ID:', user.email);
    console.log('Password:', password);
    console.log('Role:', user.role);
    console.log('Balance:', user.balance);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
