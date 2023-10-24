import { Config } from '../config';

export type User = {
  _id: string;
  email: string;
  name: string;
  lastname: string;
  job: string;
};

export async function getUserById(id: string): Promise<User | null> {
  try {
    const response = await fetch(`/api/users/${id}`);
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    throw new Error(error.message);
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
      throw new Error('UsersService.getCurrentUser', error.message);
    }
    return null;
  }
}
