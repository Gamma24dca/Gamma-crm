import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './TileWrapper.module.css';

type TileWrapperProps = {
  children: ReactNode | ReactNode[];
  linkPath?: string;
};

function TileWrapper({ children, linkPath }: TileWrapperProps) {
  return linkPath ? (
    <Link className={styles.tileWrapper} to={linkPath}>
      {children}
    </Link>
  ) : (
    <div className={styles.tileWrapper}> {children}</div>
  );
}
TileWrapper.defaultProps = {
  linkPath: undefined,
};

export default TileWrapper;
