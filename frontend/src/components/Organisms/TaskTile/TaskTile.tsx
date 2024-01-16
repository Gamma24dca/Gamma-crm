import { useState } from 'react';
import { Icon } from '@iconify/react';
import TileContainer from '../../Atoms/TileContainer/TileContainer';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import styles from './TaskTile.module.css';

function TaskTile({
  _id,
  createdAt,
  authorAvatar,
  authorName,
  title,
  description,
  path,
  status,
  client,
  priority,
  deadline,
  deleteTaskCallback,
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <TileContainer>
      <TileWrapper key={_id} linkPath={`/zlecenia/${_id}`}>
        {/* <p>{index}</p> */}
        <p className={styles.createdAtDate}>{createdAt.split('T')[0]}</p>
        <p className={styles.authorName}>{authorName}</p>
        <img src={authorAvatar} alt="user" className={styles.userImg} />
        <p className={styles.client}>{client}</p>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
        <p className={styles.path}>{path}</p>
        <p className={styles.status}>{status}</p>
        <p className={styles.priority}>{priority}</p>
        <p className={styles.deadline}>{deadline.split('T')[0]}</p>
      </TileWrapper>
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
      {isEditOpen && (
        <div className={styles.taskEditWindow}>
          <button
            type="button"
            className={styles.editBtn}
            onClick={deleteTaskCallback}
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

export default TaskTile;
