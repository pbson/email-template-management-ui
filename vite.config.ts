import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    // mkcert()
  ],
});
