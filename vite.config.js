import { resolve } from 'node:path'
import viteFastify from '@fastify/vite/plugin'
import viteReact from '@vitejs/plugin-react'

export default {
  root: resolve(process.pwd(), 'src', 'client'),
  plugins: [
    viteFastify({ spa: true, useRelativePaths: true }),
    viteReact()
  ],
  build: {
    emptyOutDir: true,
    outDir: resolve(process.pwd(), 'build'),
  },
}
