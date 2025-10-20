import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import SshTerminal from '../features/terminal/Terminal';
import { myInfo } from '../features/login/services/Auth';
import ContainersListView from '../features/containers/ContainersList';
import ListContainersImages from '../features/containersImages/ListContainerImages';
import ToggleThemeButton from '../features/shared/components/buttons/ToggleThemeButton';

const HomePage: React.FC = () => {
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const me = await myInfo(token);
      } catch (e) {
        await logout();
      }
    })();
  }, [token, logout]);

  return (
    <div className=" bg-[var(--system-white)] dark:bg-[var(--dark-primary)] w-screen h-screen justify-center flex">
      <div className="bg-[var(--system-white)] dark:bg-[var(--dark-primary)] w-screen h-screen justify-center flex">
        <div className="w-fit h-fit bg-transparent">
          <ContainersListView />
          <ListContainersImages />
          <SshTerminal />
        </div>
      </div>
      <div className="absolute bottom-4 left-3">
        <ToggleThemeButton />
      </div>
    </div>
  );
};
export default HomePage;
