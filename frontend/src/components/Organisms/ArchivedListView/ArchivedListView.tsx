import { useEffect, useState } from 'react';
import ListContainer from '../../Atoms/ListContainer/ListContainer';
import ViewContainer from '../../Atoms/ViewContainer/ViewContainer';
import { getAllArchivedStudioTasks } from '../../../services/archived-studio-tasks-service';
import DateFormatter from '../../../utils/dateFormatter';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './ArchivedListView.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import SkeletonUsersLoading from '../SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../Atoms/InfoBar/InfoBar';

function ArchivedListView() {
  const [archivedStudioTasks, setArchivedStudioTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchArchivedStudioTasks = async () => {
      try {
        setIsLoading(true);
        const response = await getAllArchivedStudioTasks();
        setArchivedStudioTasks(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArchivedStudioTasks();
  }, []);
  return (
    <ViewContainer>
      <ListContainer>
        <InfoBar>
          <div className={styles.infoBarContainer}>
            <div className={styles.tileElementInfoBar}>
              <p>ID</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Utworzono</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Autor</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Tytuł</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Firma</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Klient</p>
            </div>
            <div className={styles.usersImgContainer}>
              <p>Graficy</p>
            </div>
          </div>
        </InfoBar>
        {isLoading ? (
          <SkeletonUsersLoading />
        ) : (
          archivedStudioTasks.length > 0 && (
            <>
              {archivedStudioTasks.map((studioTask) => {
                return (
                  <TileWrapper key={studioTask._id}>
                    <div className={styles.tileContainer}>
                      <div className={styles.taskID}>
                        <p>{studioTask.searchID}</p>
                      </div>
                      <div className={styles.createdAt}>
                        <DateFormatter dateString={studioTask.startDate} />
                      </div>
                      <div className={styles.authorImgContainer}>
                        <img
                          className={styles.authorImg}
                          src={studioTask.author.img}
                          alt=""
                        />
                      </div>
                      <div className={styles.title}>
                        <p>{studioTask.title}</p>
                      </div>
                      <div className={styles.client}>
                        <p>{studioTask.client}</p>
                      </div>
                      <div className={styles.clientPerson}>
                        <p>{studioTask.clientPerson}</p>
                      </div>
                      <div className={styles.participants}>
                        <UsersDisplay
                          data={studioTask}
                          usersArray={studioTask.participants}
                        />
                      </div>
                      <div className={styles.restoreButtonContainer}>
                        <button className={styles.restoreButton} type="button">
                          Przywróć
                        </button>
                      </div>
                    </div>
                  </TileWrapper>
                );
              })}
            </>
          )
        )}
      </ListContainer>
    </ViewContainer>
  );
}

export default ArchivedListView;
