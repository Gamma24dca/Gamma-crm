import { Config } from '../config';

export type User = {
  _id: string;
  email: string;
  img: string;
  job: string;
  lastname: string;
  name: string;
  password: string;
  phone: number;
};

export async function getAllUsers(): Promise<User[] | null> {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('User by ID', error.message);
    }
    return null;
  }
}

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('User by ID', error.message);
    }
    return null;
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await fetch('/api/users/me');
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Current user', error.message);
    }
    return null;
  }
}

export async function deleteUser(id: string) {
  try {
    const response = await fetch(`/api/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Current user', error.message);
    }
    return null;
  }
}
