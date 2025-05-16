import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import Select from '../../components/Atoms/Select/Select';
import useCurrentDate from '../../hooks/useCurrentDate';
import {
  ClientsMonthSummaryTypes,
  getClientsMonthSummary,
  getTasksTypeSummary,
  getUsersMonthSummary,
  UsersMonthSummaryTypes,
} from '../../services/dashboard-service';
import styles from './Dashboard.module.css';
import ClientsPerMonthsChart from '../../components/Organisms/ClientsPerMontsChart/ClientsPerMonthsChart';
import ChartContainer from '../../components/Atoms/ChartContainer/ChartContainer';
import UsersPerMonthChart from '../../components/Organisms/UsersPerMonthChart/UsersPerMonthChart';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';

function Dashboard() {
  const [clientsMonthSummary, setClientsMonthSummary] = useState<
    ClientsMonthSummaryTypes[]
  >([]);
  const [usersMonthSummary, setUsersMonthSummary] = useState<
    UsersMonthSummaryTypes[]
  >([]);

  const [tasksTypeSummary, setTasksTypeSummary] = useState([]);
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
        <div className={styles.leftColumn}>
          <ClientsPerMonthsChart
            dataReady={dataReady}
            clientsMonthSummary={clientsMonthSummary}
            selectedMonth={selectedMonth}
            clientsMonthSummaryByRevenue={clientsMonthSummaryByRevenue}
          />

          <div className={styles.leftColumnSecondRowContainer}>
            <div className={styles.summaryTilesWrapper}>
              <div className={styles.summaryTile}>
                <p>Suma godzin</p>

                <div className={styles.summaryValueWrapper}>
                  <Icon
                    icon="ic:baseline-access-time"
                    width="16"
                    height="16"
                    className={styles.summaryValueIcon}
                  />
                  <p>{`${summedHours} h`}</p>
                </div>
              </div>
              <div className={styles.summaryTile}>
                <p>Suma przychodów</p>
                <div className={styles.summaryValueWrapper}>
                  <Icon
                    icon="ic:outline-monetization-on"
                    width="16"
                    height="16"
                    className={styles.summaryValueIcon}
                  />
                  <p>{`${summedRevenue} zł`}</p>
                </div>
              </div>
            </div>

            <div className={styles.radarChartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={tasksTypeSummary}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="taskType" />
                  <PolarRadiusAxis />
                  <Radar
                    name="Mike"
                    dataKey="count"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>{' '}
            </div>
          </div>
        </div>

        <ChartContainer>
          <div className={styles.usersMonthSummaryContainer}>
            <div className={styles.infoMonthSummaryRow}>
              <div className={styles.userWrapper}>
                <p className={styles.infoUsersPar}>Grafik - {selectedMonth}</p>
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
      </div>
    </>
  );
}

export default Dashboard;
