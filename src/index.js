import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import MainMap from './components/MainMap';
import NoPage from './components/NoPage';
import Protected from './components/Protected';
import { initKeycloak } from './services/keycloackService';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
const root = ReactDOM.createRoot(document.getElementById('root'));
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});
const App = () => {
  const [keycloakInitialized, setKeycloakInitialized] = useState(false);

  useEffect(() => {
    initKeycloak(() => {
      setKeycloakInitialized(true);
    });
  }, []);

  if (!keycloakInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<MainMap />} />
          <Route path="*" element={<NoPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

root.render(<App />);
