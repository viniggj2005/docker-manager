import './index.css';
import { router } from './Router';
import 'izitoast/dist/css/iziToast.min.css';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './hooks/use-theme';
import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DockerClientProvider } from './contexts/DockerClientContext';
import { WindowFullscreen,WindowIsFullscreen,WindowUnfullscreen,WindowReload,WindowReloadApp } from "../wailsjs/runtime/runtime";

const container = document.getElementById('root');
document.addEventListener('keydown', async(e) => {
    if (e.key === "Escape") {
        WindowUnfullscreen();
    }else if (e.key==="F11"){
      const isFullscreen= await WindowIsFullscreen()
      if(isFullscreen){
        WindowUnfullscreen();
      }else{
        WindowFullscreen()
      }
    }else if(e.key==="F5"){
      WindowReload()
    }else if (e.shiftKey && e.key === "F5" ){
      WindowReloadApp()
    }
});
console.log(WindowIsFullscreen())
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
