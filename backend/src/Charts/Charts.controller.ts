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
};
