import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { getAllUsers } from '../../services/users-service';
import styles from './UsersView.module.css';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';

function UsersView() {
  const [users, setUsers] = useState([]);

  const { showModal, exitAnim, openModal, closeModal } = useModal();

  useEffect(() => {
    getAllUsers().then((allUsers) => {
      setUsers(allUsers);
    });
  }, []);
  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <h2>Dodaj użytkownika</h2>
      </ModalTemplate>
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
      <div className={styles.usersViewContainer}>
        <div className={styles.usersContainer}>
          {users.length > 0 ? (
            users.map((user) => {
              return (
                <Link
                  key={user._id}
                  className={styles.userTile}
                  to={`/użytkownicy/${user._id}`}
                >
                  <img src={user.img} alt="user" className={styles.userImg} />

                  <p className={styles.userName}>
                    {`${user.name} ${user.lastname}`}
                  </p>
                  <p className={styles.userJob}>{user.job}</p>
                  <p className={styles.userEmail}>{user.email}</p>
                  <p className={styles.userPhone}>{user.phone}</p>
                </Link>
              );
            })
          ) : (
            <SkeletonUsersLoading />
          )}
        </div>
      </div>
      <button type="button" onClick={() => openModal()}>
        <Icon
          icon="icons8:plus"
          color="#f68c1e"
          width="60"
          height="60"
          className={styles.addNewUserBtn}
        />
      </button>
    </>
  );
}

export default UsersView;
