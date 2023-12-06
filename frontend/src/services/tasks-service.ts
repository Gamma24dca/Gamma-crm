import { Config } from '../config';

export type Task = {
  _id: string;
  title: string;
  author: string;
  client: string;
  path: string;
  description: string;
  image: File | Blob;
  date: string | Blob;
  priority: string | Blob;
  status: string;
  deadline: string;
  participants: string | Blob;
  subtasks: string | Blob;
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
  image,
  date,
  priority,
  status,
  deadline,
  participants,
  subtasks,
}: Task): Promise<Task | null> {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('author', author);
    formData.append('client', client);
    formData.append('path', path);
    formData.append('description', description);
    formData.append('image', image);
    formData.append('date', date);
    formData.append('priority', priority);
    formData.append('status', status);
    formData.append('deadline', deadline);
    formData.append('participants', participants);
    formData.append('subtasks', subtasks);

    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: formData,
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
