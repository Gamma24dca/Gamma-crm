import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styles from './UserTile.module.css';

type UserTileProps = {
  _id: string;
  img: string;
  name: string;
  lastname: string;
  job: string;
  email: string;
  phone: number;
};

function UserTile({
  _id,
  img,
  name,
  lastname,
  job,
  email,
  phone,
}: UserTileProps) {
  return (
    <Link className={styles.userTile} to={`/użytkownicy/${_id}`}>
      <img src={img} alt="user" className={styles.userImg} />
      <p className={styles.userName}>{`${name} ${lastname}`}</p>
      <p className={styles.userJob}>{job}</p>
      <p className={styles.userEmail}>{email}</p>
      <p className={styles.userPhone}>{phone}</p>
      <div className={styles.iconWrapper}>
        <Icon
          icon="ph:dots-three-outline-vertical-fill"
          color="#f68c1e"
          className={styles.dotsIcon}
          width="24"
          height="24"
        />
      </div>
    </Link>
  );
}

export default UserTile;
