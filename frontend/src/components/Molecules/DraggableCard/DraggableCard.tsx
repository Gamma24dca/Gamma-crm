import { Draggable } from '@hello-pangea/dnd';
import styles from './DraggableCard.module.css';

function DraggableCard({ task, index }) {
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
              transform: snapshot.isDragging ? 'rotate(-2deg)' : '',
            }}
            className={styles.taskCardContainer}
          >
            <p>{task.title}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default DraggableCard;
