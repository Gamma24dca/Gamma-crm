import { useEffect, useState } from 'react';
import { useCombobox } from 'downshift';
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

function CompaniesView() {
  const [successMessage, setSuccessMessage] = useState('');
  // const [searchQuery, setSearchQuery] = useState('all');
  const [matchingCompanies, setMatchingCompanies] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { companies, dispatch } = useCompaniesContext();
  const { setFormValue } = useSelectUser();

  // const handleSearchQuery = (e) => {
  //   setSearchQuery(e.target.value);
  // };

  // useEffect(() => {
  //   const fetchSearchedCompanies = debounce(async () => {
  //     await SearchCompany(searchQuery).then((matchedCompanies) => {
  //       setMatchingCompanies(matchedCompanies);
  //     });
  //   }, 500);
  //   fetchSearchedCompanies();
  // }, [searchQuery]);

  // console.log(matchingCompanies, searchQuery);

  const getMatchingCompanies = debounce(async ({ inputValue }) => {
    if (!inputValue) {
      setMatchingCompanies([]);
      return;
    }
    const matchedCompanies = await SearchCompany(inputValue);
    console.log(matchedCompanies, inputValue);
    setMatchingCompanies(matchedCompanies);
  }, 300);

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({
    items: matchingCompanies,
    onInputValueChange: getMatchingCompanies,
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
        <input
          type="text"
          name="Search"
          id="Search"
          placeholder="Szukaj"
          className={styles.input}
          {...getInputProps()}
        />
        <div className={styles.searchResultContainer} {...getMenuProps()}>
          {isOpen &&
            matchingCompanies.map((item, index) => {
              return (
                <div key={item._id}>
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
                      key={item._id}
                      className={styles.companyItem}
                    >
                      {item.name}
                    </p>
                  )}
                </div>
              );
            })}
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
