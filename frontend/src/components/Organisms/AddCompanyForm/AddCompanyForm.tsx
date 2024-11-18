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

const createCompanySchema = Yup.object({
  name: Yup.string().required('Nazwa jest wymagana'),
  phone: Yup.string(),
  mail: Yup.string().email('Nieprawidłowy adres email'),
  website: Yup.string(),
});

function AddCompanyForm({ companies, successMessage, handleSuccesMessage }) {
  const {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
    // handleMemberChange,
    // selectedMember,
  } = useSelectUser();

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      mail: '',
      website: '',
    },
    validationSchema: createCompanySchema,
    onSubmit: async (values) => {
      try {
        const { name, phone, mail, website } = values;

        const memberObject = formValue.teamMembers.map((member) => {
          return member;
        });

        if (companies.some((company) => company.name === name)) {
          handleSuccesMessage('Ta firma już istnieje');
          return;
        }

        await addCompany({
          name,
          phone,
          mail,
          website,
          teamMembers: memberObject,
        });

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
      id: 'phone',
      type: 'text',
      placeholder: 'Telefon',
      value: formik.values.phone,
    },
    {
      id: 'mail',
      type: 'email',
      placeholder: 'Mail',
      value: formik.values.mail,
    },
    {
      id: 'website',
      type: 'url',
      placeholder: 'Strona',
      value: formik.values.website,
    },
  ];
  return (
    <Form onSubmit={formik.handleSubmit} isSignInView={false}>
      {formik.status === 'error' && (
        <div className={styles.error}>Tworzenie nie powiodło się</div>
      )}
      <>
        {formInputs.map(({ id, type, placeholder, value }) => {
          return (
            <FormControl key={id}>
              <Input
                id={id}
                type={type}
                name={id}
                placeholder={placeholder}
                className={
                  formik.touched.mail && formik.errors.mail
                    ? `${styles.errorBorder}`
                    : `${inputStyle.input}`
                }
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={value}
              />
            </FormControl>
          );
        })}
      </>

      <SelectUser
        users={users}
        // selectedMember={selectedMember}
        // handleMemberChange={handleMemberChange}
        handleAddMember={handleAddMember}
      />
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
  );
}

export default AddCompanyForm;
