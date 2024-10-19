import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AppProvider } from './context/AppContext.tsx';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import Host from './pages/Host.tsx';
import Join from './pages/Join.tsx';
import Play from './pages/Play.tsx';
import NotFound from './pages/NotFound.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/host' element={<Host />} />
          <Route path='/join' element={<Join />} />
          <Route path='/play' element={<Play />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
