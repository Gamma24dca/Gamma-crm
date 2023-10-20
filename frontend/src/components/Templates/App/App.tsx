import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from '../../Organisms/SignIn/SignIn';
import NotFound from '../NotFound/NotFound';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// If you want deploy site to static cdn, use Hashrouter instead
export function WrappedApp() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
