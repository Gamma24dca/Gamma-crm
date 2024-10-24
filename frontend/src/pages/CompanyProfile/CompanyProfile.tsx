import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import styles from './CompanyProfile.module.css';
import {
  CompaniesType,
  getCurrentCompany,
} from '../../services/companies-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import BackButton from '../../components/Atoms/BackButton/BackButton';
import CTA from '../../components/Atoms/CTA/CTA';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useWindowSize from '../../hooks/useWindowSize';
import usePagination from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';

const mockedTasks = [
  {
    _id: 'ig35c',
    worker: 'Bartek',
    month: 'marzec',
    company: 'Aksil',
    createdAt: '2024.03.03',
    client: 'Stachowiczk Joanna',
    taskTitle: 'AKSIL_KATALOG_PRODUKTOW 2024',
    hours: 19,
    comment: 'projekt, poprawki i pliki do druku',
    printWhere: '',
    printSpec: '',
    isSettled: true,
  },
  {
    _id: 'fps32',
    worker: 'Edyta',
    month: 'wrzesień',
    company: 'Santander',
    createdAt: '2024.05.01',
    client: 'Badowska Alicja',
    taskTitle: 'Baner industry 1070x2125',
    hours: 12,
    comment: 'Zaliczka 12',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: '3x8[2',
    worker: 'Edyta',
    month: 'kwiecień',
    company: 'Santander',
    createdAt: '2024.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 39,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: true,
  },
  {
    _id: '71x71',
    worker: 'Weronika',
    month: 'kwiecień',
    company: 'Santander',
    createdAt: '2024.07.10',
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
    createdAt: '2024.04.08',
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
    createdAt: '2024.05.01',
    client: 'Badowska Alicja',
    taskTitle: 'Baner industry 1070x2125',
    hours: 52,
    comment: 'Zaliczka 12',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: '368a2',
    worker: 'Edyta',
    month: 'kwiecień',
    company: 'Santander',
    createdAt: '2024.03.08',
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
    createdAt: '2024.09.10',
    client: 'Ożóg Joanna',
    taskTitle: 'test data',
    hours: 15,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: 'k3hx4',
    worker: 'Jagoda',
    month: 'październik',
    company: 'Santander',
    createdAt: '2024.05.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 19,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: 'fss32',
    worker: 'Edyta',
    month: 'wrzesień',
    company: 'Santander',
    createdAt: '2023.02.01',
    client: 'Badowska Alicja',
    taskTitle: 'Baner industry 1070x2125',
    hours: 12,
    comment: 'Zaliczka 12',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: '3d8a2',
    worker: 'Edyta',
    month: 'kwiecień',
    company: 'Santander',
    createdAt: '2024.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 39,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: true,
  },
  {
    _id: '7lx71',
    worker: 'Weronika',
    month: 'kwiecień',
    company: 'Santander',
    createdAt: '2024.01.20',
    client: 'Ożóg Joanna',
    taskTitle: 'test data',
    hours: 15,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: 'kfpx4',
    worker: 'Jagoda',
    month: 'październik',
    company: 'Santander',
    createdAt: '2023.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 19,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: 'knpx4',
    worker: 'Jagoda',
    month: 'październik',
    company: 'Santander',
    createdAt: '2023.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 19,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: 'kfp34',
    worker: 'Jagoda',
    month: 'październik',
    company: 'Santander',
    createdAt: '2023.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 19,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
  {
    _id: 'kfpv4',
    worker: 'Jagoda',
    month: 'październik',
    company: 'Santander',
    createdAt: '2023.04.08',
    client: 'Ożóg Joanna',
    taskTitle: 'Avik Animation 4k',
    hours: 19,
    comment: '',
    printWhere: '',
    printSpec: '',
    isSettled: false,
  },
];

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const params = useParams();

  const { sortedData, sortColumn, sortOrder, handleSortChange } =
    useSort(mockedTasks);

  const {
    currentPage,
    totalPages,
    setItemsPerPage,
    currentTasks,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(sortedData, 14);

  const is1800 = useWindowSize('1800');
  const is1600 = useWindowSize('1600');
  const is1350 = useWindowSize('1350');

  useEffect(() => {
    if (is1350) {
      setItemsPerPage(8);
    }
    if (is1600 && !is1350) {
      setItemsPerPage(10);
    }
    if (is1800 && !is1600) {
      setItemsPerPage(12);
    }
    if (!is1800 && !is1600) {
      setItemsPerPage(14);
    }
  }, [is1800, is1600, is1350, setItemsPerPage]);

  const totalHours = mockedTasks.reduce((acc, task) => acc + task.hours, 0);

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
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <h2>Edytuj</h2>
        {company.length > 0 ? (
          <div className={styles.inputsWrapper}>
            <div className={styles.firstRow}>
              <div>
                <label htmlFor="companyName">
                  <strong>Nazwa:</strong>
                </label>
                <input
                  type="text"
                  name="companyName"
                  id="companyName"
                  value={company[0].name}
                  className={styles.companyInput}
                />
              </div>

              <div>
                <label htmlFor="companyMail">
                  <strong>E-Mail:</strong>
                </label>
                <input
                  type="text"
                  name="companyMail"
                  id="companyMail"
                  value={company[0].mail}
                  className={styles.companyInput}
                />
              </div>
            </div>

            <div className={styles.secondRow}>
              <div>
                <label htmlFor="companyNumber">
                  <strong>Numer:</strong>
                </label>
                <input
                  type="text"
                  name="companyNumber"
                  id="companyNumber"
                  value={company[0].phone}
                  className={styles.companyInput}
                />
              </div>
              <div>
                <label htmlFor="companyWebsite">
                  <strong>Strona:</strong>
                </label>
                <input
                  type="text"
                  name="companyWebsite"
                  id="companyWebsite"
                  value={company[0].website}
                  className={styles.companyInput}
                />
              </div>
            </div>
          </div>
        ) : (
          <p>loading</p>
        )}
      </ModalTemplate>
      <ControlBar>
        <div className={styles.leftSide}>
          <BackButton path="firmy" />
          {company.length > 0 ? (
            <div
              className={styles.editCompanyWrapper}
              role="button"
              tabIndex={0}
              onClick={() => openModal()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  openModal();
                }
              }}
            >
              <button type="button" className={styles.editCompanyButton}>
                <h2>{company[0].name}</h2>
              </button>
              <Icon icon="lucide:edit" width="24" height="24" color="#f68c1e" />
            </div>
          ) : (
            <div className={styles.companyNameLoader} />
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
        </div>
        <div className={styles.center}>
          {/* <label htmlFor="task-search">Szukaj</label> */}
          <input
            className={styles.navInput}
            type="text"
            placeholder="Szukaj"
            name="task-search"
            id="task-search"
          />

          <p className={styles.summPar}>Suma:</p>
        </div>
        <div className={styles.totalHoursContainer}>
          <p>{totalHours}</p>
        </div>
        <div className={styles.controlBarBtnsWrapper}>
          <CTA type="button" onClick={() => {}}>
            Filtry
          </CTA>
        </div>
      </ControlBar>

      <ViewContainer>
        <ListContainer>
          <div className={styles.companyInfoBar}>
            <div className={styles.reckoningTaskListElement}>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
              >
                <p>ID</p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('worker')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('worker');
                  }
                }}
              >
                <p>
                  Pracownik{' '}
                  {sortColumn === 'worker' && (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('month')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('month');
                  }
                }}
              >
                <p>
                  Miesiąc{' '}
                  {sortColumn === 'month' && (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('createdAt')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('createdAt');
                  }
                }}
              >
                <p>
                  Utworzono{' '}
                  {sortColumn === 'createdAt' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('client')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('client');
                  }
                }}
              >
                <p>
                  Klient{' '}
                  {sortColumn === 'client' && (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('taskTitle')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('taskTitle');
                  }
                }}
              >
                <p>
                  Tytuł{' '}
                  {sortColumn === 'taskTitle' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('hours')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('hours');
                  }
                }}
              >
                <p>
                  Sum{' '}
                  {sortColumn === 'hours' && (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('comment')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('comment');
                  }
                }}
              >
                <p>
                  Komentarz{' '}
                  {sortColumn === 'comment' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('printSpec')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('printSpec');
                  }
                }}
              >
                <p>
                  DRUK(spec){' '}
                  {sortColumn === 'printSpec' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('printWhere')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('printWhere');
                  }
                }}
              >
                <p>
                  DRUK(gdzie){' '}
                  {sortColumn === 'printWhere' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
            </div>
          </div>
          <>
            {currentTasks.map((task) => {
              return (
                <div key={task._id} className={styles.reckoningTaskListElement}>
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
          <div className={styles.paginationControls}>
            <button
              onClick={handlePreviousPage}
              type="button"
              disabled={currentPage === 1}
              className={`${styles.paginationButton} ${styles.prevPaginationButton}`}
            >
              <Icon
                icon="ion:arrow-back-outline"
                color="#f68c1e"
                width="25"
                height="25"
              />
            </button>
            <span className={styles.paginationInfo}>
              {currentPage} z {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              type="button"
              disabled={currentPage === totalPages}
              className={`${styles.paginationButton} ${styles.nextPaginationButton}`}
            >
              <Icon
                icon="ion:arrow-back-outline"
                color="#f68c1e"
                width="25"
                height="25"
              />
            </button>
          </div>
        </ListContainer>
      </ViewContainer>
    </>
  );
}

export default CompanyProfile;
