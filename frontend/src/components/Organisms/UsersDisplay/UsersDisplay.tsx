import { Link } from 'react-router-dom';
import styles from './UsersDisplay.module.css';
import useShowLabel from '../../../hooks/useShowLabel';
import HoverLabel from '../../Atoms/HoverLabel/HoverLabel';

function UsersDisplay({ data, usersArray }) {
  const { labelState, handleMouseEnter, handleMouseLeave } = useShowLabel();

  return (
    <div className={styles.usersImgContainer}>
      {usersArray.length > 0 &&
        usersArray.map((user) => {
          return (
            <Link
              className={styles.userWrapper}
              key={user._id}
              to={`/użytkownicy/${user._id}`}
            >
              <img
                className={styles.userImg}
                src={user.img}
                alt="user"
                onMouseEnter={(e) => {
                  handleMouseEnter(user.name, data.name, e);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
              />
              {labelState.isLabel &&
                labelState.labelValue === data.name &&
                labelState.labelId === user.name && (
                  <HoverLabel
                    position={labelState.mousePosition}
                    root="label-root"
                  >
                    {user.name}
                  </HoverLabel>
                )}
            </Link>
          );
        })}
    </div>
  );
}

export default UsersDisplay;
