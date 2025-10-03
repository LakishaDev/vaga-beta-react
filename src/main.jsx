import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Prodavnica from './Prodavnica.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <Prodavnica /> */}
  </StrictMode>,
)
