import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import { addCompany, getAllCompanies } from '../../services/companies-service';
import { getAllUsers } from '../../services/users-service';
import TileWrapper from '../../components/Atoms/TileWrapper/TileWrapper';
import SkeletonUsersLoading from '../../components/Organisms/SkeletonUsersLoading/SkeletonUsersLoading';
import InfoBar from '../../components/Organisms/InfoBar/InfoBar';
import CTA from '../../components/Atoms/CTA/CTA';
import ControlBarTitle from '../../components/Atoms/ControlBar/Title/ControlBarTitle';
import SearchInput from '../../components/Atoms/ControlBar/SearchInput/SearchInput';
import ModalTemplate from '../../components/Templates/ModalTemplate/ModalTemplate';
import useModal from '../../hooks/useModal';
import useCompaniesContext from '../../hooks/Context/useCompaniesContext';
import useUsersContext from '../../hooks/Context/useUsersContext';
import Form from '../../components/Atoms/Form/Form';
import FormControl from '../../components/Atoms/FormControl/FormControl';
import Input from '../../components/Atoms/Input/Input';
import inputStyle from '../../components/Atoms/Input/Input.module.css';
import SubmitButton from '../../components/Atoms/SubmitBtn/SubmitBtn';
import CompanyGraphicTile from '../../components/Molecules/CompanyGraphicTile/CompanyGraphicTile';

const createCompanySchema = Yup.object({
  name: Yup.string().required('Nazwa jest wymagana'),
  phone: Yup.string(),
  mail: Yup.string().email('Nieprawidłowy adres email'),
  website: Yup.string(),
});

