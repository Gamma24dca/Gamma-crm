import React, { createContext, ReactNode, useMemo, useReducer } from 'react';
import { ReckoningTaskTypes } from '../services/reckoning-view-service';

type ReckoTasksStateType = {
  reckoTasks: ReckoningTaskTypes[];
};

type ReckoTaskContextType = ReckoTasksStateType & {
  dispatch: React.Dispatch<any>;
};

export const ReckoTasksContext = createContext<
  ReckoTaskContextType | undefined
>(undefined);

export const reckoTasksReducer = (state: ReckoTasksStateType, action: any) => {
  switch (action.type) {
    case 'SET_RECKOTASKS':
      return { reckoTasks: action.payload };
    case 'CREATE_RECKOTASK':
      return { reckoTasks: [...state.reckoTasks, action.payload] };
    case 'DELETE_RECKOTASK':
      return {
        reckoTasks: state.reckoTasks.filter((reckTask) => {
          return reckTask._id !== action.payload._id;
        }),
      };
    case 'UPDATE_RECKOTASK':
      return {
        reckoTasks: state.reckoTasks.map((rt) => {
          return rt._id === action.payload._id ? action.payload : rt;
        }),
      };

    case 'UPDATE_HOUR_NUM': {
      const { taskId, userId, dayId, newValue, selectedMonthIndex } =
        action.payload;

      return {
        reckoTasks: state.reckoTasks.map((task) => {
          if (task._id !== taskId) return task;

          const updatedParticipants = task.participants.map((participant) => {
            if (participant._id !== userId) return participant;

            const filteredHours = participant.months.filter((obj) => {
              const monthIndex = new Date(obj.createdAt).getUTCMonth() + 1;
              return monthIndex === selectedMonthIndex;
            });

            const updatedHours = filteredHours[0].hours.map((hour) => {
              return hour._id === dayId
                ? { ...hour, hourNum: Number(newValue) }
                : hour;
            });

            const updatedMonths = participant.months.map((month) => {
              const monthIndex = new Date(month.createdAt).getUTCMonth() + 1;

              return monthIndex === selectedMonthIndex
                ? { ...month, hours: updatedHours }
                : month;
            });

            return { ...participant, months: updatedMonths };
          });
          // console.log({ ...task, participants: updatedParticipants });

          return { ...task, participants: updatedParticipants };
        }),
      };
    }

    // case 'CLEAR_HOURS': {
    //   const { taskId, userId } = action.payload;
    //   return {
    //     reckoTasks: state.reckoTasks.map((task) => {
    //       if (task._id !== taskId) return task;

    //       const updatedParticipants = task.participants.map((participant) => {
    //         if (participant._id !== userId) return participant;

    //         const clearedHours = participant.hours.map((hour) => {
    //           return hour.hourNum === 0 ? hour : { ...hour, hourNum: 0 };
    //         });

    //         return { ...participant, hours: clearedHours };
    //       });

    //       return { ...task, participants: updatedParticipants };
    //     }),
    //   };
    // }

    default:
      return state;
  }
};

export function ReckoTasksContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reckoTasksReducer, {
    reckoTasks: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <ReckoTasksContext.Provider value={contextValue}>
      {children}
    </ReckoTasksContext.Provider>
  );
}
