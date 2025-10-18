import React, { useEffect } from 'react';
import { myInfo } from '../components/login/Auth';
import { useAuth } from '../contexts/AuthContext';
import SshTerminal from '../components/terminal/Terminal';
import ToggleThemeButton from '../components/buttons/ToggleThemeButton';
import ContainersListView from '../components/containers/ContainersList';
import ListContainersImages from '../components/containersImages/ListContainerImages';

const HomePage: React.FC = () => {
  const { token, logout } = useAuth();

  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const me = await myInfo(token);
        console.log('me', me);
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
          <ToggleThemeButton />
          <SshTerminal />
        </div>
      </div>
    </div>
  );
};
export default HomePage;
