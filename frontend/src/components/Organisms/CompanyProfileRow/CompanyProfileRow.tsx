import { useState } from 'react';
import { updateReckoningTask } from '../../../services/reckoning-view-service';
import summarizeCompanyProfHours from '../../../utils/summarizeCompanyProfHours';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './CompanyProfileRow.module.css';

const tileClass = (tileIndex) => {
  return tileIndex % 2 === 0
    ? styles.reckoningTaskListElement
    : styles.darkerReckoningTaskListElement;
};

function CompanyProfileRow({
  task,
  index,
  currentMonthIndex,
  companyHourRate,
}) {
  const [isChecked, setIsChecked] = useState({
    checkedID: task._id,
    checkedValue: task.isSettled,
  });
  const handleCheckboxChange = async (e, taskId) => {
    try {
      const res = await updateReckoningTask({
        taskId,
        value: {
          isSettled: e.target.checked,
        },
      });

      if (res) {
        setIsChecked(() => {
          return {
            checkedID: taskId,
            checkedValue: !e.target.checked,
          };
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      key={task._id}
      className={`${tileClass(index)}  ${
        isChecked.checkedValue && isChecked.checkedID === task._id
          ? styles.checked
          : null
      }`}
    >
      <div className={styles.reckoningTaskListElementTile}>
        <input
          type="checkbox"
          className={styles.cprtCheckbox}
          checked={isChecked.checkedValue}
          onChange={(e) => {
            handleCheckboxChange(e, task._id);
          }}
        />
        <p>{task.searchID}</p>
      </div>

      <div className={`${styles.reckoningTaskListElementTile}`}>
        <p>{task.client}</p>
      </div>
      <div className={styles.reckoningTaskListElementTile}>
        <p>{task.clientPerson}</p>
      </div>
      {/* <div className={styles.reckoningTaskListElementTile}>
            <p>{task.startDate.slice(0, 10)}</p>
          </div> */}
      <div className={styles.reckoningTaskListElementTile}>
        <UsersDisplay data={task} usersArray={task.participants} />
      </div>
      <div className={styles.reckoningTaskListElementTile}>
        <p>{task.title}</p>
      </div>

      <div className={styles.reckoningTaskListElementTile}>
        <p>{task.description}</p>
      </div>
      <div className={styles.reckoningTaskListElementTile}>
        <p>{summarizeCompanyProfHours(task, currentMonthIndex)}</p>
      </div>

      <div className={styles.reckoningTaskListElementTile}>
        <p>
          {summarizeCompanyProfHours(task, currentMonthIndex) *
            Number(companyHourRate)}{' '}
          zł
        </p>
      </div>
      <div className={styles.reckoningTaskListElementTile}>
        <p>{task.printWhere}</p>
      </div>
    </div>
  );
}

export default CompanyProfileRow;
