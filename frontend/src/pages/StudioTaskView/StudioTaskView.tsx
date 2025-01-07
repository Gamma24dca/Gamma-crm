import { useEffect, useState } from 'react';
import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { isEqual } from 'lodash';
import styles from './StudioTaskView.module.css';
import {
  getTasksByStatus,
  statuses,
  TasksByStatus,
  updateTaskStatus,
} from '../../statuses';
import DroppableColumn from '../../components/Molecules/DroppableColumn/DroppableColumn';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../services/studio-tasks-service';
import { useMutation } from 'react-query';

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
          setTasksByStatus({ ...newTasksByStatus }); // Ensure a new object reference
        }
      }
    };

    fetchTasks();
  }, [dispatch, studioTasks]); // Removed tasksByStatus to avoid overwriting local changes

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

  const onDragEnd: OnDragEndResponder = (result) => {
    const { destination, source } = result;

    if (!destination) return; // Task was dropped outside any droppable area

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return; // Task dropped in the same position
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
    setTasksByStatus({ ...updatedTasks }); // Ensure new object reference

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

const updateTaskStatusLocal = (
  sourceTask: StudioTaskTypes,
  source: { status: StudioTaskTypes['status']; index: number },
  destination: {
    status: StudioTaskTypes['status'];
    index?: number;
  },
  tasksByStatus: TasksByStatus
) => {
  if (!destination) return tasksByStatus; // Drop outside does nothing

  if (source.status === destination.status) {
    // Copy the source column to avoid mutating the original
    const column = [...tasksByStatus[source.status]];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length, 0, sourceTask);

    return {
      ...tasksByStatus,
      [destination.status]: column,
    };
  } else {
    // Copy both source and destination columns
    const sourceColumn = [...tasksByStatus[source.status]];
    const destinationColumn = [...tasksByStatus[destination.status]];

    // Remove the task from the source column
    sourceColumn.splice(source.index, 1);

    // Add the task to the destination column
    destinationColumn.splice(
      destination.index ?? destinationColumn.length,
      0,
      sourceTask
    );

    return {
      ...tasksByStatus,
      [source.status]: sourceColumn,
      [destination.status]: destinationColumn,
    };
  }
};

export default StudioTaskView;
