import { useEffect, useState } from 'react';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { isEqual } from 'lodash';
import { useMutation } from 'react-query';
import styles from './KanbanView.module.css';
import {
  getTasksByStatus,
  statuses,
  updateTaskStatus,
  updateTaskStatusLocal,
} from '../../../statuses';
import useStudioTasksContext from '../../../hooks/Context/useStudioTasksContext';
import useCompaniesContext from '../../../hooks/Context/useCompaniesContext';
import { getAllCompanies } from '../../../services/companies-service';
import {
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../../services/studio-tasks-service';
import DroppableColumn from '../../Molecules/DroppableColumn/DroppableColumn';

function KanbanView() {
  const { studioTasks, dispatch } = useStudioTasksContext();
  const { companies, dispatch: companiesDispatch } = useCompaniesContext();
  const [tasksByStatus, setTasksByStatus] = useState(getTasksByStatus([]));
  const [isDragAllowed, setIsDragAllowed] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (companies.length === 0) {
        try {
          const allCompanies = await getAllCompanies();
          companiesDispatch({ type: 'SET_COMPANIES', payload: allCompanies });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [companiesDispatch, companies]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (studioTasks.length === 0) {
        try {
          const allStudioTasks = await getAllStudioTasks();
          dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
        } catch (error) {
          console.error('Error fetching tasks:', error);
        }
      }

      if (studioTasks) {
        const newTasksByStatus = getTasksByStatus(studioTasks);
        if (!isEqual(newTasksByStatus, tasksByStatus)) {
          setTasksByStatus({ ...newTasksByStatus });
        }
      }
    };

    fetchTasks();
  }, [dispatch, studioTasks]);

  const mutation = useMutation<
    void,
    Error,
    {
      source: StudioTaskTypes;
      destination: { status: StudioTaskTypes['status']; index?: number };
    }
  >(({ source, destination }) => updateTaskStatus(source, destination), {
    onSettled: async () => {
      const allStudioTasks = await getAllStudioTasks();
      dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
    },
  });

  console.log('tasks:', tasksByStatus);

  const onDragEnd: OnDragEndResponder = (result) => {
    if (!isDragAllowed) return;

    const { destination, source } = result;

    if (!destination) return;

    setIsDragAllowed(false);
    console.log('dragging disabled');

    try {
      if (
        destination.droppableId === source.droppableId &&
        destination.index === source.index
      ) {
        return;
      }

      const sourceStatus = source.droppableId as StudioTaskTypes['status'];
      const destinationStatus =
        destination.droppableId as StudioTaskTypes['status'];
      const sourceTask = tasksByStatus[sourceStatus][source.index];
      const destinationTask = tasksByStatus[destinationStatus][
        destination.index
      ] ?? {
        status: destinationStatus,
        index: undefined,
      };

      const updatedTasks = updateTaskStatusLocal(
        sourceTask,
        { status: sourceStatus, index: source.index },
        { status: destinationStatus, index: destination.index },
        tasksByStatus
      );

      // console.log('Updated tasksByStatus:', updatedTasks);
      setTasksByStatus({ ...updatedTasks });
      // console.log('dest task', destinationTask);

      mutation.mutateAsync({
        source: sourceTask,
        destination: destinationTask,
      });
    } catch (error) {
      console.error('Error handling drag and drop', error);
    } finally {
      setTimeout(() => {
        setIsDragAllowed(true);
        console.log('dragging enabled');
      }, 300);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className={styles.columnsWrapper}>
        {statuses.map((status) => {
          return (
            <DroppableColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
              isDragAllowed={isDragAllowed}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default KanbanView;
