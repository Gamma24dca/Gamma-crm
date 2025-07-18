import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './AddCompanyForm.module.css';
import FormControl from '../../Atoms/FormControl/FormControl';
import Input from '../../Atoms/Input/Input';
import SelectUser from '../../Molecules/SelectUser/SelectUser';
import CompanyGraphicTile from '../../Molecules/CompanyGraphicTile/CompanyGraphicTile';
import SubmitButton from '../../Atoms/SubmitBtn/SubmitBtn';
import Form from '../../Atoms/Form/Form';
import useSelectUser from '../../../hooks/useSelectUser';
import { addCompany } from '../../../services/companies-service';
import inputStyle from '../../Atoms/Input/Input.module.css';
// import ClientSelect from '../../Molecules/ClientSelect/ClientSelect';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import { addManyClients } from '../../../services/clients-service';
import ClientSelect from '../../Molecules/ClientSelect/ClientSelect';

const createCompanySchema = Yup.object({
  name: Yup.string().required('Nazwa jest wymagana'),
  nip: Yup.string(),
  mail: Yup.string().email('Nieprawidłowy adres email'),
  website: Yup.string(),
});

const initialCompanyObject = {
  name: '',
  nip: '',
  address: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
  keyWords: [],
  hourRate: '',
};

function AddCompanyForm({ companies, successMessage, handleSuccesMessage }) {
  const [clients, setClients] = useState([]);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
  });
  const [isAddNewClientFormActive, setIsAddNewClientFormActive] =
    useState(false);

  const [isAddNewClientError, setIsAddNewClientError] = useState(false);
  const {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
    keyWordInputValue,
    setKeyWordInputValue,
    // clientInputValue,
    // setClientInputValue,
  } = useSelectUser({
    initialValue: initialCompanyObject,
    objectKey: 'teamMembers',
  });
  const { dispatch } = useCompaniesContext();

  const formik = useFormik({
    initialValues: {
      name: '',
      nip: '',
      address: '',
      website: '',
      hourRate: '',
    },
    validationSchema: createCompanySchema,

    onSubmit: async (values) => {
      try {
        const { name, nip, address, website, hourRate } = values;

        const memberObject = formValue.teamMembers.map((member) => {
          return member;
        });

        const keyWordsObject = formValue.keyWords.map((kw) => ({
          label: kw.label,
          value: kw.value,
        }));

        if (companies.some((company) => company.name === name)) {
          handleSuccesMessage('Ta firma już istnieje');
          return;
        }

        const response = await addCompany({
          name,
          nip,
          address,
          website,
          clientPerson: clients,
          hourRate,
          teamMembers: memberObject,
          keyWords: keyWordsObject,
        });

        await addManyClients(clients);

        if (response !== null) {
          dispatch({ type: 'CREATE_COMPANY', payload: response });
        }

        formik.resetForm();
        handleSuccesMessage('Firma dodana pomyślnie!');
        setFormValue((prevState) => ({
          ...prevState,
          teamMembers: [],
        }));
        setClients([]);
      } catch {
        formik.setStatus('error');
      }
    },
  });

  const handleAddNewClientFormChange = (e, key) => {
    setNewClient((prev) => {
      return {
        ...prev,
        [key]: e.target.value,
      };
    });
  };

  console.log(formValue.keyWords);

  const handlhandleAddNewClientSubmit = (nc, companyName) => {
    if (nc.name && companyName) {
      setClients((prev) => {
        return [...prev, { ...nc, company: companyName }];
      });
      setNewClient({
        name: '',
        company: '',
        email: '',
        phone: '',
      });
      setIsAddNewClientFormActive(false);
      setIsAddNewClientError(false);
      return;
    }
    setIsAddNewClientError(true);
  };

  const handleDeleteNewClient = (clientName) => {
    const filteredClients = clients.filter((cl) => cl.name !== clientName);
    setClients(filteredClients);
  };

  const formInputs = [
    {
      id: 'name',
      type: 'text',
      placeholder: `${
        formik.errors.name && formik.touched.name ? 'Uzupełnij Nazwe!' : 'Nazwa'
      }`,
      inValue: formik.values.name,
      touchedProp: formik.touched.name,
      errorProp: formik.errors.name,
      isCap: true,
    },
    {
      id: 'nip',
      type: 'text',
      placeholder: 'NIP',
      inValue: formik.values.nip,
      touchedProp: formik.touched.nip,
      errorProp: formik.errors.nip,
      isCap: false,
    },
    {
      id: 'address',
      type: 'text',
      placeholder: 'Adres',
      inValue: formik.values.address,
      touchedProp: formik.touched.address,
      errorProp: formik.errors.address,
      isCap: true,
    },
    {
      id: 'website',
      type: 'url',
      placeholder: 'Strona',
      inValue: formik.values.website,
      touchedProp: formik.touched.website,
      errorProp: formik.errors.website,
      isCap: false,
    },
    {
      id: 'hourRate',
      type: 'text',
      placeholder: 'Stawka godzinowa',
      inValue: formik.values.hourRate,
      touchedProp: formik.touched.hourRate,
      errorProp: formik.errors.hourRate,
      isCap: false,
    },
  ];

  const capitalizeFirst = (text) =>
    text.charAt(0).toUpperCase() + text.slice(1);

  return (
    <div className={styles.formsWrapper}>
      <Form onSubmit={formik.handleSubmit} isSignInView={false}>
        {formik.status === 'error' && (
          <div className={styles.error}>Tworzenie nie powiodło się</div>
        )}
        <>
          {formInputs.map(
            ({ id, type, placeholder, inValue, touchedProp, errorProp }) => {
              return (
                <FormControl key={id}>
                  <Input
                    id={id}
                    type={type}
                    name={id}
                    placeholder={placeholder}
                    className={
                      touchedProp && errorProp
                        ? `${inputStyle.errorBorder}`
                        : `${inputStyle.input}`
                    }
                    onChange={(e) => {
                      const { name, value } = e.target;
                      formik.setFieldValue(name, capitalizeFirst(value));
                    }}
                    onBlur={formik.handleBlur}
                    value={inValue}
                  />
                </FormControl>
              );
            }
          )}
        </>
        {/* <div className={styles.clientSelectWrapper}>
        <ClientSelect
          value={formValue.clientPerson}
          setValue={setFormValue}
          inputValue={clientInputValue}
          setInputValue={setClientInputValue}
        />
      </div> */}

        <div className={styles.clientSelectWrapper}>
          <ClientSelect
            value={formValue.keyWords}
            setValue={setFormValue}
            inputValue={keyWordInputValue}
            setInputValue={setKeyWordInputValue}
          />
        </div>

        <SelectUser users={users} handleAddMember={handleAddMember} />
        {formValue.teamMembers.length > 0 && (
          <div className={styles.displayMembersWrapper}>
            {formValue.teamMembers.map((member) => {
              return (
                <CompanyGraphicTile
                  key={member._id}
                  member={member}
                  handleDeleteMember={handleDeleteMember}
                />
              );
            })}
          </div>
        )}
        <div className={styles.submitBtnWrapper}>
          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            isSignInView={false}
          />
        </div>
        <p className={styles.finalMessage}>{successMessage}</p>
      </Form>
      <div>
        <div className={styles.clientsContainer}>
          {isAddNewClientFormActive ? (
            <>
              <div className={styles.newClientTopBar}>
                <Icon
                  icon="ion:arrow-back-outline"
                  color="#f68c1e"
                  width="26"
                  height="26"
                  className={styles.backButton}
                  onClick={() => {
                    setIsAddNewClientFormActive(false);
                    setIsAddNewClientError(false);
                  }}
                />
                <p className={styles.clientSecTitle}>Nowy klient</p>
              </div>
              <div className={styles.inputsWrapper}>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder={`${
                    isAddNewClientError
                      ? 'Imie i nazwisko wymagane!'
                      : 'Imie i nazwisko'
                  }`}
                  className={`${
                    isAddNewClientError ? styles.errorBorder : styles.input
                  }`}
                  onChange={(e) => handleAddNewClientFormChange(e, 'name')}
                  onBlur={formik.handleBlur}
                  value={newClient.name}
                  maxLength={30}
                />
                <Input
                  id="mail"
                  type="text"
                  name="mail"
                  placeholder="Email"
                  className={styles.input}
                  onChange={(e) => handleAddNewClientFormChange(e, 'email')}
                  onBlur={formik.handleBlur}
                  value={newClient.email}
                  maxLength={40}
                />
                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Telefon"
                  className={styles.input}
                  onChange={(e) => handleAddNewClientFormChange(e, 'phone')}
                  onBlur={formik.handleBlur}
                  value={newClient.phone}
                  maxLength={15}
                />
              </div>
              <button
                type="button"
                className={styles.addNewClientButton}
                onClick={() =>
                  handlhandleAddNewClientSubmit(newClient, formik.values.name)
                }
              >
                Dodaj
              </button>
            </>
          ) : (
            <>
              <p className={styles.clientSecTitle}>Klienci</p>

              <div className={styles.clientTilesWrapper}>
                {clients.length > 0 ? (
                  clients.map((cl) => {
                    return (
                      <div className={styles.clientTile} key={cl.name}>
                        <p>{cl.name}</p>
                        <Icon
                          icon="line-md:trash"
                          width="24"
                          height="24"
                          onClick={() => handleDeleteNewClient(cl.name)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className={styles.noClientsWrapper}>
                    <Icon icon="line-md:person-add" width="24" height="24" />
                    <p className={styles.noClientsTitle}>Brak klientów</p>
                  </div>
                )}
              </div>

              <button
                type="button"
                className={styles.addClientButton}
                onClick={() => setIsAddNewClientFormActive(true)}
              >
                Dodaj klienta
                <Icon icon="line-md:plus-circle" width="20" height="20" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddCompanyForm;
