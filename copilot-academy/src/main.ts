import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import './styles/main.css'

// A lazy page that fails to load (network blip, or an old page after a new
// version was published) leaves a blank screen. Reload once; the flag stops a
// reload loop and is cleared after the next successful navigation.
const RELOAD_FLAG = 'copilot-academy:chunk-reload'
window.addEventListener('vite:preloadError', () => {
	try {
		if (sessionStorage.getItem(RELOAD_FLAG)) return
		sessionStorage.setItem(RELOAD_FLAG, '1')
	} catch {
		return
	}
	location.reload()
})
router.afterEach(() => {
	try {
		sessionStorage.removeItem(RELOAD_FLAG)
	} catch {
		// storage unavailable: nothing to clear
	}
})

createApp(App).use(createPinia()).use(router).mount('#app')
