import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import styles from './TileWrapper.module.css';

type TileWrapperProps = {
  children: ReactNode | ReactNode[]; // Accept both single and multiple children
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
