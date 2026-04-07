const https = require('https');

const newKey = '337e094a6890e08bbf4af3e1d0bc119b';
const commonUrls = [
    'https://smmcpan.com/api/v2',
    'https://smmbaba.com/api/v2',
    'https://bulksmmserver.com/api/v2',
    'https://jap.com/api/v2',
    'https://smmflare.com/api/v2',
    'https://bestsmmpanel.com/api/v2',
    'https://smmking.com/api/v2',
    'https://securesmm.com/api/v2'
];

function fetchApi(url, key, action) {
    return new Promise((resolve, reject) => {
        https.get(`${url}?key=${key}&action=${action}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('timeout', () => resolve({ error: 'Timeout' }))
        .on('error', (err) => resolve({ error: err.message }));
    });
}

(async () => {
    for (const url of commonUrls) {
        console.log(`Checking ${url}...`);
        const balance = await fetchApi(url, newKey, 'balance');
        console.log(`Response:`, balance);
        if (balance && balance.balance !== undefined) {
            console.log(`!!! FOUND VALID PROVIDER: ${url}`);
            break;
        }
    }
})();
