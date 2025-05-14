import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

import { Icon } from '@iconify/react';
import ChartContainer from '../../Atoms/ChartContainer/ChartContainer';
import styles from './ClientsPerMonthsChart.module.css';

function ClientsPerMonthsChart({ dataReady, clientsMonthSummary }) {
  return (
    <ChartContainer>
      {dataReady ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={clientsMonthSummary}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="Suma_godzin"
              fill="#828fa3"
              activeBar={<Rectangle fill="#f68c1e" stroke="#f68c1e" />}
              animationBegin={0}
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className={styles.noTasksContainer}>
          <p>Brak zleceń</p>
          <Icon icon="line-md:coffee-loop" width="24" height="24" />
        </div>
      )}
    </ChartContainer>
  );
}

export default ClientsPerMonthsChart;
