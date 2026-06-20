import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Replace 'livingstructures' with your exact GitHub repository name
  base: '/livingstructures/', 
  plugins: [react()]
})
