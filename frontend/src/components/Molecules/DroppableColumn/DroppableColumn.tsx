import { Droppable } from '@hello-pangea/dnd';
import styles from './DroppableColumn.module.css';
import DraggableCard from '../DraggableCard/DraggableCard';
import { statusNames } from '../../../statuses';

function DroppableColumn({ status, tasks }) {
  return (
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
            <p className={styles.statusName}>{statusNames[status]}</p>
            {tasks.map((task, index) => {
              return <DraggableCard key={task._id} task={task} index={index} />;
            })}
            {droppableProvided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
}

export default DroppableColumn;
