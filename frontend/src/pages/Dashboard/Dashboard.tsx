import { useEffect, useState } from 'react';
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
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import Select from '../../components/Atoms/Select/Select';
import useCurrentDate from '../../hooks/useCurrentDate';
import {
  ClientsMonthSummaryTypes,
  getClientsMonthSummary,
} from '../../services/dashboard-service';
import styles from './Dashboard.module.css';

function Dashboard() {
  const [clientsMonthSummary, setClientsMonthSummary] = useState<
    ClientsMonthSummaryTypes[]
  >([]);
  const [chartKey, setChartKey] = useState(0); // 👈 key to force remount for animation
  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const currentMonthIndex = months.indexOf(selectedMonth);

  const fetchClientsMonthSummary = async () => {
    try {
      const response = await getClientsMonthSummary(
        currentMonthIndex + 1,
        selectedYear
      );
      if (response.length > 0) {
        setClientsMonthSummary(response);
        // 👇 force chart to remount, triggering animation
        setChartKey((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchClientsMonthSummary();
  }, [selectedMonth, selectedYear]);

  return (
    <>
      <ControlBar>
        <ControlBarTitle>Pulpit</ControlBarTitle>
        <Select
          value={selectedMonth}
          handleValueChange={handleMonthChange}
          optionData={months}
        />
        <Select
          value={selectedYear}
          handleValueChange={handleYearChange}
          optionData={years}
        />
        <p>Miesięczne</p>
        <p>Roczne</p>
        <p>Graficy</p>
      </ControlBar>

      <div className={styles.chartContainer}>
        {clientsMonthSummary.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              key={chartKey} // 👈 force animation
              width={500}
              height={300}
              data={clientsMonthSummary}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
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
          <Icon
            icon="line-md:loading-twotone-loop"
            width="121"
            height="121"
            className={styles.loadingIcon}
          />
        )}
      </div>
    </>
  );
}

export default Dashboard;
