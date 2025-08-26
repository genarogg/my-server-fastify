import { resolve } from 'node:path'
import viteFastify from '@fastify/vite/plugin'
import viteReact from '@vitejs/plugin-react'

export default {
  root: resolve(process.cwd(), 'src', 'client'),
  plugins: [
    viteFastify({ spa: true, useRelativePaths: true }),
    viteReact()
  ],
  build: {
    emptyOutDir: true,
    outDir: resolve(process.cwd(), 'dist',"src"),
  },
}
