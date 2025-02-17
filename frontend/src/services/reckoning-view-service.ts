import { Config } from '../config';
import { User } from './users-service';

export type ReckoningTaskTypes = {
  _id?: string;
  searchID: number;
  clientPerson: string;
  client: string;
  title: string;
  description: string;
  author: Omit<User, 'password'>;
  taskType: string;
  printWhat: string;
  printWhere: string;
  participants: Omit<User, 'password'>[];
  deadline: string;
  startDate: Date;
};

export async function getAllReckoningTasks() {
  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/reckoningtasks',
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

export async function getMyReckoningTasks(userId, year, month) {
  try {
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/reckoningtasks/${year}/${month}/${userId}`,
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

export async function addReckoningTask({
  searchID,
  client,
  clientPerson,
  title,
  description,
  author,
  taskType,
  printWhat,
  printWhere,
  participants,
  deadline,
  startDate,
}: ReckoningTaskTypes) {
  const formData = {
    searchID,
    client,
    clientPerson,
    title,
    description,
    author,
    taskType,
    printWhat,
    printWhere,
    participants,
    deadline,
    startDate,
  };

  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/reckoningtasks',
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
