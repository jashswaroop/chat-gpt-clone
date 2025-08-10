import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from '@/components/ui/provider';
import App from './App.tsx';
import AuthPage from './pages/AuthPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/chat" element={<App />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </Provider>
  </StrictMode>
);
