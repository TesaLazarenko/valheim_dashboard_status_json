// vite.config.js in ESM format according to https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/server-status': {
        target: 'http://192.168.1.109:2080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/server-status/, '/status.json'),
        configure: (proxy, options) => {
          proxy.on('proxyRes', (proxyRes, req, res) => {
            proxyRes.headers['content-type'] = 'application/json';
          });
        }
      },
    },
  },
});
