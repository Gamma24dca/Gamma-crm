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
};

function AddCompanyForm({ companies, successMessage, handleSuccesMessage }) {
  // const [clients, setClients] = useState([]);
  // const [client, setClient] = useState({
  //   label: '',
  //   value: '',
  //   company: '',
  //   email: '',
  //   phone: '',
  // });
  const [isAddNewClientFormActive, setIsAddNewClientFormActive] =
    useState(false);
  const {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
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

        const clientsObject = formValue.clientPerson.map((client) => ({
          label: client.label,
          value: client.value,
          company: client.company,
          email: client.email,
          phone: client.phone,
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
          clientPerson: clientsObject,
          hourRate,
          teamMembers: memberObject,
        });

        if (response !== null) {
          dispatch({ type: 'CREATE_COMPANY', payload: response });
        }

        formik.resetForm();
        handleSuccesMessage('Firma dodana pomyślnie!');
        setFormValue((prevState) => ({
          ...prevState,
          teamMembers: [],
        }));
      } catch {
        formik.setStatus('error');
      }
    },
  });

  const formInputs = [
    {
      id: 'name',
      type: 'text',
      placeholder: 'Nazwa',
      value: formik.values.name,
    },
    {
      id: 'nip',
      type: 'text',
      placeholder: 'NIP',
      inValue: formik.values.nip,
    },
    {
      id: 'address',
      type: 'text',
      placeholder: 'Adres',
      inValue: formik.values.address,
    },
    {
      id: 'website',
      type: 'url',
      placeholder: 'Strona',
      inValue: formik.values.website,
    },
    {
      id: 'hourRate',
      type: 'text',
      placeholder: 'Stawka godzinowa',
      inValue: formik.values.hourRate,
    },
  ];
  return (
    <div className={styles.formsWrapper}>
      <Form onSubmit={formik.handleSubmit} isSignInView={false}>
        {formik.status === 'error' && (
          <div className={styles.error}>Tworzenie nie powiodło się</div>
        )}
        <>
          {formInputs.map(({ id, type, placeholder, inValue }) => {
            return (
              <FormControl key={id}>
                <Input
                  id={id}
                  type={type}
                  name={id}
                  placeholder={placeholder}
                  className={
                    formik.touched.address && formik.errors.address
                      ? `${styles.errorBorder}`
                      : `${inputStyle.input}`
                  }
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={inValue}
                />
              </FormControl>
            );
          })}
        </>

        {/* <div className={styles.clientSelectWrapper}>
        <ClientSelect
          value={formValue.clientPerson}
          setValue={setFormValue}
          inputValue={clientInputValue}
          setInputValue={setClientInputValue}
        />
      </div> */}

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
        <SubmitButton
          disabled={formik.isSubmitting}
          buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
          isSignInView={false}
        />
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
                  onClick={() => setIsAddNewClientFormActive(false)}
                />
                <p className={styles.clientSecTitle}>Nowy klient</p>
              </div>
              <div className={styles.inputsWrapper}>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Imie i nazwisko"
                  className={styles.input}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value=""
                />
                <Input
                  id="mail"
                  type="text"
                  name="mail"
                  placeholder="Email"
                  className={styles.input}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value=""
                />
                <Input
                  id="phone"
                  type="text"
                  name="phone"
                  placeholder="Telefon"
                  className={styles.input}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value=""
                />
              </div>
              <button type="button" className={styles.addNewClientButton}>
                Dodaj
              </button>
            </>
          ) : (
            <>
              <p className={styles.clientSecTitle}>Klienci</p>

              <div className={styles.clientTilesWrapper}>
                <div className={styles.clientTile}>
                  <p>Karina Olejnik</p>
                  <Icon icon="line-md:trash" width="24" height="24" />
                </div>
                <div className={styles.clientTile}>
                  <p>Karina Olejnik</p>
                  <Icon icon="line-md:trash" width="24" height="24" />
                </div>
                <div className={styles.clientTile}>
                  <p>Karina Olejnik</p>
                  <Icon icon="line-md:trash" width="24" height="24" />
                </div>
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
