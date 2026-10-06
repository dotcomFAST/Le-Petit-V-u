import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
	plugins: [react()],
	base: mode === 'production' ? '/Le-Petit-V-u/' : '/',
	build: { outDir: 'docs', emptyOutDir: true },
}))
