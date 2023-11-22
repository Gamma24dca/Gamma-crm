import useAuth from '../../../hooks/useAuth';
import styles from './Navigation.module.css';

function Navigation() {
  const { signOut, user } = useAuth();
  const GammaUser = user[0];
  return (
    <div className={styles.navWrapper}>
      <div className={styles.workerWrapper}>
        <img src={GammaUser.img} alt="Worker" className={styles.workerImg} />
        <div className={styles.dataTextWrapper}>
          <h2 className={styles.name}>{GammaUser.name}</h2>
          <p className={styles.job}>{GammaUser.job}</p>
        </div>
      </div>
      <input className={styles.navInput} />
      <button type="button" className={styles.signOutBtn} onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}

export default Navigation;
