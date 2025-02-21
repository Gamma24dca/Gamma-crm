import { Config } from '../config';
import { User } from './users-service';

type DaysArray = {
  hourNum: number;
  isWeekend: boolean;
};

export type ReckoningTaskTypes = {
  _id?: string;
  searchID: number;
  client: string;
  clientPerson: string;
  title: string;
  description: string;
  author: Omit<User, 'password'>;
  printWhat: string;
  printWhere: string;
  participants: [{ _id: string; name: string; hours: DaysArray[] }];
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

export async function updateReckoningTask({ taskId, value }) {
  try {
    const formValue = {
      taskId,
      ...value,
    };
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/reckoningtasks/${taskId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValue),
      }
    );

    if (response.ok) {
      return await response.json();
    }
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Update subtask', error.message);
    }
    return null;
  }
}

export async function updateDay({ taskId, userId, dayId, value }) {
  try {
    const subtaskBody = {
      ...value,
    };
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/reckoningtasks/${taskId}/dayUpdate/${userId}/${dayId}`,
      {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subtaskBody),
      }
    );
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    if (Config.isDev) {
      throw new Error('Update subtask', error.message);
    }
    return null;
  }
}
