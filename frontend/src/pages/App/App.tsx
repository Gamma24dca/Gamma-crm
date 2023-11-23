import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../components/Organisms/SignIn/SignIn';

import NotFound from '../NotFound/NotFound';
import HomePage from '../HomePage/HomePage';
import PrivateRouteProvider from '../../providers/PrivateRouteProvider';
import MainTemplate from '../../components/Templates/MainTemplate/MainTemplate';
import useAuth from '../../hooks/useAuth';
import UsersView from '../UsersView/UsersView';

function App() {
  const { user } = useAuth();

  return user ? (
    <MainTemplate>
      <Routes>
        <Route path="/" element={<Navigate to="/pulpit" />} />
        <Route
          path="/pulpit"
          element={
            <PrivateRouteProvider>
              <HomePage />
            </PrivateRouteProvider>
          }
        />
        <Route
          path="/użytkownicy"
          element={
            <PrivateRouteProvider>
              <UsersView />
            </PrivateRouteProvider>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainTemplate>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
