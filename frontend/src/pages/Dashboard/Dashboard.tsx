import { useEffect, useState } from 'react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import Select from '../../components/Atoms/Select/Select';
import useCurrentDate from '../../hooks/useCurrentDate';
import {
  ClientsMonthSummaryTypes,
  getClientsMonthSummary,
  getUsersMonthSummary,
  UsersMonthSummaryTypes,
} from '../../services/dashboard-service';
import styles from './Dashboard.module.css';
import ClientsPerMonthsChart from '../../components/Organisms/ClientsPerMontsChart/ClientsPerMonthsChart';
import ChartContainer from '../../components/Atoms/ChartContainer/ChartContainer';
import UsersPerMonthChart from '../../components/Organisms/UsersPerMonthChart/UsersPerMonthChart';

function Dashboard() {
  const [clientsMonthSummary, setClientsMonthSummary] = useState<
    ClientsMonthSummaryTypes[]
  >([]);
  const [usersMonthSummary, setUsersMonthSummary] = useState<
    UsersMonthSummaryTypes[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const currentMonthIndex = months.indexOf(selectedMonth);

  // Reset on new month/year
  useEffect(() => {
    setDataReady(false);
  }, [selectedMonth, selectedYear]);

  // Fetch both datasets, THEN render chart
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setIsLoading(true);
        const clients = await getClientsMonthSummary(
          currentMonthIndex + 1,
          selectedYear
        );
        setClientsMonthSummary(clients);

        const users = await getUsersMonthSummary(
          currentMonthIndex + 1,
          selectedYear
        );
        setUsersMonthSummary(users);

        if (clients.length > 0 && users.length > 0) {
          setDataReady(true);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAll();
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

      <div className={styles.chartsWrapper}>
        <ClientsPerMonthsChart
          dataReady={dataReady}
          clientsMonthSummary={clientsMonthSummary}
        />
        <ChartContainer>
          <div className={styles.usersMonthSummaryContainer}>
            <div className={styles.infoMonthSummaryRow}>
              <div className={styles.userWrapper}>
                <p className={styles.infoUsersPar}>Grafik - {selectedMonth}</p>
              </div>
              <div className={styles.infoDayWrapper}>
                {usersMonthSummary.length > 0 &&
                  usersMonthSummary[0].days.map((infoDay) => {
                    return (
                      <div className={styles.infoDayNumber} key={infoDay.day}>
                        {infoDay.day}
                      </div>
                    );
                  })}
              </div>
            </div>

            <UsersPerMonthChart
              isLoading={isLoading}
              usersMonthSummary={usersMonthSummary}
            />
          </div>
        </ChartContainer>
      </div>
    </>
  );
}

export default Dashboard;
