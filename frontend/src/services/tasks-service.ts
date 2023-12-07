import { Config } from '../config';

type TaskTypes = {
  title: string;
  client: string;
  path: string;
  description: string;
  imgFile: File;
  priority: string;
  status: string;
  deadline: string;
};

export async function getAllTasks(): Promise<TaskTypes[] | null> {
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

export async function getTaskById(id: string): Promise<TaskTypes | null> {
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
  client,
  path,
  description,
  imgFile,
  priority,
  status,
  deadline,
}: TaskTypes): Promise<TaskTypes | null> {
  try {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('client', client);
    formData.append('path', path);
    formData.append('description', description);
    formData.append('imgFile', imgFile);
    formData.append('priority', priority);
    formData.append('status', status);
    formData.append('deadline', deadline);

    const response = await fetch('/api/tasks', {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      console.error('PostService. createPost', error.message);
    }
    return null;
  }
}
