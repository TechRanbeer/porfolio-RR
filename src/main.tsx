import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import ChatPage from './pages/ChatPage.tsx';
import ProjectDetailPage from './pages/ProjectDetailPage.tsx';
import FormspreeAdminPage from './pages/FormspreeAdminPage.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/admin" element={<FormspreeAdminPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
