import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DateFormatter from '../../../utils/dateFormatter';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import ModalSectionTitle from '../../Atoms/ModalSectionTitle/ModalSectionTitle';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './UpdateTaskModalContent.module.css';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import useStudioTaskUpdate from '../../../hooks/useStudioTaskUpdate';
import useSubtask from '../../../hooks/useSubtasks';
import useAuth from '../../../hooks/useAuth';
import checkIfUserAssigned from '../../../utils/checkIfUserAssigned';
import CompanyBatch from '../../Atoms/CompanyBatch/CompanyBatch';
import { getReckoningTask } from '../../../services/reckoning-view-service';
import summarizeHours from '../../../utils/SummarizeHours';
import { months } from '../../../hooks/useCurrentDate';

function UpdateTaskModalContent({
  task,
  closeModal,
  setDeleteCaptcha,
  companyClass,
}) {
  const [assignedReckoTask, setAssignedReckoTask] = useState([]);
  const [isReckoTaskLoading, setIsReckoTaskLoading] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
  });
  const {
    users,
    companies,
    isEditing,
    setIsEditing,
    isSelectOpen,
    setIsSelectOpen,
    isMemberChangeLoading,
    formValue,
    handleFormChange,
    handleArchiveTask,
    handleBlur,
    handleAddMember,
    handleDeleteMember,
    handleClientChange,
    handleClientPersonChange,
    isUserAssigned,
    setIsUserAssigned,
  } = useStudioTaskUpdate(task, closeModal);

  const {
    handleAddSubtask,
    handleDeleteSubtask,
    handleAddSubtaskInput,
    handleUpdateSubtask,
    handleEditSubtask,
    editSubtaskContent,
    addSubtaskInput,
  } = useSubtask(task);

  const { user: currentUser } = useAuth();

  const getAssignedReckoTask = async () => {
    try {
      setIsReckoTaskLoading(true);
      if (task.reckoTaskID) {
        const reckoTask = await getReckoningTask(task.reckoTaskID);
        if (reckoTask !== null) {
          setAssignedReckoTask([reckoTask]);
        } else {
          setAssignedReckoTask([]);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsReckoTaskLoading(false);
    }
  };

  useEffect(() => {
    setIsUserAssigned(
      checkIfUserAssigned(task.participants, currentUser[0]._id)
    );
    getAssignedReckoTask();
  }, []);

  const handleFilterDropdownInputValue = (e, key) => {
    const { value } = e.target;
    setSelectFilterValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const filteredUsersForDropdown = users.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.user.toLocaleLowerCase());
  });

  const renderReckoSection = () => {
    if (isReckoTaskLoading) {
      return (
        <div className={styles.checkboxLoaderContainer}>
          <CheckboxLoader />
        </div>
      );
    }

    if (assignedReckoTask.length === 0) {
      return (
        <p className={styles.noRecordsTitle}>Brak pozycji w rozliczeniu</p>
      );
    }

    return (
      <div className={styles.reckoTable}>
        {assignedReckoTask[0].participants.map((art) =>
          art.isVisible ? (
            <div className={styles.reckoTableRow} key={art._id}>
              <Link
                className={styles.reckoUserCell}
                to={`/użytkownicy/${art._id}`}
              >
                <img className={styles.heroImg} src={`${art.img}`} alt="" />
                <p className={styles.reckoSectionPartName}>{art.name}:</p>
              </Link>
              <div className={styles.reckoMonthCells}>
                {art.months
                  .sort(
                    (a, b) =>
                      new Date(a.createdAt).getTime() -
                      new Date(b.createdAt).getTime()
                  )
                  .map((m) => {
                    const monthIndex = new Date(m.createdAt).getUTCMonth();
                    return (
                      <div key={m._id} className={styles.reckoMonthCell}>
                        <p>{months[monthIndex].slice(0, 3)}</p>
                        <p>{summarizeHours(m.hours)}h</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : null
        )}
      </div>
    );
  };

  return (
    <>
      <h3 className={styles.editModalTitle}>Edytuj</h3>
      <div className={styles.modalContainer}>
        <div className={styles.infoColumn}>
          {/* <p>{task.title}</p> */}

          <ModalSectionTitle iconName="line-md:monitor-screenshot-twotone">
            <input
              type="text"
              name="taskTitle"
              id="taskTitle"
              onChange={(e) => {
                handleFormChange(e, 'title');
              }}
              onBlur={handleBlur}
              onClick={() => setIsEditing(true)}
              value={formValue.title}
              className={`${styles.input} ${
                isEditing ? styles.editMode : styles.noEditMode
              }`}
            />
          </ModalSectionTitle>

          <div className={styles.secondSection}>
            <div className={styles.usersContainer}>
              <p className={styles.sectionTitle}>Członkowie</p>
              {task.participants.length > 0 ? (
                <UsersDisplay data={task} usersArray={task.participants} />
              ) : (
                <p className={styles.noParticipantsPar}>Brak członków</p>
              )}
            </div>
            <div>
              <p className={styles.sectionTitle}>Klient</p>
              <div className={styles.clientContainer}>
                <CompanyBatch
                  companyClass={companyClass}
                  isClientPerson={false}
                  isBigger
                >
                  {task.client}
                </CompanyBatch>

                <CompanyBatch companyClass={null} isClientPerson isBigger>
                  {task.clientPerson}
                </CompanyBatch>
              </div>
            </div>
          </div>

          <div className={styles.thirdSection}>
            <div className={styles.cardNumberWrapper}>
              <p className={styles.sectionTitle}>Data</p>
              <div
                className={`${styles.modalDatesWrapper} ${
                  new Date(task.deadline) <= new Date()
                    ? styles.datePast
                    : styles.dateCurrent
                }`}
              >
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
            </div>
            <div>
              <p className={styles.sectionTitle}>Numer</p>
              <p className={styles.cardNumber}>#{task.searchID}</p>
            </div>
          </div>

          <ModalSectionTitle iconName="mdi:account-clock-outline">
            <p className={styles.descriptionTitle}>Rozliczenie</p>
          </ModalSectionTitle>

          <div className={`${styles.reckoTableWrapper} `}>
            {renderReckoSection()}
          </div>

          <ModalSectionTitle iconName="fluent:text-description-ltr-24-filled">
            <p className={styles.descriptionTitle}>Opis</p>
          </ModalSectionTitle>

          <textarea
            name="taskTitle"
            id="taskTitle"
            onChange={(e) => {
              handleFormChange(e, 'description');
            }}
            onBlur={handleBlur}
            // onClick={}
            value={formValue.description}
            className={styles.descriptionInput}
            placeholder="Dodaj opis zlecenia..."
          />

          <ModalSectionTitle iconName="pajamas:task-done">
            <p className={styles.descriptionTitle}>Lista zadań</p>
          </ModalSectionTitle>

          <div className={styles.subtasksContainer}>
            {task.subtasks.map((subtask) => {
              return (
                <div key={subtask._id} className={styles.subtaskContainer}>
                  {editSubtaskContent.isLoading &&
                  editSubtaskContent.subtaskId === subtask._id ? (
                    <CheckboxLoader />
                  ) : (
                    <input
                      type="checkbox"
                      checked={subtask.done}
                      onChange={() => {
                        if (subtask.done) {
                          handleUpdateSubtask(task._id, subtask._id, {
                            done: false,
                          });
                        } else {
                          handleUpdateSubtask(task._id, subtask._id, {
                            done: true,
                          });
                        }
                      }}
                    />
                  )}

                  {editSubtaskContent.isEditing &&
                  editSubtaskContent.subtaskId === subtask._id ? (
                    <input
                      autoFocus
                      type="text"
                      name="subtask content"
                      id="subtask content"
                      className={`${styles.subtaskInput} ${styles.subtaskInputEditMode}`}
                      onChange={(e) => {
                        handleEditSubtask({
                          contentValue: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        handleUpdateSubtask(task._id, subtask._id, {
                          content: editSubtaskContent.contentValue,
                        });

                        handleEditSubtask({
                          contentValue: '',
                          isEditing: false,
                          subtaskId: '',
                        });
                      }}
                      onClick={() => {
                        handleEditSubtask({ isEditing: true });
                      }}
                      value={editSubtaskContent.contentValue}
                    />
                  ) : (
                    <p
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleEditSubtask({
                            contentValue: subtask.content,
                            isEditing: true,
                            subtaskId: subtask._id,
                          });
                        }
                      }}
                      className={styles.subtaskContent}
                      onClick={() => {
                        handleEditSubtask({
                          contentValue: subtask.content,
                          isEditing: true,
                          subtaskId: subtask._id,
                        });
                      }}
                    >
                      {subtask.content}
                    </p>
                  )}

                  <Icon
                    className={styles.trashIcon}
                    icon="solar:trash-bin-minimalistic-broken"
                    width="22"
                    height="22"
                    onClick={() => {
                      handleDeleteSubtask(task._id, subtask._id);
                    }}
                  />
                </div>
              );
            })}
            {!addSubtaskInput.isInputOpen && (
              <button
                type="button"
                className={styles.addSubtaskButton}
                onClick={() =>
                  handleAddSubtaskInput({
                    isInputOpen: !addSubtaskInput.isInputOpen,
                  })
                }
              >
                Dodaj...
              </button>
            )}
            {addSubtaskInput.isInputOpen && (
              <div className={styles.addSubtaskInputWrapper}>
                <input
                  type="text"
                  className={styles.addSubtaskInput}
                  placeholder="Tytuł zadania..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddSubtask();
                    }
                  }}
                  onChange={(e) => {
                    handleAddSubtaskInput({ inputValue: e.target.value });
                  }}
                  onBlur={handleAddSubtask}
                  autoFocus
                />
                {addSubtaskInput.isSubtaskLoading && <CheckboxLoader />}
              </div>
            )}
          </div>
        </div>
        <div className={styles.actionColumn}>
          <div className={styles.joinContainer}>
            {isMemberChangeLoading.isLoading &&
              isMemberChangeLoading.loadPlace === 'Join' && <CheckboxLoader />}

            <button
              disabled={isMemberChangeLoading.isLoading}
              type="button"
              className={styles.archiveTaskButton}
              onClick={() => {
                if (!isUserAssigned) {
                  handleAddMember(currentUser[0]._id, 'Join');
                  setIsUserAssigned(true);
                } else {
                  handleDeleteMember(currentUser[0]._id, 'Join');
                  setIsUserAssigned(false);
                }
              }}
            >
              {isUserAssigned ? 'Odejdź' : 'Dołącz'}
            </button>
          </div>

          <MultiselectDropdown
            isSelectOpen={isSelectOpen}
            setIsSelectOpen={setIsSelectOpen}
            label="Członkowie"
            inputKey="user"
            inputValue={selectFilterValue.user}
            handleInputValue={handleFilterDropdownInputValue}
            isSquare={false}
          >
            {filteredUsersForDropdown.map((user) => {
              const isUserChecked = checkIfUserAssigned(
                task.participants,
                user._id
              );
              return (
                user._id !== currentUser[0]._id && (
                  <div key={user._id} className={styles.userWrapper}>
                    {isMemberChangeLoading.isLoading &&
                    user.name === isMemberChangeLoading.userName &&
                    isMemberChangeLoading.loadPlace === 'Select' ? (
                      <CheckboxLoader />
                    ) : (
                      <input
                        className={styles.checkInput}
                        type="checkbox"
                        checked={isUserChecked}
                        onChange={() => {
                          if (isUserChecked) {
                            handleDeleteMember(user._id, 'Select');
                            setIsSelectOpen(true);
                          } else {
                            handleAddMember(user._id, 'Select');
                            setIsSelectOpen(true);
                          }
                        }}
                      />
                    )}

                    <p
                      role="button"
                      tabIndex={0}
                      className={styles.userPar}
                      onClick={() => {
                        if (isUserChecked) {
                          handleDeleteMember(user._id, 'Select');
                          setIsSelectOpen(true);
                        } else {
                          handleAddMember(user._id, 'Select');
                          setIsSelectOpen(true);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          if (isUserChecked) {
                            handleDeleteMember(user._id, 'Select');
                          } else {
                            handleAddMember(user._id, 'Select');
                          }
                          setIsSelectOpen(true);
                        }
                      }}
                    >
                      {user.name}
                    </p>
                  </div>
                )
              );
            })}
          </MultiselectDropdown>

          <select
            onChange={(e) => {
              handleClientChange(e);
            }}
            className={styles.selectInput}
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
            className={styles.selectInput}
          >
            <option value="Klient">{formValue.clientPerson}</option>
            {formValue.client.length > 0 &&
              companies.map((company) => {
                if (company.name === formValue.client) {
                  return company.clientPerson.map((cp) => {
                    return (
                      cp.name !== formValue.clientPerson && (
                        <option key={cp.name} value={cp.name}>
                          {cp.name}
                        </option>
                      )
                    );
                  });
                }
                return null;
              })}
          </select>

          <button
            className={styles.archiveTaskButton}
            onClick={() => handleArchiveTask(task._id)}
            type="button"
          >
            Zarchiwizuj
          </button>
          <button
            className={styles.deleteTaskButton}
            type="button"
            onClick={() => setDeleteCaptcha(true)}
          >
            Usuń
          </button>
        </div>
      </div>
    </>
  );
}

export default UpdateTaskModalContent;
