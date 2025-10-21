import React from 'react';
import { useNavigate } from 'react-router-dom';
import ContainersListView from '../features/containers/ContainersList';
import ListContainersImages from '../features/containersImages/ListContainerImages';
import ToggleThemeButton from '../features/shared/components/buttons/ToggleThemeButton';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className=" bg-[var(--system-white)] dark:bg-[var(--dark-primary)] w-screen h-screen justify-center flex">
      <div className="bg-[var(--system-white)] dark:bg-[var(--dark-primary)] w-screen h-screen justify-center flex">
        <div className="w-fit h-fit bg-transparent">
          <ContainersListView />
          <ListContainersImages />

          <button onClick={() => navigate('/createConnectionForm')}>Criar nova conexão SSH</button>
        </div>
      </div>
      <div className="absolute bottom-4 left-3">
        <ToggleThemeButton />
      </div>
    </div>
  );
};
export default HomePage;
