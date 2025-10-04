import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {ContainersList} from "../wailsjs/go/docker/Docker";

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState<string>();

    function greet() {
    ContainersList().then((resp: any) => {
        console.log(resp)
    })
}

    

    return (
        <div className='bg-white w-screen h-screen justify-center flex'>
            
                <button className="bg-red-500 rounded" onClick={greet}>Greet</button>
            </div>

    )
}

export default App
