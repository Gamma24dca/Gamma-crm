import styles from './CompanyGraphicTile.module.css';

function CompanyGraphicTile({ member, handleDeleteMember }) {
  return (
    <div className={styles.memberTile}>
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
      <img src={member.img} alt="user" className={styles.userImg} />
      <p>{member.name}</p>
    </div>
  );
}

export default CompanyGraphicTile;
