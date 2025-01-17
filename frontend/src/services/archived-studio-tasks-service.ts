import { Config } from '../config';

export async function getAllArchivedStudioTasks() {
  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/archivedstudiotasks',
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

export async function getArchivedStudioTask(id: string) {
  try {
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/archivedstudiotasks/${id}`,
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
      throw new Error('Get user', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function archiveStudioTask(id: string) {
  try {
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/move-studiotask/${id}`,
      {
        method: 'POST',
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
      throw new Error('Archive task', error.mesage);
    }
    console.error(error.mesage);
    return null;
  }
}

export async function unarchiveStudioTask({ id, index }) {
  const formData = {
    index,
  };
  try {
    const response = await fetch(
      `https://gamma-crm.onrender.com/api/unarchive-sudiotask/${id}`,
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
      throw new Error('Archive task', error.mesage);
    }
    console.error(error.mesage);
    return null;
  }
}
