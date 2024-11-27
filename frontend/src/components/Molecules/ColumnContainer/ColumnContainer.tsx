import { useMemo, useState } from 'react';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ColumnComp } from '../../../types';
import styles from './ColumnContainer.module.css';
import DraggableCard from '../DraggableCard/DraggableCard';

function DroppableColumn({
  col,
  deleteColumn,
  updateColumn,
  tasks,
}: ColumnComp) {
  const [editMode, setEditMode] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: col.id,
    data: {
      type: 'Column',
      col,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const filteredTasks = tasks.filter(
    (studioTasks) => studioTasks.status === col.title
  );
  const tasksId = useMemo(
    () => filteredTasks.map((task) => task._id),
    [filteredTasks]
  );

  if (isDragging) {
    return (
      <div className={styles.draggedColumn} ref={setNodeRef} style={style} />
    );
  }

  return (
    <div
      className={styles.columnContainer}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <button
        type="button"
        onClick={() => {
          deleteColumn(col.id);
        }}
      >
        delete
      </button>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setEditMode(true);
        }}
        onClick={() => setEditMode(true)}
      >
        {!editMode && col.title}
        {editMode && (
          <input
            autoFocus
            value={col.title}
            onChange={(e) => {
              updateColumn(col.id, e.target.value);
            }}
            onBlur={() => setEditMode(false)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              setEditMode(false);
            }}
          />
        )}
      </div>

      <div className={styles.tasksWrapper}>
        <SortableContext items={tasksId}>
          {tasks.length !== 0 &&
            filteredTasks.map((task) => {
              return <DraggableCard task={task} key={task._id} />;
            })}
        </SortableContext>
      </div>
    </div>
  );
}

export default DroppableColumn;
