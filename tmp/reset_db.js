const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetUsers() {
  try {
    console.log('جاري مسح جميع البيانات المرتبطة بالحسابات...');
    
    // Deleting in order to avoid foreign key constraints
    await prisma.order.deleteMany({});
    await prisma.deposit.deleteMany({});
    await prisma.ticket.deleteMany({});
    
    const deleted = await prisma.user.deleteMany({});
    
    console.log(`تم مسح جميع الحسابات بنجاح. عدد الحسابات المحذوفة: ${deleted.count}`);
  } catch (error) {
    console.error('حدث خطأ أثناء المسح:', error);
  } finally {
    await prisma.$disconnect();
  }
}

resetUsers();
