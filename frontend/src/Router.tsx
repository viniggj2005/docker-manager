import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ImagesPage from './pages/ImagesPage';
import ProtectedRoute from './ProtectedRoute';
import ContainersPage from './pages/ContainersPage';
import TerminalFormPage from './pages/TerminalFormPage';
import CreateAccountPage from './pages/CreateAccountPage';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import DockerCredentialsPage from './pages/DockerCredentialsPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        { index: true, element: <Navigate to="/home" replace /> },

        {
          element: <ProtectedRoute />,
          children: [
            { path: 'home', element: <HomePage /> },
            { path: 'images', element: <ImagesPage /> },
            { path: 'containers', element: <ContainersPage /> },
            { path: 'createConnectionForm', element: <TerminalFormPage /> },
            { path: 'docker-credentials', element: <DockerCredentialsPage /> },
          ],
        },

        { path: 'login', element: <LoginPage /> },
        { path: 'create-account', element: <CreateAccountPage /> },
      ],
    },
    // { path: '*', element: <NotFoundPage /> },
  ],
  { basename: '/' }
);
