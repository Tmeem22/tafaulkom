async function testSmmApi() {
  const SMM_API_URL = "https://smmcpan.com/api/v2";
  const SMM_API_KEY = "1c0d36b4dcb564e139ba7189c6195fb2";

  console.log("Testing SMM API connection...");

  try {
    const params = new URLSearchParams();
    params.append('key', SMM_API_KEY);
    params.append('action', 'balance');

    const response = await fetch(SMM_API_URL, {
      method: "POST",
      body: params
    });

    const data = await response.json();
    console.log("Response Received:", JSON.stringify(data, null, 2));

    if (data.balance !== undefined) {
      console.log("SUCCESS_TOKEN_API_OK");
      console.log("Current Balance:", data.balance, data.currency);
    } else {
      console.log("ERROR_TOKEN_API_FAIL", data.error || "Unknown Error");
    }
  } catch (error) {
    console.error("CONNECTION_FAILED_TOKEN", error.message);
  }
}

testSmmApi();
