import React, { Suspense } from 'react'
import eruda from 'eruda'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from 'store'
import { LanguageProvider } from 'i18n'
import App from 'pages/App'
import '@reach/dialog/styles.css'
import RouteLoading from 'components/RouteLoading'
import { isLocalEnv, isTestEnv } from 'utils/url'
import { AppKitProvider } from 'components/AppKitProvider'
import './index.scss'

if (isTestEnv || isLocalEnv) {
  if (window.location.search.includes('eruda')) {
    eruda.init()
  }
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
              </Suspense>
            </AppKitProvider>
          </BrowserRouter>
        </LanguageProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
