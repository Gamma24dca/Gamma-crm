import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../../components/Organisms/SignIn/SignIn';
import HomePage from '../HomePage/HomePage';
import MainTemplate from '../../components/Templates/MainTemplate/MainTemplate';
import useAuth from '../../hooks/useAuth';
import UsersView from '../UsersView/UsersView';
import UserProfile from '../UserProfile/UserProfile';
// import TasksView from '../TasksView/TasksView';
import TaskProfile from '../TaskProfile/TaskProfile';
import CompaniesView from '../CompaniesView/CompaniesView';
import CompanyProfile from '../CompanyProfile/CompanyProfile';
import StudioTaskView from '../StudioTaskView/StudioTaskView';
import TasksView from '../TasksView/TasksView';
import ReckoningView from '../ReckoningView/ReckoningView';
import Dashboard from '../Dashboard/Dashboard';
import ClientsView from '../ClientsView/ClientsView';
import ClientProfile from '../ClientProfile/ClientProfile';

function App() {
  const { user } = useAuth();

  return user ? (
    <MainTemplate>
      <Routes>
        <Route path="*" element={<HomePage />} />
        <Route path="/signin" element={<Navigate to="/pulpit" />} />
        <Route path="/" element={<Navigate to="/pulpit" />} />
        <Route path="/pulpit" element={<Dashboard />} />
        <Route path="/użytkownicy" element={<UsersView />} />
        <Route path="/użytkownicy/:id" element={<UserProfile />} />
        <Route path="/zlecenia" element={<StudioTaskView />} />
        <Route path="/zlecenia/:id" element={<TaskProfile />} />
        <Route path="/rozliczenie" element={<ReckoningView />} />
        <Route path="/firmy" element={<CompaniesView />} />
        <Route path="/firmy/:id" element={<CompanyProfile />} />
        <Route path="/klienci" element={<ClientsView />} />
        <Route path="/klienci/:id" element={<ClientProfile />} />
        <Route path="/magazyn" element={<TasksView />} />
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
