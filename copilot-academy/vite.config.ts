import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Relative base, so the built `dist/` works from any sub-path (an intranet
// folder, a static host). Routing uses hash history for the same reason.
export default defineConfig({
	base: './',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		// The Excel lab's chunk carries the tree-shaken chart library (~600 kB,
		// ~200 kB gzipped). It is only fetched when that lab opens.
		chunkSizeWarningLimit: 650,
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.ts'],
	},
})
