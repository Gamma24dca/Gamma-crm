import styles from './TilesColumnContainer.module.css';
import { ChildrenProps } from '../../../providers/UserProvider';

function TilesColumnContainer({ children }: ChildrenProps) {
  return <div className={styles.tilesWrapper}>{children}</div>;
}

export default TilesColumnContainer;
