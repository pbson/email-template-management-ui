import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';
import QueryProvider from './provider/query-provider.tsx';
import LayoutConfigProvider from './provider/theme-config-provider.tsx';
import Routes from './routes/index.tsx';
import { ToasterConfig } from '@/components';

const App = () => {
  useEffect(() => {
    const extensionId = 'aohajaelhipbamnilfnehkcpecpeacmd';

    const jwt = localStorage.getItem('jwt');

    function sendJwtToBackground(jwt: string) {
      chrome?.runtime?.sendMessage(
        extensionId,
        { type: 'SET_JWT', token: jwt },
        (response) => {
          console.log('Response from background:', response);
          console.log('chrome.runtime.lastError:', chrome.runtime.lastError);
          if (chrome.runtime.lastError) {
            setTimeout(() => sendJwtToBackground(jwt), 1000);
          } else {
            console.log('Response from background:', response);
          }
        },
      );
    }
    
    if (jwt) {
      sendJwtToBackground(jwt);
    }
  }, []);

  return (
    <React.StrictMode>
      <LayoutConfigProvider>
        <QueryProvider>
          <ToasterConfig />
          <Routes />
        </QueryProvider>
      </LayoutConfigProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
