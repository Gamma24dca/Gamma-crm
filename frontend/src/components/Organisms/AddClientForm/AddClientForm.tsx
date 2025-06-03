import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Form from '../../Atoms/Form/Form';
import FormControl from '../../Atoms/FormControl/FormControl';
import Input from '../../Atoms/Input/Input';
import styles from './AddClientForm.module.css';
import { addClient } from '../../../services/clients-service';
import useClientsContext from '../../../hooks/Context/useClientsContext';
import SubmitButton from '../../Atoms/SubmitBtn/SubmitBtn';
import CheckboxLoader from '../../Atoms/CheckboxLoader/CheckboxLoader';

const createClientSchema = Yup.object({
  name: Yup.string().required('Podaj nazwe'),
  company: Yup.string().required('Podaj firmę'),
  email: Yup.string().required('Podaj email'),
  phone: Yup.string().required('Podaj numer'),
});

function AddClientForm() {
  const { dispatch } = useClientsContext();
  const formik = useFormik({
    initialValues: {
      name: '',
      company: '',
      email: '',
      phone: '',
    },
    validationSchema: createClientSchema,
    onSubmit: async (values) => {
      try {
        const { name, company, email, phone } = values;

        const response = await addClient({
          name,
          company,
          email,
          phone,
        });

        if (response !== null) {
          dispatch({ type: 'CREATE_CLIENT', payload: response });
          formik.setStatus('success');
          return;
        }

        formik.setStatus('error');
      } catch {
        formik.setStatus('error');
      }
    },
  });
  const formInputs = [
    {
      id: 'name',
      type: 'text',
      placeholder: `${
        formik.errors.name && formik.touched.name ? 'Uzupełnij nazwe!' : 'Nazwa'
      }`,
      value: formik.values.name,
      touchedProp: formik.touched.name,
      errorProp: formik.errors.name,
    },
    {
      id: 'company',
      type: 'text',
      placeholder: `${
        formik.errors.company && formik.touched.company
          ? 'Uzupełnij firmę!'
          : 'Firma'
      }`,
      inValue: formik.values.company,
      touchedProp: formik.touched.company,
      errorProp: formik.errors.company,
    },
    {
      id: 'phone',
      type: 'text',
      placeholder: `${
        formik.errors.phone && formik.touched.phone
          ? 'Uzupełnij telefon!'
          : 'Telefon'
      }`,
      inValue: formik.values.phone,
      touchedProp: formik.touched.phone,
      errorProp: formik.errors.phone,
    },
    {
      id: 'email',
      type: 'email',
      placeholder: `${
        formik.errors.email && formik.touched.email
          ? 'Uzupełnij email!'
          : 'Email'
      }`,
      inValue: formik.values.email,
      touchedProp: formik.touched.email,
      errorProp: formik.errors.email,
    },
  ];

  const displayModalTitle = () => {
    if (
      (formik.errors.name && formik.touched.name) ||
      (formik.errors.company && formik.touched.company) ||
      (formik.errors.email && formik.touched.email) ||
      (formik.errors.phone && formik.touched.phone)
    ) {
      return <h2>Coś poszło nie tak :(</h2>;
    } else if (formik.status === 'success') {
      return (
        <div className={styles.modalWrapper}>
          <Icon
            icon="line-md:circle-to-confirm-circle-transition"
            width="24"
            height="24"
            className={styles.successIcon}
          />
          <h2>Klient utworzony!</h2>
        </div>
      );
    }

    return <h2>Dodaj klienta</h2>;
  };
  return (
    <>
      {displayModalTitle()}
      <Form onSubmit={formik.handleSubmit} isSignInView={false}>
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
                        ? `${styles.errorBorder}`
                        : `${styles.input}`
                    }
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={inValue}
                  />
                </FormControl>
              );
            }
          )}
        </>

        <div className={styles.buttonWrapper}>
          {formik.isSubmitting && <CheckboxLoader />}
          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            isSignInView={false}
          />
        </div>
      </Form>
    </>
  );
}

export default AddClientForm;
