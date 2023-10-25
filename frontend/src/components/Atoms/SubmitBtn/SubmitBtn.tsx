import styles from './SubmitBtn.module.css';

type BtnProps = {
  buttonContent: string;
  disabled: boolean;
};

function SubmitButton({ buttonContent, disabled, ...restProps }: BtnProps) {
  return (
    <button
      {...restProps}
      className={styles.submitbtn}
      type="submit"
      disabled={disabled}
    >
      {buttonContent}
    </button>
  );
}

export default SubmitButton;
