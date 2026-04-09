const API_URL = process.env.SMM_API_URL || 'https://smmcpan.com/api/v2';
const API_KEY = process.env.SMM_API_KEY || '';

export interface SMMService {
  service: string;
  name: string;
  type: string;
  category: string;
  rate: string;
  min: string;
  max: string;
  refill: boolean;
  cancel: boolean;
}

export async function getProviderServices(): Promise<SMMService[]> {
  try {
    const url = new URL(API_URL);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('action', 'services');

    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 } // cache for an hour
    });
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch SMM services", error);
    return [];
  }
}

export async function getProviderBalance() {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}&action=balance`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to get balance", error);
    return { balance: 0, currency: 'USD' };
  }
}

export async function createProviderOrder(serviceId: string | number, link: string, quantity: number) {
  try {
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'add');
    params.append('service', String(serviceId));
    params.append('link', link);
    params.append('quantity', String(quantity));

    const response = await fetch(API_URL, { 
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create provider order", error);
    return { error: "Internal provider error" };
  }
}

export async function getProviderOrderStatus(orderId: number | string) {
  try {
    const url = new URL(API_URL);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('action', 'status');
    url.searchParams.append('order', String(orderId));

    const response = await fetch(url.toString());
    const data = await response.json();
    
    // returns something like { charge: "0.278", start_count: "3572", status: "Completed", remains: "0" }
    return data;
  } catch (error) {
    console.error("Failed to retrieve order status", error);
    return null;
  }
}

export async function getProviderOrderStatuses(orderIds: (number | string)[]) {
  if (orderIds.length === 0) return {};
  try {
    const url = new URL(API_URL);
    url.searchParams.append('key', API_KEY);
    url.searchParams.append('action', 'status');
    url.searchParams.append('orders', orderIds.join(','));

    const response = await fetch(url.toString());
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to retrieve multiple order statuses", error);
    return {};
  }
}

export async function createProviderRefill(orderId: number | string) {
  try {
    const params = new URLSearchParams();
    params.append('key', API_KEY);
    params.append('action', 'refill');
    params.append('order', String(orderId));

    const response = await fetch(API_URL, { 
      method: 'POST',
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to create provider refill", error);
    return { error: "Internal provider error" };
  }
}
