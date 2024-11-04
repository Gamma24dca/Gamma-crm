import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CompanyTile.module.css';
import TileWrapper from '../../Atoms/TileWrapper/TileWrapper';

function CompanyTile({ company }) {
  const [labelState, setLabelState] = useState({
    isLabel: false,
    userLabel: '',
    companyUserLabel: '',
  });

  const handleMouseEnter = (user, companyVal) => {
    setLabelState({
      isLabel: true,
      userLabel: user.name,
      companyUserLabel: companyVal.name,
    });
  };

  const handleMouseLeave = () => {
    setLabelState({ isLabel: false, userLabel: '', companyUserLabel: '' });
  };

  return (
    <TileWrapper key={company._id} linkPath={company._id}>
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
      <div className={styles.tileElement}>
        <p>{company.activeTasks}</p>
      </div>
      <div className={styles.usersImgContainer}>
        {company.teamMembers.length > 0 &&
          company.teamMembers.map((companyUser) => {
            return (
              <Link
                className={styles.userWrapper}
                key={companyUser._id}
                to={`/użytkownicy/${companyUser._id}`}
              >
                <img
                  className={styles.userImg}
                  src={companyUser.img}
                  alt="user"
                  onMouseEnter={() => {
                    handleMouseEnter(companyUser, company);
                  }}
                  onMouseLeave={() => {
                    handleMouseLeave();
                  }}
                />
                {labelState.isLabel &&
                  labelState.companyUserLabel === company.name &&
                  labelState.userLabel === companyUser.name && (
                    <div className={styles.graphicName}>
                      <p>{companyUser.name}</p>
                    </div>
                  )}
              </Link>
            );
          })}
      </div>
    </TileWrapper>
  );
}

export default CompanyTile;
