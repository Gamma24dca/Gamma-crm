import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import styles from './UserTile.module.css';
import { deleteUser } from '../../../services/users-service';
import TileContainer from '../../Atoms/TileContainer/TileContainer';

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
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    // Extract this elements to separate components
    <TileContainer>
      <Link className={styles.userTile} to={`/użytkownicy/${_id}`}>
        <img src={img} alt="user" className={styles.userImg} />
        <p className={styles.userName}>{`${name} ${lastname}`}</p>
        <p className={styles.userJob}>{job}</p>
        <p className={styles.userEmail}>{email}</p>
        <p className={styles.userPhone}>{phone}</p>
      </Link>
      <div className={styles.iconWrapper}>
        <Icon
          icon="raphael:edit"
          color="#828fa3"
          width="26"
          height="26"
          onClick={() => {
            setIsEditOpen((val) => !val);
          }}
        />
      </div>

      {/* Create context with redux to get all users again after deleting */}
      {isEditOpen && (
        <div className={styles.userEditWindow}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={() => {
              deleteUser(_id);
              setIsEditOpen(false);
            }}
          >
            Usuń
          </button>
          <button type="button" className={styles.editBtn}>
            Edytuj
          </button>
        </div>
      )}
    </TileContainer>
  );
}

export default UserTile;
