async function getFirstService() {
  const API_URL = "https://smmcpan.com/api/v2";
  const API_KEY = "1c0d36b4dcb564e139ba7189c6195fb2"; // From .env

  try {
    const res = await fetch(`${API_URL}?key=${API_KEY}&action=services`);
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      console.log("First Service ID:", data[0].service);
      console.log("First Service Name:", data[0].name);
      console.log("Min:", data[0].min, "Max:", data[0].max);
    } else {
      console.log("No services found or error:", data);
    }
  } catch (e) {
    console.error(e);
  }
}

getFirstService();
