import { Icon } from '@iconify/react';
import styles from './UsersDropdown.module.css';

function UsersDropdown({ children, isSelectOpen, setIsSelectOpen }) {
  return (
    <button
      type="button"
      className={styles.openSelectButton}
      onClick={() => {
        setIsSelectOpen((prev) => !prev);
      }}
    >
      <div className={styles.labelWrapper}>
        <p className={styles.buttonLabel}>Członkowie</p>

        <Icon
          icon="material-symbols:keyboard-arrow-down-rounded"
          width="24"
          height="24"
          className={`${isSelectOpen ? styles.upArrow : styles.downArrow}`}
        />
      </div>

      {isSelectOpen && (
        <>
          <div className={styles.overlay} />
          <div className={styles.selectContainer}>{children}</div>
        </>
      )}
    </button>
  );
}

export default UsersDropdown;
