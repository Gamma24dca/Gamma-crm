import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users-service';
import styles from './UsersView.module.css';

function UsersView() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      setUsers(allUsers);
    });
  }, []);

  return (
    <div className={styles.usersViewContainer}>
      <div className={styles.topBar}>
        <Icon
          icon="icon-park-outline:edit-name"
          width="35"
          height="35"
          color="#828fa3"
          className={styles.personIcon}
        />
        <Icon
          icon="mdi:worker-outline"
          width="35"
          height="35"
          color="#828fa3"
          className={styles.jobIcon}
        />
        <Icon
          icon="lucide:mail"
          width="35"
          height="35"
          color="#828fa3"
          className={styles.mailIcon}
        />
        <Icon
          icon="tabler:phone"
          width="35"
          height="35"
          color="#828fa3"
          className={styles.phoneIcon}
        />
      </div>
      <div className={styles.usersContainer}>
        {users.map((user) => {
          return (
            <div key={user._id} className={styles.userTile}>
              <img src={user.img} alt="user" className={styles.userImg} />

              <p className={styles.userName}>
                {`${user.name} ${user.lastname}`}
              </p>
              <p className={styles.userJob}>{user.job}</p>
              <p className={styles.userEmail}>{user.email}</p>
              <p className={styles.userPhone}>{user.phone}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UsersView;
