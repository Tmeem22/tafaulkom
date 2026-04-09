const API_URL = "https://smmcpan.com/api/v2";
const API_KEY = "e06697e47ff1923d9533ebb0d7b50692";

async function test() {
  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}&action=services`);
    const data = await res.json();
    console.log("Response:", JSON.stringify(data).substring(0, 500));
  } catch (e) {
    console.error("Error:", e);
  }
}

test();
