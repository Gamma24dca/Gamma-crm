import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, getCurrentUser } from '../services/users-service';
import { signIn, signOut, signUp } from '../services/auth-service';

export type UserContextValue = {
  user: undefined | null | User;
  signOut: typeof signOut;
  signIn: typeof signIn;
  signUp: typeof signUp;
};

export const UserContext = React.createContext<UserContextValue>({
  user: undefined,
  signIn: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: () => Promise.resolve(),
});

type ChildrenProps = {
  children: string | JSX.Element | JSX.Element[];
};

function UserProvider({ children }: ChildrenProps) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserContextValue['user']>();
  const contextValue = useMemo<UserContextValue>(
    () => ({
      user: currentUser,
      signIn: async (data) => {
        await signIn(data);
        setCurrentUser(await getCurrentUser());
        navigate('/', { replace: true });
      },
      signOut: async () => {
        await signOut();
        setCurrentUser(null);
        navigate('/signin', { replace: true });
      },
      signUp: async (data) => {
        await signUp(data);
        navigate('/signin', { replace: true });
      },
    }),
    [currentUser, navigate]
  );

  useEffect(() => {
    getCurrentUser()
      .then((data) => setCurrentUser(data))
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  if (currentUser === undefined) {
    return (
      <div>
        <p>...loading</p>
      </div>
    );
  }

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export default UserProvider;
