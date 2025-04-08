import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import CTA from '../../components/Atoms/CTA/CTA';
import CheckboxLoader from '../../components/Atoms/CheckboxLoader/CheckboxLoader';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import Select from '../../components/Atoms/Select/Select';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ReckoningTile from '../../components/Organisms/ReckoningTile/ReckoningTile';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import useReckoTasksContext from '../../hooks/Context/useReckoTasksContext';
import useAuth from '../../hooks/useAuth';
import useCurrentDate from '../../hooks/useCurrentDate';
import {
  addReckoningTask,
  addReckoningTaskFromKanban,
  getMyReckoningTasks,
} from '../../services/reckoning-view-service';
import generateSearchID from '../../utils/generateSearchId';
import styles from './ReckoningView.module.css';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  getStudioTask,
  UpdateStudioTask,
} from '../../services/studio-tasks-service';
import CompanyBatch from '../../components/Atoms/CompanyBatch/CompanyBatch';
import UsersDisplay from '../../components/Organisms/UsersDisplay/UsersDisplay';
import socket from '../../socket';
import generateDaysArray from '../../utils/generateDaysArray';

// function generateDaysArray(month, year) {
//   const daysInMonth = new Date(year, month, 0).getDate();
//   const daysArray = [];

//   for (let i = 1; i <= daysInMonth; i += 1) {
//     const dayOfWeek = new Date(year, month - 1, i).getDay(); // Sunday=0, Saturday=6
//     daysArray.push({
//       hourNum: 0,
//       isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
//     });
//   }

//   return daysArray;
// }

function ReckoningView() {
  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);
  // const [hover, setHover] = useState({
  //   isHover: false,
  //   cardId: '',
  // });
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [taskLoadingState, setTaskLoadingState] = useState({
    isGetMyTasksLoading: false,
    isAddEmptyLoading: false,
  });

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  // const [reckoningTasks, setReckoningTasks] = useState([]);
  const { reckoTasks, dispatch } = useReckoTasksContext();
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { studioTasks, dispatch: studioTasksDispatch } =
    useStudioTasksContext();

  const { user } = useAuth();
  const currentUserId = user[0]._id;
  const monthIndex = new Date().getMonth();
  const selectedMonthIndex = months.indexOf(selectedMonth) + 1;

  const handleLoadingStateChange = (key, value) => {
    setTaskLoadingState((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const fetchReckoningTasks = async (index) => {
    // console.log('client month index:', index);
    try {
      handleLoadingStateChange('isGetMyTasksLoading', true);

      // DODANE +1 PO ZMIANIE REQUESTOW NA LOCALHOST NIE WIEM DLACZEGO, PEWNIE TRZEBA ZMIENIC TAK JAK BYLO NA MAINE I FETCHOW Z CHMURY
      const response = await getMyReckoningTasks(
        currentUserId,
        '2025',
        index + 1
      );
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

  const fetchTasksFromKanban = async () => {
    if (studioTasks.length === 0) {
      try {
        const allStudioTasks = await getAllStudioTasks();
        studioTasksDispatch({
          type: 'SET_STUDIOTASKS',
          payload: allStudioTasks,
        });
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }
  };

  useEffect(() => {
    fetchReckoningTasks(monthIndex);
    fetchTasksFromKanban();
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
        idOfAssignedStudioTask: '',
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
            createdAt: new Date(selectedYear, selectedMonthIndex, 1),
          },
        ],
        startDate,
        // deadline: '',
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

  const handleAddFromKanban = async ({
    _id,
    searchID,
    client,
    clientPerson,
    title,
    description,
    participants,
  }) => {
    try {
      handleLoadingStateChange('isAddEmptyLoading', true);

      const startDate = new Date(selectedYear, selectedMonthIndex, 1);

      const addResponse = await addReckoningTaskFromKanban({
        searchID,
        idOfAssignedStudioTask: _id,
        client,
        clientPerson,
        title,
        description,
        author: user[0],
        printWhat: '',
        printWhere: '',
        participants: participants.map((part) => {
          return {
            _id: part._id,
            isVisible: currentUserId === part._id,
            name: part.name,
            img: part.img,
            hours: generateDaysArray(selectedMonthIndex, 2025),
            createdAt: new Date(selectedYear, selectedMonthIndex, 1),
          };
        }),
        startDate,
        // deadline: '',
      });

      const updatedTask = await UpdateStudioTask({
        id: _id,
        studioTaskData: { reckoTaskID: addResponse._id },
      });

      const res = await getStudioTask(updatedTask._id);
      studioTasksDispatch({
        type: 'UPDATE_STUDIOTASK',
        payload: res,
      });
      console.log('updated', res);
      socket.emit('tasksUpdated', res);

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
          <ReckoningTile
            key={reckTask._id}
            reckTask={reckTask}
            index={index}
            // assigneStudioTaskId={reckTask.idOfAssignedStudioTask}
          />
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

  const studioTasksAssignedTome = studioTasks.filter((task) => {
    return task.participants.some((participant) => {
      return participant._id === currentUserId;
    });
  });

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          // handleLoadingStateChange('isFinalMessage', false);
          // setFormValue(initialTaskObject);
        }}
        exitAnim={exitAnim}
      >
        <h3>Aktywne zlecenia</h3>

        <div className={styles.tasksWrapper}>
          {studioTasksAssignedTome.map((studioTask) => {
            const companyClass = studioTask.client.split(' ').join(' ');
            return (
              <div
                className={styles.studioTaskContainer}
                key={studioTask._id}
                onMouseEnter={() => {
                  setHoveredCardId(studioTask._id);
                }}
                onMouseLeave={() => {
                  setHoveredCardId(null);
                }}
              >
                <div
                  className={`${styles.contentWrapper} ${
                    hoveredCardId === studioTask._id
                      ? styles.fadeOut
                      : styles.fadeIn
                  }`}
                >
                  <div className={styles.batchWrapper}>
                    <CompanyBatch
                      companyClass={companyClass}
                      isClientPerson={false}
                      isBigger={false}
                    >
                      {studioTask.client}
                    </CompanyBatch>
                    <CompanyBatch
                      companyClass={null}
                      isClientPerson
                      isBigger={false}
                    >
                      {studioTask.clientPerson}
                    </CompanyBatch>
                  </div>
                  <p className={styles.searchIDel}>#{studioTask.searchID}</p>
                  <p className={styles.studioTaskTitle}>{studioTask.title}</p>
                  <div className={styles.userDisplayWrapper}>
                    <UsersDisplay
                      data={studioTask}
                      usersArray={studioTask.participants}
                    />
                  </div>
                </div>
                <div
                  className={`${styles.ctaContainer} ${
                    hoveredCardId === studioTask._id
                      ? styles.fadeIn
                      : styles.fadeOut
                  }`}
                >
                  <CTA
                    onClick={() => {
                      handleAddFromKanban(
                        studioTask as {
                          _id: string;
                          searchID: number;
                          client: string;
                          clientPerson: string;
                          title: string;
                          description: string;
                          participants: any[];
                        }
                      );
                    }}
                  >
                    Dodaj
                  </CTA>
                </div>
              </div>
            );
          })}
        </div>
      </ModalTemplate>
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
          <CTA type="button" onClick={openModal}>
            Dodaj ze zleceń
          </CTA>
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
