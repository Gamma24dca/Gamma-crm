import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import BackButton from '../../Atoms/BackButton/BackButton';
import styles from './CompanyProfileControlBar.module.css';
import CTA from '../../Atoms/CTA/CTA';
import Select from '../../Atoms/Select/Select';

const months = [
  'Styczeń',
  'Luty',
  'Marzec',
  'Kwiecień',
  'Maj',
  'Czerwiec',
  'Lipiec',
  'Sierpień',
  'Wrzesień',
  'Październik',
  'Listopad',
  'Grudzień',
];

function CompanyProfileControlBar({ company, openModal, tasks }) {
  const [selectedMonth, setSelectedMonth] = useState<string>('');

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  useEffect(() => {
    const currentMonthIndex = new Date().getMonth();
    setSelectedMonth(months[currentMonthIndex]);
  }, []);

  const totalHours = tasks.reduce((acc, task) => acc + task.hours, 0);

  return (
    <>
      <div className={styles.leftSide}>
        <BackButton path="firmy" />
        {company ? (
          <div
            className={styles.editCompanyWrapper}
            role="button"
            tabIndex={0}
            onClick={() => openModal()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                openModal();
              }
            }}
          >
            <button type="button" className={styles.editCompanyButton}>
              <h2>{company.name}</h2>
            </button>

            <Icon icon="lucide:edit" width="24" height="24" color="#f68c1e" />
          </div>
        ) : (
          <div className={styles.companyNameLoader} />
        )}
        {/* <select
          id="month-select"
          value={selectedMonth}
          onChange={handleMonthChange}
          className={styles.selectInput}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select> */}
        <Select
          value={selectedMonth}
          handleValueChange={handleMonthChange}
          optionData={months}
        />
      </div>
      <div className={styles.center}>
        <input
          className={styles.navInput}
          type="text"
          placeholder="Szukaj"
          name="task-search"
          id="task-search"
        />

        <p className={styles.summPar}>Suma:</p>
      </div>
      <div className={styles.totalHoursContainer}>
        <p>{totalHours}</p>
      </div>
      <div className={styles.controlBarBtnsWrapper}>
        <CTA type="button" onClick={() => {}}>
          Filtry
        </CTA>
      </div>
    </>
  );
}

export default CompanyProfileControlBar;
