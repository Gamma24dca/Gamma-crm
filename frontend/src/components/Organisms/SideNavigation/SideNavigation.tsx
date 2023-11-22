import { NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './SideNavigation.module.css';

const sideNavButtons = [
  {
    name: 'Pulpit',
    icon: 'ic:outline-space-dashboard',
  },
  {
    name: 'Użytkownicy',
    icon: 'uil:users-alt',
  },
  {
    name: 'Zlecenia',
    icon: 'fluent:tasks-app-24-regular',
  },
  {
    name: 'Firmy',
    icon: 'clarity:building-line',
  },
  {
    name: 'Magazyn',
    icon: 'material-symbols:warehouse-outline-rounded',
  },
];

function SideNavigation() {
  return (
    <div className={styles.sideNavContainer}>
      <div className={styles.logoContainer}>
        <img
          src="https://res.cloudinary.com/dpktrptfr/image/upload/v1679038488/HomePage/orange.png"
          alt="Gamma logo"
          className={styles.logo}
        />
      </div>

      <div className={styles.buttonsContainer}>
        <div className={styles.btnsWrapper}>
          {sideNavButtons.map((btn) => {
            return (
              <NavLink
                className={({ isActive }) =>
                  isActive ? `${styles.active}` : `${styles.inactive}`
                }
                key={btn.name}
                to={`${btn.name}`}
              >
                <Icon
                  icon={btn.icon}
                  width="28"
                  height="28"
                  className={styles.icon}
                />
                <button type="button" className={styles.sideNavBtn}>
                  {btn.name}
                </button>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SideNavigation;
