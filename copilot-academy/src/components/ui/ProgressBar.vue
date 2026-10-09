<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		value: number
		tone?: 'brand' | 'success' | 'light' | 'iris'
		size?: 'xs' | 'sm' | 'md'
		label?: string
	}>(),
	{ tone: 'brand', size: 'sm' }
)

const clamped = computed(() => Math.max(0, Math.min(100, props.value)))
const TRACK = {
	brand: 'bg-brand-100',
	success: 'bg-success-100',
	light: 'bg-white/15',
	iris: 'bg-iris-100',
}
const BAR = {
	brand: 'bg-gradient-to-r from-brand-600 to-brand-500',
	success: 'bg-success-600',
	light: 'bg-white',
	iris: 'bg-gradient-to-r from-brand-600 via-iris-600 to-iris-500',
}
const HEIGHT = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' }
</script>

<template>
	<div
		:class="['w-full overflow-hidden rounded-full', TRACK[tone], HEIGHT[size]]"
		role="progressbar"
		aria-valuemin="0"
		aria-valuemax="100"
		:aria-valuenow="Math.round(clamped)"
		:aria-label="label ?? 'İlerleme'"
	>
		<div
			:class="['h-full rounded-full transition-[width] duration-500 ease-out', BAR[tone]]"
			:style="{ width: `${clamped}%` }"
		/>
	</div>
</template>
