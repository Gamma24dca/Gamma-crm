import styles from "./SignIn.module.css";
import Input from "../../Atoms/Input";

function SignIn() {
  return (
    <>
      <Input id="password" type="password" name="password" />
      <h1 className={styles.testHeader}>SignIn</h1>
    </>
  );
}

export default SignIn;
