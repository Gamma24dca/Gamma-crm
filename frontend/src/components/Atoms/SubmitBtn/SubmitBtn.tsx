import styles from './SubmitBtn.module.css';

type BtnProps = {
  buttonContent: string;
};

function SubmitButton({ buttonContent, ...restProps }: BtnProps) {
  return (
    <button {...restProps} className={styles.submitbtn} type="submit">
      {buttonContent}
    </button>
  );
}

export default SubmitButton;
