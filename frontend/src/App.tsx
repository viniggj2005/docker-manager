import './index.css';
import ContainersListView from './components/containers/ContainersList';

function App() {
  return (
    <div className=" bg-[var(--system-white)] w-screen h-screen justify-center flex">
      <div className="bg-[#0082a8] bg-opacity-20 w-screen h-screen justify-center flex">
        <div className="w-fit h-fit bg-transparent">
          <ContainersListView />
        </div>
      </div>
    </div>
  );
}

export default App;
