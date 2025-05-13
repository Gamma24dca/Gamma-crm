import { ReckoningTaskModel } from '../Reckoning/Reckoning.model';

export const ChartsController = {
  async getClientsPerHour(month, year) {
    const companiesMonthSummary = await await ReckoningTaskModel.aggregate([
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
          totalHours: { $sum: '$participants.months.hours.hourNum' },
        },
      },
      {
        $sort: { totalHours: -1 },
      },
    ]);

    return await companiesMonthSummary;
  },
};
