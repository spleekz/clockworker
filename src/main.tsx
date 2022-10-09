import React from 'react'

import { App } from 'app'
import ReactDOM from 'react-dom/client'

import { RootStoreProvider } from 'stores/root-store/context'

//Явное добавление иконки игры в папку сборки
new URL('../icons/clockworker-icon.ico', import.meta.url)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <RootStoreProvider>
    <App />
  </RootStoreProvider>,
)
