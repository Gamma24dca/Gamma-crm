import styles from './SearchInput.module.css';

function SearchInput({ ...restProps }) {
  return (
    <input
      className={styles.navInput}
      type="text"
      placeholder="Szukaj"
      {...restProps}
    />
  );
}

export default SearchInput;
