<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
	defineProps<{
		value: number
		size?: number
		stroke?: number
		tone?: 'brand' | 'light' | 'success'
		label?: string
	}>(),
	{ size: 64, stroke: 6, tone: 'brand' }
)

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const clamped = computed(() => Math.max(0, Math.min(100, props.value)))
const offset = computed(() => circumference.value * (1 - clamped.value / 100))

const colors = computed(() => {
	if (props.tone === 'light') return { track: 'rgba(255,255,255,.18)', bar: '#ffffff' }
	if (props.tone === 'success') return { track: '#d3efdc', bar: '#118043' }
	return { track: '#dcebfb', bar: '#0f6cbd' }
})
</script>

<template>
	<div
		class="relative inline-flex shrink-0 items-center justify-center"
		:style="{ width: `${size}px`, height: `${size}px` }"
		role="img"
		:aria-label="label ?? `%${Math.round(clamped)} tamamlandı`"
	>
		<svg :width="size" :height="size" class="-rotate-90" aria-hidden="true">
			<circle
				:cx="size / 2"
				:cy="size / 2"
				:r="radius"
				fill="none"
				:stroke="colors.track"
				:stroke-width="stroke"
			/>
			<circle
				:cx="size / 2"
				:cy="size / 2"
				:r="radius"
				fill="none"
				:stroke="colors.bar"
				:stroke-width="stroke"
				stroke-linecap="round"
				:stroke-dasharray="circumference"
				:stroke-dashoffset="offset"
				class="transition-[stroke-dashoffset] duration-700 ease-out"
			/>
		</svg>
		<span class="absolute inset-0 flex items-center justify-center">
			<slot>
				<span class="text-sm font-semibold">%{{ Math.round(clamped) }}</span>
			</slot>
		</span>
	</div>
</template>
