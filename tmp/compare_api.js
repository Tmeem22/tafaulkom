const https = require('https');

const oldKey = 'cf8f53cfd066917a0021a79e3387f10e';
const newKey = '337e094a6890e08bbf4af3e1d0bc119b';
const apiUrl = 'https://smmcpan.com/api/v2';

function fetchApi(key, action) {
    return new Promise((resolve, reject) => {
        https.get(`${apiUrl}?key=${key}&action=${action}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(data);
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function checkApiKey(key, name) {
    console.log(`Checking key: ${name} (${key})`);
    try {
        const balanceData = await fetchApi(key, 'balance');
        console.log(`${name} Balance:`, balanceData);
        
        const servicesData = await fetchApi(key, 'services');
        console.log(`${name} Services Count:`, Array.isArray(servicesData) ? servicesData.length : (servicesData.error || 'Error'));
    } catch (error) {
        console.log(`${name} Error:`, error.message);
    }
    console.log('---');
}

(async () => {
    await checkApiKey(oldKey, 'Old Key');
    await checkApiKey(newKey, 'New Key');
})();
