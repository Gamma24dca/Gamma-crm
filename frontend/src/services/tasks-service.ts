import { Config } from '../config';

export type Task = {
  // _id?: string;
  // title: string;
  // author?: string;
  // client: string;
  // path: string;
  // description: string;
  image: File;
  // date?: string | Blob | Date;
  // priority: string | Blob | number;
  // status: string;
  // deadline: string;
  // participants?: string | Blob | object[];
  // subtasks?: string | Blob | object[];
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

// export async function addTask(
//   image // title,
//   // author,
//   // client,
//   // path,
//   // description,
//   // priority,
//   // status,
//   // deadline,
//   : Task
// ): Promise<Task | null> {
//   try {
//     const formData = new FormData();
//     // formData.append('title', title);
//     // formData.append('author', author);
//     // formData.append('client', client);
//     // formData.append('path', path);
//     // formData.append('description', description);
//     // @ts-ignore
//     formData.append('image', image);
//     // formData.append('priority', priority.toString());
//     // formData.append('status', status);
//     // formData.append('deadline', deadline);

//     const response = await fetch('/api/tasks', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: formData,
//     });

//     if (response.ok) {
//       return await response.json();
//     }
//     throw new Error(`${response.status} ${response.statusText}`);
//   } catch (error) {
//     if (Config.isDev) {
//       console.error('Add task', error.message);
//     }
//     return null;
//   }
// }

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
