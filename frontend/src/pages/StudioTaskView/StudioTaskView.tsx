import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { DndContext, useDroppable } from '@dnd-kit/core';

import Calendar from 'react-calendar';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import UsersDisplay from '../../components/Organisms/UsersDisplay/UsersDisplay';
import styles from './StudioTaskView.module.css';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  addStudioTask,
  getAllStudioTasks,
} from '../../services/studio-tasks-service';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import useSelectUser from '../../hooks/useSelectUser';
import Loader from '../../components/Molecules/Loader/Loader';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import useAuth from '../../hooks/useAuth';
import SelectUser from '../../components/Molecules/SelectUser/SelectUser';
import CompanyGraphicTile from '../../components/Molecules/CompanyGraphicTile/CompanyGraphicTile';
import DraggableCard from '../../components/Molecules/DraggableCard/DraggableCard';

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
  return Math.floor(100000 + Math.random() * 900000);
}

// const createCompanySchema = Yup.object({
//   searchID: Yup.string().required('Wymagane'),
//   title: Yup.string().required('Nazwa jest wymagana'),
//   client: Yup.string(),
//   clientPerson: Yup.string(),
//   status: Yup.string(),
//   author: Yup.object(),
//   taskType: Yup.string(),
//   participants: Yup.array(),
//   description: Yup.string(),
//   subtasks: Yup.array(),
//   deadline: Yup.date(),
//   startDate: Yup.date(),
// });

function DateFormatter({ dateString }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
  };

  return <div className={styles.date}>{formatDate(dateString)}</div>;
}

const initialTaskObject = {
  title: '',
  client: '',
  clientPerson: '',
  status: '',
  author: {},
  taskType: '',
  participants: [],
  description: '',
  subtasks: [],
  deadline: '',
  startDate: '',
};

