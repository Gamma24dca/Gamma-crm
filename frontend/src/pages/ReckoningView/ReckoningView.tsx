import { useEffect, useState } from 'react';
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

function generateDaysArray(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let i = 1; i <= daysInMonth; i += 1) {
    const dayOfWeek = new Date(year, month - 1, i).getDay(); // Sunday=0, Saturday=6
    daysArray.push({
      hourNum: null,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  return daysArray;
}

function StudioTaskView() {
  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);
  // const [reckoningTasks, setReckoningTasks] = useState([]);
  const { reckoTasks, dispatch } = useReckoTasksContext();

  const { user } = useAuth();
  const currentUserId = user[0]._id;
  const monthIndex = new Date().getMonth();

  const fetchReckoningTasks = async (index) => {
    try {
      const response = await getMyReckoningTasks(currentUserId, '2025', index);
      console.log(response);

      if (response) {
        // setReckoningTasks(response);
        dispatch({ type: 'SET_RECKOTASKS', payload: response });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchReckoningTasks(monthIndex);
  }, []);

  useEffect(() => {
    const arrayMonthIndex = months.indexOf(selectedMonth) + 1;

    setSelectedMonthDaysArray(generateDaysArray(arrayMonthIndex, 2025));

    fetchReckoningTasks(arrayMonthIndex - 1);
  }, [selectedMonth]);

  const handleAddEmptyReckoTask = async () => {
    try {
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
            name: user[0].name,
            hours: generateDaysArray(2, 2025),
          },
        ],
        startDate: new Date(),
        deadline: '',
      });

      if (addResponse !== null) {
        // setReckoningTasks((prev) => {
        //   return [...prev, addResponse];
        // });
        dispatch({ type: 'CREATE_RECKOTASK', payload: addResponse });
      }
    } catch (error) {
      console.error(error);
    }
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
                {selectedMonthDaysArray.map((dayTile, index) => {
                  return (
                    <p className={styles.dayInfoPar} key={index}>
                      {index + 1}
                    </p>
                  );
                })}
              </div>
            </div>

            {reckoTasks.length > 0 ? (
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
              <SkeletonUsersLoading />
            )}
            {reckoTasks.length > 0 && (
              <div className={styles.addNewReckoTaskWrapper}>
                <button
                  type="button"
                  className={styles.addNewReckoTaskButton}
                  onClick={handleAddEmptyReckoTask}
                >
                  Dodaj wiersz..
                </button>
              </div>
            )}
          </div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
