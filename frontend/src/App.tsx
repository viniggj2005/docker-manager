import './index.css';
import { Outlet, useLocation } from 'react-router-dom';
import GlobalTerminalHost from './features/terminal/GlobalTerminalHost';
import AppShell from './features/shared/components/sidebar/AppShell';

const authRoutes = ['/login', '/create-account'];

export default function App() {
  const location = useLocation();
  const isAuthRoute = authRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen">
      <GlobalTerminalHost />
      {isAuthRoute ? (
        <Outlet />
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
    </div>
  );
}
