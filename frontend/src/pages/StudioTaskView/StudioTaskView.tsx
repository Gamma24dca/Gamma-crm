import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
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
// import useSelectUser from '../../hooks/useSelectUser';
import Loader from '../../components/Molecules/Loader/Loader';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import useAuth from '../../hooks/useAuth';

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

function StudioTaskView() {
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { studioTasks, dispatch } = useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [formData, setFormData] = useState({
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
  });
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

  // const {
  //   users,
  //   formValue,
  //   setFormValue,
  //   handleAddMember,
  //   handleDeleteMember,
  //   handleMemberChange,
  //   selectedMember,
  // } = useSelectUser();

  const handleFormChange = (e, key) => {
    setFormData((prev) => ({
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
      const response = await addStudioTask({
        searchID,
        title: formData.title,
        client: formData.client,
        clientPerson: formData.clientPerson,
        status: formData.status,
        author: user[0],
        taskType: formData.taskType,
        participants: [
          {
            _id: '672a17729df774cf83b094ad',
            name: 'Kamil',
            lastname: 'Mika',
            email: 'kamil3.mika@gamma24.pl',
            phone: 531099779,
            job: 'Grafik',
            img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1683719307/AboutPage/Gamma_Kamil-min.jpg',
          },
          {
            _id: '655f423bf7ce6ff8c9b4f307',
            name: 'Bartek',
            lastname: 'Szyfner',
            email: 'bartek.szyfner@gamma24.pl',
            phone: 531099779,
            job: 'Grafik',
            img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1683719307/AboutPage/Gamma_Bartek-min.jpg',
          },
        ],
        description: 'studio task test model',
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
        deadline: '2023-12-07T10:24:14.128Z',
        startDate: 'Fri Nov 15 2024 11:08:25 GMT+0100',
      });

      if (response !== null) {
        handleLoadingStateChange('finalMessage', 'Zlecenie utworzone!');
      } else {
        handleLoadingStateChange('finalMessage', 'Coś poszło nie tak :(');
      }
    } catch (error) {
      console.log(error);
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
                value={formData.title}
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
                {formData.client.length > 0 &&
                  companies.map((company) => {
                    if (company.name === formData.client) {
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

                    let doneSubtasks = 0;

                    task.subtasks.forEach((subtask) => {
                      if (subtask.done) {
                        doneSubtasks += 1;
                      }
                    });

                    return (
                      task.status === column.title && (
                        <div className={styles.task} key={task._id}>
                          <div className={styles.clientInfoWrapper}>
                            <p
                              className={`${styles.clientName} ${
                                styles[`${task.client}`]
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
                          <p>{task.title}</p>
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
        </div>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
