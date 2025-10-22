import './index.css';
import { Outlet } from 'react-router-dom';
import GlobalTerminalHost from './features/terminal/GlobalTerminalHost';

export default function App() {
  return (
    <div className="min-h-screen">
      <GlobalTerminalHost />
      <Outlet />
    </div>
  );
}
