import { Icon } from '@iconify/react';
import BackButton from '../../Atoms/BackButton/BackButton';
import styles from './CompanyProfileControlBar.module.css';
import CTA from '../../Atoms/CTA/CTA';
import Select from '../../Atoms/Select/Select';
import summarizeHours from '../../../utils/SummarizeHours';

function CompanyProfileControlBar({
  company,
  openModal,
  tasks,
  selectedMonth,
  selectedYear,
  handleMonthChange,
  handleYearChange,
  months,
  years,
}) {
  const totalHours = summarizeHours(tasks);

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
