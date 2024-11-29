import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import styles from './DraggableCard.module.css';

function DraggableCard({ task }) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging) {
    return (
      <div className={styles.draggedTask} ref={setNodeRef} style={style} />
    );
  }

  return (
    <div
      className={styles.taskCardContainer}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <p>{task.title}</p>
    </div>
  );
}

export default DraggableCard;
