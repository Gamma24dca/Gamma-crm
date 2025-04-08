import { useEffect, useState } from 'react';
import { archiveStudioTask } from '../services/archived-studio-tasks-service';
import {
  deleteTask,
  UpdateStudioTask,
  StudioTaskTypes,
  getStudioTask,
} from '../services/studio-tasks-service';
import useStudioTasksContext from './Context/useStudioTasksContext';
import useUsersContext from './Context/useUsersContext';
import useCompaniesContext from './Context/useCompaniesContext';
import socket from '../socket';

const useStudioTaskUpdate = (task, closeModal) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [isUserAssigned, setIsUserAssigned] = useState(false);
  const [formValue, setFormValue] = useState<StudioTaskTypes>(task);
  const [isMemberChangeLoading, setIsMemberChangeLoading] = useState({
    userName: '',
    isLoading: false,
    loadPlace: '',
  });
  const { users } = useUsersContext();
  const { companies } = useCompaniesContext();
  const { dispatch } = useStudioTasksContext();

  useEffect(() => {
    socket.on('deleteTask', (taskToDel) => {
      dispatch({ type: 'DELETE_STUDIOTASK', payload: taskToDel });
    });

    socket.on('archiveTask', (taskToArch) => {
      dispatch({ type: 'DELETE_STUDIOTASK', payload: taskToArch });
    });

    socket.on('updateTasks', (tasks) => {
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: tasks });
    });
  }, []);

  const handleDeleteTask = async (id) => {
    socket.emit('taskDeleted', task);
    dispatch({ type: 'DELETE_STUDIOTASK', payload: task });
    closeModal();
    await deleteTask(id);
  };

  const handleArchiveTask = async (id) => {
    socket.emit('taskArchived', task);
    dispatch({ type: 'DELETE_STUDIOTASK', payload: task });
    closeModal();
    await archiveStudioTask(id);
  };

  const handleFormChange = (e, key) => {
    setFormValue((prev) => ({
      ...prev,
      [key]: e.target.value,
    }));
  };

  const handleBlur = async () => {
    setIsEditing(false);
    try {
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: formValue,
      });
      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const handleMemberLoadChange = (name, loadState, loadPlace) => {
    setIsMemberChangeLoading(() => {
      return {
        userName: name,
        isLoading: loadState,
        loadPlace,
      };
    });
  };

  const handleAddMember = async (userId: string, loadPlace: string) => {
    const userToAdd = users.find((user) => user._id === userId);
    const userToAddNasme = userToAdd.name;

    if (!userToAdd) return;

    const participants = [...task.participants];

    const isAlreadyAdded = participants.some(
      (participant) => participant._id === userId
    );

    if (isAlreadyAdded) return;

    const newFormValue = {
      ...task,
      participants: [...participants, userToAdd],
    };

    setFormValue(newFormValue);

    try {
      handleMemberLoadChange(userToAddNasme, true, loadPlace);
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: newFormValue,
      });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleMemberLoadChange(userToAddNasme, false, loadPlace);
    }
  };

  const handleDeleteMember = async (userId: string, loadPlace: string) => {
    const userToDelete = users.find((user) => user._id === userId);
    const userToDeleteName = userToDelete.name;
    const participants = [...task.participants];

    const filteredParticipants = participants.filter(
      (participant) => participant._id !== userId
    );

    setFormValue((prev) => {
      return {
        ...prev,
        participants: filteredParticipants,
      };
    });

    try {
      handleMemberLoadChange(userToDeleteName, true, loadPlace);

      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: { ...task, participants: filteredParticipants },
      });
      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleMemberLoadChange(userToDeleteName, false, loadPlace);
    }
  };

  const handleClientChange = async (e) => {
    const companyObject = companies.filter(
      (com) => com.name === e.target.value
    );
    const companyFirstClientPerson = companyObject[0].clientPerson[0].value;
    handleFormChange(e, 'client');
    setFormValue((prev) => {
      return {
        ...prev,
        clientPerson: companyFirstClientPerson,
      };
    });
    try {
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          ...task,
          client: e.target.value,
          clientPerson: companyFirstClientPerson,
        },
      });
      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleClientPersonChange = async (e) => {
    handleFormChange(e, 'clientPerson');
    try {
      const updatedTask = await UpdateStudioTask({
        id: task._id,
        studioTaskData: {
          ...task,
          clientPerson: e.target.value,
        },
      });
      // const res = await getAllStudioTasks();
      // dispatch({ type: 'SET_STUDIOTASKS', payload: res });
      const res = await getStudioTask(updatedTask._id);
      dispatch({ type: 'UPDATE_STUDIOTASK', payload: res });
      socket.emit('tasksUpdated', res);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    users,
    companies,
    isEditing,
    setIsEditing,
    isSelectOpen,
    setIsSelectOpen,
    isMemberChangeLoading,
    formValue,
    handleFormChange,
    handleDeleteTask,
    handleArchiveTask,
    handleBlur,
    handleAddMember,
    handleDeleteMember,
    handleClientChange,
    handleClientPersonChange,
    isUserAssigned,
    setIsUserAssigned,
  };
};

export default useStudioTaskUpdate;
