import { Draggable } from '@hello-pangea/dnd';
import styles from './DraggableCard.module.css';
import { StudioTaskTypes } from '../../../services/studio-tasks-service';

function DraggableCard({
  task,
  index,
}: {
  task: StudioTaskTypes;
  index: number;
}) {
  return (
    <Draggable draggableId={String(task._id)} index={index}>
      {(provided, snapshot) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          style={{
            opacity: snapshot.isDragging ? 0.9 : 1,
            transform: snapshot.isDragging ? 'scale(0.9)' : '',
          }}
          className={styles.taskCardContainer}
        >
          <div
            style={{
              opacity: snapshot.isDragging ? 0.9 : 1,
              transform: snapshot.isDragging ? 'rotate(-2deg)' : '',
            }}
          >
            {task.searchID}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default DraggableCard;
