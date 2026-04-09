const API_URL = "https://smmcpan.com/api/v2";
const API_KEY = "e06697e47ff1923d9533ebb0d7b50692";

async function checkBalance() {
  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}&action=balance`);
    const data = await res.json();
    console.log("Current Balance:", data.balance, data.currency);
  } catch (e) {
    console.error("Error:", e);
  }
}

checkBalance();
