import { useEffect } from 'react';
import { Icon } from '@iconify/react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import UsersDisplay from '../../components/Organisms/UsersDisplay/UsersDisplay';
import styles from './StudioTaskView.module.css';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import { getAllStudioTasks } from '../../services/studio-tasks-service';

const colums = [
  {
    class: 'columnTitleMark',
    title: 'Na później',
  },
  {
    class: 'columnTitleMarkToDo',
    title: 'Do zrobienia',
  },
  {
    class: 'columnTitleMarkInProgress',
    title: 'W trakcie',
  },
  {
    class: 'columnTitleMarkSent',
    title: 'Wysłane',
  },
];

function generateSearchID() {
  return Math.floor(1000 + Math.random() * 9000);
}

function StudioTaskView() {
  const { studioTasks, dispatch } = useStudioTasksContext();

  useEffect(() => {
    const fetchAllStudioTasks = async () => {
      const AllStudioTasks = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: AllStudioTasks });
    };

    fetchAllStudioTasks();
  }, [dispatch]);

  return (
    <>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>
        <SearchInput />
        <div className={styles.buttonsWrapper}>
          <CTA onClick={() => {}}>Nowe zlecenie</CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
      </ControlBar>

      <ViewContainer>
        <div className={styles.columnsWrapper}>
          {colums.map((column) => {
            return (
              <div className={styles.taskColumnContainer} key={column.class}>
                <div className={styles.columnTitleWrapper}>
                  <div className={`${styles[`${column.class}`]}`} />
                  <h4>{column.title}</h4>
                </div>
                <div
                  className={`${styles.taskColumn} ${
                    studioTasks.some((task) => task.status === column.title)
                      ? ''
                      : styles.taskColumnBorder
                  }`}
                >
                  {studioTasks.map((task) => {
                    const subtasksLength = task.subtasks.length;
                    const searchID = generateSearchID();
                    let doneSubtasks = 0;

                    task.subtasks.forEach((subtask) => {
                      if (subtask.done) {
                        doneSubtasks += 1;
                      }
                    });

                    return (
                      task.status === column.title && (
                        <div className={styles.task}>
                          <p
                            className={`${styles.clientName} ${
                              styles[`${task.client}`]
                            }`}
                          >
                            {task.client}
                          </p>
                          <span className={styles.searchID}>#{searchID}</span>
                          <p>{task.title}</p>
                          <div className={styles.userDisplayWrapper}>
                            <UsersDisplay
                              data={task}
                              usersArray={task.participants}
                            />
                          </div>
                          <div className={styles.subtasksCountWrapper}>
                            <Icon
                              icon="material-symbols:task-alt"
                              width="12"
                              height="12"
                            />
                            <div>
                              <span>{doneSubtasks}/</span>
                              <span>{subtasksLength}</span>
                            </div>
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
