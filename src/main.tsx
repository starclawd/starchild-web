import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from 'store';
import { LanguageProvider } from 'i18n';
import App from 'pages/App';
import '@reach/dialog/styles.css';
import './index.scss';
import RouteLoading from 'components/RouteLoading';
import WebsocketUpdater from 'store/websocket/updater';

function Updaters() {
  return (
    <>
      <WebsocketUpdater />
    </>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <BrowserRouter>
            <Updaters />
            <Suspense fallback={<RouteLoading />}>
              <App />
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
);
