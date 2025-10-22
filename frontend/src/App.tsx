import './index.css';
import { Outlet } from 'react-router-dom';
import GlobalTerminalHost from './features/terminal/GlobalTerminalHost';
import AppShell from './features/shared/components/layout/AppShell';

export default function App() {
  return (
    <div className="min-h-screen">
      <GlobalTerminalHost />
      <AppShell>
        <Outlet />
      </AppShell>
    </div>
  );
}
