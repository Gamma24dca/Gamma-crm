import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getTaskById, TaskTypes } from '../../services/tasks-service';
import styles from './TaskProfile.module.css';

function TaskProfile() {
  const params = useParams();
  const [task, setTask] = useState<TaskTypes[]>([]);

  useEffect(() => {
    getTaskById(params.id)
      .then((singleTaskArray: TaskTypes | TaskTypes[]) => {
        if (Array.isArray(singleTaskArray)) {
          if (singleTaskArray.length > 0) {
            setTask(singleTaskArray);
          }
        } else {
          setTask([singleTaskArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching task:', error);
      });
  }, [params.id]);

  return (
    <div className={styles.taskProfileContainer}>
      <Link to="/zlecenia" className={styles.backButton}>
        <Icon
          icon="ion:arrow-back-outline"
          color="#f68c1e"
          width="40"
          height="40"
        />
      </Link>
      {task.length > 0 && (
        <>
          <h2 key={task[0]._id}>{task[0].title}</h2>
          <img
            // @ts-ignore
            src={task[0].image}
            alt="task pic"
            className={styles.taskImage}
          />
        </>
      )}
    </div>
  );
}

export default TaskProfile;
