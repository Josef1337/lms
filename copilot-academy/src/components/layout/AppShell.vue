<script setup lang="ts">
import { ref, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import { useProgress } from '@/stores/progress'
import AppHeader from './AppHeader.vue'
import MobileNav from './MobileNav.vue'
import SidebarNav from './SidebarNav.vue'
import SiteFooter from './SiteFooter.vue'

const progress = useProgress()
const route = useRoute()
const menuOpen = ref(false)
const main = ref<HTMLElement | null>(null)

watch(
	() => route.fullPath,
	() => (menuOpen.value = false)
)

// The router uses the URL hash, so a plain "#main" link would navigate.
function skipToContent() {
	main.value?.focus()
	main.value?.scrollIntoView()
}
</script>

<template>
	<div class="min-h-screen lg:flex">
		<button
			type="button"
			class="sr-only z-50 rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:start-3 focus:top-3"
			@click="skipToContent"
		>
			İçeriğe atla
		</button>

		<aside
			:class="[
				'no-print sticky top-0 hidden h-screen shrink-0 border-e border-ink-200/80 bg-white transition-[width] duration-200 lg:block',
				progress.data.sidebarCollapsed ? 'w-[76px]' : 'w-[284px]',
			]"
		>
			<SidebarNav :collapsed="progress.data.sidebarCollapsed" />
		</aside>
		<MobileNav v-model:open="menuOpen" />

		<div class="flex min-w-0 flex-1 flex-col">
			<AppHeader @open-menu="menuOpen = true" />
			<main id="main" ref="main" tabindex="-1" class="flex-1 focus:outline-none">
				<RouterView />
			</main>
			<SiteFooter compact />
		</div>
	</div>
</template>
