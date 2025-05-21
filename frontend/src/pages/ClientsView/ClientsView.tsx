import styles from './ClientsView.module.css';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';

function ClientsView() {
  return (
    <>
      <ControlBar>
        <ControlBarTitle>Klienci</ControlBarTitle>
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          <p className={styles.klient}>klient</p>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ClientsView;
