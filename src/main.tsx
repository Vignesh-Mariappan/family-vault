import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { FamilyProvider } from './context/FamilyContext.tsx'

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
      <FamilyProvider>
        <App />
      </FamilyProvider>
    </BrowserRouter>
)
