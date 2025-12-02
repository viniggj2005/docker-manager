import './index.css';
import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppFrame } from './features/appFrame/appFrame';
import { WindowIsFullscreen } from '../wailsjs/runtime/runtime';
import AppShell from './features/shared/components/sidebar/AppShell';
import GlobalTerminalHost from './features/terminal/GlobalTerminalHost';

const authRoutes = ['/login', '/create-account'];

export default function App() {
  const location = useLocation();
  const isAuthRoute = authRoutes.includes(location.pathname);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = async () => {
      const fs = await WindowIsFullscreen();
      setIsFullscreen(fs);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden">
      {!isFullscreen && <AppFrame />}

      <GlobalTerminalHost />

      <div className="flex-1 min-h-0">
        {isAuthRoute ? (
          <Outlet />
        ) : (
          <AppShell>
            <Outlet />
          </AppShell>
        )}
      </div>
    </div>
  );
}
