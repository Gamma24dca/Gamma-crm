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

    // case 'UPDATE_RECKOTASK':
    //   return {};

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
