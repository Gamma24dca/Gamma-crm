import { Link } from 'react-router-dom';
import { ChildrenProps } from '../../../providers/UserProvider';
import styles from './TileWrapper.module.css';

type TileWrapperProps = ChildrenProps & {
  linkPath: string;
};

function TileWrapper({ children, linkPath }: TileWrapperProps) {
  return (
    <Link className={styles.tileWrapper} to={linkPath}>
      {children}
    </Link>
  );
}

export default TileWrapper;
