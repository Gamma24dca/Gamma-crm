import FormContainer from '../../Atoms/FormContainer/FormContainer';
import Form from '../../Atoms/Form/Form';
import Input from '../../Atoms/Input/Input';
import styles from './SignIn.module.css';
import FormControl from '../../Atoms/FormControl/FormControl';
import Label from '../../Atoms/Label/Label';

function SignIn() {
  return (
    <>
      <img src="./orange.png" alt="logo gamma" className={styles.logo} />
      <FormContainer>
        <Form>
          <h1 className={styles.testHeader}>Zaloguj się</h1>
          <FormControl>
            <Label htmlFor="email" labelContent="Email" />
            <Input id="email" type="email" name="email" />
          </FormControl>
          <FormControl>
            <Label htmlFor="password" labelContent="Hasło" />
            <Input id="password" type="password" name="password" />
          </FormControl>
        </Form>
      </FormContainer>
    </>
  );
}

export default SignIn;
