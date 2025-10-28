import './index.css';
import { router } from './Router';
import 'izitoast/dist/css/iziToast.min.css';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './hooks/use-theme';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DockerClientProvider } from './contexts/DockerClientContext';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  // <React.StrictMode>
  <AuthProvider>
    <DockerClientProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </DockerClientProvider>
  </AuthProvider>
  // </React.StrictMode>
);
