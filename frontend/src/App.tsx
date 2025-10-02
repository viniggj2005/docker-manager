import {useState} from 'react';
import logo from './assets/images/logo-universal.png';
import './App.css';
import {ContainersList} from "../wailsjs/go/docker/Docker";

function App() {
    const [resultText, setResultText] = useState("Please enter your name below 👇");
    const [name, setName] = useState<string>();

    function greet() {
    ContainersList().then((resp: string[]) => {
        setName(resp[0])               // guarda primeiro container
        setResultText(resp[0] ?? "")   // mostra também no resultText
    })
}

    

    return (
        <div id="App">
            <img src={logo} id="logo" alt="logo"/>
            <div id="result" className="result">{resultText}</div>
            <div id="input" className="input-box">
                <div id="result" className="result">{resultText}</div>
<div>
    {name && <p>Container: {name}</p>}
</div>
                <button className="btn" onClick={greet}>Greet</button>
            </div>
        </div>
    )
}

export default App
