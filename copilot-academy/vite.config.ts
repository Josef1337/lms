import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

// Relative base, so the built `dist/` works from any sub-path (an intranet
// web folder, a static host). Routing uses hash history for the same reason.
// Serve it over http(s): browsers block module scripts opened from file://.
export default defineConfig({
	base: './',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	build: {
		// Corporate browser floor: Chrome/Edge 109, Firefox ESR 115, Safari and
		// iOS 15.4. Keep in sync with "browserslist" in package.json (autoprefixer).
		target: ['es2020', 'chrome109', 'edge109', 'firefox115', 'safari15.4', 'ios15.4'],
		// The Excel lab's chunk carries the tree-shaken chart library (~600 kB,
		// ~200 kB gzipped). It is only fetched when that lab opens.
		chunkSizeWarningLimit: 650,
	},
	test: {
		environment: 'jsdom',
		include: ['src/**/*.test.ts'],
	},
})
