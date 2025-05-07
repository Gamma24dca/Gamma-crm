import { Icon } from '@iconify/react';
import styles from './CompanyProfileViewComponent.module.css';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import summarizeCompanyProfHours from '../../../utils/summarizeCompanyProfHours';

const tileClass = (tileIndex) => {
  return tileIndex % 2 === 0
    ? styles.reckoningTaskListElement
    : styles.darkerReckoningTaskListElement;
};

function CompanyProfileViewComponent({
  loadingState,
  currentTasks,
  currentMonthIndex,
}) {
  if (loadingState.isError) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:close-small"
          width="70"
          height="70"
          className={styles.errorIcon}
        />
        <p>Coś poszło nie tak :(</p>
      </div>
    );
  }

  if (!loadingState.isError && loadingState.isLoading) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  if (
    !loadingState.isError &&
    !loadingState.isLoading &&
    currentTasks.length > 0
  ) {
    return currentTasks.map((task, index) => {
      return (
        <div key={task._id} className={`${tileClass(index)}`}>
          <div className={styles.reckoningTaskListElementTile}>
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
            <p>{summarizeCompanyProfHours(task, currentMonthIndex)}</p>
          </div>

          <div className={styles.reckoningTaskListElementTile}>
            <p>{task.description}</p>
          </div>
          <div className={styles.reckoningTaskListElementTile}>
            <p>{task.printWhat}</p>
          </div>
          <div className={styles.reckoningTaskListElementTile}>
            <p>{task.printWhere}</p>
          </div>
        </div>
      );
    });
  }

  return (
    <div className={styles.noTasksContainer}>
      <p>Brak zleceń</p>
      <Icon icon="line-md:coffee-loop" width="24" height="24" />
    </div>
  );
}

export default CompanyProfileViewComponent;
