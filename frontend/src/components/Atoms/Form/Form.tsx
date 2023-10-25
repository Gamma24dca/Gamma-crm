import styles from './Form.module.css';

type FormProps = {
  children: string | JSX.Element | JSX.Element[];
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
};

function Form({ children, onSubmit, ...restProps }: FormProps) {
  return (
    <form data-testid="form" className={styles.form} {...restProps}>
      {children}
    </form>
  );
}

export default Form;
