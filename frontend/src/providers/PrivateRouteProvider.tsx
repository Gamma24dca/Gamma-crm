import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ChildrenProps } from './UserProvider';

function PrivateRouteProvider({ children }: ChildrenProps) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/signin" />;
  }
  return children;
}

export default PrivateRouteProvider;
