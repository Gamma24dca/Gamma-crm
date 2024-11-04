import styles from './Captcha.module.css';

function Captcha({ handleDeleteCompany, setDeleteCaptcha, params }) {
  return (
    <div className={styles.captchaContainer}>
      <h2>Jesteś pewien?</h2>
      <div className={styles.captchaButtonsWrapper}>
        <button
          type="button"
          className={styles.confirmDeleteButton}
          onClick={() => handleDeleteCompany(params.id)}
        >
          Tak
        </button>{' '}
        <button
          type="button"
          className={styles.cancelDeleteButton}
          onClick={() => setDeleteCaptcha(false)}
        >
          Anuluj
        </button>
      </div>
    </div>
  );
}

export default Captcha;
