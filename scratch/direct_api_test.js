require('dotenv').config();

const API_URL = process.env.SMM_API_URL || 'https://smmcpan.com/api/v2';
const API_KEY = (process.env.SMM_API_KEY || '').replace(/['"]/g, '').trim();

async function testProvider() {
  console.log('--- فحص الاتصال الحقيقي بمزود SMMCPan ---');
  console.log('URL:', API_URL);
  console.log('API Key (first 5):', API_KEY.substring(0, 5) + '...');

  try {
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'balance');

    const response = await fetch(API_URL, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });

    const data = await response.json();
    console.log('النتيجة من المزود:', data);

    if (data.balance) {
      console.log('✅ الربط سليم 100%! رصيدك عند المزود هو:', data.balance, data.currency);
    } else if (data.error) {
       console.log('⚠️ تم الاتصال بالمزود ولكن هناك خطأ:', data.error);
    } else {
       console.log('❓ رد غير معروف من المزود:', data);
    }
  } catch (err) {
    console.error('❌ فشل الاتصال بالسيرفر نهائياً:', err.message);
  }
}

testProvider();
