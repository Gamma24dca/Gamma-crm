import { createContext, useMemo, useReducer } from 'react';

export const CompaniesContext = createContext([]);

export const companiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_COMPANIES':
      return { companies: action.payload };
    case 'CREATE_COMPANY':
      return { companies: [action.payload, ...state.companies] };
    case 'DELETE_COMPANY':
      return {
        companies: state.companies.filter(
          (company) => company._id !== action.payload.id
        ),
      };

    default:
      return state;
  }
};

export function CompaniesContextProvider({ children }) {
  const [state, dispatch] = useReducer(companiesReducer, {
    companies: [],
  });
  const contextValue = useMemo(
    () => ({ ...state, dispatch }),
    [state, dispatch]
  );

  return (
    <CompaniesContext.Provider value={contextValue}>
      {children}
    </CompaniesContext.Provider>
  );
}
