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

type MonthType = {
  month: number;
  totalHours: number;
};

export type UsersMonthSummaryTypes = {
  _id: string;
  name: string;
  img: string;
  days?: DayType[];
  months?: MonthType[];
};

export type MonthPerDaySummary = {
  totalHours: number;
  day: number;
};

export async function getClientsMonthSummary(
  month: number,
  year: number,
  yearlySummary: boolean
) {
  const fetchUrl = yearlySummary
    ? `/api/dashboard/reckoning/client-per-hour-yearly/${year}`
    : `/api/dashboard/reckoning/client-per-hour/${month}/${year}`;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${fetchUrl}`, {
      method: 'GET',
      credentials: 'include',
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
      throw new Error('Get clients month summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getUsersMonthSummary(
  month: number,
  year: number,
  yearlySummary: boolean
) {
  const fetchUrl = yearlySummary
    ? `/api/dashboard/reckoning/user-per-day-hours-yearly/${year}`
    : `/api/dashboard/reckoning/user-per-day-hours/${month}/${year}`;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${fetchUrl}`, {
      method: 'GET',
      credentials: 'include',
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
      throw new Error('Get users month summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getTasksTypeSummary(yearlySummary: boolean) {
  const fetchUrl = yearlySummary
    ? `/api/dashboard/archivedStudioTasks/tasks-per-type`
    : `/api/dashboard/studioTasks/tasks-per-type`;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${fetchUrl}`, {
      method: 'GET',
      credentials: 'include',
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
      throw new Error('Get tasks type summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}

export async function getMonthDaysSummary(
  month: number,
  year: number,
  yearlySummary: boolean
) {
  const fetchUrl = yearlySummary
    ? `/api/dashboard/reckoning/month-hours-per-year/${year}`
    : `/api/dashboard/reckoning/month-hours-per-day/${month}/${year}`;
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${fetchUrl}`, {
      method: 'GET',
      credentials: 'include',
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
      throw new Error('Get month summary', error.message);
    }
    console.error(error.message);
    return null;
  }
}
