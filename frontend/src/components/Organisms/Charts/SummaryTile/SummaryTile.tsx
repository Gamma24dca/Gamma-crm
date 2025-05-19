import { Icon } from '@iconify/react';
import styles from './SummaryTile.module.css';

function SummaryTile({ children, title, iconValue }) {
  return (
    <div className={styles.summaryTile}>
      <p>{title}</p>

      <div className={styles.summaryValueWrapper}>
        <Icon
          icon={iconValue}
          width="16"
          height="16"
          className={styles.summaryValueIcon}
        />
        <p>{children}</p>
      </div>
    </div>
  );
}

export default SummaryTile;
