<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { X } from 'lucide-vue-next'
import SidebarNav from './SidebarNav.vue'

const open = defineModel<boolean>('open', { required: true })
const panel = ref<HTMLElement | null>(null)
let returnFocus: HTMLElement | null = null

function close() {
	open.value = false
}

function onKeydown(event: KeyboardEvent) {
	if (event.key === 'Escape') {
		close()
		return
	}
	// Keep Tab inside the drawer while it is open.
	if (event.key !== 'Tab' || !panel.value) return
	const focusable = panel.value.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
	if (!focusable.length) return
	const first = focusable[0]
	const last = focusable[focusable.length - 1]
	if (event.shiftKey && document.activeElement === first) {
		event.preventDefault()
		last.focus()
	} else if (!event.shiftKey && document.activeElement === last) {
		event.preventDefault()
		first.focus()
	}
}

watch(open, async (isOpen) => {
	document.documentElement.style.overflow = isOpen ? 'hidden' : ''
	if (isOpen) {
		returnFocus = document.activeElement as HTMLElement | null
		await nextTick()
		panel.value?.querySelector<HTMLElement>('[aria-current="page"], a[href]')?.focus()
	} else {
		returnFocus?.focus()
	}
})

onBeforeUnmount(() => (document.documentElement.style.overflow = ''))
</script>

<template>
	<Teleport to="body">
		<Transition
			enter-active-class="transition-opacity duration-200"
			enter-from-class="opacity-0"
			leave-active-class="transition-opacity duration-150"
			leave-to-class="opacity-0"
		>
			<div
				v-if="open"
				class="fixed inset-0 z-40 bg-ink-950/40 backdrop-blur-[2px] lg:hidden"
				aria-hidden="true"
				@click="close"
			/>
		</Transition>
		<Transition
			enter-active-class="transition-transform duration-200 ease-out"
			enter-from-class="-translate-x-full rtl:translate-x-full"
			leave-active-class="transition-transform duration-150 ease-in"
			leave-to-class="-translate-x-full rtl:translate-x-full"
		>
			<div
				v-if="open"
				ref="panel"
				role="dialog"
				aria-modal="true"
				aria-label="Menü"
				class="fixed inset-y-0 start-0 z-50 flex w-[86vw] max-w-[320px] flex-col bg-white shadow-float lg:hidden"
				@keydown="onKeydown"
			>
				<button
					type="button"
					class="btn btn-ghost btn-sm absolute end-3 top-3.5 z-10 px-2"
					aria-label="Menüyü kapat"
					@click="close"
				>
					<X :size="20" aria-hidden="true" />
				</button>
				<SidebarNav drawer @navigate="close" />
			</div>
		</Transition>
	</Teleport>
</template>