function CompaniesView() {
  const [labelState, setLabelState] = useState({
    isLabel: false,
    userLabel: '',
    companyUserLabel: '',
  });
  const [selectedMember, setSelectedMember] = useState<string>('Bartek');
  const [teamMembers, setTeamMembers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { users, dispatch: usersDispatch } = useUsersContext();

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      mail: '',
      website: '',
    },
    validationSchema: createCompanySchema,
    onSubmit: async (values) => {
      try {
        const { name, phone, mail, website } = values;

        const memberIDs = teamMembers.map((member) => {
          return { workerID: member._id, name: member.name, img: member.img };
        });

        if (companies.some((company) => company.name === name)) {
          setSuccessMessage('Ta firma już istnieje');
          return;
        }
        await addCompany({
          name,
          phone,
          mail,
          website,
          teamMembers: memberIDs,
        });

        formik.resetForm();
        setSuccessMessage('Firma dodana pomyślnie!');
        setTeamMembers([]);
      } catch {
        formik.setStatus('error');
      }
    },
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const allCompanies = await getAllCompanies();
        companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };

    const fetchUsers = async () => {
      if (users.length === 0) {
        try {
          const allUsers = await getAllUsers();
          usersDispatch({ type: 'SET_USERS', payload: allUsers });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchCompanies();
    fetchUsers();
  }, [companiesDispatch, usersDispatch, users]);

  const handleMouseEnter = (user, company) => {
    setLabelState({
      isLabel: true,
      userLabel: user.name,
      companyUserLabel: company.name,
    });
  };

  const handleMouseLeave = () => {
    setLabelState({ isLabel: false, userLabel: '', companyUserLabel: '' });
  };

  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleAddMember = (selectedMemberValue) => {
    const filteredUser = users.filter(
      (user) => user.name === selectedMemberValue
    );
    if (teamMembers.includes(filteredUser[0])) return;

    setTeamMembers((prevState) => [...prevState, ...filteredUser]);
  };

  const handleDeleteMember = (selectedMemberValue) => {
    const filteredArray = teamMembers.filter((member) => {
      return member._id !== selectedMemberValue._id;
    });
    setTeamMembers([...filteredArray]);
  };

  const clearValues = () => {
    setSuccessMessage('');
    setTeamMembers([]);
  };

  const formInputs = [
    {
      id: 'name',
      type: 'text',
      placeholder: 'Nazwa',
      value: formik.values.name,
    },
    {
      id: 'phone',
      type: 'text',
      placeholder: 'Telefon',
      value: formik.values.phone,
    },
    {
      id: 'mail',
      type: 'email',
      placeholder: 'Mail',
      value: formik.values.mail,
    },
    {
      id: 'website',
      type: 'url',
      placeholder: 'Strona',
      value: formik.values.website,
    },
  ];

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
        <Form onSubmit={formik.handleSubmit} isSignInView={false}>
          {formik.status === 'error' && (
            <div className={styles.error}>Tworzenie nie powiodło się</div>
          )}

          <>
            {formInputs.map(({ id, type, placeholder, value }) => {
              return (
                <FormControl key={id}>
                  <Input
                    id={id}
                    type={type}
                    name={id}
                    placeholder={placeholder}
                    className={`${inputStyle.input}`}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={value}
                  />
                </FormControl>
              );
            })}
          </>

          <div className={styles.addUserWrapper}>
            <select
              id="user-select"
              value={selectedMember}
              onChange={handleMemberChange}
              className={styles.selectInput}
            >
              {users.map((user) => (
                <option key={user._id} value={user.name}>
                  {user.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className={styles.addTeamMemberButton}
              onClick={() => handleAddMember(selectedMember)}
            >
              <Icon
                icon="icons8:plus"
                color="#f68c1e"
                width="50"
                height="50"
                className={styles.addNewUserBtn}
              />
            </button>
          </div>
          {teamMembers.length > 0 && (
            <div className={styles.displayMembersWrapper}>
              {teamMembers.map((member) => {
                return (
                  <CompanyGraphicTile
                    key={member._id}
                    member={member}
                    handleDeleteMember={handleDeleteMember}
                  />
                );
              })}
            </div>
          )}
          <SubmitButton
            disabled={formik.isSubmitting}
            buttonContent={formik.isSubmitting ? 'Dodawanie...' : 'Dodaj'}
            isSignInView={false}
          />
          <p className={styles.finalMessage}>{successMessage}</p>
        </Form>
      </ModalTemplate>
      <ControlBar>
        <ControlBarTitle>Firmy</ControlBarTitle>
        <SearchInput />
        <div className={styles.buttonsWrapper}>
          <CTA
            onClick={() => {
              openModal();
              // clearValues();
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
                return (
                  <TileWrapper key={company._id} linkPath={company._id}>
                    <div className={styles.tileElement}>
                      <p>{company.name}</p>
                    </div>
                    <div className={styles.tileElement}>
                      <p>{company.phone}</p>
                    </div>
                    <div className={styles.tileElement}>
                      <p>{company.mail}</p>
                    </div>
                    <div className={styles.tileElement}>
                      <p>{company.website}</p>
                    </div>
                    <div className={styles.tileElement}>
                      <p>{company.activeTasks}</p>
                    </div>
                    <div className={styles.usersImgContainer}>
                      {company.teamMembers.length > 0 &&
                        company.teamMembers.map((companyUser) => {
                          return (
                            <Link
                              className={styles.userWrapper}
                              key={companyUser.workerID}
                              to={`/użytkownicy/${companyUser.workerID}`}
                            >
                              <img
                                className={styles.userImg}
                                src={companyUser.img}
                                alt="user"
                                onMouseEnter={() => {
                                  handleMouseEnter(companyUser, company);
                                }}
                                onMouseLeave={() => {
                                  handleMouseLeave();
                                }}
                              />
                              {labelState.isLabel &&
                                labelState.companyUserLabel === company.name &&
                                labelState.userLabel === companyUser.name && (
                                  <div className={styles.graphicName}>
                                    <p>{companyUser.name}</p>
                                  </div>
                                )}
                            </Link>
                          );
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
