import useAuth from '../../../hooks/useAuth';
import styles from './Navigation.module.css';

// type UserType = {
//   user: object[];
// };

const NavData = {
  name: 'Dawid',
  img: 'https://res.cloudinary.com/dpktrptfr/image/upload/v1683719306/AboutPage/Gamma_Dawid-min.jpg',
  job: 'Grafik',
};

function Navigation() {
  const { signOut } = useAuth();
  return (
    <div className={styles.navWrapper}>
      <div className={styles.workerWrapper}>
        <img src={NavData.img} alt="Worker" className={styles.workerImg} />
        <div className={styles.dataTextWrapper}>
          <h2 className={styles.name}>{NavData.name}</h2>
          <p className={styles.job}>{NavData.job}</p>
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