function StudioTaskView() {
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { studioTasks, dispatch } = useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [isDropped, setIsDropped] = useState(false);

  function handleDragEnd(event) {
    if (event.over && event.over.id === 'droppable') {
      setIsDropped(true);
    }
  }

  const draggableMarkup = <DraggableCard>Przeciągnij</DraggableCard>;

  const { isOver, setNodeRef } = useDroppable({
    id: 'droppable',
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };

  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isFinalMessage: false,
    finalMessage: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [companiesDispatch, companies]);

  const { user } = useAuth();

  const {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
  } = useSelectUser({
    initialValue: initialTaskObject,
    objectKey: 'participants',
  });

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleLoadingStateChange = (key, val) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const createTaskHandler = async () => {
    try {
      handleLoadingStateChange('isLoading', true);
      const searchID = generateSearchID();
      const currentDate = new Date();
      const response = await addStudioTask({
        searchID,
        title: formValue.title,
        client: formValue.client,
        clientPerson: formValue.clientPerson,
        status: formValue.status,
        author: user[0],
        taskType: formValue.taskType,
        participants: formValue.participants,
        description: formValue.description,
        subtasks: [
          {
            content: 'test subtask',
            done: false,
          },
          {
            content: 'test subtask 2',
            done: true,
          },
          {
            content: 'test subtask 2',
            done: true,
          },
        ],
        deadline: formValue.deadline,
        startDate: currentDate,
      });

      if (response !== null) {
        handleLoadingStateChange('finalMessage', 'Zlecenie utworzone!');
        dispatch({ type: 'CREATE_STUDIOTASK', payload: response });
      } else {
        handleLoadingStateChange('finalMessage', 'Coś poszło nie tak :(');
      }
    } catch (error) {
      console.error(error);
      handleLoadingStateChange('isLoading', false);
    } finally {
      handleLoadingStateChange('isLoading', false);
      handleLoadingStateChange('isFinalMessage', true);
    }
  };

  useEffect(() => {
    const fetchAllStudioTasks = async () => {
      const AllStudioTasks = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: AllStudioTasks });
    };

    fetchAllStudioTasks();
  }, [dispatch]);

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        <div>
          <h2>Utwórz zlecenie</h2>
          {loadingState.isLoading ? (
            <div className={styles.loaderWrapper}>
              <Loader />
            </div>
          ) : (
            <div>
              <input
                type="text"
                name="Title"
                id="Title"
                placeholder="Tytuł"
                value={formValue.title}
                onChange={(e) => handleFormChange(e, 'title')}
              />
              <select
                name="companies"
                id="companies"
                onChange={(e) => handleFormChange(e, 'client')}
              >
                <option value="">Wybierz firme</option>
                {companies.map((company) => {
                  return (
                    <option key={company._id} value={company.name}>
                      {company.name}
                    </option>
                  );
                })}
              </select>
              <select
                name="client-person"
                id="client-person"
                onChange={(e) => handleFormChange(e, 'clientPerson')}
              >
                <option value="">Wybierz klienta</option>
                {formValue.client.length > 0 &&
                  companies.map((company) => {
                    if (company.name === formValue.client) {
                      return company.clientPerson.map((cp) => {
                        return (
                          <option key={cp.value} value={cp.label}>
                            {cp.label}
                          </option>
                        );
                      });
                    }
                    return null;
                  })}
              </select>
              <select
                name="status"
                id="status"
                onChange={(e) => handleFormChange(e, 'status')}
              >
                <option value="">Status</option>
                <option value="Na później">Na później</option>
                <option value="Do zrobienia">Do zrobienia</option>
                <option value="W trakcie">W trakcie</option>
                <option value="Wysłane">Wysłane</option>
              </select>
              <select
                name="task-type"
                id="task-type"
                onChange={(e) => handleFormChange(e, 'taskType')}
              >
                <option value="">Rodzaj zlecenia</option>
                <option value="Kreacja">Kreacja</option>
                <option value="Druk">Druk</option>
                <option value="Multimedia">Multimedia</option>
                <option value="Gadżety">Gadżety</option>
                <option value="Szwalnia">Szwalnia</option>
              </select>
              <input
                type="text"
                name="Description"
                id="Description"
                placeholder="Opis"
                value={formValue.description}
                onChange={(e) => handleFormChange(e, 'description')}
              />

              <SelectUser users={users} handleAddMember={handleAddMember} />
              {formValue.participants.length > 0 && (
                <div className={styles.displayMembersWrapper}>
                  {formValue.participants.map((member) => {
                    return (
                      <CompanyGraphicTile
                        key={member._id}
                        member={member}
                        handleDeleteMember={handleDeleteMember}
                      />
                    );
                  })}
                </div>
              )}
              <Calendar
                value={formValue.deadline}
                onChange={(e) => {
                  setFormValue((prev) => ({
                    ...prev,
                    deadline: e.toString(),
                  }));
                }}
                locale="pl-PL"
              />

              <button type="button" onClick={createTaskHandler}>
                Dodaj
              </button>
              <p>{loadingState.finalMessage}</p>
            </div>
          )}
        </div>
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>
        <SearchInput />
        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
            }}
          >
            Nowe zlecenie
          </CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
      </ControlBar>
      <ViewContainer>
        <div className={styles.columnsWrapper}>
          <DndContext onDragEnd={(e) => handleDragEnd(e)}>
            {colums.map((column) => {
              return (
                <div
                  ref={setNodeRef}
                  style={style}
                  className={styles.taskColumnContainer}
                  key={column.class}
                >
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

                      // keep this value in useState
                      let doneSubtasks = 0;

                      task.subtasks.forEach((subtask) => {
                        if (subtask.done) {
                          doneSubtasks += 1;
                        }
                      });

                      const taskClass =
                        task.participants.length > 4
                          ? styles.taskHigher
                          : styles.task;

                      const companyClass = task.client.split(' ').join('');

                      return (
                        task.status === column.title && (
                          <div
                            draggable="true"
                            className={taskClass}
                            key={task._id}
                          >
                            {!isDropped ? draggableMarkup : null}

                            <div className={styles.clientInfoWrapper}>
                              <p
                                className={`${styles.clientName} ${
                                  styles[`${companyClass}`]
                                }`}
                              >
                                {task.client}
                              </p>
                              <p className={`${styles.clientPerson}`}>
                                {task.clientPerson}
                              </p>
                            </div>

                            <span className={styles.searchID}>
                              #{task.searchID}
                            </span>
                            <p className={styles.taskTitle}>{task.title}</p>
                            <div className={styles.userDisplayWrapper}>
                              <UsersDisplay
                                data={task}
                                usersArray={task.participants}
                              />
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
          </DndContext>
        </div>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
