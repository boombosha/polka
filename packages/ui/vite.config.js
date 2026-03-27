import vue from '@vitejs/plugin-vue';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const rootPkg = JSON.parse(readFileSync(resolve(__dirname, '../../package.json'), 'utf8'));

export default defineConfig({
  plugins: [vue()],
  define: {
    __POLKA_VERSION__: JSON.stringify(rootPkg.version),
  },
  server: {
    port: 5173,
    proxy: {
      '/wxh': 'http://localhost:4700',
      '/docs': 'http://localhost:4700',
      '/openapi.json': 'http://localhost:4700',
      '/health': 'http://localhost:4700',
    },
  },
  build: {
    outDir: resolve(__dirname, '../../apps/server/public'),
    emptyOutDir: true,
  },
});
