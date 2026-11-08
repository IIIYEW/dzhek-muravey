import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

export default defineConfig(({ mode }) => ({
  base: mode === 'pages' ? '/dzhek-muravey/' : '/',
  plugins: [tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@shared': fileURLToPath(new URL('../shared', import.meta.url)),
    },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:4000',
      '/robots.txt': 'http://127.0.0.1:4000',
      '/sitemap.xml': 'http://127.0.0.1:4000',
    },
  },
}));
