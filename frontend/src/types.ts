import { StudioTaskTypes } from './services/studio-tasks-service';

export type Id = string | number;

export type Column = {
  class: string;
  title: string;
  id: Id;
};

export type ColumnComp = {
  col: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, e: string) => void;
  tasks: StudioTaskTypes[];
};
