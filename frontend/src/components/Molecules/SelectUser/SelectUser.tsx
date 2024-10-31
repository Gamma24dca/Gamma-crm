import { Icon } from '@iconify/react';
import styles from './SelectUser.module.css';

function SelectUser({
  users,
  selectedMember,
  handleMemberChange,
  handleAddMember,
}) {
  return (
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
  );
}

export default SelectUser;
