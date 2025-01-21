import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Icon } from '@iconify/react';
import styles from './DraggableCard.module.css';
import UsersDisplay from '../../Organisms/UsersDisplay/UsersDisplay';
import DateFormatter from '../../../utils/dateFormatter';
import ModalTemplate from '../../Templates/ModalTemplate/ModalTemplate';
import useModal from '../../../hooks/useModal';
import {
  deleteTask,
  getAllStudioTasks,
  StudioTaskTypes,
  UpdateStudioTask,
} from '../../../services/studio-tasks-service';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import Captcha from '../Captcha/Captcha';
import { archiveStudioTask } from '../../../services/archived-studio-tasks-service';
import useSelectUser from '../../../hooks/useSelectUser';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';

// const initialTaskObject = {
//   searchID: 0,
//   title: '',
//   client: '',
//   clientPerson: '',
//   status: '',
//   index: 0,
//   author: {},
//   participants: [],
//   description: '',
//   subtasks: [],
//   startDate: ' ',
//   deadline: '',
// };

function DraggableCard({ task, index, doneSubtasks = 0, isDragAllowed }) {
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [deleteCaptcha, setDeleteCaptcha] = useState(false);
  const { dispatch } = useStudioTasksContext();
  const { companies } = useCompaniesContext();
  // const [isEditing, setIsEditing] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [formValue, setFormValue] = useState<StudioTaskTypes>(task);

  const taskClass =
    task.participants.length > 4 ? styles.taskHigher : styles.task;

  const dragDisabledClass = isDragAllowed ? '' : styles.dragDisabled;

  const companyClass = task.client.split(' ').join('');

  const subtasksLength = task.subtasks.length;

  const handleDeleteTask = async (id) => {
    dispatch({ type: 'DELETE_STUDIOTASK', payload: task });
    closeModal();
    await deleteTask(id);
  };

  const handleArchiveTask = async (id) => {
    dispatch({ type: 'DELETE_STUDIOTASK', payload: task });
    closeModal();
    await archiveStudioTask(id);
  };

  const {
    users,
    // formValue,
    // setFormValue,
    // handleAddMember,
    // handleDeleteMember,
    // clientInputValue,
    // setClientInputValue,
  } = useSelectUser({
    initialValue: task,
    objectKey: 'participants',
  });

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleBlur = async () => {
    // setIsEditing(false);
    try {
      await UpdateStudioTask({ id: task._id, studioTaskData: formValue });
      const res = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: res });
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleAddMember = async (userId: string) => {
    const userToAdd = users.find((user) => user._id === userId);

    if (!userToAdd) return;

    const participants = [...task.participants];

    const isAlreadyAdded = participants.some(
      (participant) => participant._id === userId
    );

    if (isAlreadyAdded) return;

    const newFormValue = {
      ...task,
      participants: [...participants, userToAdd],
    };

    setFormValue(newFormValue);

    try {
      await UpdateStudioTask({
        id: task._id,
        studioTaskData: newFormValue,
      });
      const res = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: res });
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleDeleteMember = async (userId: string) => {
    const participants = [...task.participants];

    const filteredParticipants = participants.filter(
      (participant) => participant._id !== userId
    );

    setFormValue((prev) => {
      return {
        ...prev,
        participants: filteredParticipants,
      };
    });

    try {
      await UpdateStudioTask({
        id: task._id,
        studioTaskData: { ...task, participants: filteredParticipants },
      });
      const res = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: res });
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleClientChange = async (e) => {
    const companyObject = companies.filter(
      (com) => com.name === e.target.value
    );
    const companyFirstClientPerson = companyObject[0].clientPerson[0].value;
    handleFormChange(e, 'client');
    setFormValue((prev) => {
      return {
        ...prev,
        clientPerson: companyFirstClientPerson,
      };
    });
    try {
      await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          ...task,
          client: e.target.value,
          clientPerson: companyFirstClientPerson,
        },
      });
      const res = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: res });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClientPersonChange = async (e) => {
    handleFormChange(e, 'clientPerson');
    try {
      await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          ...task,
          clientPerson: e.target.value,
        },
      });
      const res = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: res });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        {deleteCaptcha ? (
          <Captcha
            handleDeleteCompany={handleDeleteTask}
            setDeleteCaptcha={setDeleteCaptcha}
            id={task._id}
          />
        ) : (
          <>
            <h3>Edytuj</h3>
            <div className={styles.modalContainer}>
              <div className={styles.infoColumn}>
                {/* <p>{task.title}</p> */}
                <input
                  type="text"
                  name="taskTitle"
                  id="taskTitle"
                  onChange={(e) => {
                    handleFormChange(e, 'title');
                  }}
                  onBlur={handleBlur}
                  // onClick={}
                  value={formValue.title}
                />
                <UsersDisplay data={task} usersArray={task.participants} />
                <div className={styles.clientContainer}>
                  <p
                    className={`${styles.modalCompanyBatch} ${
                      styles[`${companyClass}`]
                    }`}
                  >
                    {task.client}
                  </p>
                  <p className={styles.modalClientBatch}>{task.clientPerson}</p>
                </div>
                <div className={styles.modalDateContainer}>
                  {task.deadline && task.startDate ? (
                    <>
                      <DateFormatter dateString={task.startDate} />
                      <span>&nbsp;-&nbsp;</span>
                      <DateFormatter dateString={task.deadline} />
                    </>
                  ) : (
                    <p className={styles.noDates}>Brak dat</p>
                  )}
                </div>
                <input
                  type="text"
                  name="taskTitle"
                  id="taskTitle"
                  onChange={(e) => {
                    handleFormChange(e, 'description');
                  }}
                  onBlur={handleBlur}
                  // onClick={}
                  value={formValue.description}
                />
                {task.subtasks.map((subtask) => {
                  return (
                    <div key={subtask._id} className={styles.subtaskContainer}>
                      <input type="checkbox" checked={subtask.done} />
                      <p>{subtask.content}</p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.actionColumn}>
                <button
                  type="button"
                  className={styles.openSelectButton}
                  onClick={() => {
                    setIsSelectOpen((prev) => !prev);
                  }}
                >
                  <div className={styles.labelWrapper}>
                    <p className={styles.buttonLabel}>Przypisz ludzi</p>
                    <Icon
                      icon="material-symbols:keyboard-arrow-down-rounded"
                      width="24"
                      height="24"
                    />
                  </div>

                  {isSelectOpen && (
                    <div className={styles.selectContainer}>
                      {users.map((user) => {
                        const isUserChecked = task.participants.some(
                          (participant) => participant._id === user._id
                        );
                        return (
                          <div key={user._id} className={styles.userWrapper}>
                            <input
                              className={styles.checkInput}
                              type="checkbox"
                              checked={isUserChecked}
                              onChange={() => {
                                if (isUserChecked) {
                                  handleDeleteMember(user._id);
                                  setIsSelectOpen(true);
                                } else {
                                  handleAddMember(user._id);
                                  setIsSelectOpen(true);
                                }
                              }}
                            />
                            <p>{user.name}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </button>
                <button type="button" onClick={() => setDeleteCaptcha(true)}>
                  Usuń zlecenie
                </button>
                <button
                  onClick={() => handleArchiveTask(task._id)}
                  type="button"
                >
                  Zarchiwizuj
                </button>

                <select
                  onChange={(e) => {
                    handleClientChange(e);
                  }}
                >
                  <option value="Firma">{formValue.client}</option>
                  {companies.map((company) => {
                    return (
                      company.name !== formValue.client && (
                        <option key={company._id} value={company.name}>
                          {company.name}
                        </option>
                      )
                    );
                  })}
                </select>
                <select
                  onChange={(e) => {
                    handleClientPersonChange(e);
                  }}
                >
                  <option value="Klient">{formValue.clientPerson}</option>
                  {formValue.client.length > 0 &&
                    companies.map((company) => {
                      if (company.name === formValue.client) {
                        return company.clientPerson.map((cp) => {
                          return (
                            cp.label !== formValue.clientPerson && (
                              <option key={cp.value} value={cp.label}>
                                {cp.label}
                              </option>
                            )
                          );
                        });
                      }
                      return null;
                    })}
                </select>
              </div>
            </div>
          </>
        )}
      </ModalTemplate>
      <Draggable
        draggableId={String(task._id)}
        index={index}
        isDragDisabled={!isDragAllowed}
      >
        {(provided, snapshot) => (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={dragDisabledClass}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={() => openModal()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openModal();
                }
              }}
              style={{
                opacity: snapshot.isDragging ? 0.9 : 1,
                transform: snapshot.isDragging ? 'scale(0.95)' : '',
              }}
              className={taskClass}
            >
              <div className={styles.clientInfoWrapper}>
                <p
                  className={`${styles.clientName} ${
                    styles[`${companyClass}`]
                  }`}
                >
                  {task.client}
                </p>
                <p className={`${styles.clientPerson}`}>{task.clientPerson}</p>
              </div>

              <span className={styles.searchID}>#{task.searchID}</span>
              <p className={styles.taskTitle}>{task.title}</p>
              <div className={styles.userDisplayWrapper}>
                <UsersDisplay data={task} usersArray={task.participants} />
              </div>
              <div className={styles.datesWrapper}>
                {task.deadline && task.startDate ? (
                  <>
                    <DateFormatter dateString={task.startDate} />
                    <span>&nbsp;-&nbsp;</span>
                    <DateFormatter dateString={task.deadline} />
                  </>
                ) : (
                  <p className={styles.noDates}>Brak dat</p>
                )}
              </div>
              <div className={styles.subtasksCountWrapper}>
                <Icon icon="material-symbols:task-alt" width="12" height="12" />
                <div>
                  <span>{doneSubtasks}/</span>
                  <span>{subtasksLength}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Draggable>
    </>
  );
}

export default DraggableCard;
