import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import CTA from '../../components/Atoms/CTA/CTA';
// import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
// import InfoBar from '../../components/Organisms/InfoBar/InfoBar';
import styles from './StudioTaskView.module.css';

function StudioTaskView() {
  return (
    <>
      <ControlBar>
        <ControlBarTitle>Zlecenia</ControlBarTitle>

        <SearchInput />
        <div className={styles.buttonsWrapper}>
          <CTA onClick={() => {}}>Nowe zlecenie</CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
        </div>
      </ControlBar>
      <ViewContainer>
        <div className={styles.columnsWrapper}>
          <div className={styles.taskColumnContainer}>
            <div className={styles.columnTitleWrapper}>
              <div className={styles.columnTitleMark} />
              <h4>Na później</h4>
            </div>
            <div className={styles.taskColumn}>
              <div className={styles.task}>
                <p>task</p>
              </div>
            </div>
          </div>

          <div className={styles.taskColumnContainer}>
            <div className={styles.columnTitleWrapper}>
              <div className={styles.columnTitleMarkToDo} />
              <h4>Do zrobienia</h4>
            </div>
            <div className={styles.taskColumn}>
              <div className={styles.task}>
                <p>task</p>
              </div>
            </div>
          </div>
          <div className={styles.taskColumnContainer}>
            <div className={styles.columnTitleWrapper}>
              <div className={styles.columnTitleMarkInProgress} />
              <h4>W trakcie</h4>
            </div>
            <div className={styles.taskColumn}>
              <div className={styles.task}>
                <p>task</p>
              </div>
            </div>
          </div>
          <div className={styles.taskColumnContainer}>
            <div className={styles.columnTitleWrapper}>
              <div className={styles.columnTitleMarkSent} />
              <h4>Wysłane</h4>
            </div>
            <div className={styles.taskColumn}>
              <div className={styles.task}>
                <p>task</p>
              </div>
            </div>
          </div>
        </div>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
