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

import { useState } from 'react';
import { Icon } from '@iconify/react';
// import ChartContainer from '../../Atoms/ChartContainer/ChartContainer';
import styles from './ClientsPerMonthsChart.module.css';
import Select from '../../../Atoms/Select/Select';

const selectValues = ['Godziny', 'Przychód'];

function ClientsPerMonthsChart({
  dataReady,
  clientsMonthSummary,
  selectedMonth,
  clientsMonthSummaryByRevenue,
  isYearly,
  year,
}) {
  const [selectValue, setSelectValue] = useState('Godziny');

  const handleSelectValue = (e) => {
    e.preventDefault();
    setSelectValue(e.target.value);
  };

  const chartTitle = isYearly
    ? `Podsumowanie klientów - ${year}`
    : `Podsumowanie klientów - ${selectedMonth}`;

  return (
    <div className={styles.container}>
      <div className={styles.chartInfoContainer}>
        <Select
          value={selectValue}
          handleValueChange={handleSelectValue}
          optionData={selectValues}
        />
        <p>{`${selectValue === 'Godziny' ? '[h]' : '[zł]'}  ${chartTitle}`}</p>
      </div>

      {dataReady ? (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={
              selectValue === 'Godziny'
                ? clientsMonthSummary
                : clientsMonthSummaryByRevenue
            }
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey={selectValue === 'Godziny' ? 'Suma_godzin' : 'przychód'}
              fill={selectValue === 'Godziny' ? '#8884d8' : '#82ca9d'}
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
    </div>
  );
}

export default ClientsPerMonthsChart;
