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
import { Icon } from '@iconify/react';
import DashboardContainerTitle from '../../../Atoms/DashboardContainerTitle/DashboardContainerTitle';
import styles from './MonthPerDaySummaryChart.module.css';

function MonthPerDaySummaryChart({
  selectedMonth,
  monthDaysSummary,
  dataReady,
}) {
  return (
    <div className={styles.lineChartContainer}>
      <DashboardContainerTitle>{`[h] Podsumowanie miesiąca - ${selectedMonth}`}</DashboardContainerTitle>
      {dataReady ? (
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
              animationBegin={0}
              animationDuration={2000}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.noTasksContainer}>
          <p>Brak danych</p>
          <Icon icon="line-md:coffee-loop" width="24" height="24" />
        </div>
      )}
    </div>
  );
}

export default MonthPerDaySummaryChart;
