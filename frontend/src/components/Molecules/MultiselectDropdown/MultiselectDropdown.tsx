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
      // onClick={() => {
      //   setIsSelectOpen(true);
      // }}
    >
      <div
        className={styles.labelWrapper}
        role="button"
        onClick={() => {
          setIsSelectOpen((prev) => !prev);
        }}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsSelectOpen((prev) => !prev);
          }
        }}
      >
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
          <div
            className={styles.overlay}
            role="button"
            onClick={() => {
              setIsSelectOpen(false);
            }}
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setIsSelectOpen(false);
              }
            }}
          />
          <div className={styles.selectContainer}>{children}</div>
        </>
      )}
    </button>
  );
}

export default MultiselectDropdown;
