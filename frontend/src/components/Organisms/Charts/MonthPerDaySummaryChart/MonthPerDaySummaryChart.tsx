import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import DashboardContainerTitle from '../../../Atoms/DashboardContainerTitle/DashboardContainerTitle';
import styles from './MonthPerDaySummaryChart.module.css';

function MonthPerDaySummaryChart({ selectedMonth, monthDaysSummary }) {
  return (
    <div className={styles.lineChartContainer}>
      <DashboardContainerTitle>{`Podsumowanie miesiąca - ${selectedMonth}`}</DashboardContainerTitle>
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          width={500}
          height={300}
          data={monthDaysSummary}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="totalHours"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MonthPerDaySummaryChart;
