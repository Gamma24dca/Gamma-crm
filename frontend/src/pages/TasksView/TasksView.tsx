import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import styles from './TasksView.module.css';
import useAddNewTask from '../../hooks/useAddNewTask';
import Loader from '../../components/Molecules/Loader/Loader';
import { getAllTasks } from '../../services/tasks-service';
import TopBar from '../../components/Atoms/TopBar/TopBar';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import TilesColumnContainer from '../../components/Atoms/TilesColumnContainer/TilesColumnContainer';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import useTasksContext from '../../hooks/useTasksContext';
import InfoBar from '../../components/Organisms/InfoBar/InfoBar';

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
        {isLoading ? (
          <div className={styles.loaderWrapper}>
            <Loader />
          </div>
        ) : (
          <div>
            {showFinalMessage ? (
              <div className={styles.loaderWrapper}>
                <p>{finalMessage}</p>
              </div>
            ) : (
              <>
                <div className={styles.topBarContainer}>
                  <h2>Stwórz zlecenie</h2>
                  <button
                    type="button"
                    onClick={createTaskHandler}
                    className={styles.addTaskBtn}
                  >
                    Dodaj
                  </button>
                </div>
                <div className={styles.mainContainer}>
                  <div>
                    <input
                      ref={imgIconRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className={styles.inputRef}
                    />
                    <button
                      type="button"
                      onClick={handleIconClick}
                      className={styles.addImgField}
                    >
                      <div className={styles.addImgFieldContainer}>
                        <span className={styles.imgLabel}>{imgLabel}</span>
                        <img
                          alt="your"
                          src={imgSrc}
                          className={styles.addImage}
                        />
                      </div>
                    </button>
                  </div>
                  <div className={styles.inputsContainer}>
                    <div className={styles.rowContainer}>
                      <div className={styles.leftRow}>
                        <input
                          type="text"
                          placeholder="Tytuł"
                          value={title}
                          onChange={handleTitleChange}
                          className={styles.input}
                        />
                        <input
                          type="text"
                          placeholder="Klient"
                          value={client}
                          onChange={handleClientChange}
                          className={styles.input}
                        />
                        <input
                          type="text"
                          placeholder="Opis"
                          value={description}
                          onChange={handleDescriptionChange}
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.rightRow}>
                        <input
                          type="text"
                          placeholder="Ścieżka plików"
                          value={path}
                          onChange={handlePathChange}
                          className={styles.input}
                        />

                        <select
                          className={styles.selectInput}
                          onChange={handlePriorityChange}
                        >
                          <option value="">Priorytet</option>
                          <option value="200">200</option>
                          <option value="400">400</option>
                          <option value="600">600</option>
                          <option value="800">800</option>
                          <option value="1000">1000</option>
                        </select>
                        <select
                          className={styles.selectInput}
                          onChange={handleStatusChange}
                        >
                          <option value="">Status zlecenia</option>
                          <option value="Studio">Studio</option>
                          <option value="Druk">Druk</option>
                          <option value="Kalander">Kalander</option>
                          <option value="Szwalnia">Szwalnia</option>
                          <option value="Pakowanie">Pakowanie</option>
                          <option value="Wysyłka">Wysyłka</option>
                        </select>
                      </div>
                    </div>

                    <p
                      className={styles.buttonInput}
                      // onClick={() => setIsCalendarVisible((val) => !val)}
                    >
                      <p>Deadline</p>
                    </p>
                    <Calendar
                      onChange={handleDeadlineChange}
                      value={deadline}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
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
      <div className={styles.tasksContainer}>
        <div className={styles.tasksWrapper}>
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
              console.log(task);
              return (
                <Link
                  className={styles.tile}
                  key={task._id}
                  to={`/zlecenia/${task._id}`}
                >
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.createdAtDate}>
                      {task.date.split('T')[0]}
                    </p>
                  </div>
                  <div className={styles.taskAuthorCreatorWrapper}>
                    <img
                      src={task.authorAvatar}
                      alt="user"
                      className={styles.userImg}
                    />
                    <p className={styles.authorName}>{task.authorName}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.client}>{task.client}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.title}>{task.title}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.description}>{task.description}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.path}>{task.path}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.status}>{task.status}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.priority}>{task.priority}</p>
                  </div>
                  <div className={styles.tileContentWrapper}>
                    <p className={styles.deadline}>
                      {task.deadline.split('T')[0]}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <SkeletonUsersLoading />
          )}
        </div>
      </div>
    </>
  );
}

export default TasksView;
