import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router-dom';
import {
  getAllCompanies,
  UpdateCompany,
} from '../../../services/companies-service';
import styles from './UpdateCompanyModalContent.module.css';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import MultiselectDropdown from '../../Molecules/MultiselectDropdown/MultiselectDropdown';
import FilterCheckbox from '../../Molecules/FilterCheckbox/FilterCheckbox';
import useUsersContext from '../../../hooks/Context/useUsersContext';
import { getAllUsers } from '../../../services/users-service';
import { getClientsByCompany } from '../../../services/clients-service';
import AddClientForm from '../AddClientForm/AddClientForm';

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
  const { users, dispatch } = useUsersContext();
  const { dispatch: CompaniesDispatch } = useCompaniesContext();
  const [formValue, setFormValue] = useState(initialCompanyObject);
  const [isHourRateInputActive, setIsHourRateInputActive] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isClientsSelectOpen, setIsClientsSelectOpen] = useState(false);
  const [selectFilterValue, setSelectFilterValue] = useState({
    user: '',
    client: '',
  });
  const [clients, setClients] = useState([]);
  const [isPlusIconVisible, setIsPlusIconVisible] = useState(false);
  const [isAddNewClientView, setIsAddNewClientView] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      const fetchedClients = await getClientsByCompany(
        currentCompany.name.toLowerCase()
      );
      setClients(fetchedClients);
    };

    fetchClients();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        try {
          const allUsers = await getAllUsers();
          dispatch({ type: 'SET_USERS', payload: allUsers });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [dispatch, users]);

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
  }, [currentCompany]);

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
      CompaniesDispatch({ type: 'SET_COMPANIES', payload: companies });
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
    if (
      formValue.teamMembers.some((userToCheck) => userToCheck._id === user._id)
    ) {
      // setTeamMembers(teamMembers.filter((part) => part._id !== user._id));
      setFormValue((prev) => {
        return {
          ...prev,
          teamMembers: formValue.teamMembers.filter(
            (part) => part._id !== user._id
          ),
        };
      });

      setIsSelectOpen(true);
    } else {
      setFormValue((prev) => {
        return {
          ...prev,
          teamMembers: [...prev.teamMembers, user],
        };
      });
      setIsSelectOpen(true);
    }
  };

  const handleClientAssign = (newClient) => {
    if (
      formValue.clientPerson.some(
        (clientToCheck) => clientToCheck.value === newClient.name
      )
    ) {
      setFormValue((prev) => {
        return {
          ...prev,
          clientPerson: formValue.clientPerson.filter(
            (client) => client.value !== newClient.name
          ),
        };
      });

      setIsClientsSelectOpen(true);
    } else {
      setFormValue((prev) => {
        return {
          ...prev,
          clientPerson: [
            ...prev.clientPerson,
            { value: newClient.name, label: newClient.name },
          ],
        };
      });
      setIsClientsSelectOpen(true);
    }
  };

  const filteredUsersForDropdown = users.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.user.toLocaleLowerCase());
  });

  const filteredClientsForDropdown = clients.filter((u) => {
    return u.name
      .toLocaleLowerCase()
      .includes(selectFilterValue.client.toLocaleLowerCase());
  });

  return (
    <div>
      {!isAddNewClientView ? (
        <div className={styles.inputsWrapper}>
          {!isAddNewClientView && (
            <h2 className={styles.editCompanyModalTitle}>Edytuj</h2>
          )}

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
                      isSelected={formValue.teamMembers.some(
                        (tm) => tm._id === u._id
                      )}
                      toggleCompany={handleUserAssign}
                      filterVariable={u}
                    />
                  );
                })}
              </MultiselectDropdown>
            </div>

            <div className={styles.selectsRowRight}>
              <label
                htmlFor="companyNumber"
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setIsAddNewClientView(true);
                  }
                }}
                onMouseEnter={() => setIsPlusIconVisible(true)}
                onMouseLeave={() => setIsPlusIconVisible(false)}
                onClick={() => setIsAddNewClientView(true)}
                className={styles.clientsLabel}
              >
                <strong>Klienci:</strong>
                {isPlusIconVisible && (
                  <Icon
                    icon="line-md:plus-circle"
                    width="24"
                    height="24"
                    className={styles.addClientIcon}
                  />
                )}
              </label>
              <MultiselectDropdown
                isSelectOpen={isClientsSelectOpen}
                setIsSelectOpen={setIsClientsSelectOpen}
                label="Klienci"
                inputKey="client"
                inputValue={selectFilterValue.client}
                handleInputValue={handleFilterDropdownInputValue}
                isSquare
              >
                {filteredClientsForDropdown.map((client) => {
                  return (
                    <FilterCheckbox
                      key={client._id}
                      name={client.name}
                      isSelected={formValue.clientPerson.some(
                        (cp) => cp.value === client.name
                      )}
                      toggleCompany={handleClientAssign}
                      filterVariable={client}
                    />
                  );
                })}
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
                  <span
                    className={`${styles.rateLabel} ${hourRateLabelStyle()}`}
                  >
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
      ) : (
        <>
          <button type="button" onClick={() => setIsAddNewClientView(false)}>
            wróć
          </button>
          <AddClientForm companyName={currentCompany.name} />
        </>
      )}
    </div>
  );
}

export default UpdateCompanyModalContent;
