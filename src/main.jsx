import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { AppProvider } from './Context/AppContext';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
      <AppProvider>
           <App />
      </AppProvider>
   
  </BrowserRouter>
)
