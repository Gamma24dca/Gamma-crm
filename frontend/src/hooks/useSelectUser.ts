import { useEffect, useState } from 'react';
import useUsersContext from './Context/useUsersContext';
import { getAllUsers } from '../services/users-service';
import { CompaniesType } from '../services/companies-service';

const useSelectUser = () => {
  const { users, dispatch } = useUsersContext();
  const [selectedMember, setSelectedMember] = useState<string>('Bartek');
  const [formValue, setFormValue] = useState<CompaniesType>({
    name: '',
    phone: '',
    mail: '',
    teamMembers: [],
    website: '',
  });

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
    const isUserInArray = formValue.teamMembers.some(
      (user) => user._id === filteredUser[0]._id
    );
    if (isUserInArray) return;

    setFormValue((prevState) => ({
      ...prevState,
      teamMembers: [...prevState.teamMembers, ...filteredUser],
    }));
  };

  const handleDeleteMember = (selectedMemberValue) => {
    const filteredArray = formValue.teamMembers.filter((member) => {
      return member._id !== selectedMemberValue._id;
    });
    setFormValue((prevState) => ({
      ...prevState,
      teamMembers: [...filteredArray],
    }));
  };

  return {
    users,
    formValue,
    setFormValue,
    handleAddMember,
    handleDeleteMember,
    handleMemberChange,
    selectedMember,
  };
};

export default useSelectUser;
