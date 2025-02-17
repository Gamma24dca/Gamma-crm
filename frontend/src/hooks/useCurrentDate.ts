import { useEffect, useState } from 'react';

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

const years = [2024, 2025];

const useCurrentDate = () => {
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>();
  const [selectedYear, setSelectedYear] = useState<number>();

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  useEffect(() => {
    const monthIndex = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    setCurrentMonthIndex(monthIndex);
    setSelectedYear(currentYear);
    setSelectedMonth(months[monthIndex]);
  }, []);

  return {
    selectedMonth,
    selectedYear,
    currentMonthIndex,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  };
};

export default useCurrentDate;
