import { useEffect, useState } from 'react';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { isEqual } from 'lodash';
import { useMutation } from 'react-query';
import styles from './StudioTaskView.module.css';
import {
  getTasksByStatus,
  statuses,
  updateTaskStatus,
  updateTaskStatusLocal,
} from '../../statuses';
import DroppableColumn from '../../components/Molecules/DroppableColumn/DroppableColumn';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../services/studio-tasks-service';

function StudioTaskView() {
  const { studioTasks, dispatch } = useStudioTasksContext();
  const [tasksByStatus, setTasksByStatus] = useState(getTasksByStatus([]));

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

  console.log(tasksByStatus);

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) return;

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
            />
          );
        })}
      </div>
    </DragDropContext>
  );
}

export default StudioTaskView;
