import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'  // Add this import
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>  {/* ← THIS is the wrapper */}
      <App />
    </HelmetProvider>
  </React.StrictMode>,
)