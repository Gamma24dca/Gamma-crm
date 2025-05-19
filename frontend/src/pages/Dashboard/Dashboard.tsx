import { useEffect, useState } from 'react';
// import { round } from 'lodash';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import Select from '../../components/Atoms/Select/Select';
import useCurrentDate from '../../hooks/useCurrentDate';
import {
  ClientsMonthSummaryTypes,
  getClientsMonthSummary,
  getMonthDaysSummary,
  getTasksTypeSummary,
  getUsersMonthSummary,
  MonthPerDaySummary,
  UsersMonthSummaryTypes,
} from '../../services/dashboard-service';
import styles from './Dashboard.module.css';
import ClientsPerMonthsChart from '../../components/Organisms/Charts/ClientsPerMontsChart/ClientsPerMonthsChart';
import ChartContainer from '../../components/Atoms/ChartContainer/ChartContainer';
import UsersPerMonthChart from '../../components/Organisms/UsersPerMonthChart/UsersPerMonthChart';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import MonthPerDaySummaryChart from '../../components/Organisms/Charts/MonthPerDaySummaryChart/MonthPerDaySummaryChart';
import TypesRadarChart from '../../components/Organisms/Charts/TypesRadarChart/TypesRadarChart';
import SummaryTile from '../../components/Organisms/Charts/SummaryTile/SummaryTile';

function Dashboard() {
  const [viewVariable, setViewVariable] = useState('Miesięczne');
  const [clientsMonthSummary, setClientsMonthSummary] = useState<
    ClientsMonthSummaryTypes[]
  >([]);
  const [usersMonthSummary, setUsersMonthSummary] = useState<
    UsersMonthSummaryTypes[]
  >([]);

  const [tasksTypeSummary, setTasksTypeSummary] = useState([]);
  const [monthDaysSummary, setMonthDaysSummary] = useState<
    MonthPerDaySummary[]
  >([]);
  // const [compareData, setCompareData] = useState<ClientsMonthSummaryTypes[]>(
  //   []
  // );
  const [isLoading, setIsLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);

  const { companies, dispatch: companiesDispatch } = useCompaniesContext();

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const viewVariableSelectValue = ['Miesięczne', 'Roczne', 'Graficy'];

  const handleViewVariableChange = (e) => {
    setViewVariable(e.target.value);
  };

  // const {
  //   selectedMonth: compareSelectedMonth,
  //   handleMonthChange: compareHandleMonthChange,
  //   months: compareMonths,
  // } = useCurrentDate();

  const currentMonthIndex = months.indexOf(selectedMonth);

  useEffect(() => {
    const fetchCompanies = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchCompanies();
  }, [companiesDispatch, companies]);

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

        const tasks = await getTasksTypeSummary();
        setTasksTypeSummary(tasks);

        const monthDays = await getMonthDaysSummary(
          currentMonthIndex + 1,
          selectedYear
        );
        setMonthDaysSummary(monthDays);

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

  // useEffect(() => {
  //   const fetchToCompare = async () => {
  //     const compareSelectedMonthIndex = months.indexOf(compareSelectedMonth);
  //     try {
  //       if (compareSelectedMonth === selectedMonth) return;
  //       const clientsToCompare = await getClientsMonthSummary(
  //         compareSelectedMonthIndex + 1,
  //         selectedYear
  //       );

  //       setCompareData(clientsToCompare);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchToCompare();
  // }, [compareSelectedMonth]);

  const clientsMonthSummaryByRevenue = clientsMonthSummary.map((client) => {
    const [filteredCompany] = companies.filter(
      (com) => com.name === client._id
    );

    if (!filteredCompany) {
      console.warn(`Company not found for client ID: ${client._id}`);
      return {
        ...client,
        przychód: 0,
      };
    }

    const { hourRate } = filteredCompany;

    return {
      ...client,
      przychód: client.Suma_godzin * Number(hourRate),
    };
  });

  const summedHours = clientsMonthSummary.reduce((summ, cms) => {
    return Number(summ) + Number(cms.Suma_godzin);
  }, 0);

  const summedRevenue = clientsMonthSummaryByRevenue.reduce((summ, cms) => {
    return Number(summ) + Number(cms.przychód);
  }, 0);

  return (
    <>
      <ControlBar>
        <ControlBarTitle>Pulpit</ControlBarTitle>
        {viewVariable === 'Miesięczne' && (
          <Select
            value={selectedMonth}
            handleValueChange={handleMonthChange}
            optionData={months}
          />
        )}

        <Select
          value={selectedYear}
          handleValueChange={handleYearChange}
          optionData={years}
        />
        <Select
          value={viewVariable}
          handleValueChange={handleViewVariableChange}
          optionData={viewVariableSelectValue}
        />
      </ControlBar>

      <div className={styles.chartsWrapper}>
        <div className={styles.leftColumn}>
          <ClientsPerMonthsChart
            dataReady={dataReady}
            clientsMonthSummary={clientsMonthSummary}
            selectedMonth={selectedMonth}
            clientsMonthSummaryByRevenue={clientsMonthSummaryByRevenue}
          />

          <div className={styles.leftColumnSecondRowContainer}>
            <div className={styles.summaryTilesWrapper}>
              <div className={styles.firstRowTiles}>
                <SummaryTile
                  title="Suma godzin"
                  iconValue="ic:baseline-access-time"
                >{`${summedHours} h`}</SummaryTile>
                <SummaryTile
                  title="Suma przychodów"
                  iconValue="ic:outline-monetization-on"
                >{`${summedRevenue} zł`}</SummaryTile>
              </div>
              {/* <div className={styles.compareTitle}>
                <p>W porównaniu do</p>
                <Select
                  value={compareSelectedMonth}
                  handleValueChange={compareHandleMonthChange}
                  optionData={compareMonths}
                />
              </div>

              <div className={styles.firstRowTiles}>
                <SummaryTile
                  title="Suma godzin"
                  iconValue="material-symbols:chart-data-rounded"
                >{`${
                  selectedMonth === compareSelectedMonth
                    ? '100%'
                    : round(
                        (compareData.reduce((summ, cms) => {
                          return Number(summ) + Number(cms.Suma_godzin);
                        }, 0) *
                          100) /
                          summedHours
                      )
                } `}</SummaryTile>
                <SummaryTile
                  title="Suma przychodów"
                  iconValue="ic:outline-monetization-on"
                >{`${summedRevenue} zł`}</SummaryTile>
              </div> */}
            </div>

            <TypesRadarChart
              tasksTypeSummary={tasksTypeSummary}
              dataReady={dataReady}
            />
          </div>
        </div>

        <div className={styles.rightColumn}>
          <ChartContainer>
            <div className={styles.usersMonthSummaryContainer}>
              <div className={styles.infoMonthSummaryRow}>
                <div className={styles.userWrapper}>
                  <p className={styles.infoUsersPar}>
                    Grafik - {selectedMonth}
                  </p>
                </div>
                <div className={styles.infoDayWrapper}>
                  <div className={styles.emptyTile}>sum</div>
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

          <MonthPerDaySummaryChart
            selectedMonth={selectedMonth}
            monthDaysSummary={monthDaysSummary}
            dataReady={dataReady}
          />
        </div>
      </div>
    </>
  );
}

export default Dashboard;
