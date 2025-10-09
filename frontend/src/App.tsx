import './index.css';
import ContainersListView from './components/containers/ContainersList';
import ListContainersImages from './components/containersImages/ListContainerImages';

function App() {
  return (
    <div className=" bg-[var(--system-white)] w-screen h-screen justify-center flex">
      <div className="bg-white  w-screen h-screen justify-center flex">
        <div className="w-fit h-fit bg-transparent">
          <ContainersListView />
          <ListContainersImages />
        </div>
      </div>
    </div>
  );
}

export default App;
