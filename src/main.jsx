import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Context from './context/Context.jsx'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')).render(
  
  <Context>
    <BrowserRouter>
      <App />
      <Toaster/>
    </BrowserRouter>
  </Context>
  
)
