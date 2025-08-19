import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/mind-cleaner/',   // 仓库名
  plugins: [react()],
  build: { outDir: 'docs' } // 构建产物输出到 docs
})
