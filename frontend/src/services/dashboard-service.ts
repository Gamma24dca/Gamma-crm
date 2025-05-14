import { Config } from '../config';

export type ClientsMonthSummaryTypes = {
  _id: string;
  Suma_godzin: number;
};

type DayType = {
  day: number;
  totalHours: number;
  isWeekend: boolean;
};

export type UsersMonthSummaryTypes = {
  _id: string;
  name: string;
  img: string;
  days: DayType[];
};

export async function getClientsMonthSummary(month: number, year: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/dashboard/reckoning/client-per-hour/${month}/${year}`,
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

export async function getUsersMonthSummary(month: number, year: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/dashboard/reckoning/user-per-day-hours/${month}/${year}`,
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
