import styles from './DraggableCard.module.css';

function DraggableCard({ task }) {
  return (
    <div className={styles.taskCardContainer}>
      <p>{task.title}</p>
    </div>
  );
}

export default DraggableCard;
