import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../components/Organisms/SignIn/SignIn';
import HomePage from '../HomePage/HomePage';
import MainTemplate from '../../components/Templates/MainTemplate/MainTemplate';
import useAuth from '../../hooks/useAuth';
import UsersView from '../UsersView/UsersView';
import UserProfile from '../UserProfile/UserProfile';
import TasksView from '../TasksView/TasksView';

function App() {
  const { user } = useAuth();

  return user ? (
    <MainTemplate>
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/signin" element={<Navigate to="/pulpit" />} />
        <Route path="/" element={<Navigate to="/pulpit" />} />
        <Route path="/pulpit" element={<HomePage />} />
        <Route path="/użytkownicy" element={<UsersView />} />
        <Route path="/użytkownicy/:id" element={<UserProfile />} />
        <Route path="/zlecenia" element={<TasksView />} />
      </Routes>
    </MainTemplate>
  ) : (
    <Routes>
      <Route path="/" element={<Navigate to="/signin" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}

export default App;
