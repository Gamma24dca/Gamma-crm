import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import styles from './CompanyProfile.module.css';
import {
  CompaniesType,
  getCurrentCompany,
} from '../../services/companies-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';

import BackButton from '../../components/Atoms/BackButton/BackButton';

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const params = useParams();

  const months = useMemo(
    () => [
      'Styczeń',
      'Luty',
      'Marzec',
      'Kwiecień',
      'Maj',
      'Czerwiec',
      'Lipiec',
      'Sierpień',
      'Wrzesień',
      'Październik',
      'Listopad',
      'Grudzień',
    ],
    []
  );

  // State to hold the currently selected month

  // Get current month and set it as default when the component mounts
  useEffect(() => {
    const currentMonthIndex = new Date().getMonth(); // Get the current month (0-based index)
    setSelectedMonth(months[currentMonthIndex]); // Set the current month in the state
  }, [months]);

  // Handle month selection change
  const handleChange = (e) => {
    setSelectedMonth(e.target.value);
  };

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
        <BackButton path="firmy" />
        {company.length > 0 && (
          <div>
            <h2>{company[0].name}</h2>
          </div>
        )}

        <select id="month-select" value={selectedMonth} onChange={handleChange}>
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <div className={styles.controlBarBtnsWrapper}>
          <button type="button" onClick={() => {}}>
            Filtry
          </button>
        </div>
      </ControlBar>

      <ViewContainer>
        <div className={styles.containersWrapper}>
          <div className={styles.LeftContainer}>
            <div className={styles.leftColumnTitle}>
              <h3>Dane firmy</h3>
            </div>
            {company.length > 0 ? (
              <div className={styles.inputsWrapper}>
                <label htmlFor="companyName">
                  <strong>Nazwa:</strong>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={company[0].name}
                    className={styles.companyInput}
                  />
                </label>
                <label htmlFor="companyMail">
                  <strong>E-Mail:</strong>
                  <input
                    type="text"
                    name="companyMail"
                    id="companyMail"
                    value={company[0].mail}
                    className={styles.companyInput}
                  />
                </label>
                <label htmlFor="companyNumber">
                  <strong>Numer:</strong>
                  <input
                    type="text"
                    name="companyNumber"
                    id="companyNumber"
                    value={company[0].phone}
                    className={styles.companyInput}
                  />
                </label>
                <label htmlFor="companyWebsite">
                  <strong>Strona:</strong>
                  <input
                    type="text"
                    name="companyWebsite"
                    id="companyWebsite"
                    value={company[0].website}
                    className={styles.companyInput}
                  />
                </label>
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
