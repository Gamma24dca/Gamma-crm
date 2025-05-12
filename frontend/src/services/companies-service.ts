import { Config } from '../config';
import { User } from './users-service';

type ClientPerson = {
  id?: string;
  value: string;
  label: string;
};

export type CompaniesType = {
  _id?: string;
  name: string;
  phone: string;
  mail: string;
  website: string;
  clientPerson: ClientPerson[];
  activeTasks?: number;
  teamMembers: User[];
};

export async function getAllCompanies(): Promise<CompaniesType[] | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/companies`,
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
      throw new Error('Get Companies', error.message);
    }
    return null;
  }
}

export async function getCurrentCompany(id): Promise<CompaniesType | null> {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/companies/${id}`,
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
      throw new Error('Get Company', error.message);
    }
    return null;
  }
}

export async function addCompany({
  name,
  phone,
  mail,
  website,
  clientPerson,
  teamMembers,
}) {
  const formData = {
    name,
    phone,
    mail,
    website,
    clientPerson,
    teamMembers,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/companies`,
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
      throw new Error('Add company', error.message);
    }
    return null;
  }
}

export async function deleteCompany(id) {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/companies/${id}`,
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
      throw new Error('Delete company', error.message);
    }
    return null;
  }
}

export async function UpdateCompany({ id, companyData }) {
  const formData = {
    id,
    ...companyData,
  };

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/companies/${id}`,
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

export async function SearchCompany(query) {
  try {
    if (!query) {
      return [];
    }
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/companies/search/${query}`,
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
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Update company', error.message);
    }
  }
}
export async function getAssignedReckoTasks({ company, monthIndex }) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/companies/reckoning/${company}/${monthIndex}`,
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
      throw new Error('Get Companies', error.message);
    }
    return null;
  }
}
