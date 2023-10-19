import styles from './Input.module.css';

type InputProps = {
  id: string;
  type: string;
  name: string;
};
function Input({ id, type, name, ...restProps }: InputProps) {
  return (
    <input
      data-testid="input"
      className={styles.input}
      id={id}
      type={type}
      name={name}
      {...restProps}
    />
  );
}

export default Input;
