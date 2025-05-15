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
import SearchInput from '../../Atoms/ControlBar/SearchInput/SearchInput';
import FiltersClearButton from '../../Atoms/FiltersClearButton/FiltersClearButton';

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
  searchInputValue,
  setSearchInputValue,
  settleStateFilter,
  setSettleStateFilter,
}) {
  const [filterDropdown, setFilterDropdown] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isSecondSelectOpen, setIsSecondSelectOpen] = useState(false);

  const total =
    tasks.length > 0
      ? tasks.reduce((tasksTotalHours, task) => {
          return (
            tasksTotalHours + summarizeCompanyProfHours(task, currentMonthIndex)
          );
        }, 0)
      : 0;

  const settleDropdownData = [
    {
      id: 2,
      value: 'Rozliczone',
    },
    {
      id: 3,
      value: 'Nierozliczone',
    },
  ];

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

  const toggleSettleValue = (settleValue) => {
    if (settleStateFilter) {
      console.log('saifuhsdiuhsdagiusda');
      setSettleStateFilter('');
    } else {
      setSettleStateFilter(settleValue.value);
    }
  };

  const viewData = ['Główne', 'Dodatkowe'];

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
          optionData={viewData}
        />

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
        <SearchInput
          value={searchInputValue}
          onChange={(e) => {
            setSearchInputValue(e.target.value);
          }}
        />
      </div>
      <div className={styles.totalHoursContainer}>
        <p className={styles.summPar}>Suma:</p>
        <div className={styles.summWrapper}>
          <p className={styles.summValue}>{total}h</p>

          <p className={styles.summValue}>
            {company && total * Number(company.hourRate)}zł
          </p>
        </div>
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
            <div className={styles.spacer} />
            <MultiselectDropdown
              label="Rozliczone"
              isSelectOpen={isSecondSelectOpen}
              setIsSelectOpen={setIsSecondSelectOpen}
            >
              {settleDropdownData.map((sdd) => {
                return (
                  <FilterCheckbox
                    key={sdd.id}
                    name={sdd.value}
                    isSelected={settleStateFilter === sdd.value}
                    toggleCompany={toggleSettleValue}
                    filterVariable={sdd}
                  />
                );
              })}
            </MultiselectDropdown>

            <FiltersClearButton
              handleClear={() => {
                setClientPersonToFilter([]);
                setSettleStateFilter('');
              }}
            />
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
