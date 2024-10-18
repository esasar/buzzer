import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { SocketProvider } from './context/SocketContext.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Host from './pages/Host.tsx';
import Join from './pages/Join.tsx';
import NotFound from './pages/NotFound.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SocketProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/host' element={<Host />} />
          <Route path='/join' element={<Join />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </SocketProvider>
    </BrowserRouter>
  </StrictMode>,
)
