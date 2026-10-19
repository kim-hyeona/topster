import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import albumApi from './api/albums.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const handler = albumApi.createHandler({ getKey: () => process.env.LASTFM_API_KEY || env.LASTFM_API_KEY })
  return {
    plugins: [vue(), {
      name: 'private-album-api',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.split('?')[0] === '/api/albums') return handler(req, res)
          next()
        })
      },
    }],
  }
})

