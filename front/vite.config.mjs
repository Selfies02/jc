import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import autoprefixer from 'autoprefixer'
import config from './src/config'

const fullBackendUrl = config.getFullBackendUrl()

export default defineConfig(() => {
  return {
    base: '/',
    build: {
      outDir: 'build',
    },
    css: {
      postcss: {
        plugins: [autoprefixer({})],
      },
    },
    esbuild: {
      loader: 'jsx',
      include: /src\/.*\.jsx?$/,
      exclude: [],
    },
    optimizeDeps: {
      force: true,
      esbuildOptions: {
        loader: {
          '.js': 'jsx',
        },
      },
    },
    plugins: [react()],
    resolve: {
      alias: [
        {
          find: 'src/',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
    server: {
      port: 4173,
      proxy: {
        '/api': {
          target: `${fullBackendUrl}`,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
          configure: (proxy, _options) => {
            proxy.on('error', (err, _req, _res) => {})
            proxy.on('proxyReq', (proxyReq, req, _res) => {})
            proxy.on('proxyRes', (proxyRes, req, _res) => {})
          },
        },
      },
      cors: true,
      hmr: {
        overlay: true,
      },
    },
  }
})
