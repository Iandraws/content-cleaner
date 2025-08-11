import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import AppInitializer from './components/AppInitializer';

const theme = createTheme();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppInitializer>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AppInitializer>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
