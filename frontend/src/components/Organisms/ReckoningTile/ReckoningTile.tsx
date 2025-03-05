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

function ReckoningTile({ reckTask, index }) {
  const [formValue, setFormValue] = useState(reckTask);
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { dispatch } = useReckoTasksContext();

  const { user } = useAuth();
  const currentUserId = user[0]._id;

  const filterReckTasks = reckTask.participants.filter((part) => {
    return part._id === currentUserId;
  });

  const [days, setDays] = useState(filterReckTasks[0].hours);
  // const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

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
      await updateReckoningTask({ taskId: id, value });
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const tileClass = (tileIndex) => {
    return tileIndex % 2 === 0
      ? styles.reckTaskItem
      : styles.darkerReckTaskItem;
  };

  const handleHourChange = (dayId, e) => {
    setDays((prevData) =>
      prevData.map((item) => {
        return item._id === dayId ? { ...item, hourNum: e.target.value } : item;
      })
    );
  };

  const handleDayUpdate = async (taskId, userId, dayId, value) => {
    try {
      await updateDay({ taskId, userId, dayId, value });
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleDeleteReckoTask = async (id) => {
    try {
      setIsEditOpen(false);
      const response = await deleteReckoningTask(id);
      console.log(response);
      dispatch({ type: 'DELETE_RECKOTASK', payload: response });
    } catch (error) {
      console.error('Error saving value:', error);
    }
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
          <Icon icon="ic:outline-more-vert" width="24" height="24" />
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
                  icon="solar:trash-bin-minimalistic-broken"
                  width="20"
                  height="20"
                />
                <p>Usuń</p>
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
        {days.map((dayTile, dayIndex) => {
          return (
            <input
              className={
                dayTile.isWeekend ? styles.weekendDayTile : styles.dayTile
              }
              key={dayIndex}
              value={dayTile.hourNum}
              onChange={(e) => {
                handleHourChange(dayTile._id, e);
              }}
              onBlur={(e) => {
                handleDayUpdate(reckTask._id, currentUserId, dayTile._id, {
                  hourNum: e.target.value,
                });
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ReckoningTile;
