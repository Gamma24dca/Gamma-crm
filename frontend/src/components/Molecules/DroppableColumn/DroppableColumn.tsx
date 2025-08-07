import { Droppable } from '@hello-pangea/dnd';
import styles from './DroppableColumn.module.css';
import DraggableCard from '../DraggableCard/DraggableCard';
import { statusNames } from '../../../statuses';

const test = {
  do_wzięcia: styles.dwz,
  na_później: styles.np,
  do_zrobienia: styles.dzr,
  w_trakcie: styles.wtr,
  wysłane: styles.wys,
};
function DroppableColumn({ status, tasks, isDragAllowed, isLoading }) {
  console.log(status);
  return (
    <div className={styles.columnWrapper}>
      <div className={styles.columnTitleWrapper}>
        <div className={`${styles.bullet} ${test[status]}`} />
        <p className={styles.statusName}>{statusNames[status]}</p>
      </div>
      <Droppable droppableId={status}>
        {(droppableProvided, snapshot) => {
          return (
            <div
              ref={droppableProvided.innerRef}
              {...droppableProvided.droppableProps}
              className={`${
                snapshot.isDraggingOver
                  ? styles.draggedColumn
                  : styles.columnContainer
              }`}
            >
              {!isLoading ? (
                tasks.length > 0 &&
                tasks.map((task, index) => {
                  let doneSubtasks = 0;

                  task.subtasks.forEach((subtask) => {
                    if (subtask.done) {
                      doneSubtasks += 1;
                    }
                  });

                  // return task.participants.map((partTas) => {
                  //   return (
                  //     partTas._id === '655f423bf7ce6ff8c9b4f307' && (
                  //       <DraggableCard
                  //         key={task._id}
                  //         task={task}
                  //         index={index}
                  //         doneSubtasks={doneSubtasks}
                  //         isDragAllowed={isDragAllowed}
                  //       />
                  //     )
                  //   );
                  // });
                  return (
                    <DraggableCard
                      key={task._id}
                      task={task}
                      index={index}
                      doneSubtasks={doneSubtasks}
                      isDragAllowed={isDragAllowed}
                    />
                  );
                })
              ) : (
                <>
                  <div className={styles.skeletonWrapper}>
                    <div className={styles.taskSkeleton} />
                  </div>
                  <div className={styles.skeletonWrapper}>
                    <div className={styles.taskSkeleton} />
                  </div>
                  <div className={styles.skeletonWrapper}>
                    <div className={styles.taskSkeleton} />
                  </div>
                </>
              )}

              {droppableProvided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default DroppableColumn;
