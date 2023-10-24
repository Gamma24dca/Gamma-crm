import { Routes, Route } from 'react-router-dom';
import SignIn from '../../Organisms/SignIn/SignIn';
import NotFound from '../NotFound/NotFound';
import HomePage from '../../../pages/HomePage/HomePage';
import PrivateRouteProvider from '../../../providers/PrivateRouteProvider';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRouteProvider>
            <div>
              <HomePage />
            </div>
          </PrivateRouteProvider>
        }
      />
      <Route path="/signin" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
