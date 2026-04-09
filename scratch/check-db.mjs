import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Checking database connection and tables...');
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Existing tables:', tables);
    
    // Check if TicketMessage exists
    const hasTicketMessage = tables.some(t => t.table_name === 'TicketMessage');
    console.log('Has TicketMessage table:', hasTicketMessage);
    
    if (!hasTicketMessage) {
      console.log('Attempting to create TicketMessage table manually if possible...');
      // This is risky but let's see if we can at least verify.
    }
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
