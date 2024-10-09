import { useEffect, useState } from 'react';
import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import {
  CompaniesType,
  getAllCompanies,
} from '../../services/companies-service';

function CompaniesView() {
  const [companies, setCompanies] = useState<CompaniesType[] | undefined>([]);

  useEffect(() => {
    getAllCompanies().then((allCompanies) => {
      setCompanies(allCompanies);
    });
  }, []);

  return (
    <>
      <ControlBar>
        <button type="button" onClick={() => {}}>
          Dodaj Firme
        </button>
        <button type="button" onClick={() => {}}>
          Filtry
        </button>
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          {companies && companies.length > 0 ? (
            <>
              {companies.map((company) => {
                return (
                  <div key={company._id} className={styles.test}>
                    <p>{company.name}</p>
                    <p>{company.phone}</p>
                    <p>{company.mail}</p>
                    <p>{company.website}</p>
                    <p>{company.activeTasks}</p>
                  </div>
                );
              })}
            </>
          ) : (
            <p>loading</p>
          )}
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default CompaniesView;
