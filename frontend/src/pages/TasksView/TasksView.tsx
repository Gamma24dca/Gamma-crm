import { useEffect } from 'react';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import styles from './TasksView.module.css';
import useAddNewTask from '../../hooks/useAddNewTask';
import { getAllTasks } from '../../services/tasks-service';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import useTasksContext from '../../hooks/useTasksContext';
import InfoBar from '../../components/Organisms/InfoBar/InfoBar';
import AddTaskModalContent from '../../components/Organisms/AddTaskModalContent/AddTaskModalContent';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';

function TasksView() {
  const { showModal, exitAnim, openModal, closeModal } = useModal();

  // Have to improve form validation, possibly formik is needed

  const {
    title,
    client,
    path,
    description,
    deadline,
    imgLabel,
    imgSrc,
    isLoading,
    finalMessage,
    showFinalMessage,
    handleIconClick,
    imgIconRef,
    handleFileChange,
    handleTitleChange,
    handleClientChange,
    handlePathChange,
    handleDescriptionChange,
    handlePriorityChange,
    handleStatusChange,
    handleDeadlineChange,
    createTaskHandler,
    clearValues,
  } = useAddNewTask();

  // const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  // @ts-ignore
  const { tasks, dispatch } = useTasksContext();

  useEffect(() => {
    getAllTasks().then((allTasks) => {
      dispatch({ type: 'SET_TASKS', payload: allTasks });
    });
  }, [exitAnim, dispatch]);

  const sortedTasks = tasks.sort((a, b) => {
    return Number(b.priority) - Number(a.priority);
  });

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <AddTaskModalContent
          isLoading={isLoading}
          showFinalMessage={showFinalMessage}
          finalMessage={finalMessage}
          createTaskHandler={createTaskHandler}
          imgIconRef={imgIconRef}
          title={title}
          imgSrc={imgSrc}
          handleFileChange={handleFileChange}
          handleIconClick={handleIconClick}
          imgLabel={imgLabel}
          handleTitleChange={handleTitleChange}
          client={client}
          handleClientChange={handleClientChange}
          description={description}
          handleDescriptionChange={handleDescriptionChange}
          path={path}
          handlePathChange={handlePathChange}
          handlePriorityChange={handlePriorityChange}
          handleStatusChange={handleStatusChange}
          handleDeadlineChange={handleDeadlineChange}
          deadline={deadline}
        />
      </ModalTemplate>
      <div className={styles.controllPanel}>
        <button
          type="button"
          onClick={() => {
            openModal();
            clearValues();
            // setIsCalendarVisible(false);
          }}
        >
          Add Task
        </button>
      </div>

      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Utworzono</p>
            </div>
            <div className={styles.taskAuthorCreatorWrapper}>
              <p className={styles.InfoBarElement}>Autor</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Klient</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Tytuł</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Opis</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Ścieżka</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Status</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Priorytet</p>
            </div>
            <div className={styles.tileContentWrapper}>
              <p className={styles.InfoBarElement}>Deadline</p>
            </div>
          </InfoBar>

          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => {
              return (
                <TileWrapper key={task._id} linkPath={`/zlecenia/${task._id}`}>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.date.split('T')[0]}</p>
                  </div>
                  <div className={styles.taskAuthorCreatorWrapper}>
                    <img
                      src={task.authorAvatar}
                      alt="user"
                      className={styles.userImg}
                    />
                    <p>{task.authorName}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.client}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.title}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.description}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.path}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.status}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.priority}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p>{task.deadline.split('T')[0]}</p>
                  </div>
                </TileWrapper>
              );
            })
          ) : (
            <SkeletonUsersLoading />
          )}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default TasksView;
