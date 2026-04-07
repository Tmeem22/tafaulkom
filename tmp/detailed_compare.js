const https = require('https');

const oldKey = 'cf8f53cfd066917a0021a79e3387f10e';
const oldUrl = 'https://smmcpan.com/api/v2';

const newKey = '337e094a6890e08bbf4af3e1d0bc119b';
const newUrl = 'https://hevoteam.com/api/v2';

function fetchApi(url, key, action) {
    return new Promise((resolve) => {
        https.get(`${url}?key=${key}&action=${action}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', () => resolve([]));
    });
}

async function detailedCompare() {
    const oldServices = await fetchApi(oldUrl, oldKey, 'services');
    const newServices = await fetchApi(newUrl, newKey, 'services');

    const searchTerms = ['متابعين', 'لايكات', 'مشاهدات'];
    
    console.log('--- DETAILED PRICE COMPARISON ---');
    searchTerms.forEach(term => {
        console.log(`\n[Category: ${term}]`);
        const oldMatch = oldServices.find(s => s.name.includes(term));
        const newMatch = newServices.find(s => s.name.includes(term));
        
        if (oldMatch) console.log(` - Old (${oldMatch.name}): $${oldMatch.rate}`);
        if (newMatch) console.log(` - New (${newMatch.name}): $${newMatch.rate}`);
    });
    
    // Check if new provider has any services that are cheaper
    console.log('\n--- FINDING CHEAPER SERVICES IN NEW PROVIDER ---');
    let cheaperCount = 0;
    newServices.slice(0, 100).forEach(ns => {
        const os = oldServices.find(o => o.name.toLowerCase() === ns.name.toLowerCase());
        if (os && parseFloat(ns.rate) < parseFloat(os.rate)) {
            console.log(` * HEVOTEAM CHEAPER: ${ns.name} ($${ns.rate} < $${os.rate})`);
            cheaperCount++;
        }
    });
    console.log(`Found ${cheaperCount} cheaper services in first 100 on Hevoteam.`);
}

detailedCompare();
