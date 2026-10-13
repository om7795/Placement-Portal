import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes.jsx';
import Toast from './components/Toast.jsx';
import { fetchMe, logout } from './features/authSlice.js';

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  // Rehydrate the session on load if a token exists
  useEffect(() => {
    if (token) dispatch(fetchMe());
  }, [dispatch, token]);

  // Log out automatically when the API reports an expired/invalid token
  useEffect(() => {
    const handler = () => dispatch(logout());
    window.addEventListener('auth:unauthorized', handler);
    return () => window.removeEventListener('auth:unauthorized', handler);
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toast />
    </>
  );
}
