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

export type MonthPerDaySummary = {
  totalHours: number;
  day: number;
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
      throw new Error('Get clients month summary', error.message);
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
      throw new Error('Get users month summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getTasksTypeSummary() {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/dashboard/studioTasks/tasks-per-type`,
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
      throw new Error('Get tasks type summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getMonthDaysSummary(month: number, year: number) {
  try {
    const response = await fetch(
      `${
        import.meta.env.VITE_API_URL
      }/api/dashboard/reckoning/month-hours-per-day/${month}/${year}`,
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
      throw new Error('Get month summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}
