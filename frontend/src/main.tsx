import React from 'react';
import ReactDOM from 'react-dom/client';
import { WrappedApp } from './components/Templates/App/App';
import './index.css';
import UserProvider from './providers/UserProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <WrappedApp />
    </UserProvider>
  </React.StrictMode>
);
