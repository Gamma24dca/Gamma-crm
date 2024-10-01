import Navigation from '../../Organisms/Navigation/Navigation';
import SideNavigation from '../../Organisms/SideNavigation/SideNavigation';
import { ChildrenProps } from '../../../providers/UserProvider';
import styles from './MainTemplate.module.css';

function MainTemplate({ children }: ChildrenProps) {
  return (
    <div className={styles.mainWrapper}>
      <SideNavigation />
      <div>
        <Navigation />
        {children}
      </div>
    </div>
  );
}

export default MainTemplate;
