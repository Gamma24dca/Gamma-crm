// import { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Rectangle,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Icon } from '@iconify/react';
import styles from './ClientProfileViewComponent.module.css';
import BackButton from '../../Atoms/BackButton/BackButton';
import DateFormatter from '../../../utils/dateFormatter';

// import CompanyProfileRow from '../CompanyProfileRow/CompanyProfileRow';

function ClientProfileViewComponent({
  loadingState,
  clientData,
  formValue,
  openModal,
  handleDeleteClient,
  clientID,
  handleFormChange,
  companies,
  handleUpdateClient,
  chartData,
  notes,
  handleDeleteNote,
  isMouseOverIcon,
  setIsMouseOverIcon,
  users,
  //   currentMonthIndex,
  //   companyHourRate,
}) {
  if (loadingState.isError) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:close-small"
          width="70"
          height="70"
          className={styles.errorIcon}
        />
        <p>Coś poszło nie tak :(</p>
      </div>
    );
  }

  if (!loadingState.isError && loadingState.isLoading) {
    return (
      <div className={styles.iconWrapper}>
        <Icon
          icon="line-md:loading-twotone-loop"
          width="121"
          height="121"
          className={styles.loadingIcon}
        />
      </div>
    );
  }

  if (!loadingState.isError && !loadingState.isLoading && clientData) {
    return (
      <div className={styles.container}>
        <div className={styles.clientProfileTopBar}>
          <BackButton path="klienci" />
          <h2>{clientData.name}</h2>
          <div>
            <button type="button" onClick={openModal}>
              Dodaj notatke
            </button>
            <button type="button" onClick={() => handleDeleteClient(clientID)}>
              Usuń
            </button>
          </div>
        </div>
        <div className={styles.columnsWrapper}>
          <div className={styles.leftColumn}>
            <h3>Informacje</h3>
            <div className={styles.infoInputsWrapper}>
              <div className={styles.inputWrapper}>
                <label htmlFor="clientName">
                  <strong>Imie i nazwisko</strong>
                </label>
                <input
                  type="text"
                  name="clientName"
                  id="clientName"
                  maxLength={30}
                  value={formValue.name}
                  onChange={(e) => {
                    handleFormChange(e, 'name');
                  }}
                  className={styles.companyInput}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="clientMail">
                  <strong>E-mail</strong>
                </label>
                <input
                  type="text"
                  name="clientMail"
                  id="clientMail"
                  maxLength={40}
                  value={formValue.email}
                  onChange={(e) => {
                    handleFormChange(e, 'email');
                  }}
                  className={styles.companyInput}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="clientPhone">
                  <strong>Telefon</strong>
                </label>
                <input
                  type="text"
                  name="clientPhone"
                  id="clientPhone"
                  maxLength={15}
                  value={formValue.phone}
                  onChange={(e) => {
                    handleFormChange(e, 'phone');
                  }}
                  className={styles.companyInput}
                />
              </div>
              <div className={styles.inputWrapper}>
                <label htmlFor="companyNIP">
                  <strong>Firma</strong>
                </label>
                <select
                  name="companyNIP"
                  id="companyNIP"
                  //   value={formValue.nip}
                  // onChange={(e) => {
                  //   handleFormChange(e, 'nip');
                  // }}
                  className={styles.companyInput}
                >
                  <option value={formValue.company}>
                    {clientData.company}
                  </option>
                  {companies.map((com) => {
                    return (
                      com.name !== clientData.company && (
                        <option value={com.name} key={com._id}>
                          {com.name}
                        </option>
                      )
                    );
                  })}
                </select>
              </div>
              <button
                className={styles.saveBtn}
                type="button"
                onClick={handleUpdateClient}
              >
                zapisz
              </button>
            </div>
          </div>
          <div className={styles.rightColumn}>
            <h3>Podsumowanie</h3>

            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="50%">
                <BarChart
                  width={500}
                  height={300}
                  data={chartData[0].participants}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="hours"
                    fill="#8884d8"
                    activeBar={<Rectangle fill="#f68c1e" stroke="#f68c1e" />}
                    animationBegin={0}
                    animationDuration={500}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.noTasksContainer}>
                <p>Brak danych</p>
                <Icon icon="line-md:coffee-loop" width="24" height="24" />
              </div>
            )}

            <div className={styles.notesContainer}>
              {notes.length > 0 ? (
                notes.map((note) => {
                  return (
                    <div className={styles.noteTile} key={note._id}>
                      {isMouseOverIcon.isOver &&
                      isMouseOverIcon.noteID === note._id ? (
                        <Icon
                          className={styles.trashIcon}
                          icon="line-md:trash"
                          width="36"
                          height="36"
                          onMouseLeave={() =>
                            setIsMouseOverIcon(() => {
                              return {
                                isOver: false,
                                noteID: '',
                              };
                            })
                          }
                          onClick={() => handleDeleteNote(clientID, note._id)}
                        />
                      ) : (
                        <Icon
                          className={styles.noteIcon}
                          icon="line-md:document-list"
                          width="36"
                          height="36"
                          onMouseEnter={() =>
                            setIsMouseOverIcon(() => {
                              return {
                                isOver: true,
                                noteID: note._id,
                              };
                            })
                          }
                        />
                      )}

                      <div className={styles.noteContentWrapper}>
                        <p className={styles.authorName}>
                          {users.length > 0 &&
                            users.find((user) => user._id === note.author).name}
                        </p>
                        <div className={styles.noteRow}>
                          <p className={styles.noteText}>{note.text}</p>
                          <DateFormatter dateString={note.date} />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>Brak notatek</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.noTasksContainer}>
      <p>Brak zleceń</p>
      <Icon icon="line-md:coffee-loop" width="24" height="24" />
    </div>
  );
}

export default ClientProfileViewComponent;
