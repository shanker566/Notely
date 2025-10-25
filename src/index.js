import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // <-- Make sure this is imported
import App from './App';
import './index.css';
import { Analytics } from '@vercel/analytics/react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Make sure this wrapper is here */}
      <App />
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>
);