/// <reference types="vitest/config" />

import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    // Configure Vitest (https://vitest.dev/config/)
  },
})
