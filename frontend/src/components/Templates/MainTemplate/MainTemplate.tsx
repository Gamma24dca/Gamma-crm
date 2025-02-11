import Navigation from '../../Organisms/Navigation/Navigation';
import SideNavigation from '../../Organisms/SideNavigation/SideNavigation';
import { ChildrenProps } from '../../../providers/UserProvider';
import styles from './MainTemplate.module.css';
import useSideNavHide from '../../../hooks/useSideNavHide';

function MainTemplate({ children }: ChildrenProps) {
  const { isSideNavHidden } = useSideNavHide();

  return (
    <div className={styles.mainWrapper}>
      <SideNavigation />
      <div
        className={`${
          isSideNavHidden
            ? styles.restContentWrapper
            : styles.fullSizeRestContentWrapper
        }`}
      >
        <Navigation />
        {children}
      </div>
    </div>
  );
}

export default MainTemplate;
