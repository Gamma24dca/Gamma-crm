import { useEffect, useState } from 'react';
import {
  addSubtask,
  deleteSubtask,
  updateSubtask,
} from '../services/studio-tasks-service';
import useStudioTasksContext from './Context/useStudioTasksContext';
import socket from '../socket';

const useSubtask = (task) => {
  const { dispatch } = useStudioTasksContext();

  const [addSubtaskInput, setAddSubtaskInput] = useState({
    isInputOpen: false,
    isSubtaskLoading: false,
    inputValue: '',
  });
  const [editSubtaskContent, setEditSubtaskContent] = useState({
    isEditing: false,
    isLoading: false,
    contentValue: '',
    subtaskId: '',
  });

  useEffect(() => {
    socket.on('updateSubtask', (subtasks) => {
      dispatch({ type: 'UPDATE_SUBTASK', payload: subtasks });
    });
  }, []);

  const handleAddSubtaskInput = (object) => {
    setAddSubtaskInput((prev) => {
      return {
        ...prev,
        ...object,
      };
    });
  };

  const handleEditSubtask = (object) => {
    setEditSubtaskContent((prev) => {
      return {
        ...prev,
        ...object,
      };
    });
  };

  const handleUpdateSubtask = async (taskId, subtaskId, subtaskData) => {
    try {
      handleEditSubtask({ isLoading: true, subtaskId });
      const response = await updateSubtask({ taskId, subtaskId, subtaskData });
      dispatch({ type: 'UPDATE_SUBTASK', payload: response });
      socket.emit('tasksUpdated', response);
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleEditSubtask({ isLoading: false, subtaskId: '' });
    }
  };

  const handleAddSubtask = async () => {
    try {
      if (addSubtaskInput.inputValue.length > 0) {
        handleAddSubtaskInput({ isSubtaskLoading: true });

        const response = await addSubtask({
          taskId: task._id,
          content: addSubtaskInput.inputValue,
          done: false,
        });
        dispatch({ type: 'UPDATE_SUBTASK', payload: response });
        socket.emit('tasksUpdated', response);
      }
    } catch (error) {
      console.error('Error saving value:', error);
    } finally {
      handleAddSubtaskInput({
        isSubtaskLoading: false,
        inputValue: '',
        isInputOpen: false,
      });
    }
  };

  const handleDeleteSubtask = async (taskId, subtaskId) => {
    try {
      const response = await deleteSubtask(taskId, subtaskId);
      dispatch({ type: 'UPDATE_SUBTASK', payload: response });
      socket.emit('tasksUpdated', response);
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };
  return {
    handleAddSubtask,
    handleDeleteSubtask,
    handleAddSubtaskInput,
    handleUpdateSubtask,
    handleEditSubtask,
    editSubtaskContent,
    addSubtaskInput,
  };
};

export default useSubtask;
