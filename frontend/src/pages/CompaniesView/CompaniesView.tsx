import { useEffect, useState } from 'react';
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

function CompaniesView() {
  const [companies, setCompanies] = useState<CompaniesType[] | undefined>([]);
  const [users, setUsers] = useState([]);

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
          {companies && companies.length > 0 ? (
            <>
              {companies.map((company) => {
                return (
                  <TileWrapper key={company._id} linkPath={company._id}>
                    <p>{company.name}</p>
                    <p>{company.phone}</p>
                    <p>{company.mail}</p>
                    <p>{company.website}</p>
                    <p>{company.activeTasks}</p>
                    <div className={styles.usersImgContainer}>
                      {users.flatMap((user) => {
                        return company.teamMembers.map((companyUser) => {
                          return user._id === companyUser.workerID ? (
                            <div
                              className={styles.userWrapper}
                              key={companyUser.workerID}
                            >
                              <img
                                className={styles.userImg}
                                src={user.img}
                                alt="user"
                              />
                            </div>
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
