import { useEffect, useState } from 'react';
import styles from './ClientsView.module.css';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import { getAllClients } from '../../services/clients-service';
import useClientsContext from '../../hooks/Context/useClientsContext';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import CTA from '../../components/Atoms/CTA/CTA';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import AddClientForm from '../../components/Organisms/AddClientForm/AddClientForm';

function ClientsView() {
  const [searchInputValue, setSearchInputValue] = useState('');
  const { dispatch, clients } = useClientsContext();
  const { showModal, exitAnim, openModal, closeModal } = useModal();

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

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        <AddClientForm />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Klienci</ControlBarTitle>
        <SearchInput
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
        />

        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
            }}
          >
            Dodaj klienta
          </CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
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
                    <p
                      className={`${styles.clientTileWrapperElement} ${styles.bolded}`}
                    >
                      {cl.name}
                    </p>
                    <p
                      className={`${styles.clientTileWrapperElement} ${styles.bolded}`}
                    >
                      {cl.company}
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      <a
                        href={`mailto:${cl.email}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cl.email}
                      </a>
                    </p>
                    <p className={styles.clientTileWrapperElement}>
                      <a
                        href={`tel:${cl.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {cl.phone}
                      </a>
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
