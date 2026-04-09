import { readFile } from 'fs/promises';

async function testKey() {
    const env = await readFile('.env', 'utf-8');
    const lines = env.split('\n');
    const config = {};
    lines.forEach(line => {
        const parts = line.split('=');
        if (parts.length >= 2) {
            config[parts[0].trim()] = parts.slice(1).join('=').trim().replace(/"/g, '').replace(/'/g, '');
        }
    });

    const API_URL = config.SMM_API_URL || 'https://smmcpan.com/api/v2';
    const API_KEY = config.SMM_API_KEY;

    console.log(`Testing New API Key: ${API_KEY}`);
    
    try {
        const res = await fetch(`${API_URL}?key=${API_KEY}&action=balance`);
        const data = await res.json();
        console.log("Balance Response:", data);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testKey();
