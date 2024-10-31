import { useEffect, useState } from 'react';
import useUsersContext from './Context/useUsersContext';
import { getAllUsers } from '../services/users-service';

const useSelectUser = () => {
  const { users, dispatch } = useUsersContext();
  const [selectedMember, setSelectedMember] = useState<string>('Bartek');
  const [teamMembers, setTeamMembers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (users.length === 0) {
        try {
          const allUsers = await getAllUsers();
          dispatch({ type: 'SET_USERS', payload: allUsers });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [dispatch, users]);

  const handleMemberChange = (e) => {
    setSelectedMember(e.target.value);
  };

  const handleAddMember = (selectedMemberValue) => {
    const filteredUser = users.filter(
      (user) => user.name === selectedMemberValue
    );
    console.log(teamMembers, filteredUser[0]);
    if (teamMembers.includes(filteredUser[0])) return;

    setTeamMembers((prevState) => [...prevState, ...filteredUser]);
  };

  const handleDeleteMember = (selectedMemberValue) => {
    const filteredArray = teamMembers.filter((member) => {
      return member._id !== selectedMemberValue._id;
    });
    setTeamMembers([...filteredArray]);
  };

  return {
    users,
    handleAddMember,
    handleDeleteMember,
    handleMemberChange,
    selectedMember,
  };
};

export default useSelectUser;
