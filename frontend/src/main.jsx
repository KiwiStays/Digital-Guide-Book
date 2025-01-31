import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AuthProvider from './Context/Authcontext.jsx'
import { AdminProvider } from './Context/AdminContext.jsx'
import axios from 'axios'
// axios.defaults.baseURL = 'http://localhost:3000';
// console.log(import.meta.env.VITE_BACKEND_URL);
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <AdminProvider>
            <App />
      </AdminProvider>
    </AuthProvider>
  </StrictMode>,
)
