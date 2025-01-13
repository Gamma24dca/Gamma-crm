import Calendar from 'react-calendar';
import CompanyGraphicTile from '../../Molecules/CompanyGraphicTile/CompanyGraphicTile';
import Loader from '../../Molecules/Loader/Loader';
import SelectUser from '../../Molecules/SelectUser/SelectUser';
import styles from './AddStudioTaskModalContent.module.css';

function AddStudioTaskModalContent({
  loadingState,
  formValue,
  handleFormChange,
  companies,
  statuses,
  statusNames,
  users,
  handleAddMember,
  handleDeleteMember,
  createTaskHandler,
  setFormValue,
}) {
  return (
    <div>
      <h2>Utwórz zlecenie</h2>
      {loadingState.isLoading ? (
        <div className={styles.loaderWrapper}>
          <Loader />
        </div>
      ) : (
        <div>
          <input
            type="text"
            name="Title"
            id="Title"
            placeholder="Tytuł"
            value={formValue.title}
            onChange={(e) => handleFormChange(e, 'title')}
          />
          <select
            name="companies"
            id="companies"
            onChange={(e) => handleFormChange(e, 'client')}
          >
            <option value="">Wybierz firme</option>
            {companies.map((company) => {
              return (
                <option key={company._id} value={company.name}>
                  {company.name}
                </option>
              );
            })}
          </select>
          <select
            name="client-person"
            id="client-person"
            onChange={(e) => handleFormChange(e, 'clientPerson')}
          >
            <option value="">Wybierz klienta</option>
            {formValue.client.length > 0 &&
              companies.map((company) => {
                if (company.name === formValue.client) {
                  return company.clientPerson.map((cp) => {
                    return (
                      <option key={cp.value} value={cp.label}>
                        {cp.label}
                      </option>
                    );
                  });
                }
                return null;
              })}
          </select>
          <select
            name="status"
            id="status"
            onChange={(e) => handleFormChange(e, 'status')}
          >
            <option value="">Status</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {statusNames[status]}
              </option>
            ))}
          </select>
          <select
            name="task-type"
            id="task-type"
            onChange={(e) => handleFormChange(e, 'taskType')}
          >
            <option value="">Rodzaj zlecenia</option>
            <option value="Kreacja">Kreacja</option>
            <option value="Druk">Druk</option>
            <option value="Multimedia">Multimedia</option>
            <option value="Gadżety">Gadżety</option>
            <option value="Szwalnia">Szwalnia</option>
          </select>
          <input
            type="text"
            name="Description"
            id="Description"
            placeholder="Opis"
            value={formValue.description}
            onChange={(e) => handleFormChange(e, 'description')}
          />

          <SelectUser users={users} handleAddMember={handleAddMember} />
          {formValue.participants.length > 0 && (
            <div className={styles.displayMembersWrapper}>
              {formValue.participants.map((member) => {
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

          <Calendar
            value={formValue.deadline}
            onChange={(e) => {
              setFormValue((prev) => ({
                ...prev,
                deadline: e.toString(),
              }));
            }}
            locale="pl-PL"
          />

          <button type="button" onClick={createTaskHandler}>
            Dodaj
          </button>
          <p>{loadingState.finalMessage}</p>
        </div>
      )}
    </div>
  );
}

export default AddStudioTaskModalContent;
