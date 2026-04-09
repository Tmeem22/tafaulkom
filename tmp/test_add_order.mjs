const API_URL = 'https://smmcpan.com/api/v2';
const API_KEY = 'e06697e47ff1923d9533ebb0d7b50692';

async function testAddOrder() {
    console.log("Testing Add Order (POST Body)...");
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'add');
    params.append('service', '1'); // Just a dummy service ID
    params.append('link', 'https://www.google.com');
    params.append('quantity', '10');

    const resPost = await fetch(API_URL, {
        method: 'POST',
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const dataPost = await resPost.json();
    console.log("Add Order Response:", dataPost);
}

testAddOrder();
