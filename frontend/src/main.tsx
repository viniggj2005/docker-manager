import './index.css';
import App from './App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import 'izitoast/dist/css/iziToast.min.css';
import { ThemeProvider } from './hooks/use-theme';
const container = document.getElementById('root');

const root = createRoot(container!);

root.render(
  // <React.StrictMode>
  <ThemeProvider>
    <App />
  </ThemeProvider>
  // </React.StrictMode>
);
