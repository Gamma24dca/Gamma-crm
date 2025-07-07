import { Config } from '../config';

export type ClientsType = {
  _id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
};

export async function getAllClients(): Promise<ClientsType[] | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients`,
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
      throw new Error('Get Clients', error.message);
    }
    return null;
  }
}

export async function getCurrentClient(
  id: string
): Promise<ClientsType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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
      throw new Error('Get Client', error.message);
    }
    return null;
  }
}

export async function getClientsByCompany(company: string) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/bycompany/${company}`,
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
      throw new Error('Get Client', error.message);
    }
    return null;
  }
}

export async function addClient({ name, company, phone, email }) {
  const formData = {
    name,
    company,
    phone,
    email,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients`,
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
    console.error(error);
    if (Config.isDev) {
      throw new Error('Add client', error.message);
    }
    return null;
  }
}

export async function addManyClients(clients) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/bulk`,
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clients),
      }
    );

    if (response.ok) {
      return await response.json();
    }

    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Add client', error.message);
    }
    return null;
  }
}

export async function deleteClient(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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
    throw new Error(`${response.status} ${response.statusText}`);
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Delete client', error.message);
    }
    return null;
  }
}

export async function UpdateClient({ id, clientData }) {
  const formData = {
    id,
    ...clientData,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/clients/${id}`,
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
      throw new Error('Update company', error.message);
    }
    return null;
  }
}
