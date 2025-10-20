import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import TerminalFormPage from './pages/TerminalFormPage';
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
          children: [{ path: 'home', element: <HomePage /> }],
        },
        {
          element: <ProtectedRoute />,
          children: [{ path: 'createConnectionForm', element: <TerminalFormPage /> }],
        },

        { path: 'login', element: <LoginPage /> },
      ],
    },
    // { path: '*', element: <NotFoundPage /> },
  ],
  { basename: '/' }
);
