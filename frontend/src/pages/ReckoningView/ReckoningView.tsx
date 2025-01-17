// import { useEffect, useState } from 'react';
// import { Icon } from '@iconify/react';
// import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
// import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
// import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import CTA from '../../components/Atoms/CTA/CTA';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
// import UsersDisplay from '../../components/Organisms/UsersDisplay/UsersDisplay';
// import styles from './ReckoningView.module.css';
// import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
// import {
//   addStudioTask,
//   getAllStudioTasks,
//   StudioTaskTypes,
// } from '../../services/studio-tasks-service';
// import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
// import useModal from '../../hooks/useModal';
// import useSelectUser from '../../hooks/useSelectUser';
// import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
// import { getAllCompanies } from '../../services/companies-service';
// import useAuth from '../../hooks/useAuth';
// import { statuses, statusNames } from '../../statuses';
// import AddStudioTaskModalContent from '../../components/Organisms/AddStudioTaskModalContent/AddStudioTaskModalContent';

// const colums = [
//   {
//     class: 'columnTitleMark',
//     title: 'Na później',
//   },
//   {
//     class: 'columnTitleMarkToDo',
//     title: 'Do zrobienia',
//   },
//   {
//     class: 'columnTitleMarkInProgress',
//     title: 'W trakcie',
//   },
//   {
//     class: 'columnTitleMarkSent',
//     title: 'Wysłane',
//   },
// ];

// function generateSearchID() {
//   return Math.floor(100000 + Math.random() * 900000);
// }

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

// function DateFormatter({ dateString }) {
//   const formatDate = (dateStr) => {
//     const date = new Date(dateStr);
//     return date.toLocaleDateString('pl-PL', { day: '2-digit', month: 'short' });
//   };

//   return <div className={styles.date}>{formatDate(dateString)}</div>;
// }

// const initialTaskObject = {
//   searchID: 0,
//   title: '',
//   client: '',
//   clientPerson: '',
//   status: '',
//   index: 1,
//   author: {},
//   taskType: '',
//   participants: [],
//   description: '',
//   subtasks: [],
//   deadline: '',
//   startDate: '',
// };

function StudioTaskView() {
  // const { showModal, exitAnim, openModal, closeModal } = useModal();
  // const { studioTasks, dispatch } = useStudioTasksContext();
  // const { companies, dispatch: companiesDispatch } = useCompaniesContext();

  // const [loadingState, setLoadingState] = useState({
  //   isLoading: false,
  //   isFinalMessage: false,
  //   finalMessage: '',
  // });

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     if (companies.length === 0) {
  //       try {
  //         const allCompanies = await getAllCompanies();
  //         companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
  //       } catch (error) {
  //         console.error('Error fetching users:', error);
  //       }
  //     }
  //   };

  //   fetchUsers();
  // }, [companiesDispatch, companies]);

  // const { user } = useAuth();

  // const {
  //   users,
  //   formValue,
  //   setFormValue,
  //   handleAddMember,
  //   handleDeleteMember,
  // } = useSelectUser<StudioTaskTypes>({
  //   initialValue: initialTaskObject,
  //   objectKey: 'participants',
  // });

  // const handleFormChange = (e, key) => {
  //   setFormValue((prev) => ({
  //     ...prev,
  //     [key]: e.target.value,
  //   }));
  // };

  // const handleLoadingStateChange = (key, val) => {
  //   setLoadingState((prev) => ({
  //     ...prev,
  //     [key]: val,
  //   }));
  // };

  // const createTaskHandler = async () => {
  //   try {
  //     handleLoadingStateChange('isLoading', true);
  //     const searchID = generateSearchID();
  //     const currentDate = new Date();
  //     const statusValue: StudioTaskTypes['status'] =
  //       formValue.status as StudioTaskTypes['status'];
  //     const response = await addStudioTask({
  //       searchID,
  //       title: formValue.title,
  //       client: formValue.client,
  //       clientPerson: formValue.clientPerson,
  //       status: statusValue,
  //       index: 1,
  //       author: user[0],
  //       taskType: formValue.taskType,
  //       participants: formValue.participants,
  //       description: formValue.description,
  //       subtasks: [
  //         {
  //           content: 'test subtask',
  //           done: false,
  //         },
  //         {
  //           content: 'test subtask 2',
  //           done: true,
  //         },
  //         {
  //           content: 'test subtask 2',
  //           done: true,
  //         },
  //       ],
  //       deadline: formValue.deadline,
  //       startDate: currentDate,
  //     });

  //     if (response !== null) {
  //       handleLoadingStateChange('finalMessage', 'Zlecenie utworzone!');
  //       dispatch({ type: 'CREATE_STUDIOTASK', payload: response });
  //     } else {
  //       handleLoadingStateChange('finalMessage', 'Coś poszło nie tak :(');
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     handleLoadingStateChange('isLoading', false);
  //   } finally {
  //     handleLoadingStateChange('isLoading', false);
  //     handleLoadingStateChange('isFinalMessage', true);
  //   }
  // };

  // useEffect(() => {
  //   const fetchAllStudioTasks = async () => {
  //     const AllStudioTasks = await getAllStudioTasks();
  //     dispatch({ type: 'SET_STUDIOTASKS', payload: AllStudioTasks });
  //   };

  //   fetchAllStudioTasks();
  // }, [dispatch]);

  return (
    <>
      {/* <ModalTemplate
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
      </ControlBar> */}

      <ViewContainer>
        <h2>Rozliczenie</h2>
        {/* <div className={styles.columnsWrapper}>
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
                      statusNames[task.status] === column.title && (
                        <div
                          draggable="true"
                          className={taskClass}
                          key={task._id}
                        >
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
        </div> */}
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
