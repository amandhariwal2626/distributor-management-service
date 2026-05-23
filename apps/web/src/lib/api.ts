const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export async function fetchUsers(): Promise<User[]> {
  try {
    const res = await fetch(`${API_URL}/api/users`, {
      cache: 'no-store',
    });
    if (!res.ok) {
      throw new Error('Failed to fetch users');
    }
    return res.json();
  } catch (error) {
    console.error('fetchUsers error:', error);
    return [];
  }
}

export async function createUser(email: string, name?: string): Promise<User> {
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, name }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || 'Failed to create user');
  }
  return res.json();
}
