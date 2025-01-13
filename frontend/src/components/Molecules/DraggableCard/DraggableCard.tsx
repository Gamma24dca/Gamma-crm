import { Draggable } from '@hello-pangea/dnd';
import { Icon } from '@iconify/react';
import styles from './DraggableCard.module.css';
import UsersDisplay from '../../Organisms/UsersDisplay/UsersDisplay';
import DateFormatter from '../../../utils/dateFormatter';

function DraggableCard({ task, index, doneSubtasks = 0 }) {
  const taskClass =
    task.participants.length > 4 ? styles.taskHigher : styles.task;

  const companyClass = task.client.split(' ').join('');

  const subtasksLength = task.subtasks.length;

  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <div
            style={{
              opacity: snapshot.isDragging ? 0.9 : 1,
              transform: snapshot.isDragging ? 'scale(0.95)' : '',
            }}
            className={taskClass}
          >
            <div className={styles.clientInfoWrapper}>
              <p
                className={`${styles.clientName} ${styles[`${companyClass}`]}`}
              >
                {task.client}
              </p>
              <p className={`${styles.clientPerson}`}>{task.clientPerson}</p>
            </div>

            <span className={styles.searchID}>#{task.searchID}</span>
            <p className={styles.taskTitle}>{task.title}</p>
            <div className={styles.userDisplayWrapper}>
              <UsersDisplay data={task} usersArray={task.participants} />
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
              <Icon icon="material-symbols:task-alt" width="12" height="12" />
              <div>
                <span>{doneSubtasks}/</span>
                <span>{subtasksLength}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default DraggableCard;
