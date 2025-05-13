import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';

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
          day: '$participants.months.hours.dayIndex',
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
            name: '$participants.name',
            day: '$day',
          },
          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $group: {
          _id: '$_id.name',
          days: {
            $push: {
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
          days: { $push: '$days' },
        },
      },
    ]);

    return await usersMonthSummary;
  },
};
