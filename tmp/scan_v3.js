const https = require('https');

const newKey = '337e094a6890e08bbf4af3e1d0bc119b';
const endpoints = [
    'https://bulksmmserver.com/api/v2',
    'https://smmbaba.com/api/v2',
    'https://justanotherpanel.com/api/v2',
    'https://smmflare.com/api/v2',
    'https://securesmm.com/api/v2',
    'https://smmking.com/api/v2',
    'https://smmheart.com/api/v2',
    'https://smmrush.com/api/v2',
    'https://smmlite.com/api/v2',
    'https://smmtop.com/api/v2',
    'https://smmfollows.com/api/v2',
    'https://smmworldpanel.com/api/v2',
    'https://smm-main.com/api/v2'
];

async function check(url) {
    return new Promise((resolve) => {
        const req = https.get(`${url}?key=${newKey}&action=balance`, (res) => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try {
                    const j = JSON.parse(d);
                    if (j.balance !== undefined) resolve({ url, balance: j.balance, currency: j.currency });
                    else resolve(null);
                } catch (e) {
                    resolve(null);
                }
            });
        });
        req.on('error', () => resolve(null));
        req.setTimeout(3000, () => { req.destroy(); resolve(null); });
    });
}

(async () => {
    for (const url of endpoints) {
        process.stdout.write(`Checking ${url}... `);
        const res = await check(url);
        if (res) {
            console.log(`\nFOUND: ${url} | Balance: ${res.balance} ${res.currency}`);
            process.exit(0);
        }
        console.log('No');
    }
    console.log('No provider found in common list.');
})();
