import Input from '../../Atoms/Input/Input';
import styles from './SignIn.module.css';

function SignIn() {
  return (
    <>
      <h1 className={styles.testHeader}>SignIn</h1>
      <Input id="password" type="password" name="password" />
    </>
  );
}

export default SignIn;
