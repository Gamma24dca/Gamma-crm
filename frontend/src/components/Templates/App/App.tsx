import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../Organisms/SignIn/SignIn';
import NotFound from '../NotFound/NotFound';
import HomePage from '../../../pages/HomePage/HomePage';
import PrivateRouteProvider from '../../../providers/PrivateRouteProvider';
import MainTemplate from '../MainTemplate/MainTemplate';
import useAuth from '../../../hooks/useAuth';

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
              <div>
                <HomePage />
              </div>
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
