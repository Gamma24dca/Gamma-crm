import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import DraggableCard from '../DraggableCard/DraggableCard';
import styles from './ColumnContainer.module.css';
import { StudioTaskTypes } from '../../../services/studio-tasks-service';
import { statusNames } from '../../../statuses';

function DroppableColumn({
  status,
  tasks,
}: {
  status: StudioTaskTypes['status'];
  tasks: StudioTaskTypes[];
}) {
  return (
    <div>
      <p>{statusNames[status]}</p>
      <Droppable droppableId={status}>
        {(droppableProvided) => (
          <div
            ref={droppableProvided.innerRef}
            {...droppableProvided.droppableProps}
            className={styles.columnContainer}
          >
            {tasks.map((task, index) => (
              <DraggableCard key={task._id} task={task} index={index} />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

export default React.memo(DroppableColumn);
