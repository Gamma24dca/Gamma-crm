import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useSelectUser from '../../../hooks/useSelectUser';
import {
  getAllCompanies,
  UpdateCompany,
} from '../../../services/companies-service';
// import CompanyGraphicTile from '../../Molecules/CompanyGraphicTile/CompanyGraphicTile';
// import SelectUser from '../../Molecules/SelectUser/SelectUser';
import styles from './UpdateCompanyModalContent.module.css';
// import ClientSelect from '../../Molecules/ClientSelect/ClientSelect';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';
// import useAuth from '../../../hooks/useAuth';

const initialCompanyObject = {
  name: '',
  phone: '',
  mail: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
  hourRate: '',
};

function UpdateCompanyModalContent({
  currentCompany,
  closeModal,
  openCaptcha,
  refreshCompanyData,
}) {
  const params = useParams();
  // const { user } = useAuth();

  const { dispatch } = useCompaniesContext();
  const [isHourRateInputActive, setIsHourRateInputActive] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isClientsSelectOpen, setIsClientsSelectOpen] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
  });
  const [teamMembers, setTeamMembers] = useState([]);

  const {
    users,
    formValue,
    setFormValue,
    // handleAddMember,
    // handleDeleteMember,
    // clientInputValue,
    // setClientInputValue,
  } = useSelectUser({
    initialValue: initialCompanyObject,
    objectKey: 'teamMembers',
  });

  useEffect(() => {
    setFormValue({
      name: currentCompany.name || '',
      phone: currentCompany.phone || '',
      mail: currentCompany.mail || '',
      teamMembers: currentCompany.teamMembers || [],
      clientPerson: currentCompany.clientPerson || [],
      hourRate: currentCompany.hourRate || '',
      website: currentCompany.website || '',
    });
  }, [currentCompany, setFormValue]);

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdateCompany = async () => {
    const response = await UpdateCompany({
      id: params.id,
      companyData: formValue,
    });

    if (response !== null) {
      closeModal();
      refreshCompanyData();
      const companies = await getAllCompanies();
      dispatch({ type: 'SET_COMPANIES', payload: companies });
    }
  };

  const hourRateLabelStyle = () => {
    if (formValue.hourRate.length <= 2) {
      return styles.two;
    }
    if (formValue.hourRate.length === 3) {
      return styles.three;
    }

    if (formValue.hourRate.length > 3) {
      return styles.four;
    }

    return styles.one;
  };

  const handleFilterDropdownInputValue = (e, key) => {
    const { value } = e.target;
    setSelectFilterValue((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  const handleUserAssign = (user) => {
    if (teamMembers.some((userToCheck) => userToCheck._id === user._id)) {
      setTeamMembers(teamMembers.filter((part) => part._id !== user._id));

      setIsSelectOpen(true);
    } else {
      setTeamMembers((prev) => {
        return [...prev, user];
      });
      setIsSelectOpen(true);
    }
  };

  const filteredUsersForDropdown = users.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.user.toLocaleLowerCase());
  });

  return (
    <div className={styles.inputsWrapper}>
      <div className={styles.nameInput}>
        <label htmlFor="companyName">
          <strong>Nazwa:</strong>
        </label>
        <input
          type="text"
          name="companyName"
          id="companyName"
          maxLength={20}
          value={formValue.name}
          onChange={(e) => {
            handleFormChange(e, 'name');
          }}
          className={styles.companyInput}
        />
      </div>
      <div className={styles.selectsRow}>
        <div className={styles.selectsRowLeft}>
          <label htmlFor="companyNumber">
            <strong>Graficy:</strong>
          </label>
          <MultiselectDropdown
            isSelectOpen={isSelectOpen}
            setIsSelectOpen={setIsSelectOpen}
            label="Graficy"
            inputKey="user"
            inputValue={selectFilterValue.user}
            handleInputValue={handleFilterDropdownInputValue}
            isSquare
          >
            {filteredUsersForDropdown.map((u) => {
              return (
                <FilterCheckbox
                  key={u._id}
                  name={u.name}
                  isSelected={teamMembers.includes(u)}
                  toggleCompany={handleUserAssign}
                  filterVariable={u}
                />
              );
            })}
          </MultiselectDropdown>
        </div>

        <div className={styles.selectsRowRight}>
          <label htmlFor="companyNumber">
            <strong>Klienci:</strong>
          </label>
          <MultiselectDropdown
            isSelectOpen={isClientsSelectOpen}
            setIsSelectOpen={setIsClientsSelectOpen}
            label="Klienci"
            inputKey="user"
            inputValue={selectFilterValue.user}
            handleInputValue={handleFilterDropdownInputValue}
            isSquare
          >
            <p>test</p>
            {/* {filteredUsersForDropdown.map((userOnDrop) => {
          return (
            user._id !== user[0]._id && (
              <FilterCheckbox
                key={userOnDrop._id}
                name={userOnDrop.name}
                isSelected={participantsToAdd.includes(userOnDrop)}
                toggleCompany={handleUserAssign}
                filterVariable={userOnDrop}
              />
            )
          );
        })} */}
          </MultiselectDropdown>
        </div>
      </div>
      <div className={styles.nameInput}>
        <label htmlFor="companyMail">
          <strong>E-Mail:</strong>
        </label>
        <input
          type="text"
          name="companyMail"
          id="companyMail"
          maxLength={40}
          value={formValue.mail}
          onChange={(e) => {
            handleFormChange(e, 'mail');
          }}
          className={styles.companyInput}
        />
      </div>
      <div className={styles.firstRow}>
        <div>
          <label htmlFor="companyNumber">
            <strong>Numer:</strong>
          </label>
          <input
            type="text"
            name="companyNumber"
            id="companyNumber"
            maxLength={15}
            value={formValue.phone}
            onChange={(e) => {
              handleFormChange(e, 'phone');
            }}
            className={styles.companyInput}
          />
        </div>

        <div className={styles.hourRateContainer}>
          <label htmlFor="hourRate">
            <strong>Stawka:</strong>
          </label>

          <span className={styles.hourRateInputWrapper}>
            <input
              type="text"
              name="hourRate"
              id="hourRate"
              maxLength={4}
              value={formValue.hourRate}
              onClick={() => setIsHourRateInputActive(true)}
              onBlur={() => setIsHourRateInputActive(false)}
              onChange={(e) => {
                handleFormChange(e, 'hourRate');
                setIsHourRateInputActive(true);
              }}
              className={styles.hourRateInput}
            />
            {!isHourRateInputActive && (
              <span className={`${styles.rateLabel} ${hourRateLabelStyle()}`}>
                zł
              </span>
            )}
          </span>
        </div>
      </div>

      <div className={styles.optionButtonsWrapper}>
        <button
          type="button"
          onClick={() => {
            openCaptcha(true);
          }}
          className={styles.deleteCompanyButton}
        >
          Usuń firmę
        </button>
        <button
          type="button"
          onClick={() => {
            handleUpdateCompany();
          }}
          className={styles.editButton}
        >
          Zapisz
        </button>
      </div>
    </div>
  );
}

export default UpdateCompanyModalContent;
