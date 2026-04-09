async function testProviderOrder() {
  const API_URL = "https://smmcpan.com/api/v2";
  const API_KEY = "1c0d36b4dcb564e139ba7189c6195fb2"; // From .env

  console.log(`Testing provider order API with key: ${API_KEY}`);
  
  const params = new URLSearchParams();
  params.append('key', API_KEY);
  params.append('action', 'add');
  params.append('service', '21595'); 
  params.append('link', 'https://snapchat.com/add/username');
  params.append('quantity', '1');

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const data = await res.json();
    console.log("Response:", data);
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

testProviderOrder();
