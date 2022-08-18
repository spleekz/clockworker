import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'
import tsconfigPaths from 'vite-tsconfig-paths'

/* eslint-disable import/no-default-export */
export default defineConfig({
  plugins: [
    react({
      babel: {
        babelrc: true,
      },
    }),
    checker({
      eslint: {
        lintCommand: 'eslint "src/"',
      },
      typescript: true,
      overlay: false,
    }),
    tsconfigPaths(),
  ],
  server: {
    host: true,
    port: 3000,
  },
})
