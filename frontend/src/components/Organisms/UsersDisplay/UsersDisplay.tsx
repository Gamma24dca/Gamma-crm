import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './UsersDisplay.module.css';

function UsersDisplay({ data, usersArray }) {
  const [labelState, setLabelState] = useState({
    isLabel: false,
    userLabel: '',
    dataTileValue: '',
  });

  const handleMouseEnter = (user, dataVal) => {
    setLabelState({
      isLabel: true,
      userLabel: user.name,
      dataTileValue: dataVal.name,
    });
  };

  const handleMouseLeave = () => {
    setLabelState({ isLabel: false, userLabel: '', dataTileValue: '' });
  };

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
                onMouseEnter={() => {
                  handleMouseEnter(user, data);
                }}
                onMouseLeave={() => {
                  handleMouseLeave();
                }}
              />
              {labelState.isLabel &&
                labelState.dataTileValue === data.name &&
                labelState.userLabel === user.name && (
                  <div className={styles.graphicName}>
                    <p>{user.name}</p>
                  </div>
                )}
            </Link>
          );
        })}
    </div>
  );
}

export default UsersDisplay;
