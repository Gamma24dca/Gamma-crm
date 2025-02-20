import { useEffect, useState } from 'react';
// import useShowLabel from '../../../hooks/useShowLabel';
import styles from './ReckoningTile.module.css';
import {
  updateDay,
  updateReckoningTask,
} from '../../../services/reckoning-view-service';
import useAuth from '../../../hooks/useAuth';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../../services/companies-service';

function ReckoningTile({ reckTask, index }) {
  const [formValue, setFormValue] = useState(reckTask);
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();

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

  return (
    <div className={styles.reckoningItemContainer}>
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
      {/* <div
        className={`${styles.reckTaskItem} ${styles.companyTile} ${reckTask.client}`}
      >
        {reckTask.client}
      </div> */}
      {/* <div
        className={`${tileClass(index)}`}
        onMouseEnter={() => {
          handleMouseEnter(reckTask.clientPerson, reckTask.clientPerson);
        }}
        onMouseLeave={() => {
          handleMouseLeave();
        }}
      >
        {reckTask.clientPerson}
        {labelState.isLabel &&
          labelState.labelValue === reckTask.clientPerson &&
          labelState.labelId === reckTask.clientPerson && (
            // <HoverLabel>{reckTask.clientPerson}</HoverLabel>
            <p className={styles.test}>{reckTask.clientPerson}</p>
          )}
      </div> */}
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

      {reckTask.description ? (
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
      ) : (
        <div className={`${tileClass(index)}`}>Brak opisu</div>
      )}

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
