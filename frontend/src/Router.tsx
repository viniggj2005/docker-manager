import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TerminalFormPage from './pages/TerminalFormPage';
import ContainersPage from './pages/ContainersPage';
import ImagesPage from './pages/ImagesPage';
import ProtectedRoute from './ProtectedRoute';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        // index → /home
        { index: true, element: <Navigate to="/home" replace /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: 'home', element: <HomePage /> },
            { path: 'containers', element: <ContainersPage /> },
            { path: 'images', element: <ImagesPage /> },
            { path: 'createConnectionForm', element: <TerminalFormPage /> },
          ],
        },

        { path: 'login', element: <LoginPage /> },
      ],
    },
    // { path: '*', element: <NotFoundPage /> },
  ],
  { basename: '/' }
);
