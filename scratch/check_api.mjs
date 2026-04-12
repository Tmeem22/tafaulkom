import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.SMM_API_URL || 'https://smmcpan.com/api/v2';
const API_KEY = (process.env.SMM_API_KEY || '').replace(/['"]/g, '').trim();

async function check() {
    console.log(`Checking API Key: ${API_KEY}`);
    try {
        const res = await fetch(`${API_URL}?key=${API_KEY}&action=balance`);
        const data = await res.json();
        console.log('Response:', data);
    } catch (e) {
        console.error('Error:', e.message);
    }
}

check();
