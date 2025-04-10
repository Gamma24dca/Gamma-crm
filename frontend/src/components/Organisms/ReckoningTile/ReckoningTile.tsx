import { useEffect, useState } from 'react';
// import useShowLabel from '../../../hooks/useShowLabel';
import { Icon } from '@iconify/react';
import styles from './ReckoningTile.module.css';
import {
  deleteReckoningTask,
  updateDay,
  updateReckoningTask,
} from '../../../services/reckoning-view-service';
import useAuth from '../../../hooks/useAuth';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../../services/companies-service';
import Overlay from '../../Atoms/Overlay/Overlay';
import useReckoTasksContext from '../../../hooks/Context/useReckoTasksContext';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import summarizeHours from '../../../utils/SummarizeHours';
// import {
//   getStudioTask,
//   UpdateStudioTask,
// } from '../../../services/studio-tasks-service';
// import socket from '../../../socket';

function ReckoningTile({ reckTask, index, selectedMonthIndex }) {
  const [formValue, setFormValue] = useState(reckTask);
  const [isTaskDeleteLoading, setIsTaskDeleteLoading] = useState(false);
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { dispatch } = useReckoTasksContext();
  const currentDate = new Date();

  const { user } = useAuth();
  const currentUserId = user[0]._id;

  const filteredParticipants = reckTask.participants.filter((part) => {
    return part._id === currentUserId;
  });

  const filteredHours = filteredParticipants[0].months.filter((obj) => {
    const monthIndex = new Date(obj.createdAt).getUTCMonth() + 1;
    return monthIndex === selectedMonthIndex;
  });

  const [days, setDays] = useState(filteredHours);
  // const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

  const totalHours = summarizeHours(days[0].hours);

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

  const handleFormValueChange = (e, key) => {
    setFormValue((prev) => {
      return {
        ...prev,
        [key]: e.target.value,
      };
    });
  };

  const handleBlur = async (id, value) => {
    // setIsEditing(false);
    try {
      setIsTaskDeleteLoading(true);
      await updateReckoningTask({ taskId: id, value });
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      setIsTaskDeleteLoading(false);
    }
  };

  const tileClass = (tileIndex) => {
    return tileIndex % 2 === 0
      ? styles.reckTaskItem
      : styles.darkerReckTaskItem;
  };

  const handleHourChange = (dayId, e) => {
    setDays((prevData) => {
      const updatedData = prevData.map((day, dayIndex) => {
        if (dayIndex === 0) {
          return {
            ...day,
            hours: day.hours.map((item) =>
              item._id === dayId ? { ...item, hourNum: e.target.value } : item
            ),
          };
        }
        return day;
      });

      return updatedData;
    });
  };

  const handleDayUpdate = async (taskId, userId, dayId, value, month) => {
    try {
      setIsTaskDeleteLoading(true);
      await updateDay({ taskId, userId, dayId, value, month });
      dispatch({
        type: 'UPDATE_HOUR_NUM',
        payload: {
          taskId: reckTask._id,
          userId: currentUserId,
          dayId,
          newValue: Number(value.hourNum),
          selectedMonthIndex,
        },
      });
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      setIsTaskDeleteLoading(false);
    }
  };

  const handleDeleteReckoTask = async (id) => {
    try {
      setIsTaskDeleteLoading(true);
      setIsEditOpen(false);
      // const activeUsersCount = reckTask.participants.filter(
      //   (p) => p.isVisible
      // ).length;

      // if (activeUsersCount <= 1) {
      //   const updatedStudioTask = await UpdateStudioTask({
      //     id: assigneStudioTaskId,
      //     studioTaskData: { reckoTaskID: '' },
      //   });

      //   const res = await getStudioTask(updatedStudioTask._id);
      //   dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      // }

      // if (activeUsersCount <= 1) {
      const response = await deleteReckoningTask(id);
      dispatch({ type: 'DELETE_RECKOTASK', payload: response });
      // } else {
      //   const updatedParticipants = reckTask.participants.map((part) => {
      //     return part._id === currentUserId && part.isVisible
      //       ? { ...part, isVisible: false }
      //       : part;
      //   });

      //   const response = await updateReckoningTask({
      //     taskId: reckTask._id,
      //     value: { participants: updatedParticipants },
      //   });
      //   dispatch({ type: 'DELETE_RECKOTASK', payload: response });
      // }
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      setIsTaskDeleteLoading(false);
    }
  };

  const handleHoursClear = async () => {
    setDays((prevData) =>
      prevData.map((item) => {
        return item.hourNum !== 0 ? { ...item, hourNum: 0 } : item;
      })
    );

    const filterByUser = reckTask.participants.filter((part) => {
      return part._id === currentUserId;
    });

    const removedHoursFrom = filterByUser[0].hours.map((day) => {
      return day.hourNum > 0 ? { ...day, hourNum: 0 } : day;
    });

    const updatedParticipants = reckTask.participants.map((part) => {
      return part._id === currentUserId
        ? { ...filterByUser[0], hours: removedHoursFrom }
        : part;
    });

    dispatch({
      type: 'CLEAR_HOURS',
      payload: {
        taskId: reckTask._id,
        userId: currentUserId,
      },
    });

    await updateReckoningTask({
      taskId: reckTask._id,
      value: { participants: updatedParticipants },
    });
  };

  return (
    <div className={styles.reckoningItemContainer}>
      <div className={styles.editButtonWrapper}>
        <button
          type="button"
          className={styles.moreButton}
          onClick={() => {
            setIsEditOpen((prev) => !prev);
          }}
        >
          {isTaskDeleteLoading ? (
            <CheckboxLoader />
          ) : (
            <Icon icon="ic:outline-more-vert" width="24" height="24" />
          )}
        </button>
        {isEditOpen && (
          <>
            <Overlay closeFunction={setIsEditOpen} />
            <div className={styles.editModal}>
              <div
                className={styles.deleteWrapper}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleDeleteReckoTask(reckTask._id);
                  }
                }}
                onClick={() => {
                  handleDeleteReckoTask(reckTask._id);
                }}
              >
                <Icon
                  className={styles.trashIcon}
                  icon="line-md:document-delete"
                  width="20"
                  height="20"
                />
                <p>Usuń</p>
              </div>
              <div
                className={styles.deleteWrapper}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleDeleteReckoTask(reckTask._id);
                  }
                }}
                onClick={() => {
                  handleBlur(reckTask._id, {
                    client: 'Wybierz firme',
                    clientPerson: 'Wybierz klienta',
                    title: '',
                    description: '',
                    printWhat: '',
                    printWhere: '',
                  });
                  setFormValue((prev) => {
                    return {
                      ...prev,
                      client: 'Wybierz firme',
                      clientPerson: 'Wybierz klienta',
                      title: '',
                      description: '',
                      printWhat: '',
                      printWhere: '',
                    };
                  });
                  handleHoursClear();
                }}
              >
                <Icon
                  className={styles.trashIcon}
                  icon="line-md:file-document-off"
                  width="20"
                  height="20"
                />
                <p>Wyczyść</p>
              </div>
            </div>
          </>
        )}
      </div>

      <select
        className={`${styles.reckTaskItem} ${styles.companyTile} ${formValue.client}`}
        name="client"
        id="client"
        onChange={(e) => {
          handleFormValueChange(e, 'client');
          handleBlur(reckTask._id, { client: e.target.value });
        }}
      >
        <option value={formValue.client}>{formValue.client}</option>
        {companies.map((comOpt) => {
          return (
            comOpt.name !== formValue.client && (
              <option key={comOpt._id} value={comOpt.name}>
                {comOpt.name}
              </option>
            )
          );
        })}
      </select>
      <select
        onChange={(e) => {
          handleFormValueChange(e, 'clientPerson');
          handleBlur(reckTask._id, { clientPerson: e.target.value });
        }}
        className={`${styles.reckTaskItem} ${styles.clientPersonTile}`}
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
      <input
        className={`${tileClass(index)}`}
        type="text"
        name="Title"
        id="Title"
        placeholder="Dodaj tytuł..."
        value={formValue.title}
        onChange={(e) => {
          handleFormValueChange(e, 'title');
        }}
        onBlur={() => {
          handleBlur(reckTask._id, formValue);
        }}
      />

      <input
        className={`${tileClass(index)}`}
        type="text"
        name="Description"
        id="Description"
        placeholder="Dodaj opis..."
        value={formValue.description}
        onChange={(e) => {
          handleFormValueChange(e, 'description');
        }}
        onBlur={() => {
          handleBlur(reckTask._id, formValue);
        }}
      />

      <input
        className={`${tileClass(index)}`}
        type="text"
        name="Description"
        id="Description"
        placeholder="Dodaj druk..."
        value={formValue.printWhat}
        onChange={(e) => {
          handleFormValueChange(e, 'printWhat');
        }}
        onBlur={() => {
          handleBlur(reckTask._id, formValue);
        }}
      />
      <input
        className={`${tileClass(index)}`}
        type="text"
        name="Description"
        id="Description"
        placeholder="Dodaj druk..."
        value={formValue.printWhere}
        onChange={(e) => {
          handleFormValueChange(e, 'printWhere');
        }}
        onBlur={() => {
          handleBlur(reckTask._id, formValue);
        }}
      />

      <div className={styles.daysWrapper}>
        <div className={styles.summHoursContainer}>{totalHours}</div>
        {days[0].hours.map((dayTile, dayIndex) => {
          return (
            <input
              className={`${
                dayTile.isWeekend ? styles.weekendDayTile : styles.dayTile
              } ${
                dayIndex + 1 === currentDate.getDate() &&
                styles.highlightCurrentDay
              }`}
              key={dayIndex}
              value={dayTile.hourNum === 0 ? '' : dayTile.hourNum}
              onChange={(e) => {
                // console.log(typeof e.target.value);
                handleHourChange(dayTile._id, e);
                handleDayUpdate(
                  reckTask._id,
                  currentUserId,
                  dayTile._id,
                  {
                    hourNum: e.target.value !== '' ? e.target.value : 0,
                  },
                  selectedMonthIndex
                );
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ReckoningTile;
