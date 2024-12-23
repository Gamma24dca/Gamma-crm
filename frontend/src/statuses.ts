import { StudioTaskTypes } from './services/studio-tasks-service';

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
