import './index.css';
import { Outlet, useLocation } from 'react-router-dom';
import GlobalTerminalHost from './features/terminal/GlobalTerminalHost';
import AppShell from './features/shared/components/sidebar/AppShell';

export default function App() {
  const location = useLocation();
  const isLoginRoute = location.pathname === '/login';

  return (
    <div className="min-h-screen">
      <GlobalTerminalHost />
      {isLoginRoute ? (
        <Outlet />
      ) : (
        <AppShell>
          <Outlet />
        </AppShell>
      )}
    </div>
  );
}
