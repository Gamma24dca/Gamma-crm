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
import CTA from '../../components/CTA/CTA';

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const params = useParams();

  const mockedTasks = [
    {
      _id: 'is35c',
      worker: 'Bartek',
      month: 'marzec',
      company: 'Aksil',
      createdAt: '03.03.2024',
      client: 'Stachowiczk Joanna',
      taskTitle: 'AKSIL_KATALOG_PRODUKTOW 2024',
      hours: 29,
      comment: 'projekt, poprawki i pliki do druku',
      printWhere: '',
      printSpec: '',
      isSettled: true,
    },
    {
      _id: 'fds32',
      worker: 'Edyta',
      month: 'wrzesień',
      company: 'Santander',
      createdAt: '05.01.2024',
      client: 'Badowska Alicja',
      taskTitle: 'Baner industry 1070x2125',
      hours: 12,
      comment: 'Zaliczka 12',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: '3x8a2',
      worker: 'Edyta',
      month: 'kwiecień',
      company: 'Santander',
      createdAt: '04.08.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'Avik Animation 4k',
      hours: 39,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: true,
    },
    {
      _id: '73x71',
      worker: 'Weronika',
      month: 'kwiecień',
      company: 'Santander',
      createdAt: '07.10.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'test data',
      hours: 15,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: 'k3px4',
      worker: 'Jagoda',
      month: 'październik',
      company: 'Santander',
      createdAt: '04.08.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'Avik Animation 4k',
      hours: 19,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: 'fds32',
      worker: 'Edyta',
      month: 'wrzesień',
      company: 'Santander',
      createdAt: '05.01.2024',
      client: 'Badowska Alicja',
      taskTitle: 'Baner industry 1070x2125',
      hours: 12,
      comment: 'Zaliczka 12',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: '3x8a2',
      worker: 'Edyta',
      month: 'kwiecień',
      company: 'Santander',
      createdAt: '04.08.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'Avik Animation 4k',
      hours: 39,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: true,
    },
    {
      _id: '73x71',
      worker: 'Weronika',
      month: 'kwiecień',
      company: 'Santander',
      createdAt: '07.10.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'test data',
      hours: 15,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: 'k3px4',
      worker: 'Jagoda',
      month: 'październik',
      company: 'Santander',
      createdAt: '04.08.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'Avik Animation 4k',
      hours: 19,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: 'fds32',
      worker: 'Edyta',
      month: 'wrzesień',
      company: 'Santander',
      createdAt: '05.01.2024',
      client: 'Badowska Alicja',
      taskTitle: 'Baner industry 1070x2125',
      hours: 12,
      comment: 'Zaliczka 12',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: '3x8a2',
      worker: 'Edyta',
      month: 'kwiecień',
      company: 'Santander',
      createdAt: '04.08.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'Avik Animation 4k',
      hours: 39,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: true,
    },
    {
      _id: '73x71',
      worker: 'Weronika',
      month: 'kwiecień',
      company: 'Santander',
      createdAt: '07.10.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'test data',
      hours: 15,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
    {
      _id: 'k3px4',
      worker: 'Jagoda',
      month: 'październik',
      company: 'Santander',
      createdAt: '04.08.2024',
      client: 'Ożóg Joanna',
      taskTitle: 'Avik Animation 4k',
      hours: 19,
      comment: '',
      printWhere: '',
      printSpec: '',
      isSettled: false,
    },
  ];

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

  useEffect(() => {
    const currentMonthIndex = new Date().getMonth();
    setSelectedMonth(months[currentMonthIndex]);
  }, [months]);

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

        <select
          id="month-select"
          value={selectedMonth}
          onChange={handleChange}
          className={styles.selectInput}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
        <input className={styles.navInput} />

        <div className={styles.controlBarBtnsWrapper}>
          <CTA type="button" onClick={() => {}}>
            Filtry
          </CTA>
        </div>
      </ControlBar>

      <ViewContainer>
        <div className={styles.containersWrapper}>
          <div className={styles.LeftContainer}>
            {/* <div className={styles.leftColumnTitle}>
              <h3>Dane firmy</h3>
            </div> */}
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
            <div className={styles.companyInfoBar}>
              <div className={styles.reckoningTaskListElement}>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>ID</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>Pracownik</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>Miesiąc</p>
                </div>

                <div className={styles.reckoningTaskListElementTile}>
                  <p>Utworzono</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>Klient</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>Tytuł</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>Sum</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>Komentarz</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>DRUK(spec)</p>
                </div>
                <div className={styles.reckoningTaskListElementTile}>
                  <p>DRUK(gdzie)</p>
                </div>
              </div>
            </div>
            <>
              {mockedTasks.map((task) => {
                return (
                  <div
                    key={task._id}
                    className={styles.reckoningTaskListElement}
                  >
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task._id}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.worker}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.month}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.createdAt}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.client}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.taskTitle}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.hours}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.comment}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.printSpec}</p>
                    </div>
                    <div className={styles.reckoningTaskListElementTile}>
                      <p>{task.printWhere}</p>
                    </div>
                  </div>
                );
              })}
            </>
          </ListContainer>
        </div>
      </ViewContainer>
    </>
  );
}

export default CompanyProfile;
