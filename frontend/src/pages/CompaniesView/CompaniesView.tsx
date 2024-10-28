import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
import styles from './CompaniesView.module.css';
import ViewContainer from '../../components/Atoms/ViewContainer/ViewContainer';
import ControlBar from '../../components/Atoms/ControlBar/ControlBar';
import ListContainer from '../../components/Atoms/ListContainer/ListContainer';
import { getAllCompanies } from '../../services/companies-service';
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
// import SubmitButton from '../../components/Atoms/SubmitBtn/SubmitBtn';

function CompaniesView() {
  const [labelState, setLabelState] = useState({
    isLabel: false,
    userLabel: '',
    companyUserLabel: '',
  });
  const [selectedMember, setSelectedMember] = useState<string>('Bartek');
  const [teamMembers, setTeamMembers] = useState([]);
  const { showModal, exitAnim, openModal, closeModal } = useModal();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const { users, dispatch: usersDispatch } = useUsersContext();

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

  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleAddMember = (selectedMemberValue) => {
    const filteredUser = users.filter(
      (user) => user.name === selectedMemberValue
    );
    if (teamMembers.includes(filteredUser[0])) return;

    setTeamMembers((prevState) => [...filteredUser, ...prevState]);
  };

  const handleDeleteMember = (selectedMemberValue) => {
    const filteredArray = teamMembers.filter((member) => {
      return member._id !== selectedMemberValue._id;
    });
    setTeamMembers([...filteredArray]);
  };

  return (
    <>
      <ModalTemplate
        isOpen={showModal}
        onClose={closeModal}
        exitAnim={exitAnim}
      >
        <h2>Dodaj firme</h2>
        <Form onSubmit={() => {}} isSignInView={false}>
          <FormControl>
            <Input
              id="name"
              type="name"
              name="name"
              placeholder="Nazwa"
              className={`${inputStyle.input}`}
              onChange={() => {}}
              onBlur={() => {}}
              value="Nazwa"
            />
          </FormControl>
          <FormControl>
            <Input
              id="phone"
              type="phone"
              name="phone"
              placeholder="Telefon"
              className={`${inputStyle.input}`}
              onChange={() => {}}
              onBlur={() => {}}
              value="Telefon"
            />
          </FormControl>
          <FormControl>
            <Input
              id="mail"
              type="mail"
              name="mail"
              placeholder="Mail"
              className={`${inputStyle.input}`}
              onChange={() => {}}
              onBlur={() => {}}
              value="Mail"
            />
          </FormControl>
          <FormControl>
            <Input
              id="website"
              type="website"
              name="website"
              placeholder="Strona"
              className={`${inputStyle.input}`}
              onChange={() => {}}
              onBlur={() => {}}
              value="Strona"
            />
          </FormControl>

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

          {teamMembers.length > 0 ? (
            <div className={styles.displayMembersWrapper}>
              {teamMembers.map((member) => {
                return (
                  <div key={member._id} className={styles.memberTile}>
                    <div
                      className={styles.deleteMemberContainer}
                      onClick={() => handleDeleteMember(member)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleDeleteMember(member);
                        }
                      }}
                    >
                      <div className={styles.deleteMember} />
                    </div>
                    <img
                      src={member.img}
                      alt="user"
                      className={styles.userImg}
                    />
                    <p>{member.name}</p>
                  </div>
                );
              })}
            </div>
          ) : null}

          {/* <SubmitButton
            disabled={true}
            buttonContent={'Dodaj'}
            isSignInView={false}
          /> */}
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
          {companies && companies.length > 0 ? (
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
                      {users.flatMap((user) => {
                        return company.teamMembers.map((companyUser) => {
                          return user._id === companyUser.workerID ? (
                            <Link
                              className={styles.userWrapper}
                              key={companyUser.workerID}
                              to={`/użytkownicy/${user._id}`}
                            >
                              <img
                                className={styles.userImg}
                                src={user.img}
                                alt="user"
                                onMouseEnter={() => {
                                  handleMouseEnter(user, company);
                                }}
                                onMouseLeave={() => {
                                  handleMouseLeave();
                                }}
                              />
                              {labelState.isLabel &&
                              labelState.companyUserLabel === company.name &&
                              labelState.userLabel === user.name ? (
                                <div className={styles.graphicName}>
                                  <p>{user.name}</p>
                                </div>
                              ) : null}
                            </Link>
                          ) : null;
                        });
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
