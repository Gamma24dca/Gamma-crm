import styles from './Form.module.css';

type FormProps = {
  children: string | JSX.Element | JSX.Element[];
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
};

function Form({ children, onSubmit }: FormProps) {
  return (
    <form data-testid="form" className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
}

export default Form;
