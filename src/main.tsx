import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'store'
import { LanguageProvider } from 'i18n'
import App from 'pages/App'
import '@reach/dialog/styles.css'
import RouteLoading from 'pages/components/RouteLoading'
import { AppKitProvider } from 'components/AppKitProvider'
import { isLocalEnv, isTestEnv } from 'utils/url'
import DevInspector from 'components/DevInspector'
import './index.scss'

if (isTestEnv || isLocalEnv) {
  import('eruda').then((eruda) => eruda.default.init())
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageProvider>
          <BrowserRouter>
            <AppKitProvider>
              <Suspense fallback={<RouteLoading />}>
                <App />
                {isLocalEnv && <DevInspector />}
              </Suspense>
            </AppKitProvider>
          </BrowserRouter>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
