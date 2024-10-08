import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';

function CompaniesView() {
  return (
    <>
      <ControlBar>
        <button type="button" onClick={() => {}}>
          Dodaj Firme
        </button>
        <button type="button" onClick={() => {}}>
          Filtry
        </button>
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <div className={styles.test}>1</div>
          <div>2</div>
          <div>3</div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default CompaniesView;
