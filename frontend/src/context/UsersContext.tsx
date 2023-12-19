import { createContext, useMemo, useReducer } from 'react';

export const UsersContext = createContext([]);

export const usersReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USERS':
      return {
        users: action.payload,
      };

    case 'CREATE_USER':
      return {
        users: [action.payload, ...state.users],
      };

    case 'DELETE_USER':
      return {
        users: state.users.filter((w) => {
          return w._id !== action.payload._id;
        }),
      };

    default:
      return state;
  }
};

export function UsersContextProvider({ children }) {
  const [state, dispatch] = useReducer(usersReducer, {
    users: [],
  });

  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
}
