import { Link, NavLink } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './SideNavigation.module.css';

const sideNavButtons = [
  {
    name: 'pulpit',
    icon: 'ic:outline-space-dashboard',
  },
  {
    name: 'użytkownicy',
    icon: 'uil:users-alt',
  },
  {
    name: 'zlecenia',
    icon: 'fluent:tasks-app-24-regular',
  },
  {
    name: 'firmy',
    icon: 'clarity:building-line',
  },
  {
    name: 'klienci',
    icon: 'lucide:contact',
  },
  {
    name: 'zadania',
    icon: 'ic:outline-add-task',
  },
  {
    name: 'ankiety',
    icon: 'fluent:poll-24-regular',
  },
  {
    name: 'magazyn',
    icon: 'material-symbols:warehouse-outline-rounded',
  },
];

function SideNavigation() {
  return (
    <div className={styles.sideNavContainer}>
      <Link to="/" className={styles.logoContainer}>
        <img
          src="https://res.cloudinary.com/dpktrptfr/image/upload/v1679038488/HomePage/orange.png"
          alt="Gamma logo"
          className={styles.logo}
        />
      </Link>

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
                  {btn.name[0].toUpperCase() + btn.name.slice(1)}
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
