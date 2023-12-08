import styles from './TopBar.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function TopBar({ children }: ChildrenProps) {
  return <div className={styles.topBar}>{children}</div>;
}

export default TopBar;
