import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './index.css';
import UserProvider from './providers/UserProvider';
import App from './pages/App/App';
import { UsersContextProvider } from './context/UsersContext';
import TasksContextProvder from './context/TasksContext';
import { CompaniesContextProvider } from './context/CompaniesContext';
import { StudioTasksContextProvider } from './context/StudioTasksContext';
import { ReckoTasksContextProvider } from './context/ReckoTasksContext';
import { ClientsContextProvider } from './context/ClientsContext';

// If you want deploy site to static cdn, use Hashrouter instead

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ClientsContextProvider>
            <ReckoTasksContextProvider>
              <StudioTasksContextProvider>
                <CompaniesContextProvider>
                  <TasksContextProvder>
                    <UsersContextProvider>
                      <App />
                    </UsersContextProvider>
                  </TasksContextProvder>
                </CompaniesContextProvider>
              </StudioTasksContextProvider>
            </ReckoTasksContextProvider>
          </ClientsContextProvider>
        </UserProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
