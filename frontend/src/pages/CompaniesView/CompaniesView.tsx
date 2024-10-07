import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';

function CompaniesView() {
  return (
    <>
      <div className={styles.controlBarContainer}>
        <div className={styles.controlBar}>
          <select name="widok" id="widok">
            <option value="Lista">Lista</option>
            <option value="Kanban">Kanban</option>
          </select>
          <button type="button" onClick={() => {}}>
            Nowe zlecenie
          </button>
          <button type="button" onClick={() => {}}>
            Filtry
          </button>
        </div>
      </div>

      <ViewContainer>
        <p>Firmy</p>
      </ViewContainer>
    </>
  );
}

export default CompaniesView;
