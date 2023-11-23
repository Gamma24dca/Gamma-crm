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
      <h2>Users View</h2>
      {users.map((user) => {
        return <p key={user._id}>{user.name}</p>;
      })}
    </div>
  );
}

export default UsersView;
