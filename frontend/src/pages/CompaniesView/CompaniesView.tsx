import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import {
  CompaniesType,
  getAllCompanies,
} from '../../services/companies-service';
import { getAllUsers } from '../../services/users-service';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../components/Organisms/InfoBar/InfoBar';

function CompaniesView() {
  const [companies, setCompanies] = useState<CompaniesType[] | undefined>([]);
  const [users, setUsers] = useState([]);
  const [isLabel, setIsLabel] = useState(false);
  const [userLabel, setUserLabel] = useState('');
  const [companyUserLabel, setCompanyUserLabel] = useState('');

  useEffect(() => {
    getAllCompanies().then((allCompanies) => {
      setCompanies(allCompanies);
    });
    getAllUsers().then((allusers) => {
      setUsers(allusers);
    });
  }, []);

  return (
    <>
      <ControlBar>
        <h3>Firmy</h3>
        <div>
          <button type="button" onClick={() => {}}>
            Dodaj Firme
          </button>
          <button type="button" onClick={() => {}}>
            Filtry
          </button>
        </div>
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <InfoBar>
            <div className={styles.tileElementInfoBar}>
              <p>Firma</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Numer</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Email</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Strona</p>
            </div>
            <div className={styles.tileElementInfoBar}>
              <p>Zlecenia</p>
            </div>
            <div className={styles.usersImgContainer}>
              <p>Graficy</p>
            </div>
          </InfoBar>
          {companies && companies.length > 0 ? (
            <>
              {companies.map((company) => {
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
                      {users.flatMap((user) => {
                        return company.teamMembers.map((companyUser) => {
                          return user._id === companyUser.workerID ? (
                            <Link
                              className={styles.userWrapper}
                              key={companyUser.workerID}
                              to={`/użytkownicy/${user._id}`}
                            >
                              <img
                                className={styles.userImg}
                                src={user.img}
                                alt="user"
                                onMouseEnter={() => {
                                  setTimeout(() => {
                                    setIsLabel(true);
                                  }, 100);
                                  setUserLabel(user.name);
                                  setCompanyUserLabel(company.name);
                                }}
                                onMouseLeave={() => {
                                  setIsLabel(false);
                                  setUserLabel('');
                                  setCompanyUserLabel('');
                                }}
                              />
                              {isLabel &&
                              companyUserLabel === company.name &&
                              userLabel === user.name ? (
                                <div className={styles.graphicName}>
                                  <p>{user.name}</p>
                                </div>
                              ) : null}
                            </Link>
                          ) : null;
                        });
                      })}
                    </div>
                  </TileWrapper>
                );
              })}
            </>
          ) : (
            <SkeletonUsersLoading />
          )}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default CompaniesView;
