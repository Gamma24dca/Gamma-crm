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
import ArchivedListView from '../../components/Organisms/ArchivedListView/ArchivedListView';
import MultiselectDropdown from '../../components/Molecules/MultiselectDropdown/MultiselectDropdown';

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
  const [isUsersSelectOpen, setIsUsersSelectOpen] = useState(false);
  const [isCompaniesSelectOpen, setIsCompaniesSelectOpen] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isFinalMessage: false,
    finalMessage: '',
  });
  const [filterDropdown, setFilterDropdown] = useState<boolean>(false);
  const [participantsToFilter, setParticipantsToFilter] = useState<string[]>(
    () => {
      const storedFilters = localStorage.getItem('participantsToFilter');
      return storedFilters ? JSON.parse(storedFilters) : [];
    }
  );
  const [companiesToFilter, setCompaniesToFilter] = useState<string[]>(() => {
    const storedCompanies = localStorage.getItem('companiesToFilter');
    return storedCompanies ? JSON.parse(storedCompanies) : [];
  });

  const { user } = useAuth();

  useEffect(() => {
    localStorage.setItem(
      'participantsToFilter',
      JSON.stringify(participantsToFilter)
    );

    localStorage.setItem(
      'companiesToFilter',
      JSON.stringify(companiesToFilter)
    );
  }, [participantsToFilter, companiesToFilter]);

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

      let indexOfNewTask;
      if (tasksByStatus[statusValue].length > 0) {
        indexOfNewTask =
          tasksByStatus[statusValue][tasksByStatus[statusValue].length - 1]
            .index + 1;
      }
      if (tasksByStatus[statusValue].length === 0) {
        indexOfNewTask = tasksByStatus[statusValue].length + 1;
      }
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
        subtasks: [],
        deadline: formValue.deadline,
        startDate: currentDate,
      });

      if (response !== null) {
        handleLoadingStateChange('finalMessage', 'Zlecenie utworzone!');
        setFormValue(initialTaskObject);

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
          handleLoadingStateChange('isFinalMessage', false);
          setFormValue(initialTaskObject);
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
          <CTA
            onClick={() => {
              setFilterDropdown((prev) => !prev);
            }}
          >
            Filtry
          </CTA>
        </div>
        {filterDropdown && (
          <>
            <div
              className={styles.overlay}
              onClick={() => setFilterDropdown(false)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === 'Escape') {
                  setFilterDropdown(false);
                }
              }}
            />
            <div className={styles.filterDropdownContainer}>
              <h3 className={styles.dropdownHeader}>Filtr</h3>
              <div className={styles.assignedToMeWrapper}>
                <input
                  type="checkbox"
                  className={styles.assignedToMeCheckbox}
                  checked={participantsToFilter.includes(user[0]._id)}
                  onChange={() => {
                    if (participantsToFilter.includes(user[0]._id)) {
                      setParticipantsToFilter(
                        participantsToFilter.filter(
                          (part) => part !== user[0]._id
                        )
                      );
                    } else {
                      setParticipantsToFilter((prev) => {
                        return [...prev, user[0]._id];
                      });
                    }
                  }}
                />
                <img src={`${user[0].img}`} alt="" className={styles.userImg} />
                <p>Przypisane do mnie</p>
              </div>
              <div className={styles.usersDropdownContainer}>
                <MultiselectDropdown
                  isSelectOpen={isUsersSelectOpen}
                  setIsSelectOpen={setIsUsersSelectOpen}
                  label="Członkowie"
                >
                  {users.map((userOnDrop) => {
                    return (
                      user._id !== user[0]._id && (
                        <div
                          key={userOnDrop._id}
                          className={styles.userWrapper}
                        >
                          <input
                            className={styles.checkInput}
                            type="checkbox"
                            checked={participantsToFilter.includes(
                              userOnDrop._id
                            )}
                            onChange={() => {
                              if (
                                participantsToFilter.includes(userOnDrop._id)
                              ) {
                                setParticipantsToFilter(
                                  participantsToFilter.filter(
                                    (part) => part !== userOnDrop._id
                                  )
                                );

                                setIsUsersSelectOpen(true);
                              } else {
                                setParticipantsToFilter((prev) => {
                                  return [...prev, userOnDrop._id];
                                });
                                setIsUsersSelectOpen(true);
                              }
                            }}
                          />
                          <p>{userOnDrop.name}</p>
                        </div>
                      )
                    );
                  })}
                </MultiselectDropdown>
              </div>

              <div className={styles.companiesDropdownContainer}>
                <MultiselectDropdown
                  isSelectOpen={isCompaniesSelectOpen}
                  setIsSelectOpen={setIsCompaniesSelectOpen}
                  label="Firmy"
                >
                  {companies.map((company) => {
                    return (
                      <div key={company._id} className={styles.userWrapper}>
                        <input
                          className={styles.checkInput}
                          type="checkbox"
                          checked={companiesToFilter.includes(company.name)}
                          onChange={() => {
                            if (companiesToFilter.includes(company.name)) {
                              setCompaniesToFilter(
                                companiesToFilter.filter(
                                  (part) => part !== company.name
                                )
                              );

                              setIsCompaniesSelectOpen(true);
                            } else {
                              setCompaniesToFilter((prev) => {
                                return [...prev, company.name];
                              });
                              setIsCompaniesSelectOpen(true);
                            }
                          }}
                        />
                        <p>{company.name}</p>
                      </div>
                    );
                  })}
                </MultiselectDropdown>
              </div>

              <button
                type="button"
                className={styles.clearButton}
                onClick={() => {
                  setParticipantsToFilter([]);
                  setCompaniesToFilter([]);
                }}
              >
                Wyczyść
              </button>
            </div>
          </>
        )}
      </ControlBar>

      {viewVariable === 'Aktywne' ? (
        <KanbanView
          filterArray={participantsToFilter}
          companiesFilterArray={companiesToFilter}
        />
      ) : (
        <ArchivedListView
          activeGroupedTasks={tasksByStatus}
          setViewVariable={setViewVariable}
        />
      )}
    </>
  );
}

export default StudioTaskView;
