import './index.css';
import { router } from './Router';
import 'izitoast/dist/css/iziToast.min.css';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './hooks/use-theme';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  // <React.StrictMode>
  <AuthProvider>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </AuthProvider>
  // </React.StrictMode>
);
