import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import styles from './CompanyProfile.module.css';
import {
  CompaniesType,
  getCurrentCompany,
} from '../../services/companies-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType[]>([]);
  const params = useParams();

  useEffect(() => {
    getCurrentCompany(params.id)
      .then((singleUserArray: CompaniesType | CompaniesType[]) => {
        if (Array.isArray(singleUserArray)) {
          if (singleUserArray.length > 0) {
            setCompany(singleUserArray);
          }
        } else {
          setCompany([singleUserArray]);
        }
      })
      .catch((error) => {
        console.error('Error fetching user:', error);
      });
  }, [params.id]);

  return (
    <>
      <ControlBar>
        {company.length > 0 && (
          <div>
            <h3>{company[0].name}</h3>
          </div>
        )}
        <div className={styles.controlBarBtnsWrapper}>
          <button type="button" onClick={() => {}}>
            Dodaj Firme
          </button>
          <button type="button" onClick={() => {}}>
            Filtry
          </button>
        </div>
      </ControlBar>

      <ViewContainer>
        <div className={styles.containersWrapper}>
          <div className={styles.LeftContainer}>
            {company.length > 0 ? (
              <div>
                <p>{company[0].name}</p>
              </div>
            ) : (
              <p>loading</p>
            )}
          </div>
          <ListContainer>
            <h3>Zlecenia</h3>
          </ListContainer>
        </div>
      </ViewContainer>
    </>
  );
}

export default CompanyProfile;
