import { useEffect, useState } from 'react';
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

  const [tasks, setTasks] = useState([]);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  useEffect(() => {
    getAllTasks().then((allTasks) => {
      setTasks(allTasks);
    });
  }, [exitAnim]);

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
                      placeholder="Ścieżka plików"
                      value={path}
                      onChange={handlePathChange}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Opis"
                      value={description}
                      onChange={handleDescriptionChange}
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
                    <button
                      type="button"
                      className={styles.buttonInput}
                      onClick={() => setIsCalendarVisible((val) => !val)}
                    >
                      <p>Deadline</p>
                    </button>
                    {isCalendarVisible ? (
                      <Calendar
                        onChange={handleDeadlineChange}
                        value={deadline}
                      />
                    ) : null}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </ModalTemplate>
      <div className={styles.tasksContainer}>
        <h2>Tasks</h2>
        <button
          type="button"
          onClick={() => {
            openModal();
            clearValues();
            setIsCalendarVisible(false);
          }}
        >
          tasks
        </button>
      </div>
      <TopBar>
        <p>data</p>
        <p>autor</p>
        <p>opis</p>
      </TopBar>
      <ViewContainer>
        <TilesColumnContainer>
          {sortedTasks.length > 0 ? (
            sortedTasks.map((task) => {
              return (
                <TileWrapper key={task._id} linkPath={`/zlecenia/${task._id}`}>
                  <p>{task.date.split('T')[0]}</p>
                  <p>{task.client}</p>
                  <p>{task.title}</p>
                  <p>{task.description}</p>
                  <p>{task.path}</p>
                  <p>{task.status}</p>
                  <p>{task.deadline.split('T')[0]}</p>
                </TileWrapper>
              );
            })
          ) : (
            <SkeletonUsersLoading />
          )}
        </TilesColumnContainer>
      </ViewContainer>
    </>
  );
}

export default TasksView;
