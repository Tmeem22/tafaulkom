require('dotenv').config();
const { createProviderOrder, getProviderBalance } = require('./src/lib/smm-api');

async function testConnection() {
  console.log('--- بدأت عملية فحص الربط ---');
  
  // 1. Check Balance first (safest way to test API Key)
  const balanceData = await getProviderBalance();
  console.log('Provider Balance Response:', balanceData);

  if (balanceData.error) {
    console.error('❌ خطأ في الاتصال بالمزود: تأكد من صحة الـ API Key في ملف .env');
    return;
  }

  // 2. Try a dummy order with a real service ID (assuming ID 1 exists or similar)
  // We will use a very high ID to test if it reaches the server
  const testOrder = await createProviderOrder(1, 'https://test-link.com', 10);
  console.log('Test Order Response:', testOrder);
  
  if (testOrder.order) {
    console.log('✅ نجاح باهر! الطلب وصل للمزود وحصل على رقم:', testOrder.order);
  } else {
    console.log('ℹ️ تم الاتصال بالمزود بنجاح، والرد كان:', testOrder.error || 'رسالة أخرى');
  }
}

testConnection();
