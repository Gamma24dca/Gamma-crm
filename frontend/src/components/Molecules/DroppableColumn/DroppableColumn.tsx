import { Droppable } from '@hello-pangea/dnd';
import styles from './DroppableColumn.module.css';
import DraggableCard from '../DraggableCard/DraggableCard';
import { statusNames } from '../../../statuses';

function DroppableColumn({ status, tasks, isDragAllowed }) {
  return (
    <div className={styles.columnWrapper}>
      <p className={styles.statusName}>{statusNames[status]}</p>
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
              {tasks.map((task, index) => {
                let doneSubtasks = 0;

                task.subtasks.forEach((subtask) => {
                  if (subtask.done) {
                    doneSubtasks += 1;
                  }
                });
                return (
                  <DraggableCard
                    key={task._id}
                    task={task}
                    index={index}
                    doneSubtasks={doneSubtasks}
                    isDragAllowed={isDragAllowed}
                  />
                );
              })}
              {droppableProvided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
}

export default DroppableColumn;
