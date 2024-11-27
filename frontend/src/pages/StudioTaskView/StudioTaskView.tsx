import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useEffect, useMemo, useState } from 'react';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import DroppableColumn from '../../components/Molecules/ColumnContainer/ColumnContainer';
import styles from './StudioTaskView.module.css';
import { Column, Id } from '../../types';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  StudioTaskTypes,
} from '../../services/studio-tasks-service';
import DraggableCard from '../../components/Molecules/DraggableCard/DraggableCard';

const initialColumns = [
  {
    class: 'columnTitleMark',
    title: 'Na później',
    id: 1,
  },
  {
    class: 'columnTitleMarkToDo',
    title: 'Do zrobienia',
    id: 2,
  },
  {
    class: 'columnTitleMarkInProgress',
    title: 'W trakcie',
    id: 3,
  },
  {
    class: 'columnTitleMarkSent',
    title: 'Wysłane',
    id: 4,
  },
];

function StudioTaskView() {
  const { studioTasks, dispatch } = useStudioTasksContext();

  useEffect(() => {
    const fetchUsers = async () => {
      if (studioTasks.length === 0) {
        try {
          const allStudioTasks = await getAllStudioTasks();
          dispatch({ type: 'SET_STUDIOTASKS', payload: allStudioTasks });
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }
    };

    fetchUsers();
  }, [dispatch, studioTasks]);

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<StudioTaskTypes | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  function generateID() {
    return Math.floor(Math.random() * 900000);
  }

  function createNewColumn() {
    const columnToAdd: Column = {
      class: 'newColumn',
      title: `Kolumna ${columns.length + 1}`,
      id: generateID(),
    };
    setColumns((prevColumns) => [...prevColumns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);
  }

  function updateColumn(id: Id, title: string) {
    const newColumn = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });
    setColumns(newColumn);
  }

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.col);
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;
    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((newColumns) => {
      const activeColumnIndex = newColumns.findIndex(
        (col) => col.id === activeColumnId
      );

      const overColumnIndex = newColumns.findIndex(
        (col) => col.id === overColumnId
      );

      return arrayMove(newColumns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;

    if (isActiveTask && isOverTask) {
      const activeTaskIndex = studioTasks.findIndex(
        (tas) => tas._id === activeId
      );
      const overTaskIndex = studioTasks.findIndex((tas) => tas._id === overId);

      if (
        studioTasks[activeTaskIndex].status !==
        studioTasks[overTaskIndex].status
      ) {
        studioTasks[activeTaskIndex].status = studioTasks[overTaskIndex].status;
      }
      dispatch({
        type: 'SET_STUDIOTASKS',
        payload: arrayMove(studioTasks, activeTaskIndex, overTaskIndex),
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveTask && isOverAColumn) {
      const activeTaskIndex = studioTasks.findIndex(
        (tas) => tas._id === activeId
      );

      const overTitle = over.data.current?.col.title;

      studioTasks[activeTaskIndex].status = overTitle;

      dispatch({
        type: 'SET_STUDIOTASKS',
        payload: arrayMove(studioTasks, activeTaskIndex, activeTaskIndex),
      });
    }
  }

  return (
    <div className={styles.kanbanView}>
      <DndContext
        sensors={sensors}
        onDragStart={(e) => onDragStart(e)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <SortableContext items={columnsId}>
          {columns.map((col) => {
            return (
              <DroppableColumn
                col={col}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                key={col.id}
                tasks={studioTasks}
              />
            );
          })}
        </SortableContext>

        <button
          type="button"
          onClick={() => {
            createNewColumn();
          }}
        >
          add column
        </button>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <DroppableColumn
                col={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                tasks={studioTasks}
              />
            )}
            {activeTask && <DraggableCard task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );
}

export default StudioTaskView;
