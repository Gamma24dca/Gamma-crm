import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import { ColumnComp } from '../../../types';
import styles from './ColumnContainer.module.css';
import DraggableCard from '../DraggableCard/DraggableCard';

function DroppableColumn({ col, tasks }: ColumnComp) {
  const filteredTasks = useMemo(
    () => tasks.filter((studioTasks) => studioTasks.status === col.title),
    [tasks, col.title]
  );
  // const tasksId = useMemo(
  //   () => filteredTasks.map((task) => task._id),
  //   [filteredTasks]
  // );

  const { setNodeRef } = useDroppable({
    id: col.id,
    data: {
      type: 'Column',
      col,
    },
  });

  return (
    <div className={styles.columnContainer} ref={setNodeRef}>
      <div className={styles.tasksWrapper}>
        <p>{col.title}</p>
        <SortableContext items={filteredTasks.map((task) => task._id)}>
          {filteredTasks.map((task) => (
            <DraggableCard task={task} key={task._id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export default React.memo(DroppableColumn);
