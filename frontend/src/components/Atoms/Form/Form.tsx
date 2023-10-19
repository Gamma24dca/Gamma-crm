import styles from './Form.module.css';

type FormProps = {
  children: string | JSX.Element | JSX.Element[];
};

function Form({ children, ...restProps }: FormProps) {
  return (
    <form data-testid="form" className={styles.form} {...restProps}>
      {children}
    </form>
  );
}

export default Form;
