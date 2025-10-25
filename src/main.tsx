import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import UpdateShare from './components/updateshare.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App></App>} />
        <Route path='/update-share' element={<UpdateShare></UpdateShare>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
