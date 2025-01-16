import { useEffect, useState } from 'react';
import ListContainer from '../../Atoms/ListContainer/ListContainer';
import ViewContainer from '../../Atoms/ViewContainer/ViewContainer';
import { getAllArchivedStudioTasks } from '../../../services/archived-studio-tasks-service';
import DateFormatter from '../../../utils/dateFormatter';
import UsersDisplay from '../UsersDisplay/UsersDisplay';
import styles from './ArchivedListView.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import SkeletonUsersLoading from '../SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../InfoBar/InfoBar';

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
          <div className={styles.tileElementInfoBar}>
            <p>Firma</p>
          </div>
          <div className={styles.tileElementInfoBar}>
            <p>Numer</p>
          </div>
          <div className={styles.tileElementInfoBar}>
            <p>Email</p>
          </div>
          <div className={styles.tileElementInfoBar}>
            <p>Strona</p>
          </div>
          <div className={styles.tileElementInfoBar}>
            <p>Zlecenia</p>
          </div>
          <div className={styles.usersImgContainer}>
            <p>Graficy</p>
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
                    <div>
                      <p>{studioTask.searchID}</p>
                    </div>
                    <div>
                      <DateFormatter dateString={studioTask.startDate} />
                    </div>
                    <div>
                      <p>{studioTask.title}</p>
                    </div>
                    <div>
                      <p>{studioTask.client}</p>
                    </div>
                    <div>
                      <p>{studioTask.clientPerson}</p>
                    </div>
                    <div>
                      <UsersDisplay
                        data={studioTask}
                        usersArray={studioTask.participants}
                      />
                    </div>
                    <div>
                      <button type="button">Przywróć</button>
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
