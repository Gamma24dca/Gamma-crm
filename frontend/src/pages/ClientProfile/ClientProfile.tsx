import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from './ClientProfile.module.css';
import {
  ClientsType,
  deleteClient,
  getCurrentClient,
  UpdateClient,
} from '../../services/clients-service';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import BackButton from '../../components/Atoms/BackButton/BackButton';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import {
  getAllCompanies,
  UpdateCompany,
} from '../../services/companies-service';
import useClientsContext from '../../hooks/Context/useClientsContext';

const initialClientObject = {
  name: '',
  company: '',
  email: '',
  phone: '',
};

function ClientProfile() {
  const [client, setClient] = useState<ClientsType>();
  const [formValue, setFormValue] = useState(initialClientObject);
  const { dispatch } = useClientsContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });
  const params = useParams();
  const navigate = useNavigate();

  const clientID = params.id;

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };
    fetchUsers();
  }, [companiesDispatch, companies]);

  const fetchClient = async () => {
    let errorHappened = false;

    const currentClient = await getCurrentClient(clientID);

    if (currentClient) {
      setClient(currentClient);
      setFormValue({
        name: currentClient.name || '',
        company: currentClient.company || '',
        email: currentClient.email || '',
        phone: currentClient.phone || '',
      });

      try {
        setLoadingState(() => ({
          isLoading: true,
          isError: false,
        }));
      } catch (error) {
        errorHappened = true;
        setLoadingState(() => ({
          isLoading: false,
          isError: true,
        }));
      } finally {
        setLoadingState((prevState) => ({
          ...prevState,
          isLoading: false,
          isError: errorHappened ? true : prevState.isError,
        }));
      }
    }
  };
  useEffect(() => {
    fetchClient();
  }, []);

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdateClient = async () => {
    await UpdateClient({ id: clientID, clientData: formValue });
    fetchClient();
  };

  const handleDeleteClient = async (id) => {
    try {
      const deletedClient = await deleteClient(id);
      dispatch({ type: 'DELETE_CLIENT', payload: deletedClient });
      navigate('/klienci');

      const company = companies.find(
        (com) => com.name === deletedClient.company
      );

      if (!company) {
        console.warn(`Company "${deletedClient.company}" not found.`);
        return;
      }

      const filteredClientPersons = company.clientPerson.filter(
        (cp) => cp.name !== deletedClient.name
      );

      await UpdateCompany({
        id: company._id,
        companyData: { clientPerson: filteredClientPersons },
      });
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  return (
    <ViewContainer>
      <ListContainer>
        {client && (
          <>
            <div className={styles.clientProfileTopBar}>
              <BackButton path="klienci" />
              <h2>{client.name}</h2>
              <div>
                <button type="button">Dodaj notatke</button>
                <button
                  type="button"
                  onClick={() => handleDeleteClient(clientID)}
                >
                  Usuń
                </button>
              </div>
            </div>
            <div className={styles.columnsWrapper}>
              <div className={styles.leftColumn}>
                <h3>Informacje</h3>
                <div className={styles.infoInputsWrapper}>
                  <div className={styles.inputWrapper}>
                    <label htmlFor="clientName">
                      <strong>Imie i nazwisko</strong>
                    </label>
                    <input
                      type="text"
                      name="clientName"
                      id="clientName"
                      maxLength={30}
                      value={formValue.name}
                      onChange={(e) => {
                        handleFormChange(e, 'name');
                      }}
                      className={styles.companyInput}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <label htmlFor="clientMail">
                      <strong>E-mail</strong>
                    </label>
                    <input
                      type="text"
                      name="clientMail"
                      id="clientMail"
                      maxLength={40}
                      value={formValue.email}
                      onChange={(e) => {
                        handleFormChange(e, 'email');
                      }}
                      className={styles.companyInput}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <label htmlFor="clientPhone">
                      <strong>Telefon</strong>
                    </label>
                    <input
                      type="text"
                      name="clientPhone"
                      id="clientPhone"
                      maxLength={15}
                      value={formValue.phone}
                      onChange={(e) => {
                        handleFormChange(e, 'phone');
                      }}
                      className={styles.companyInput}
                    />
                  </div>
                  <div className={styles.inputWrapper}>
                    <label htmlFor="companyNIP">
                      <strong>Firma</strong>
                    </label>
                    <select
                      name="companyNIP"
                      id="companyNIP"
                      //   value={formValue.nip}
                      // onChange={(e) => {
                      //   handleFormChange(e, 'nip');
                      // }}
                      className={styles.companyInput}
                    >
                      <option value={formValue.company}>
                        {client.company}
                      </option>
                      {companies.map((com) => {
                        return (
                          com.name !== client.company && (
                            <option value={com.name} key={com._id}>
                              {com.name}
                            </option>
                          )
                        );
                      })}
                    </select>
                  </div>
                  <button
                    className={styles.saveBtn}
                    type="button"
                    onClick={handleUpdateClient}
                  >
                    zapisz
                  </button>
                </div>
              </div>
              <div className={styles.rightColumn}>
                <h3>Podsumowanie</h3>
              </div>
            </div>
          </>
        )}
      </ListContainer>
    </ViewContainer>
  );
}

export default ClientProfile;
