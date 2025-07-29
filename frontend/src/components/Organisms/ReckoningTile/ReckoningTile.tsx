import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
// import useShowLabel from '../../../hooks/useShowLabel';
import { Icon } from '@iconify/react';
import styles from './ReckoningTile.module.css';
import {
  deleteReckoningTask,
  updateDay,
  updateReckoningTask,
} from '../../../services/reckoning-view-service';
import useAuth from '../../../hooks/useAuth';
import Overlay from '../../Atoms/Overlay/Overlay';
import useReckoTasksContext from '../../../hooks/Context/useReckoTasksContext';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';
import summarizeHours from '../../../utils/SummarizeHours';

function ReckoningTile({
  reckTask,
  index,
  selectedMonthIndex,
  companies,
  isAssignedToKanban,
}) {
  const [formValue, setFormValue] = useState(reckTask);
  const [isTaskDeleteLoading, setIsTaskDeleteLoading] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState({
    isOpen: false,
    position: null,
  });

  const { dispatch } = useReckoTasksContext();
  const currentDate = new Date();

  const { user } = useAuth();
  const currentUserId = user[0]._id;

  const filteredParticipants =
    reckTask.participants?.filter((part) => part._id === currentUserId) || [];

  const filteredHours =
    filteredParticipants.length > 0
      ? filteredParticipants[0].months?.filter((obj) => {
          const monthIndex = new Date(obj.createdAt).getUTCMonth() + 1;
          return monthIndex === selectedMonthIndex;
        }) || []
      : [];

  const [days, setDays] = useState(filteredHours);
  // const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

  const totalHours = days.length > 0 ? summarizeHours(days[0].hours) : 0;

  useEffect(() => {
    const updatedFilteredParticipants = reckTask.participants.filter((part) => {
      return part._id === currentUserId;
    });

    const updatedFilteredHours = updatedFilteredParticipants[0].months.filter(
      (obj) => {
        const monthIndex = new Date(obj.createdAt).getUTCMonth() + 1;
        return monthIndex === selectedMonthIndex;
      }
    );

    setDays(updatedFilteredHours);
  }, [reckTask.participants, selectedMonthIndex, currentUserId]);

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

  const handleHoursClear = async () => {
    const findUser = reckTask.participants.find((part) => {
      return part._id === currentUserId;
    });

    const clearedMonthHours = findUser.months.map((m) => {
      const monthIndex = new Date(m.createdAt).getUTCMonth() + 1;

      return monthIndex === selectedMonthIndex
        ? {
            ...m,
            hours: m.hours.map((h) => {
              return h.hourNum > 0 ? { ...h, hourNum: 0 } : h;
            }),
          }
        : m;
    });

    const updatedParticipants = reckTask.participants.map((part) => {
      return part._id === currentUserId
        ? { ...findUser, months: clearedMonthHours }
        : part;
    });

    dispatch({
      type: 'CLEAR_HOURS',
      payload: {
        taskId: reckTask._id,
        userId: currentUserId,
        selectedMonthIndex,
      },
    });

    await updateReckoningTask({
      taskId: reckTask._id,
      value: { participants: updatedParticipants },
    });
  };

  const handleDeleteReckoTask = async (id) => {
    try {
      setIsTaskDeleteLoading(true);
      setIsEditOpen((prev) => {
        return {
          ...prev,
          isOpen: false,
        };
      });

      const currentParticipant = reckTask.participants.find(
        (p) => p._id === currentUserId
      );

      const currentMonth = currentParticipant.months.find((m) => {
        const date = new Date(m.createdAt);
        return date.getMonth() === selectedMonthIndex;
      });

      const response = await deleteReckoningTask(id, currentMonth._id);
      dispatch({ type: 'DELETE_RECKOTASK', payload: response });
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      setIsTaskDeleteLoading(false);
    }
  };

  function ReckoTaskEditSelect(position) {
    if (!position) return null;

    const { top, left } = position;

    const style: React.CSSProperties = {
      position: 'absolute' as const,
      top,
      left,
    };

    return ReactDOM.createPortal(
      <>
        <Overlay closeFunction={setIsEditOpen} />
        <div className={styles.editModal} style={style}>
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
            <p>Usuń zlecenie</p>
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
              handleHoursClear();
            }}
          >
            <Icon
              className={styles.trashIcon}
              icon="mdi:clock-minus-outline"
              width="20"
              height="20"
            />
            <p>Wyczyść godziny</p>
          </div>
          {!isAssignedToKanban && (
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
              <p>Wyczyść zlecenie</p>
            </div>
          )}
        </div>
      </>,

      document.getElementById('select-root')
    );
  }

  return (
    <div className={styles.commonGrid}>
      <div className={styles.editButtonWrapper}>
        <button
          type="button"
          className={styles.moreButton}
          onClick={(e) => {
            const rect = (
              e.target as HTMLButtonElement
            ).getBoundingClientRect();
            setIsEditOpen((prev) => {
              return {
                position: {
                  top: rect.bottom + 5 + window.scrollY,
                  left: rect.left + window.scrollX,
                },
                isOpen: !prev.isOpen,
              };
            });
          }}
        >
          {isTaskDeleteLoading ? (
            <CheckboxLoader />
          ) : (
            <Icon icon="ic:outline-more-vert" width="24" height="24" />
          )}
        </button>
        {isEditOpen && <>{ReckoTaskEditSelect(isEditOpen.position)}</>}
      </div>

      <select
        className={`${styles.reckTaskItem} ${styles.companyTile} ${formValue.client}`}
        name="client"
        id="client"
        onChange={(e) => {
          handleFormValueChange(e, 'client');
          handleBlur(reckTask._id, { client: e.target.value });
        }}
        disabled={isAssignedToKanban}
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
        disabled={isAssignedToKanban}
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
      <input
        className={`${tileClass(index)} ${styles.titleInput}`}
        type="text"
        name="Title"
        id="Title"
        placeholder="Dodaj tytuł..."
        value={formValue.title}
        disabled={isAssignedToKanban}
        onChange={(e) => {
          handleFormValueChange(e, 'title');
        }}
        onBlur={() => {
          handleBlur(reckTask._id, formValue);
        }}
      />

      <div className={styles.daysWrapper}>
        <div className={styles.summHoursContainer}>{totalHours}</div>

        {days.length > 0 &&
          days[0].hours.map((dayTile, dayIndex) => {
            return (
              <input
                className={`${
                  dayTile.isWeekend ? styles.weekendDayTile : styles.dayTile
                } ${
                  dayIndex + 1 === currentDate.getDate() &&
                  styles.highlightCurrentDay
                }`}
                type="number"
                min="0"
                max="24"
                // maxLength="2"
                key={dayIndex}
                value={dayTile.hourNum === 0 ? '' : dayTile.hourNum}
                onChange={(e) => {
                  if (e.target.value.length > 2 || Number(e.target.value) >= 25)
                    return;

                  handleHourChange(dayTile._id, e);
                  // handleDayUpdate(
                  //   reckTask._id,
                  //   currentUserId,
                  //   dayTile._id,
                  //   {
                  //     hourNum: e.target.value !== '' ? e.target.value : 0,
                  //   },
                  //   selectedMonthIndex
                  // );
                }}
                onBlur={(e) => {
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
      <input
        className={`${tileClass(index)}`}
        type="text"
        name="Description"
        id="Description"
        placeholder="Dodaj komentarz..."
        value={formValue.description}
        disabled={isAssignedToKanban}
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
        name="PrintWhat"
        id="PrintWhat"
        placeholder="Dodaj druk..."
        value={formValue.printWhat}
        disabled={isAssignedToKanban}
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
        name="PrintWhere"
        id="PrintWhere"
        placeholder="Dodaj druk..."
        value={formValue.printWhere}
        disabled={isAssignedToKanban}
        onChange={(e) => {
          handleFormValueChange(e, 'printWhere');
        }}
        onBlur={() => {
          handleBlur(reckTask._id, formValue);
        }}
      />
      <div className={styles.daysWrapper}>
        <div className={styles.summHoursContainer}>{totalHours}</div>

        {days.length > 0 &&
          days[0].hours.map((dayTile, dayIndex) => {
            return (
              <input
                className={`${
                  dayTile.isWeekend ? styles.weekendDayTile : styles.dayTile
                } ${
                  dayIndex + 1 === currentDate.getDate() &&
                  styles.highlightCurrentDay
                }`}
                type="number"
                min="0"
                max="99"
                // maxLength="2"
                key={dayIndex}
                value={dayTile.hourNum === 0 ? '' : dayTile.hourNum}
                onChange={(e) => {
                  // Allow only max 2 digits
                  if (e.target.value.length > 2) return;

                  handleHourChange(dayTile._id, e);
                  // handleDayUpdate(
                  //   reckTask._id,
                  //   currentUserId,
                  //   dayTile._id,
                  //   {
                  //     hourNum: e.target.value !== '' ? e.target.value : 0,
                  //   },
                  //   selectedMonthIndex
                  // );
                }}
                onBlur={(e) => {
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
