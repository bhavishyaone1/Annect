/**
 * Annect Application Entry Bootloader
 * 
 * Mounts the root React App component inside the HTML DOM
 * and activates React StrictMode for developer warning triggers.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
