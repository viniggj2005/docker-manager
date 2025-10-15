import './index.css';
import ToggleThemeButton from './components/buttons/ToggleThemeButton';
import ContainersListView from './components/containers/ContainersList';
import ListContainersImages from './components/containersImages/ListContainerImages';

function App() {
  return (
    <div className=" bg-[var(--system-white)] dark:bg-[var(--dark-primary)] w-screen h-screen justify-center flex">
      <div className="bg-[var(--system-white)] dark:bg-[var(--dark-primary)] w-screen h-screen justify-center flex">
        <div className="w-fit h-fit bg-transparent">
          <ContainersListView />
          <ListContainersImages />
          <ToggleThemeButton />
        </div>
      </div>
    </div>
  );
}

export default App;
