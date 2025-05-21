import styles from './CompanyTile.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';
import UsersDisplay from '../UsersDisplay/UsersDisplay';

function CompanyTile({ company, index }) {
  return (
    <TileWrapper key={company._id} linkPath={company._id} index={index}>
      <div className={styles.companyTileContainer}>
        <div className={styles.tileElement}>
          <p>{company.name}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.phone}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.mail}</p>
        </div>
        <div className={styles.tileElement}>
          <p>{company.website}</p>
        </div>

        <UsersDisplay data={company} usersArray={company.teamMembers} />
      </div>
    </TileWrapper>
  );
}

export default CompanyTile;
