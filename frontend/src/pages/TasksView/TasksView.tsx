import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import styles from './TasksView.module.css';
import useAddNewTask from '../../hooks/useAddNewTask';
import Loader from '../../components/Molecules/Loader/Loader';

function TasksView() {
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const {
    title,
    client,
    path,
    description,
    priority,
    status,
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
                    <input
                      type="text"
                      placeholder="Priorytet"
                      value={priority}
                      onChange={handlePriorityChange}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Status"
                      value={status}
                      onChange={handleStatusChange}
                      className={styles.input}
                    />
                    <input
                      type="text"
                      placeholder="Deadline"
                      value={deadline}
                      onChange={handleDeadlineChange}
                      className={styles.input}
                    />
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
          }}
        >
          tasks
        </button>
      </div>
    </>
  );
}

export default TasksView;
