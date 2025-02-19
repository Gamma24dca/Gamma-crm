import { useState } from 'react';
import useShowLabel from '../../../hooks/useShowLabel';
import styles from './ReckoningTile.module.css';
import { updateReckoningTask } from '../../../services/reckoning-view-service';
import useAuth from '../../../hooks/useAuth';

function ReckoningTile({ reckTask, index }) {
  const [formValue, setFormValue] = useState(reckTask);

  const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

  const { user } = useAuth();
  const currentUserId = user[0]._id;

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

  return (
    <div className={styles.reckoningItemContainer}>
      <div
        className={`${styles.reckTaskItem} ${styles.companyTile} ${reckTask.client}`}
      >
        {reckTask.client}
      </div>
      <div
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
      </div>
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
        {reckTask.participants.map((participant) => {
          return (
            participant._id === currentUserId &&
            participant.hours.map((dayTile, dayIndex) => {
              return (
                <div
                  className={
                    dayTile.isWeekend ? styles.weekendDayTile : styles.dayTile
                  }
                  key={dayIndex}
                >
                  {dayTile.hourNum > 0 && dayTile.hourNum}
                </div>
              );
            })
          );
        })}
      </div>
    </div>
  );
}

export default ReckoningTile;
