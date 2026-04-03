import fs from 'fs';
import path from 'path';

// Define the shape of our mock database
export interface Deposit {
  id: string;
  method: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  receiptImage: string;
  date: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
  balance: number;
  createdAt: string;
}

export interface Order {
  id: number;
  userId: string;
  providerOrderId: number | string;
  service: string;
  link: string;
  quantity: number;
  charge: number;
  startCount: number;
  remains: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  date: string;
}

export interface DbData {
  deposits: Deposit[];
  users: User[];
  orders: Order[];
}

const getDbPath = () => path.join(process.cwd(), 'src', 'data', 'db.json');

export function readDb(): DbData {
  try {
    const data = fs.readFileSync(getDbPath(), 'utf-8');
    const parsed = JSON.parse(data);
    return {
      deposits: parsed.deposits || [],
      users: parsed.users || [],
      orders: parsed.orders || [],
    };
  } catch (error) {
    // If file doesn't exist or is invalid, return empty structure
    return { deposits: [], users: [], orders: [] };
  }
}

export function writeDb(data: DbData) {
  try {
    fs.writeFileSync(getDbPath(), JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Failed to write to local DB', error);
  }
}
