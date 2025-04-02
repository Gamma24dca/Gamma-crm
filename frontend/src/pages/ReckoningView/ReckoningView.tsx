import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import Select from '../../components/Atoms/Select/Select';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import useCurrentDate from '../../hooks/useCurrentDate';
import styles from './ReckoningView.module.css';
import useAuth from '../../hooks/useAuth';
import {
  addReckoningTask,
  getMyReckoningTasks,
} from '../../services/reckoning-view-service';
import ReckoningTile from '../../components/Organisms/ReckoningTile/ReckoningTile';
import CTA from '../../components/Atoms/CTA/CTA';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import generateSearchID from '../../utils/generateSearchId';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import useReckoTasksContext from '../../hooks/Context/useReckoTasksContext';
import CheckboxLoader from '../../components/Atoms/CheckboxLoader/CheckboxLoader';

function generateDaysArray(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let i = 1; i <= daysInMonth; i += 1) {
    const dayOfWeek = new Date(year, month - 1, i).getDay(); // Sunday=0, Saturday=6
    daysArray.push({
      hourNum: 0,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  return daysArray;
}

function ReckoningView() {
  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);
  const [taskLoadingState, setTaskLoadingState] = useState({
    isGetMyTasksLoading: false,
    isAddEmptyLoading: false,
  });

  // const [reckoningTasks, setReckoningTasks] = useState([]);
  const { reckoTasks, dispatch } = useReckoTasksContext();

  const { user } = useAuth();
  const currentUserId = user[0]._id;
  const monthIndex = new Date().getMonth();

  const handleLoadingStateChange = (key, value) => {
    setTaskLoadingState((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const fetchReckoningTasks = async (index) => {
    try {
      handleLoadingStateChange('isGetMyTasksLoading', true);

      const response = await getMyReckoningTasks(currentUserId, '2025', index);
      if (response) {
        // setReckoningTasks(response);
        dispatch({ type: 'SET_RECKOTASKS', payload: response });
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleLoadingStateChange('isGetMyTasksLoading', false);
    }
  };

  const selectedMonthIndex = months.indexOf(selectedMonth) + 1;

  useEffect(() => {
    fetchReckoningTasks(monthIndex);
  }, []);

  useEffect(() => {
    setSelectedMonthDaysArray(generateDaysArray(selectedMonthIndex, 2025));

    fetchReckoningTasks(selectedMonthIndex - 1);
  }, [selectedMonth]);

  const totalHours = reckoTasks
    .flatMap((task) => task.participants[0]?.hours || [])
    .reduce((sum, hourObj) => sum + hourObj.hourNum, 0);

  const handleAddEmptyReckoTask = async () => {
    try {
      handleLoadingStateChange('isAddEmptyLoading', true);

      const startDate = new Date(selectedYear, selectedMonthIndex, 1);

      const addResponse = await addReckoningTask({
        searchID: generateSearchID(),
        client: 'Wybierz firme',
        clientPerson: 'Wybierz klienta',
        title: '',
        description: '',
        author: user[0],
        printWhat: '',
        printWhere: '',
        participants: [
          {
            _id: user[0]._id,
            isVisible: true,
            name: user[0].name,
            hours: generateDaysArray(selectedMonthIndex, 2025),
          },
        ],
        startDate,
        deadline: '',
      });

      if (addResponse !== null) {
        dispatch({ type: 'CREATE_RECKOTASK', payload: addResponse });
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleLoadingStateChange('isAddEmptyLoading', false);
    }
  };

  const renderReckoTasks = () => {
    if (taskLoadingState.isGetMyTasksLoading) {
      return <SkeletonUsersLoading />;
    }

    if (reckoTasks.length > 0 && !taskLoadingState.isGetMyTasksLoading) {
      return reckoTasks.map((reckTask, index) => {
        // console.log(reckTask.participants[0].hours);
        return (
          <ReckoningTile key={reckTask._id} reckTask={reckTask} index={index} />
        );
      });
    }

    return (
      <div className={styles.noTasksContainer}>
        <div>
          <p>Brak zleceń</p>
          <Icon icon="line-md:coffee-loop" width="24" height="24" />
        </div>

        <div>
          <button
            type="button"
            className={styles.addNewReckoTaskButton}
            onClick={handleAddEmptyReckoTask}
          >
            Dodaj pierwszy wiersz!
          </button>
          {taskLoadingState.isAddEmptyLoading && <CheckboxLoader />}
        </div>
      </div>
    );
  };

  return (
    <>
      <ControlBar>
        <ControlBarTitle>Rozliczenie</ControlBarTitle>
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
        <SearchInput />
        <div className={styles.totalHoursContainer}>
          <p>{totalHours}</p>
        </div>
        <div className={styles.ctaWrapper}>
          <CTA type="button">Dodaj ze zleceń</CTA>
        </div>
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          <div className={styles.reckoningContainer}>
            <div className={styles.infoBar}>
              <p className={styles.infoBarElement}>&nbsp;</p>
              <p className={styles.infoBarElement}>Firma</p>
              <p className={styles.infoBarElement}>Klient</p>
              <p className={styles.infoBarElement}>Tytuł</p>
              <p className={styles.infoBarElement}>Opis</p>
              <p className={styles.infoBarElement}>Druk(co)</p>
              <p className={styles.infoBarElement}>Druk(gdzie)</p>
              <div className={styles.daysWrapper}>
                <div className={styles.summHoursInfoEl}>
                  <Icon
                    icon="tabler:circle-plus-2"
                    width="24"
                    height="24"
                    // style="color: #030136"
                  />
                </div>
                {selectedMonthDaysArray.map((dayTile, index) => {
                  return (
                    <p className={styles.dayInfoPar} key={index}>
                      {index + 1}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* {!taskLoadingState.isGetMyTasksLoading ? (
              reckoTasks.length > 0 ? (
                reckoTasks.map((reckTask, index) => {
                  return (
                    <ReckoningTile
                      key={reckTask._id}
                      reckTask={reckTask}
                      index={index}
                    />
                  );
                })
              ) : (
                <p>brak zadan</p>
              )
            ) : (
              <SkeletonUsersLoading />
            )} */}
            {renderReckoTasks()}
            {reckoTasks.length > 0 && !taskLoadingState.isGetMyTasksLoading && (
              <div className={styles.addNewReckoTaskWrapper}>
                <button
                  type="button"
                  className={styles.addNewReckoTaskButton}
                  onClick={handleAddEmptyReckoTask}
                >
                  Dodaj wiersz..
                </button>
                {taskLoadingState.isAddEmptyLoading && <CheckboxLoader />}
              </div>
            )}
          </div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ReckoningView;
