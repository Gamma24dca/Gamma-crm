import { Config } from '../config';
import { User } from './users-service';

type Subtask = {
  content: string;
  done: boolean;
};

export type StudioTaskTypes = {
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
};

export async function getAllStudioTasks() {
  try {
    const response = await fetch('/api/studiotasks', {
      method: 'GET',
      credentials: 'include',
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
      throw new Error('Get users', error.message);
    }
    console.error(error.message);
    return null;
  }
}
