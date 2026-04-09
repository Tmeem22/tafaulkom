async function testProvider() {
  const API_URL = "https://smmcpan.com/api/v2";
  const API_KEY = "1c0d36b4dcb564e139ba7189c6195fb2"; // From .env

  console.log(`Testing provider API with key: ${API_KEY}`);
  
  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}&action=services`);
    const data = await res.json();
    
    if (data.error) {
      console.log("ERROR DETECTED:", data.error);
    } else {
      console.log("SUCCESS! Found", Array.isArray(data) ? data.length : 0, "services.");
    }
  } catch (e) {
    console.error("Fetch Error:", e);
  }
}

testProvider();
