// eslint-disable-next-line
import { Config } from '../config';
import { User } from './users-service';

export async function signUp({
  name,
  lastname,
  email,
  phone,
  password,
  job,
  img,
}: User): Promise<void> {
  const formInfo = {
    name,
    lastname,
    email,
    phone,
    password,
    job,
    img,
  };

  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formInfo),
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

type SignInProps = {
  email: string;
  password: string;
  grantType?: 'cookie' | 'token';
};

export async function signIn({ email, password }: SignInProps): Promise<void> {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      grantType: 'cookie',
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}

export async function signOut(): Promise<void> {
  const response = await fetch('/api/auth/signout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
}
