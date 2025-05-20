import { ArchivedStudioTaskModel } from '../ArchivedStudioTask/ArchivedStudioTask.model';
import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';
import { StudioTaskModel } from '../StudioTask/StudioTask.model';

export const ChartsController = {
  ///////CLIENTS PER HOUR/////////////
  async getClientsPerHour(month, year) {
    const companiesMonthSummary = await ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$monthDate' },
          year: { $year: '$monthDate' },
        },
      },
      {
        $match: {
          ...(month ? { month: parseInt(month) } : {}),
          ...(year ? { year: parseInt(year) } : {}),
        },
      },
      {
        $group: {
          _id: '$client',
          Suma_godzin: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { Suma_godzin: -1 },
      },
    ]);

    return await companiesMonthSummary;
  },

  async getClientsPerHourYearly(year) {
    const companiesMonthSummary = await ReckoningTaskModel.aggregate([
      {
        $unwind: '$participants',
      },
      {
        $unwind: '$participants.months',
      },
      {
        $unwind: '$participants.months.hours',
      },
      {
        $addFields: {
          monthDate: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },
      {
        $addFields: {
          month: { $month: '$monthDate' },
          year: { $year: '$monthDate' },
        },
      },
      {
        $match: {
          ...(year ? { year: parseInt(year) } : {}),
        },
      },
      {
        $group: {
          _id: '$client',
          Suma_godzin: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { Suma_godzin: -1 },
      },
    ]);

    return await companiesMonthSummary;
  },

  ///////USERS PER DAY/////////////

  async getUsersMonthSummary(month, year) {
    const usersMonthSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userId: '$participants._id',
          day: '$participants.months.hours.dayIndex',
          isWeekend: '$participants.months.hours.isWeekend',
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },

      {
        $match: {
          ...(month ? { month: parseInt(month) } : {}),
          ...(year ? { year: parseInt(year) } : {}),
        },
      },

      {
        $group: {
          _id: {
            userId: '$userId',
            name: '$participants.name',
            img: '$participants.img',
            day: '$day',
            isWeekend: '$isWeekend',
          },
          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $group: {
          _id: '$_id.userId',
          name: { $first: '$_id.name' },
          img: { $first: '$_id.img' },
          days: {
            $push: {
              isWeekend: '$_id.isWeekend',
              day: '$_id.day',
              totalHours: '$totalHours',
            },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      { $unwind: '$days' },
      { $sort: { _id: 1, 'days.day': 1 } },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          img: { $first: '$img' },
          days: { $push: '$days' },
        },
      },
    ]);

    return await usersMonthSummary;
  },

  async getUsersMonthSummaryYearly(year) {
    const rawSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          userId: '$participants._id',
          month: { $month: '$date' },
          year: { $year: '$date' },
        },
      },

      {
        $match: {
          ...(year ? { year: parseInt(year) } : {}),
        },
      },

      {
        $group: {
          _id: {
            userId: '$userId',
            name: '$participants.name',
            img: '$participants.img',
            month: '$month',
          },
          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },

      {
        $group: {
          _id: '$_id.userId',
          name: { $first: '$_id.name' },
          img: { $first: '$_id.img' },
          months: {
            $push: {
              month: '$_id.month',
              totalHours: '$totalHours',
            },
          },
        },
      },

      { $sort: { _id: 1 } },
    ]);

    // Uzupełnianie brakujących miesięcy 1–12
    const filledSummary = rawSummary.map((user) => {
      const fullMonths = Array.from({ length: 12 }, (_, i) => {
        const found = user.months.find((m) => m.month === i + 1);
        return {
          month: i + 1,
          totalHours: found ? found.totalHours : 0,
        };
      });

      return {
        _id: user._id,
        name: user.name,
        img: user.img,
        months: fullMonths,
      };
    });

    return filledSummary;
  },
  ///////HOURS PER DAY/////////////

  async getHoursPerDay(month, year) {
    const monthHoursSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          day: '$participants.months.hours.dayIndex',
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: { $toDate: '$participants.months.createdAt' } },
          year: { $year: { $toDate: '$participants.months.createdAt' } },
        },
      },

      {
        $match: {
          ...(month ? { month: parseInt(month) } : {}),
          ...(year ? { year: parseInt(year) } : {}),
        },
      },

      {
        $group: {
          _id: {
            day: '$day',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },

      {
        $project: {
          _id: 0,
          day: '$_id.day',
          totalHours: 1,
        },
      },

      {
        $sort: { day: 1 },
      },
    ]);

    return await monthHoursSummary;
  },

  async getHoursPerMonthYearly(year) {
    const monthHoursSummary = await ReckoningTaskModel.aggregate([
      { $unwind: '$participants' },
      { $unwind: '$participants.months' },
      { $unwind: '$participants.months.hours' },

      {
        $addFields: {
          date: {
            $toDate: '$participants.months.createdAt',
          },
        },
      },

      {
        $addFields: {
          day: '$participants.months.hours.dayIndex',
          hourNum: '$participants.months.hours.hourNum',
          month: { $month: { $toDate: '$participants.months.createdAt' } },
          year: { $year: { $toDate: '$participants.months.createdAt' } },
        },
      },

      {
        $match: {
          ...(year ? { year: parseInt(year) } : {}),
        },
      },

      {
        $group: {
          _id: {
            month: '$month',
          },
          totalHours: { $sum: '$hourNum' },
        },
      },

      {
        $project: {
          _id: 0,
          month: '$_id.month',
          totalHours: 1,
        },
      },

      {
        $sort: { month: 1 },
      },
    ]);

    return await monthHoursSummary;
  },
  ///////TASK TYPES/////////////

  async getStudioTasksTypesSummary() {
    const tasksByType = await StudioTaskModel.aggregate([
      {
        $group: {
          _id: '$taskType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          taskType: '$_id',
          count: 1,
        },
      },
    ]);

    return await tasksByType;
  },

  async getArchivedStudioTasksTypesSummary() {
    const tasksByType = await ArchivedStudioTaskModel.aggregate([
      {
        $group: {
          _id: '$taskType',
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          taskType: '$_id',
          count: 1,
        },
      },
    ]);

    return await tasksByType;
  },
};
