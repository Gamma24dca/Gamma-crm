import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useSelectUser from '../../../hooks/useSelectUser';
import { UpdateCompany } from '../../../services/companies-service';
import CompanyGraphicTile from '../../Molecules/CompanyGraphicTile/CompanyGraphicTile';
import SelectUser from '../../Molecules/SelectUser/SelectUser';
import styles from './UpdateCompanyModalContent.module.css';
import ClientSelect from '../../Molecules/ClientSelect/ClientSelect';

const initialCompanyObject = {
  name: '',
  phone: '',
  mail: '',
  teamMembers: [],
  website: '',
  clientPerson: [],
};

function UpdateCompanyModalContent({
  currentCompany,
  closeModal,
  openCaptcha,
  refreshCompanyData,
}) {
  const params = useParams();

  const {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
    clientInputValue,
    setClientInputValue,
  } = useSelectUser({
    initialValue: initialCompanyObject,
    objectKey: 'teamMembers',
  });

  useEffect(() => {
    setFormValue({
      name: currentCompany.name || '',
      phone: currentCompany.phone || '',
      mail: currentCompany.mail || '',
      teamMembers: currentCompany.teamMembers || [],
      clientPerson: currentCompany.clientPerson || [],
      website: currentCompany.website || '',
    });
  }, [currentCompany, setFormValue]);

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleUpdateCompany = async () => {
    const response = await UpdateCompany({
      id: params.id,
      companyData: formValue,
    });
    if (response !== null) {
      closeModal();
      refreshCompanyData();
    }
  };

  return (
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
            value={formValue.name}
            onChange={(e) => {
              handleFormChange(e, 'name');
            }}
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
            value={formValue.mail}
            onChange={(e) => {
              handleFormChange(e, 'mail');
            }}
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
            value={formValue.phone}
            onChange={(e) => {
              handleFormChange(e, 'phone');
            }}
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
            value={formValue.website}
            onChange={(e) => {
              handleFormChange(e, 'website');
            }}
            className={styles.companyInput}
          />
        </div>
      </div>

      <ClientSelect
        value={formValue.clientPerson}
        setValue={setFormValue}
        inputValue={clientInputValue}
        setInputValue={setClientInputValue}
      />
      <SelectUser users={users} handleAddMember={handleAddMember} />

      <div className={styles.displayMembersWrapper}>
        {formValue.teamMembers.length > 0 &&
          formValue.teamMembers.map((member) => {
            return (
              <CompanyGraphicTile
                key={member._id}
                member={member}
                handleDeleteMember={handleDeleteMember}
              />
            );
          })}
      </div>

      <div className={styles.optionButtonsWrapper}>
        <button
          type="button"
          onClick={() => {
            openCaptcha(true);
          }}
          className={styles.deleteCompanyButton}
        >
          Usuń firmę
        </button>
        <button
          type="button"
          onClick={() => {
            handleUpdateCompany();
          }}
          className={styles.editButton}
        >
          Zapisz
        </button>
      </div>
    </div>
  );
}

export default UpdateCompanyModalContent;
