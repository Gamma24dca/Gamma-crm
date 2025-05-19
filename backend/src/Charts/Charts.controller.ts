import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';
import { StudioTaskModel } from '../StudioTask/StudioTask.model';

export const ChartsController = {
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
};
