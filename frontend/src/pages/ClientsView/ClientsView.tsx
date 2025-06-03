import { useEffect } from 'react';
import styles from './ClientsView.module.css';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import { getAllClients } from '../../services/clients-service';
import useClientsContext from '../../hooks/Context/useClientsContext';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';

function ClientsView() {
  const { dispatch, clients } = useClientsContext();
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const allClients = await getAllClients();
        dispatch({ type: 'SET_CLIENTS', payload: allClients });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchClients();
  }, [dispatch]);

  console.log(clients);

  return (
    <>
      <ControlBar>
        <ControlBarTitle>Klienci</ControlBarTitle>
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div className={styles.clientInfoBarContainer}>
              <div className={styles.tileElementInfoBar}>
                <p>Nazwa</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Firma</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Numer</p>
              </div>
              <div className={styles.tileElementInfoBar}>
                <p>Mail</p>
              </div>
            </div>
          </InfoBar>
          <>
            {clients.map((cl, index) => {
              return (
                <TileWrapper key={cl._id} index={index}>
                  <div className={styles.clientTileWrapper}>
                    <p className={styles.clientTileWrapperElement}>{cl.name}</p>
                    <p className={styles.clientTileWrapperElement}>
                      {cl.company}
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      {cl.email}
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      {cl.phone}
                    </p>
                  </div>
                </TileWrapper>
              );
            })}
          </>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ClientsView;
