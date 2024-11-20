import { useEffect, useRef, useState } from 'react';
import { useCombobox } from 'downshift';
import { Link, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import {
  getAllCompanies,
  SearchCompany,
} from '../../services/companies-service';
import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../components/Organisms/InfoBar/InfoBar';
import CTA from '../../components/Atoms/CTA/CTA';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
// import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import useSelectUser from '../../hooks/useSelectUser';
import AddCompanyForm from '../../components/Organisms/AddCompanyForm/AddCompanyForm';
import CompanyTile from '../../components/Organisms/CompanyTile/CompanyTile';

const initialCompanyObject = {
  name: '',
  phone: '',
  mail: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
};

function CompaniesView() {
  const [successMessage, setSuccessMessage] = useState('');
  const [matchingCompanies, setMatchingCompanies] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { companies, dispatch } = useCompaniesContext();
  const { setFormValue } = useSelectUser({
    initialValue: initialCompanyObject,
    objectKey: 'teamMembers',
  });
  const latestInputValue = useRef('');
  const navigate = useNavigate();

  const getMatchingCompanies = debounce(async ({ inputValue }) => {
    if (inputValue !== latestInputValue.current) return;

    try {
      const matchedCompanies = await SearchCompany(inputValue);
      if (inputValue === latestInputValue.current) {
        setMatchingCompanies(matchedCompanies);
      }
    } catch (error) {
      console.error('Error fetching matching companies:', error.message);
    }
    if (!inputValue) setMatchingCompanies([]);
  }, 200);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: matchingCompanies,
    onInputValueChange: ({ inputValue }) => {
      latestInputValue.current = inputValue;
      getMatchingCompanies({ inputValue });
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (selectedItem) {
        navigate(`/firmy/${selectedItem._id}`);
      }
    },
    itemToString: (item) => (item ? item.name : ''),
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const allCompanies = await getAllCompanies();
        dispatch({ type: 'SET_COMPANIES', payload: allCompanies });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    fetchCompanies();
  }, [dispatch, successMessage]);

  const clearValues = () => {
    setSuccessMessage('');
    setFormValue((prevState) => ({
      ...prevState,
      teamMembers: [],
    }));
  };

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={() => {
          closeModal();
          clearValues();
        }}
        exitAnim={exitAnim}
      >
        <h2>Dodaj firme</h2>
        <AddCompanyForm
          companies={companies}
          successMessage={successMessage}
          handleSuccesMessage={setSuccessMessage}
        />
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Firmy</ControlBarTitle>
        {/* <SearchInput
          // onChange={(e) => {
          //   handleSearchQuery(e);
          // }}
          name="Search"
          id="Search"
          placeholder="Szukaj"
          {...getInputProps()}
        /> */}

        <div className={styles.searchContainer}>
          <input
            type="text"
            name="Search"
            id="Search"
            placeholder="Szukaj"
            className={styles.input}
            {...getInputProps()}
          />
          <div
            {...getMenuProps()}
            className={
              isOpen && matchingCompanies.length > 0
                ? styles.searchResultContainer
                : styles.hidden
            }
            aria-label="results"
          >
            {isOpen &&
              matchingCompanies.map((item, index) => (
                <Link
                  to={`/firmy/${item._id}`}
                  key={item._id}
                  className={styles.searchedCompanyItem}
                  onClick={(e) => e.stopPropagation()}
                >
                  {highlightedIndex === index ? (
                    <p
                      {...getItemProps({ item, index })}
                      className={styles.highlightedCompanyItem}
                    >
                      {item.name}
                    </p>
                  ) : (
                    <p
                      {...getItemProps({ item, index })}
                      className={styles.companyItem}
                    >
                      {item.name}
                    </p>
                  )}
                </Link>
              ))}
          </div>
        </div>

        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
            }}
          >
            Dodaj Firme
          </CTA>
          <CTA onClick={() => {}}>Filtry</CTA>
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
          {companies?.length ? (
            <>
              {companies.map((company) => {
                return <CompanyTile key={company._id} company={company} />;
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
