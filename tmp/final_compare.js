const https = require('https');

const oldKey = 'cf8f53cfd066917a0021a79e3387f10e';
const oldUrl = 'https://smmcpan.com/api/v2';

const newKey = '337e094a6890e08bbf4af3e1d0bc119b';
const newUrl = 'https://hevoteam.com/api/v2';

function fetchApi(url, key, action) {
    return new Promise((resolve) => {
        const fullUrl = `${url}?key=${key}&action=${action}`;
        https.get(fullUrl, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve({ error: 'Parse Error', raw: data.substring(0, 500) });
                }
            });
        }).on('error', (err) => resolve({ error: err.message }));
    });
}

async function compare() {
    console.log('--- COMPARING SMM PROVIDERS ---');
    
    // Check old provider
    console.log(`Checking Old Provider (${oldUrl})...`);
    const oldBalance = await fetchApi(oldUrl, oldKey, 'balance');
    const oldServices = await fetchApi(oldUrl, oldKey, 'services');
    
    // Check new provider
    console.log(`Checking New Provider (${newUrl})...`);
    const newBalance = await fetchApi(newUrl, newKey, 'balance');
    const newServices = await fetchApi(newUrl, newKey, 'services');
    
    console.log('\n--- RESULTS ---');
    console.log('Old Provider Balance:', oldBalance);
    console.log('Old Provider Services Count:', Array.isArray(oldServices) ? oldServices.length : (oldServices.error || 'Error'));
    
    console.log('\nNew Provider Balance:', newBalance);
    console.log('New Provider Services Count:', Array.isArray(newServices) ? newServices.length : (newServices.error || 'Error'));

    if (Array.isArray(oldServices) && Array.isArray(newServices)) {
        console.log('\n--- TOP 5 SERVICES PRICE COMPARISON (Sample) ---');
        // Find some common services by name or similar categories
        const sampleSizes = [0, 10, 50, 100, 500];
        sampleSizes.forEach(idx => {
             if (oldServices[idx]) {
                 console.log(`[Sample ${idx}] ${oldServices[idx].name}`);
                 console.log(`   Old Price: $${oldServices[idx].rate} / 1000`);
             }
        });
        
        console.log('\n--- NEW SERVICES PREVIEW ---');
        newServices.slice(0, 5).forEach(s => {
            console.log(` - ${s.name}: $${s.rate} / 1000`);
        });
    } else {
        console.log('\nCould not compare services due to errors.');
    }
}

compare();
