import { Config } from '../config';

export type Task = {
  _id: string;
  title: string;
  author: string;
  client: string;
  path: string;
  description: string;
  date: Date;
  priority: number;
  status: string;
  deadline: string;
  participants: object[];
  subtasks: object[];
};

export async function getAllTasks(): Promise<Task[] | null> {
  try {
    const response = await fetch('/api/tasks', {
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
      throw new Error('Get users', error.message);
    }
    return null;
  }
}

export async function getTaskById(id: string): Promise<Task | null> {
  try {
    const response = await fetch(`/api/tasks/${id}`, {
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

export async function addTask({
  title,
  author,
  client,
  path,
  description,
  date,
  priority,
  status,
  deadline,
  participants,
  subtasks,
}: Task): Promise<Task | null> {
  const taskInfo = {
    title,
    author,
    client,
    path,
    description,
    date,
    priority,
    status,
    deadline,
    participants,
    subtasks,
  };
  try {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskInfo),
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      console.error('Add task', error.message);
    }
    return null;
  }
}
