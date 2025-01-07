import {
  getAllStudioTasks,
  StudioTaskTypes,
  UpdateStudioTask,
} from './services/studio-tasks-service';

export const statuses: StudioTaskTypes['status'][] = [
  'na_później',
  'do_zrobienia',
  'w_trakcie',
  'wysłane',
];

export const statusNames: Record<StudioTaskTypes['status'], string> = {
  na_później: 'Na później',
  do_zrobienia: 'Do zrobienia',
  w_trakcie: 'W trakcie',
  wysłane: 'Wysłane',
};

export type TasksByStatus = Record<
  StudioTaskTypes['status'],
  StudioTaskTypes[]
>;

export const getTasksByStatus = (unorderedPosts: StudioTaskTypes[]) => {
  const postsByStatus: TasksByStatus = unorderedPosts.reduce(
    (acc, post) => {
      acc[post.status].push(post);
      return acc;
    },
    statuses.reduce(
      (obj, status) => ({ ...obj, [status]: [] }),
      {} as TasksByStatus
    )
  );
  // order each column by index
  statuses.forEach((status) => {
    postsByStatus[status] = postsByStatus[status].sort(
      (recordA: StudioTaskTypes, recordB: StudioTaskTypes) =>
        recordA.index - recordB.index
    );
  });
  return postsByStatus;
};

export const updateTaskStatus = async (source, destination) => {
  // console.log(source, destination);
  const studioTasks = await getAllStudioTasks();

  console.log(studioTasks);
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
      console.log('moved down');

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
  }
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
};
