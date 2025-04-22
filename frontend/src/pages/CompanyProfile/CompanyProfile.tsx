import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Icon } from '@iconify/react';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import styles from './CompanyProfile.module.css';
import {
  CompaniesType,
  deleteCompany,
  getAssignedReckoTasks,
  getCurrentCompany,
} from '../../services/companies-service';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import useModal from '../../hooks/useModal';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useWindowSize from '../../hooks/useWindowSize';
import usePagination from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';
import UpdateCompanyModalContent from '../../components/Organisms/UpdateCompanyModalContent/UpdateCompanyModalContent';
import Captcha from '../../components/Molecules/Captcha/Captcha';
import CompanyProfileControlBar from '../../components/Organisms/CompanyProfileControlBar/CompanyProfileControlBar';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import summarizeHours from '../../utils/SummarizeHours';

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType>();
  const [reckoningTasks, setReckoningTasks] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [deleteCaptcha, setDeleteCaptcha] = useState(false);

  const { dispatch } = useCompaniesContext();

  const navigate = useNavigate();

  const { sortedData, sortColumn, sortOrder, handleSortChange } =
    useSort(reckoningTasks);

  const {
    currentPage,
    totalPages,
    setItemsPerPage,
    currentTasks,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(sortedData, 14);

  const params = useParams();
  const companyID = params.id;

  const is1800 = useWindowSize('1800');
  const is1600 = useWindowSize('1600');
  const is1350 = useWindowSize('1350');

  const fetchCompany = async () => {
    const currentCompany = await getCurrentCompany(params.id);

    if (currentCompany) {
      setCompany(currentCompany);
      const reckoTasks = await getAssignedReckoTasks({
        company: currentCompany.name,
        monthIndex: 4,
      });
      setReckoningTasks(reckoTasks.reckoTasks);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, []);

  const handleDeleteCompany = async (id) => {
    await deleteCompany(id);
    dispatch({ type: 'DELETE_COMPANY', payload: company });
    closeModal();
    navigate('/firmy');
  };

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
      setItemsPerPage(15);
    }
  }, [is1800, is1600, is1350, setItemsPerPage]);

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          setDeleteCaptcha(false);
        }}
        exitAnim={exitAnim}
      >
        {deleteCaptcha ? (
          <Captcha
            handleDeleteCompany={handleDeleteCompany}
            setDeleteCaptcha={setDeleteCaptcha}
            id={companyID}
          />
        ) : (
          <>
            <h2>Edytuj</h2>
            <UpdateCompanyModalContent
              currentCompany={company}
              closeModal={closeModal}
              openCaptcha={setDeleteCaptcha}
              refreshCompanyData={fetchCompany}
            />
          </>
        )}
      </ModalTemplate>
      <ControlBar>
        <CompanyProfileControlBar
          company={company}
          openModal={openModal}
          tasks={reckoningTasks}
        />
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
                  Firma{' '}
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
                  Klient{' '}
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
              console.log(task.participants[0].months);
              return (
                <div key={task._id} className={styles.reckoningTaskListElement}>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.searchID}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.client}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.clientPerson}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.month}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.createdAt}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.title}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{summarizeHours(task.participants)}</p>
                  </div>

                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.description}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.printWhat}</p>
                  </div>
                  <div className={styles.reckoningTaskListElementTile}>
                    <p>{task.printWhere}</p>
                  </div>
                  {/* <div className={styles.reckoningTaskListElementTile}>
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
                  </div> */}
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
