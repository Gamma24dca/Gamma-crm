import { Config } from '../config';
import { User } from './users-service';

type DaysArray = {
  _id?: string;
  hourNum: number;
  isWeekend: boolean;
  dayIndex: number;
};

export type ReckoningTaskTypes = {
  _id?: string;
  searchID: number;
  idOfAssignedStudioTask: string;
  client: string;
  clientPerson: string;
  title: string;
  description: string;
  isSettled?: boolean;
  author: Omit<User, 'password'>;
  printWhat: string;
  printWhere: string;
  participants: [
    {
      _id: string;
      isVisible: boolean;
      name: string;
      img: string;
      months: [
        {
          createdAt: Date;
          hours: DaysArray[];
        },
      ];
    },
  ];
  startDate: Date;
  month: number;
};

export async function getAllReckoningTasks() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reckoningtasks`,
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

export async function getReckoningTask(id: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reckoningtasks/${id}`,
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
      `${
        import.meta.env.VITE_API_URL
      }/api/reckoningtasks/${year}/${month}/${userId}`,
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
  // deadline,
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
    // deadline,
    startDate,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reckoningtasks`,
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

export async function addReckoningTaskFromKanban({
  searchID,
  idOfAssignedStudioTask,
  client,
  clientPerson,
  title,
  description,
  author,
  printWhat,
  printWhere,
  participants,
  // deadline,
  startDate,
  month,
}: ReckoningTaskTypes) {
  const formData = {
    searchID,
    idOfAssignedStudioTask,
    client,
    clientPerson,
    title,
    description,
    author,
    printWhat,
    printWhere,
    participants,
    // deadline,
    startDate,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reckoningtasks/from-kanban/${month}`,
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
      `${import.meta.env.VITE_API_URL}/api/reckoningtasks/${taskId}`,
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

export async function updateDay({ taskId, userId, dayId, value, month }) {
  try {
    const subtaskBody = {
      ...value,
    };
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/reckoningtasks/${taskId}/dayUpdate/${userId}/${dayId}/${month}`,
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

export async function deleteReckoningTask(id, monthId) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/reckoningtasks/${id}/${monthId}`,
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
      throw new Error('Update subtask', error.message);
    }
    return null;
  }
}
