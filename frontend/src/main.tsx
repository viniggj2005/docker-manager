import './index.css'
import App from './App'
import React from 'react'
import {createRoot} from 'react-dom/client'
import 'izitoast/dist/css/iziToast.min.css';
const container = document.getElementById('root')

const root = createRoot(container!)

root.render(
    // <React.StrictMode>
        <App/>
    // </React.StrictMode>
)
