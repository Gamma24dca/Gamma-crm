import { createPortal } from 'react-dom';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  // closestCorners,
} from '@dnd-kit/core';
import { debounce } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import DroppableColumn from '../../components/Molecules/ColumnContainer/ColumnContainer';
import styles from './StudioTaskView.module.css';
import { Column } from '../../types';
import useStudioTasksContext from '../../hooks/Context/useStudioTasksContext';
import {
  getAllStudioTasks,
  StudioTaskTypes,
  UpdateStudioTask,
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
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<StudioTaskTypes | null>(null);

  // const [currentStatus, setCurrentStatus] = useState({
  //   status: '',
  // });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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

  // async function handleUpdateTaskStatus(id, status) {
  //   try {
  //     await UpdateStudioTask({
  //       id,
  //       studioTaskData: status,
  //     });
  //     console.log(`Task ${id} updated successfully with status:`, status);
  //   } catch (error) {
  //     console.error(`Failed to update task ${id} with status:`, error);
  //   }
  // }

  const debouncedUpdateTaskStatus = useCallback(
    debounce((id, status) => {
      console.log(`Task ${id} updated successfully with status:`, status);

      UpdateStudioTask({
        id,
        studioTaskData: status,
      });
    }, 300),
    []
  );

  // useEffect(() => {
  //   if (activeTask && currentStatus.status) {
  //     handleUpdateTaskStatus(activeTask._id, currentStatus);
  //   }
  // }, [currentStatus, activeTask]);

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.col);
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveColumn(null);
    setActiveTask(null);

    if (!over) return;

    const isTask = active.data.current?.type === 'Task';
    const isColumn = over.data.current?.type === 'Column';

    if (isTask && isColumn) {
      const activeId = active.id;
      const overTitle = over.data.current?.col.title;

      if (!overTitle) return;

      const activeTaskIndex = studioTasks.findIndex(
        (task) => task._id === activeId
      );

      const updatedTask = {
        ...studioTasks[activeTaskIndex],
        status: overTitle,
      };

      // Move the task to the new column and set it to the last position
      const updatedTasks = studioTasks
        .filter((task) => task._id !== activeId) // Remove task from current position
        .concat(updatedTask); // Add it to the end of the list (or desired position)

      dispatch({
        type: 'SET_STUDIOTASKS',
        payload: updatedTasks,
      });

      debouncedUpdateTaskStatus(activeId, { status: overTitle });
    }
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

      if (!over.data.current?.col?.title) {
        console.warn('Invalid column data during drag over.');
        return;
      }

      const overTitle = over.data.current?.col.title;

      studioTasks[activeTaskIndex].status = overTitle;

      // console.log(overTitle);
      // setCurrentStatus({
      //   status: over.data.current?.col.title,
      // });

      dispatch({
        type: 'SET_STUDIOTASKS',
        payload: arrayMove(studioTasks, activeTaskIndex, activeTaskIndex),
      });
      debouncedUpdateTaskStatus(activeId, { status: overTitle });
    }
  }

  return (
    <div className={styles.kanbanView}>
      <DndContext
        sensors={sensors}
        // collisionDetection={closestCorners}
        onDragStart={(e) => onDragStart(e)}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        {columns.map((col) => {
          return <DroppableColumn col={col} key={col.id} tasks={studioTasks} />;
        })}

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
              <DroppableColumn col={activeColumn} tasks={studioTasks} />
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
