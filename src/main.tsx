import React, { Suspense } from 'react';
import VConsole from 'vconsole'
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'store';
import { LanguageProvider } from 'i18n';
import App from 'pages/App';
import '@reach/dialog/styles.css';
import RouteLoading from 'components/RouteLoading';
import './index.scss';
import { isTestEnv } from 'utils/url';
import { isMobile } from 'utils/userAgent';

if (isTestEnv && isMobile) {
  new VConsole();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <BrowserRouter>
            <Suspense fallback={<RouteLoading />}>
              <App />
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
