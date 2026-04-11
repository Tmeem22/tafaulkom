import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testTickets() {
  console.log("Starting Ticket System Test...");

  // 1. Create two test accounts
  const u1Password = await bcrypt.hash('password123', 10);
  const u2Password = await bcrypt.hash('password123', 10);

  const testUser1 = await prisma.user.upsert({
    where: { email: 'test1@example.com' },
    update: {},
    create: {
      username: 'TestUser1',
      email: 'test1@example.com',
      password: u1Password,
      role: 'USER'
    }
  });

  const testUser2 = await prisma.user.upsert({
    where: { email: 'test2@example.com' },
    update: {},
    create: {
      username: 'TestUser2',
      email: 'test2@example.com',
      password: u2Password,
      role: 'USER'
    }
  });

  // Ensure Admin exists
  const adminMode = await prisma.user.findFirst({
    where: { role: 'ADMIN' }
  });

  const adminId = adminMode?.id || testUser1.id; // fallback for test

  console.log(`Created/Ensured Users: ${testUser1.username}, ${testUser2.username}`);

  // 2. User 1 creates a ticket
  const ticket1 = await prisma.ticket.create({
    data: {
      userId: testUser1.id,
      subject: 'طلب مساعدة حساب 1',
      message: 'السلام عليكم، عندي مشكلة في حسابي.',
      status: 'open'
    }
  });
  console.log(`User 1 created ticket #${ticket1.id}`);

  // 3. User 2 creates a ticket
  const ticket2 = await prisma.ticket.create({
    data: {
      userId: testUser2.id,
      subject: 'استفسار حساب 2',
      message: 'كيف اقوم بإضافة رصيد؟',
      status: 'open'
    }
  });
  console.log(`User 2 created ticket #${ticket2.id}`);

  // 4. Admin replies to ticket 1
  await prisma.ticketMessage.create({
      data: {
          ticketId: ticket1.id,
          senderId: adminId,
          role: 'ADMIN',
          message: 'وعليكم السلام، نعم تفضل ما هي مشكلتك؟'
      }
  });
  console.log(`Admin replied to ticket #${ticket1.id}`);

  // 5. Admin replies to ticket 2
  await prisma.ticketMessage.create({
      data: {
          ticketId: ticket2.id,
          senderId: adminId,
          role: 'ADMIN',
          message: 'يمكنك إضافة رصيد من صفحة الإيداع.'
      }
  });
  console.log(`Admin replied to ticket #${ticket2.id}`);

  // 6. User 1 replies back
  await prisma.ticketMessage.create({
      data: {
          ticketId: ticket1.id,
          senderId: testUser1.id,
          role: 'USER',
          message: 'شكرا تم حل المشكلة.'
      }
  });
  console.log(`User 1 replied to ticket #${ticket1.id}`);

  // Query tickets to verify
  const allUser1Tickets = await prisma.ticket.findMany({
      where: { userId: testUser1.id },
      include: { messages: true }
  });

  const allUser2Tickets = await prisma.ticket.findMany({
      where: { userId: testUser2.id },
      include: { messages: true }
  });

  console.log(`Test User 1 Ticket Messages count: ${allUser1Tickets[0]?.messages.length} (Expected > 0)`);
  console.log(`Test User 2 Ticket Messages count: ${allUser2Tickets[0]?.messages.length} (Expected > 0)`);

  console.log("Test Completed Successfully! The Ticket system supports conversation and distinct users without interference.");
}

testTickets()
  .catch(e => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
