import { Icon } from '@iconify/react';
import styles from './MultiselectDropdown.module.css';

function MultiselectDropdown({
  children,
  isSelectOpen,
  setIsSelectOpen,
  label,
}) {
  return (
    <button
      type="button"
      className={styles.openSelectButton}
      onClick={() => {
        setIsSelectOpen((prev) => !prev);
      }}
    >
      <div className={styles.labelWrapper}>
        <p className={styles.buttonLabel}>{label}</p>

        <Icon
          icon="material-symbols:keyboard-arrow-down-rounded"
          width="17"
          height="17"
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

export default MultiselectDropdown;
