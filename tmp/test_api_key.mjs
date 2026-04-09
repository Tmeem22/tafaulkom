const API_URL = 'https://smmcpan.com/api/v2';
const API_KEY = 'e06697e47ff1923d9533ebb0d7b50692';

async function testBalance() {
    console.log("Testing Balance (GET)...");
    const resGet = await fetch(`${API_URL}?key=${API_KEY}&action=balance`);
    const dataGet = await resGet.json();
    console.log("GET Response:", dataGet);

    console.log("\nTesting Balance (POST Body)...");
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'balance');
    const resPost = await fetch(API_URL, {
        method: 'POST',
        body: params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
    const dataPost = await resPost.json();
    console.log("POST Response:", dataPost);
}

testBalance();
