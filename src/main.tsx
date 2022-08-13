import React from 'react'

import { App } from 'app'
import ReactDOM from 'react-dom/client'

import { RootStoreProvider } from 'stores/root-store/context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RootStoreProvider>
    <App />
  </RootStoreProvider>,
)
