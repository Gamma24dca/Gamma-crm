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
import usePagination from '../../hooks/usePagination';
import useSort from '../../hooks/useSort';
import UpdateCompanyModalContent from '../../components/Organisms/UpdateCompanyModalContent/UpdateCompanyModalContent';
import Captcha from '../../components/Molecules/Captcha/Captcha';
import CompanyProfileControlBar from '../../components/Organisms/CompanyProfileControlBar/CompanyProfileControlBar';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import useCurrentDate from '../../hooks/useCurrentDate';
import useViewportHeight from '../../hooks/useViewportHeight';
import CompanyProfileViewComponent from '../../components/Organisms/CompanyProfileViewComponent/CompanyProfileViewComponent';

function CompanyProfile() {
  const [company, setCompany] = useState<CompaniesType>();
  const [clientPersonToFilter, setClientPersonToFilter] = useState<string[]>(
    []
  );
  const [settleStateFilter, setSettleStateFilter] = useState<string>('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [reckoningTasks, setReckoningTasks] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const [deleteCaptcha, setDeleteCaptcha] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    isError: false,
  });

  const { dispatch } = useCompaniesContext();

  const navigate = useNavigate();

  const {
    selectedMonth,
    selectedYear,
    handleMonthChange,
    handleYearChange,
    months,
    years,
  } = useCurrentDate();

  const currentMonthIndex = months.indexOf(selectedMonth);

  const filteredTasks =
    clientPersonToFilter.length > 0
      ? reckoningTasks.filter((ct) => {
          return clientPersonToFilter.includes(ct.clientPerson);
        })
      : reckoningTasks;

  const filteredBySettleValTasks = () => {
    if (settleStateFilter.length > 0 && clientPersonToFilter.length > 0) {
      return filteredTasks.filter((cp) => {
        if (settleStateFilter === 'Rozliczone') return cp.isSettled;
        if (settleStateFilter === 'Nierozliczone') return !cp.isSettled;

        return true;
      });
    }

    return settleStateFilter.length > 0
      ? reckoningTasks.filter((cp) => {
          if (settleStateFilter === 'Rozliczone') return cp.isSettled;
          if (settleStateFilter === 'Nierozliczone') return !cp.isSettled;

          return true;
        })
      : filteredTasks;
  };

  const matchedTasksFromSearchInput = searchInputValue
    ? reckoningTasks.filter((cts) => {
        return (
          cts.title.toLowerCase().includes(searchInputValue.toLowerCase()) ||
          cts.description
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          cts.clientPerson
            .toLowerCase()
            .includes(searchInputValue.toLowerCase()) ||
          cts.searchID.toString().includes(searchInputValue) ||
          cts.participants.some((member) =>
            member.name.toLowerCase().includes(searchInputValue.toLowerCase())
          )
        );
      })
    : filteredBySettleValTasks();

  const { sortedData, sortColumn, sortOrder, handleSortChange } = useSort(
    matchedTasksFromSearchInput,
    currentMonthIndex
  );

  const viewportHeight = useViewportHeight();

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

  useEffect(() => {
    const tileHeight = 35;
    const headerHeight = 300;
    const availableHeight = viewportHeight - headerHeight;

    console.log(
      'viewportHeight:',
      viewportHeight,
      'available:',
      availableHeight
    );

    const itemsPerPage = Math.floor(availableHeight / tileHeight);
    setItemsPerPage(itemsPerPage > 0 ? itemsPerPage : 1);
  }, [viewportHeight]);

  const fetchCompany = async () => {
    let errorHappened = false;

    const currentCompany = await getCurrentCompany(params.id);

    if (currentCompany) {
      setCompany(currentCompany);

      try {
        setLoadingState(() => ({
          isLoading: true,
          isError: false,
        }));

        const reckoTasks = await getAssignedReckoTasks({
          company: currentCompany.name,
          monthIndex: currentMonthIndex + 1,
        });

        setReckoningTasks(reckoTasks.reckoTasks);
      } catch (error) {
        errorHappened = true;
        setLoadingState(() => ({
          isLoading: false,
          isError: true,
        }));
      } finally {
        setLoadingState((prevState) => ({
          ...prevState,
          isLoading: false,
          isError: errorHappened ? true : prevState.isError,
        }));
      }
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [currentMonthIndex]);

  const handleDeleteCompany = async (id) => {
    await deleteCompany(id);
    dispatch({ type: 'DELETE_COMPANY', payload: company });
    closeModal();
    navigate('/firmy');
  };

  const dataToSummarize = () => {
    if (clientPersonToFilter.length > 0) {
      return filteredTasks;
    }
    if (searchInputValue.length > 0) {
      return matchedTasksFromSearchInput;
    }

    return reckoningTasks;
  };

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
          tasks={dataToSummarize()}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          handleMonthChange={handleMonthChange}
          handleYearChange={handleYearChange}
          months={months}
          years={years}
          currentMonthIndex={currentMonthIndex}
          setClientPersonToFilter={setClientPersonToFilter}
          clientPersonToFilter={clientPersonToFilter}
          searchInputValue={searchInputValue}
          setSearchInputValue={setSearchInputValue}
          settleStateFilter={settleStateFilter}
          setSettleStateFilter={setSettleStateFilter}
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
              >
                <p>Firma </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('clientPerson')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('clientPerson');
                  }
                }}
              >
                <p>
                  Klient{' '}
                  {sortColumn === 'clientPerson' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              {/* <div
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
              </div> */}
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
              >
                <p>
                  Graficy{' '}
                  {sortColumn === 'client' && (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('title')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('title');
                  }
                }}
              >
                <p>
                  Tytuł{' '}
                  {sortColumn === 'title' && (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('description')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('description');
                  }
                }}
              >
                <p>
                  Komentarz{' '}
                  {sortColumn === 'description' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>
              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('participants')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('participants');
                  }
                }}
              >
                <p>
                  Sum{' '}
                  {sortColumn === 'participants' &&
                    (sortOrder === 'asc' ? '↑' : '↓')}
                </p>
              </div>

              <div
                className={`${styles.reckoningTaskListElementTile} ${styles.companyInfoBarTile}`}
                role="button"
                tabIndex={0}
                onClick={() => handleSortChange('printWhat')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleSortChange('printWhat');
                  }
                }}
              >
                <p>
                  DRUK(spec){' '}
                  {sortColumn === 'printWhat' &&
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

          <CompanyProfileViewComponent
            loadingState={loadingState}
            currentTasks={currentTasks}
            currentMonthIndex={currentMonthIndex}
          />

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
