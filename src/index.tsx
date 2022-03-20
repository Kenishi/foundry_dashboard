import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import { createTheme, ThemeProvider } from '@mui/material';

const queryClient= new QueryClient();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={darkTheme}>
        <App />
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
