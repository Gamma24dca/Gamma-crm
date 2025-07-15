import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './ClientProfile.module.css';
import {
  addNote,
  ClientsType,
  deleteClient,
  deleteNote,
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
import ClientProfileViewComponent from '../../components/Organisms/ClientProfileViewComponent/ClientProfileViewComponent';
import useUsersContext from '../../hooks/Context/useUsersContext';
import { getAllUsers } from '../../services/users-service';
import DateFormatter from '../../utils/dateFormatter';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import CTA from '../../components/Atoms/CTA/CTA';

const initialClientObject = {
  name: '',
  company: '',
  email: '',
  phone: '',
};

function ClientProfile() {
  const [client, setClient] = useState<ClientsType>();
  const [formValue, setFormValue] = useState(initialClientObject);
  const [notes, setNotes] = useState([]);
  const [noteValue, setNoteValue] = useState('');
  const [isMouseOverIcon, setIsMouseOverIcon] = useState({
    isOver: false,
    noteID: '',
  });
  const { dispatch } = useClientsContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { users, dispatch: usersDispatch } = useUsersContext();
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });
  const params = useParams();
  const navigate = useNavigate();
  const { showModal, exitAnim, openModal, closeModal } = useModal();

  const clientID = params.id;

  const fetchCompanies = async () => {
    if (companies.length === 0) {
      try {
        const allCompanies = await getAllCompanies();
        companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    }
  };

  const fetchUsers = async () => {
    if (companies.length === 0) {
      try {
        const allUsers = await getAllUsers();
        usersDispatch({ type: 'SET_USERS', payload: allUsers });
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [companiesDispatch, companies]);

  const fetchClient = async () => {
    let errorHappened = false;

    try {
      const currentClient = await getCurrentClient(clientID);

      if (currentClient) {
        setClient(currentClient);
        setNotes(currentClient.notes);
        setFormValue({
          name: currentClient.name || '',
          company: currentClient.company || '',
          email: currentClient.email || '',
          phone: currentClient.phone || '',
        });

        setLoadingState(() => ({
          isLoading: true,
          isError: false,
        }));
        return;
      }
      throw new Error('Error fetching client');
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
  };
  useEffect(() => {
    fetchClient();
    fetchUsers();
  }, []);

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdateClient = async () => {
    const updatedClient = await UpdateClient({
      id: clientID,
      clientData: formValue,
    });
    const company = companies.find((com) => com.name === updatedClient.company);

    if (!company) {
      console.warn(`Company "${updatedClient.company}" not found.`);
      return;
    }

    const updatedClientPersons = company.clientPerson.map((person) => {
      return person.name === updatedClient.name ? formValue : person;
    });

    await UpdateCompany({
      id: company._id,
      companyData: { clientPerson: updatedClientPersons },
    });
    const allCompanies = await getAllCompanies();
    companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
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

      const refreshedCompanies = await getAllCompanies();
      companiesDispatch({ type: 'SET_COMPANIES', payload: refreshedCompanies });
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleDeleteNote = async (clientId, noteID) => {
    await deleteNote(clientId, noteID);
    const filteredNotes = notes.filter((note) => note._id !== noteID);

    setNotes(filteredNotes);
  };

  const handleAddNote = async (text) => {
    const updatedNotes = await addNote({ text, date: new Date(), clientID });

    setNotes(updatedNotes);
  };
  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
        }}
        exitAnim={exitAnim}
      >
        <h2>Dodaj notatke</h2>
        <textarea
          id="note"
          name="note"
          placeholder="Wpisz swoją notatkę..."
          rows={5}
          cols={40}
          aria-label="Pole na notatkę"
          autoFocus
          required
          maxLength={1000}
          value={noteValue}
          onChange={(e) => setNoteValue(e.target.value)}
        />
        <CTA onClick={() => handleAddNote(noteValue)}>Dodaj</CTA>
      </ModalTemplate>
      <ViewContainer>
        <ListContainer>
          {client && (
            <ClientProfileViewComponent
              clientData={client}
              loadingState={loadingState}
            >
              <>
                <div className={styles.clientProfileTopBar}>
                  <BackButton path="klienci" />
                  <h2>{client.name}</h2>
                  <div>
                    <button type="button" onClick={openModal}>
                      Dodaj notatke
                    </button>
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
                    <div className={styles.notesContainer}>
                      {notes.length > 0 ? (
                        notes.map((note) => {
                          return (
                            <div className={styles.noteTile} key={note._id}>
                              {isMouseOverIcon.isOver &&
                              isMouseOverIcon.noteID === note._id ? (
                                <Icon
                                  className={styles.trashIcon}
                                  icon="line-md:trash"
                                  width="36"
                                  height="36"
                                  onMouseLeave={() =>
                                    setIsMouseOverIcon(() => {
                                      return {
                                        isOver: false,
                                        noteID: '',
                                      };
                                    })
                                  }
                                  onClick={() =>
                                    handleDeleteNote(clientID, note._id)
                                  }
                                />
                              ) : (
                                <Icon
                                  className={styles.noteIcon}
                                  icon="line-md:document-list"
                                  width="36"
                                  height="36"
                                  onMouseEnter={() =>
                                    setIsMouseOverIcon(() => {
                                      return {
                                        isOver: true,
                                        noteID: note._id,
                                      };
                                    })
                                  }
                                />
                              )}

                              <div className={styles.noteContentWrapper}>
                                <p className={styles.authorName}>
                                  {users.length > 0 &&
                                    users.find(
                                      (user) => user._id === note.author
                                    ).name}
                                </p>
                                <div className={styles.noteRow}>
                                  <p className={styles.noteText}>{note.text}</p>
                                  <DateFormatter dateString={note.date} />
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p>Brak notatek</p>
                      )}
                    </div>
                  </div>
                </div>
              </>
            </ClientProfileViewComponent>
          )}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default ClientProfile;
