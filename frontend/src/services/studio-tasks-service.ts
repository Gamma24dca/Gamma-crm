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
  status: 'na_później' | 'do_zrobienia' | 'w_trakcie' | 'wysłane';
  index: number;
  author: Omit<User, 'password'>;
  taskType: string;
  participants: Omit<User, 'password'>[];
  description: string;
  subtasks: Subtask[];
  deadline: string;
  startDate: Date;
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

export async function addStudioTask({
  searchID,
  title,
  client,
  clientPerson,
  status,
  index,
  author,
  taskType,
  participants,
  description,
  subtasks,
  deadline,
  startDate,
}: StudioTaskTypes) {
  const formData = {
    searchID,
    title,
    client,
    clientPerson,
    status,
    index,
    author,
    taskType,
    participants,
    description,
    subtasks,
    deadline,
    startDate,
  };
  console.log(formData);
  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/studiotasks',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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

export async function UpdateStudioTask({ id, studioTaskData }) {
  const formData = {
    id,
    ...studioTaskData,
  };

  try {
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/studiotasks/${id}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      }
    );

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Update studio task', error.message);
    }
    return null;
  }
}

export async function deleteTask(id: string) {
  try {
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/studiotasks/${id}`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Delete studio task', error.message);
    }
    return null;
  }
}
