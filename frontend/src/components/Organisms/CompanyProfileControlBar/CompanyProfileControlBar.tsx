import { useState } from 'react';
import { Icon } from '@iconify/react';
import BackButton from '../../Atoms/BackButton/BackButton';
import styles from './CompanyProfileControlBar.module.css';
import CTA from '../../Atoms/CTA/CTA';
import Select from '../../Atoms/Select/Select';
import summarizeCompanyProfHours from '../../../utils/summarizeCompanyProfHours';
import FilterDropdownContainer from '../../Atoms/FilterDropdownContainer/FilterDropdownContainer';
import Overlay from '../../Atoms/Overlay/Overlay';
import DropdownHeader from '../../Atoms/DropdownHeader/DropdownHeader';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';

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
  currentMonthIndex,
  clientPersonToFilter,
  setClientPersonToFilter,
}) {
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const total =
    tasks.length > 0
      ? tasks.reduce((tasksTotalHours, task) => {
          return (
            tasksTotalHours + summarizeCompanyProfHours(task, currentMonthIndex)
          );
        }, 0)
      : 0;

  const toggleClientPerson = (clientPerson) => {
    if (clientPersonToFilter.includes(clientPerson.value)) {
      setClientPersonToFilter(
        clientPersonToFilter.filter((part) => part !== clientPerson.value)
      );
    } else {
      setClientPersonToFilter((prev) => {
        return [...prev, clientPerson.value];
      });
    }
  };

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
        <p>{total}</p>
      </div>
      {filterDropdown && (
        <>
          <Overlay closeFunction={setFilterDropdown} />
          <FilterDropdownContainer>
            <DropdownHeader>Filtr</DropdownHeader>
            <br />
            <MultiselectDropdown
              label="Klienci"
              isSelectOpen={isSelectOpen}
              setIsSelectOpen={setIsSelectOpen}
            >
              {company.clientPerson.map((cp) => {
                return (
                  <FilterCheckbox
                    key={cp._id}
                    name={cp.value}
                    isSelected={clientPersonToFilter.includes(cp.value)}
                    toggleCompany={toggleClientPerson}
                    filterVariable={cp}
                  />
                );
              })}
            </MultiselectDropdown>
          </FilterDropdownContainer>
        </>
      )}
      <div className={styles.controlBarBtnsWrapper}>
        <CTA
          type="button"
          onClick={() => {
            setFilterDropdown((prev) => !prev);
          }}
        >
          Filtry
        </CTA>
      </div>
    </>
  );
}

export default CompanyProfileControlBar;
