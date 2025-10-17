import './index.css';

import { Outlet } from 'react-router-dom';

export default function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Outlet />
    </div>
  );
}
