import { Config } from '../config';

export type TeamMemberType = {
  workerID: string;
  name: string;
  img: string;
};

export type CompaniesType = {
  _id?: string;
  name: string;
  phone: string;
  mail: string;
  website: string;
  activeTasks: number;
  teamMembers: TeamMemberType[];
};

export async function getAllCompanies(): Promise<CompaniesType[] | null> {
  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/companies',
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
      `https://gamma-crm.onrender.com/api/companies/${id}`,
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

export async function addCompany({ name, phone, mail, website, teamMembers }) {
  const formData = {
    name,
    phone,
    mail,
    website,
    teamMembers,
  };

  try {
    const response = await fetch(
      'https://gamma-crm.onrender.com/api/companies',
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
      `https://gamma-crm.onrender.com/api/companies/${id}`,
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
    throw new Error();
  } catch (error) {
    console.error(error);
    if (Config.isDev) {
      throw new Error('Delete company', error.message);
    }
    return null;
  }
}

// export async function UpdateCompany(params: type) {}
