import styles from './HoverLabel.module.css';

function HoverLabel({ children }) {
  return (
    <div className={styles.graphicName}>
      <p>{children}</p>
    </div>
  );
}

export default HoverLabel;
