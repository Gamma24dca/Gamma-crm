import { Config } from '../config';

export type TeamMemberType = {
  workerID: string;
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
