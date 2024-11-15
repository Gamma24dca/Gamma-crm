import { Config } from '../config';
import { User } from './users-service';

type Subtask = {
  content: string;
  done: boolean;
};

export type StudioTaskTypes = {
  _id?: string;
  searchID: number;
  title: string;
  client: string;
  clientPerson: string;
  status: string;
  author: User;
  TaskType: string;
  participants: User[];
  description: string;
  subtasks: Subtask[];
  deadline: string;
  startDate: string;
};

export async function getAllStudioTasks() {
  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/studiotasks',
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}
