import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import styles from './StudioTaskView.module.css';
import { getTasksByStatus, statuses, statusNames } from '../../statuses';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  addStudioTask,
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../services/studio-tasks-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import CTA from '../../components/Atoms/CTA/CTA';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import AddStudioTaskModalContent from '../../components/Organisms/AddStudioTaskModalContent/AddStudioTaskModalContent';
import useSelectUser from '../../hooks/useSelectUser';
import useAuth from '../../hooks/useAuth';
import generateSearchID from '../../utils/generateSearchId';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../services/companies-service';
import Select from '../../components/Atoms/Select/Select';
import KanbanView from '../../components/Organisms/KanbanView/KanbanView';

const initialTaskObject: StudioTaskTypes = {
  searchID: 0,
  title: '',
  client: '',
  clientPerson: '',
  status: 'na_później',
  index: 1,
  author: {
    _id: '',
    email: '',
    img: '',
    job: '',
    lastname: '',
    name: '',
    phone: 0,
  },
  taskType: '',
  participants: [],
  description: '',
  subtasks: [],
  deadline: '',
  startDate: new Date(),
};

const viewOptions = ['Aktywne', 'Archiwum'];

function StudioTaskView() {
  const [viewVariable, setViewVariable] = useState('Aktywne');
  const { studioTasks, dispatch } = useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [tasksByStatus, setTasksByStatus] = useState(getTasksByStatus([]));
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isFinalMessage: false,
    finalMessage: '',
  });

  const { user } = useAuth();

  useEffect(() => {
    const fetchCompanies = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchCompanies();
  }, [companiesDispatch, companies]);

  const {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
  } = useSelectUser<StudioTaskTypes>({
    initialValue: initialTaskObject,
    objectKey: 'participants',
  });

  const handleLoadingStateChange = (key, val) => {
    setLoadingState((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleViewChange = (e) => {
    setViewVariable(e.target.value);
  };

  const createTaskHandler = async () => {
    try {
      handleLoadingStateChange('isLoading', true);
      const searchID = generateSearchID();
      const currentDate = new Date();
      const statusValue: StudioTaskTypes['status'] =
        formValue.status as StudioTaskTypes['status'];

      const indexOfNewTask =
        tasksByStatus[statusValue][tasksByStatus[statusValue].length - 1]
          .index + 1;
      const response = await addStudioTask({
        searchID,
        title: formValue.title,
        client: formValue.client,
        clientPerson: formValue.clientPerson,
        status: statusValue,
        index: indexOfNewTask,
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
    const fetchTasks = async () => {
      if (studioTasks.length === 0) {
        try {
          const allStudioTasks = await getAllStudioTasks();
          dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }

      if (studioTasks) {
        const newTasksByStatus = getTasksByStatus(studioTasks);
        if (!isEqual(newTasksByStatus, tasksByStatus)) {
          setTasksByStatus({ ...newTasksByStatus });
        }
      }
    };

    fetchTasks();
  }, [dispatch, studioTasks]);

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        <AddStudioTaskModalContent
          loadingState={loadingState}
          formValue={formValue}
          handleFormChange={handleFormChange}
          companies={companies}
          statuses={statuses}
          statusNames={statusNames}
          users={users}
          handleAddMember={handleAddMember}
          handleDeleteMember={handleDeleteMember}
          createTaskHandler={createTaskHandler}
          setFormValue={setFormValue}
        />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>

        <Select
          value={viewVariable}
          handleValueChange={handleViewChange}
          optionData={viewOptions}
        />
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

      {viewVariable === 'Aktywne' ? <KanbanView /> : <p>Lista archiwum</p>}
    </>
  );
}

export default StudioTaskView;
