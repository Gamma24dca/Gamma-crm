import useAuth from '../../hooks/useAuth';

function HomePage() {
  const { signOut } = useAuth();
  return (
    <div>
      <h1>Home Page</h1>
      <button type="button" onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}

export default HomePage;
