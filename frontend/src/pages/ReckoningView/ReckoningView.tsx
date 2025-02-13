import { useEffect, useState } from 'react';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import InfoBar from '../../components/Atoms/InfoBar/InfoBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import Select from '../../components/Atoms/Select/Select';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import useCurrentDate from '../../hooks/useCurrentDate';
import styles from './ReckoningView.module.css';

function generateDaysArray(month, year) {
  const daysInMonth = new Date(year, month, 0).getDate();
  const daysArray = [];

  for (let i = 1; i <= daysInMonth; i += 1) {
    const dayOfWeek = new Date(year, month - 1, i).getDay(); // Sunday=0, Saturday=6
    daysArray.push({
      hourNum: 0,
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
    });
  }

  return daysArray;
}

const mockedTasks = [
  {
    _id: 'ig35c',
    worker: 'Bartek',
    month: 'marzec',
    company: 'Axa',
    createdAt: '2024.03.03',
    client: 'Stachowiczk Joanna',
    taskTitle: 'AKSIL_KATALOG_PRODUKTOW 2024',
    hours: generateDaysArray(2, 2025),
    comment: 'projekt, poprawki i pliki do druku',
    printWhere: 'Zetka',
    printSpec: 'A4',
    isSettled: true,
  },
  {
    _id: 'fps32',
    worker: 'Edyta',
    month: 'wrzesień',
    company: 'Santander',
    createdAt: '2024.05.01',
    client: 'Badowska Alicja',
    taskTitle: 'Baner industry 1070x2125',
    hours: generateDaysArray(2, 2025),
    comment: 'Zaliczka 12',
    printWhere: 'RM Print',
    printSpec: 'A5',
    isSettled: false,
  },
  {
    _id: '3x8[2',
    worker: 'Edyta',
    month: 'kwiecień',
    company: 'Santander',
    createdAt: '2024.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: generateDaysArray(2, 2025),
    comment: '',
    printWhere: 'Zetka',
    printSpec: 'A4',
    isSettled: true,
  },
];

function StudioTaskView() {
  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const [selectedMonthDaysArray, setSelectedMonthDaysArray] = useState([]);

  useEffect(() => {
    const monthIndex = months.indexOf(selectedMonth) + 1;

    setSelectedMonthDaysArray(generateDaysArray(monthIndex, 2025));
  }, [selectedMonth]);

  const tileClass = (index) => {
    return index % 2 === 0 ? styles.reckTaskItem : styles.darkerReckTaskItem;
  };

  return (
    <>
      <ControlBar>
        <ControlBarTitle>Rozliczenie</ControlBarTitle>
        <Select
          value={selectedMonth}
          handleValueChange={handleMonthChange}
          optionData={months}
        />

        <Select
          value={selectedYear}
          handleValueChange={handleYearChange}
          optionData={years}
        />
      </ControlBar>
      <ViewContainer>
        <ListContainer>
          {/* <InfoBar>
            <div className={styles.infoBarContainer}>
              <p>Firma</p>
              <p>Klient</p>
              <p>Tytuł</p>
              <p>Komentarz</p>
              <div className={styles.daysWrapper}>
                {selectedMonthDaysArray.map((dayTile, index) => {
                  return (
                    <p className={styles.dayNumberInfo} key={index}>
                      {index + 1}
                    </p>
                  );
                })}
              </div>
            </div>
          </InfoBar> */}

          <div className={styles.reckoningContainer}>
            <div className={styles.infoBar}>
              <p className={styles.infoBarElement}>Firma</p>
              <p className={styles.infoBarElement}>Klient</p>
              <p className={styles.infoBarElement}>Tytuł</p>
              <p className={styles.infoBarElement}>Opis</p>
              <p className={styles.infoBarElement}>Druk(co)</p>
              <p className={styles.infoBarElement}>Druk(gdzie)</p>
              <div className={styles.daysWrapper}>
                {selectedMonthDaysArray.map((dayTile, index) => {
                  return (
                    <p className={styles.dayInfoPar} key={index}>
                      {index + 1}
                    </p>
                  );
                })}
              </div>
            </div>
            {mockedTasks.map((reckTask, index) => {
              return (
                <div
                  className={styles.reckoningItemContainer}
                  key={reckTask._id}
                >
                  <div
                    className={`${styles.reckTaskItem} ${styles.companyTile} ${reckTask.company}`}
                  >
                    {reckTask.company}
                  </div>
                  <div className={`${tileClass(index)}`}>{reckTask.client}</div>
                  <div className={`${tileClass(index)}`}>
                    {reckTask.taskTitle}
                  </div>
                  {reckTask.comment ? (
                    <div className={`${tileClass(index)}`}>
                      {reckTask.comment && reckTask.comment}
                    </div>
                  ) : (
                    <div className={`${tileClass(index)}`}>Brak opisu</div>
                  )}

                  <div className={`${tileClass(index)}`}>
                    {reckTask.printSpec}
                  </div>
                  <div className={`${tileClass(index)}`}>
                    {reckTask.printWhere}
                  </div>

                  <div className={styles.daysWrapper}>
                    {selectedMonthDaysArray.map((dayTile, dayIndex) => {
                      return (
                        <div
                          className={
                            dayTile.isWeekend
                              ? styles.weekendDayTile
                              : styles.dayTile
                          }
                          key={dayIndex}
                        >
                          {dayTile.hourNum > 0 && dayTile.hourNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default StudioTaskView;
