import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DatabaseProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </DatabaseProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
