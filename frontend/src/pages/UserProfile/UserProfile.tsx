import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserById, User } from '../../services/users-service';
import styles from './UserProfile.module.css';

function UserProfile() {
  const params = useParams();
  const [user, setUser] = useState<User[]>([]);

  useEffect(() => {
    getUserById(params.id)
      .then((singleUserArray: User | User[]) => {
        if (Array.isArray(singleUserArray)) {
          if (singleUserArray.length > 0) {
            setUser(singleUserArray);
          }
        } else {
          setUser([singleUserArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [params.id]);

  return (
    <div className={styles.userProfileContainer}>
      <Link to="/użytkownicy" className={styles.backButton}>
        <Icon
          icon="ion:arrow-back-outline"
          color="#f68c1e"
          width="40"
          height="40"
        />
      </Link>
      {user.length > 0 && <h2 key={user[0]._id}>{user[0].name}</h2>}
    </div>
  );
}

export default UserProfile;
