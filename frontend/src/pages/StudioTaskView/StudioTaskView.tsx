import { DragDropContext, OnDragEndResponder } from '@hello-pangea/dnd';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { useMutation } from 'react-query';
import styles from './StudioTaskView.module.css';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  StudioTaskTypes,
  UpdateStudioTask,
} from '../../services/studio-tasks-service';
import {
  getTasksByStatus,
  statuses,
  statusNames,
  TasksByStatus,
} from '../../statuses';
import DroppableColumn from '../../components/Molecules/ColumnContainer/ColumnContainer';

const updateTaskStatus = async (source, destination) => {
  console.log(source, destination);
  const { data: studioTasks } = await await getAllStudioTasks();

  const tasksByStatus = getTasksByStatus(studioTasks);

  if (source.status === destination.status) {
    // moving post inside the same column

    const columnTasks = tasksByStatus[source.status];
    const destinationIndex = destination.index ?? columnTasks.length + 1;

    if (source.index > destinationIndex) {
      // post moved up, eg
      // dest   src
      //  <------
      // [4, 7, 23, 5]

      await Promise.all([
        // for all posts between destinationIndex and source.index, increase the index
        ...columnTasks
          .filter(
            (task) =>
              task.index >= destinationIndex && task.index < source.index
          )
          .map((task) =>
            UpdateStudioTask({
              id: task._id,
              studioTaskData: { index: task.index + 1 },
            })
          ),
        // for the post that was moved, update its index

        UpdateStudioTask({
          id: source._id,
          studioTaskData: { index: destinationIndex },
        }),
      ]);
    } else {
      // post moved down, e.g
      // src   dest
      //  ------>
      // [4, 7, 23, 5]

      await Promise.all([
        // for all posts between source.index and destinationIndex, decrease the index
        ...columnTasks
          .filter(
            (post) =>
              post.index <= destinationIndex && post.index > source.index
          )
          .map((task) =>
            UpdateStudioTask({
              id: task._id,
              studioTaskData: { index: task.index - 1 },
            })
          ),
        // for the post that was moved, update its index
        UpdateStudioTask({
          id: source._id,
          studioTaskData: { index: destinationIndex },
        }),
      ]);
    }
  } else {
    // moving post across columns

    const sourceColumn = tasksByStatus[source.status];
    const destinationColumn = tasksByStatus[destination.status];
    const destinationIndex = destination.index ?? destinationColumn.length + 1;

    await Promise.all([
      // decrease index on the posts after the source index in the source columns
      ...sourceColumn
        .filter((task) => task.index > source.index)
        .map((task) =>
          UpdateStudioTask({
            id: task._id,
            studioTaskData: { index: task.index - 1 },
          })
        ),
      // increase index on the tasks after the destination index in the destination columns
      ...destinationColumn
        .filter((task) => task.index >= destinationIndex)
        .map((task) =>
          UpdateStudioTask({
            id: task._id,
            studioTaskData: { index: task.index + 1 },
          })
        ),
      // change the dragged post to take the destination index and column

      UpdateStudioTask({
        id: source._id,
        studioTaskData: { index: destinationIndex, status: destination.status },
      }),
    ]);
  }
};

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
          console.error('Error fetching users:', error);
        }
      }

      if (studioTasks) {
        const newTasksByStatus = getTasksByStatus(studioTasks);
        if (!isEqual(newTasksByStatus, tasksByStatus)) {
          setTasksByStatus(newTasksByStatus);
        }
      }
    };

    fetchTasks();
  }, [dispatch, studioTasks, tasksByStatus]);

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

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceStatus = source.droppableId as StudioTaskTypes['status'];
    const destinationStatus =
      destination.droppableId as StudioTaskTypes['status'];
    const sourcePost = tasksByStatus[sourceStatus][source.index]!;
    const destinationPost = tasksByStatus[destinationStatus][
      destination.index
    ] ?? {
      status: destinationStatus,
      index: undefined, // undefined if dropped after the last item
    };

    // compute local state change synchronously
    setTasksByStatus(
      updateTasksStatusLocal(
        sourcePost,
        { status: sourceStatus, index: source.index },
        { status: destinationStatus, index: destination.index },
        tasksByStatus
      )
    );

    // trigger the mutation to persist the changes
    mutation.mutateAsync({
      source: sourcePost,
      destination: destinationPost,
    });
  };

  return (
    <div className={styles.kanbanView}>
      <DragDropContext onDragEnd={onDragEnd}>
        {statuses.map((status) => {
          return (
            <DroppableColumn
              key={status}
              status={status}
              tasks={tasksByStatus[status]}
            />
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default StudioTaskView;

const updateTasksStatusLocal = (
  sourcePost: StudioTaskTypes,
  source: { status: StudioTaskTypes['status']; index: number },
  destination: {
    status: StudioTaskTypes['status'];
    index?: number; // undefined if dropped after the last item
  },
  tasksByStatus: TasksByStatus
) => {
  if (source.status === destination.status) {
    // moving deal inside the same column
    const column = tasksByStatus[source.status];
    column.splice(source.index, 1);
    column.splice(destination.index ?? column.length + 1, 0, sourcePost);
    return {
      ...tasksByStatus,
      [destination.status]: column,
    };
  }
  // moving deal across columns
  const sourceColumn = tasksByStatus[source.status];
  const destinationColumn = tasksByStatus[destination.status];
  sourceColumn.splice(source.index, 1);
  destinationColumn.splice(
    destination.index ?? destinationColumn.length + 1,
    0,
    sourcePost
  );
  return {
    ...tasksByStatus,
    [source.status]: sourceColumn,
    [destination.status]: destinationColumn,
  };
};
