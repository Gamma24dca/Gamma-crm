import { createPortal } from 'react-dom';
import {
  closestCenter,
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
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
import { User } from '../../services/users-service';

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

const posts = [
  {
    id: 0,
    title: 'Post 1',
    content: 'lorem ipsum dolor sit amet',
    status: 'draft',
    index: 0,
  },
  {
    id: 1,
    title: 'Post 2',
    content: 'consectetur adipiscing elit',
    status: 'to_review',
    index: 0,
  },
  {
    id: 2,
    title: 'Post 3',
    content:
      'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    status: 'published',
    index: 0,
  },
  {
    id: 3,
    title: 'Post 4',
    content: 'Ut enim ad minim veniam',
    status: 'to_publish',
    index: 0,
  },
  {
    id: 4,
    title: 'Post 5',
    content:
      'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat',
    status: 'draft',
    index: 1,
  },
  {
    id: 5,
    title: 'Post 6',
    content:
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur',
    status: 'draft',
    index: 2,
  },
  {
    id: 6,
    title: 'Post 7',
    content:
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
    status: 'to_be_fixed',
    index: 0,
  },
  {
    id: 7,
    title: 'Post 8',
    content: 'Sed ut perspiciatis unde',
    status: 'published',
    index: 1,
  },
  {
    id: 8,
    title: 'Post 9',
    content:
      'iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam',
    status: 'published',
    index: 2,
  },
  {
    id: 9,
    title: 'Post 10',
    content:
      'eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo',
    status: 'to_review',
    index: 1,
  },
  {
    id: 10,
    title: 'Post 11',
    content:
      'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit',
    status: 'to_publish',
    index: 1,
  },
  {
    id: 11,
    title: 'Post 12',
    content:
      'sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt',
    status: 'to_review',
    index: 2,
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

  type Subtask = {
    content: string;
    done: boolean;
  };

  interface Post {
    _id?: string;
    searchID: number;
    title: string;
    client: string;
    clientPerson: string;
    status: string;
    index: number;
    author: Omit<User, 'password'>;
    taskType: string;
    participants: Omit<User, 'password'>[];
    description: string;
    subtasks: Subtask[];
    deadline: string;
    startDate: Date;
  }

  const statuses: Post['status'][] = [
    'na_później',
    'do_zrobienia',
    'w_trakcie',
    'wysłane',
  ];

  const statusNames: Record<Post['status'], string> = {
    na_później: 'Na później',
    do_zrobienia: 'Do zrobienia',
    w_trakcie: 'W trakcie',
    wysłane: 'Wysłane',
  };

  type PostsByStatus = Record<Post['status'], Post[]>;

  const getPostsByStatus = (unorderedPosts: Post[]) => {
    console.log(unorderedPosts);
    if (unorderedPosts.length > 0) {
      const postsByStatus: PostsByStatus = unorderedPosts.reduce(
        (acc, post) => {
          // acc[post.status].push(post);
          // return acc;
          console.log(acc, post);
        }
        // statuses.reduce(
        //   (obj, status) => ({ ...obj, [status]: [] }),
        //   {} as PostsByStatus
        // )
      );
      // order each column by index
      // statuses.forEach((status) => {
      //   postsByStatus[status] = postsByStatus[status].sort(
      //     (recordA: Post, recordB: Post) => recordA.index - recordB.index
      //   );
      // });
      // return postsByStatus;
    }
  };

  // console.log(studioTasks);

  // getPostsByStatus(studioTasks);

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

  const debouncedUpdateTaskStatus = useCallback(
    debounce(async (id, status) => {
      try {
        console.log(`Updating task ${id} with status:`, status);
        await UpdateStudioTask({
          id,
          studioTaskData: status,
        });
        console.log(`Task ${id} updated successfully`);
      } catch (error) {
        console.error(`Failed to update task ${id}:`, error);
      }
    }, 300),
    []
  );

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
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Find the active and over tasks
    const activeTaskIndex = studioTasks.findIndex(
      (task) => task._id === activeId
    );
    const activeTaskN = studioTasks[activeTaskIndex];
    const overTaskIndex = studioTasks.findIndex((task) => task._id === overId);
    const overTask = studioTasks[overTaskIndex];

    const updatedTasks = [...studioTasks];

    // Check if the task is dropped on a column or another task
    if (over.data.current?.type === 'Column') {
      // Dropped into a column, append to the end of the column
      const targetColumn = over.data.current.col;
      const targetTasks = studioTasks.filter(
        (task) => task.status === targetColumn.title
      );

      // Remove from original position
      updatedTasks.splice(activeTaskIndex, 1);

      // Update task's status
      activeTaskN.status = targetColumn.title;

      // Add to the end of the target column
      const newIndex =
        studioTasks.indexOf(targetTasks[targetTasks.length - 1]) + 1 ||
        updatedTasks.length;
      updatedTasks.splice(newIndex, 0, activeTaskN);
    } else if (over.data.current?.type === 'Task') {
      // Dropped onto another task
      const sameColumn = activeTaskN.status === overTask.status;

      if (sameColumn) {
        // Handle intra-column reordering
        const reorderedTasks = arrayMove(
          updatedTasks,
          activeTaskIndex,
          overTaskIndex
        );
        dispatch({
          type: 'SET_STUDIOTASKS',
          payload: reorderedTasks,
        });
        return;
      }

      // Inter-column movement
      const targetColumn = overTask.status;

      // Remove from original position
      updatedTasks.splice(activeTaskIndex, 1);

      // Update task's status
      activeTaskN.status = targetColumn;

      // Insert above the hovered task
      const insertionIndex = overTaskIndex;
      updatedTasks.splice(insertionIndex, 0, activeTaskN);
    }

    // Update state with reordered tasks
    dispatch({
      type: 'SET_STUDIOTASKS',
      payload: updatedTasks,
    });

    // Persist the changes
    debouncedUpdateTaskStatus(activeId, { status: activeTaskN.status });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isOverAColumn) {
      const overColumn = over.data.current.col;
      console.log(`Task is over column: ${overColumn.title}`);
    } else {
      const isOverTask = over.data.current?.type === 'Task';
      if (isOverTask) {
        console.log(`Task is over task ID: ${overId}`);
      }
    }
  }

  return (
    <div className={styles.kanbanView}>
      <DndContext
        sensors={sensors}
        // collisionDetection={closestCorners} // Updated for better accuracy
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
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
