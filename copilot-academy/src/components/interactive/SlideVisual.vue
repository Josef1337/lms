<script setup lang="ts">
// Abstract sketch of a suggested slide visual. Decorative: the suggestion is
// always written out next to the slide.
import type { SlideVisual } from '@/content/datasets/presentation'

defineProps<{ kind: SlideVisual; accent: string; soft: string }>()
</script>

<template>
	<div class="flex h-full w-full items-center justify-center" aria-hidden="true">
		<div v-if="kind === 'kpi'" class="grid w-full grid-cols-3 gap-1.5">
			<div v-for="i in 3" :key="i" class="rounded-md p-1.5" :style="{ background: soft }">
				<div class="h-3 w-3/4 rounded-sm" :style="{ background: accent }" />
				<div class="mt-1 h-1 w-full rounded-sm bg-white/80" />
			</div>
		</div>
		<div
			v-else-if="kind === 'bars'"
			class="flex h-[70%] w-[60%] items-end gap-3 border-b border-ink-300 px-2"
		>
			<div class="w-full rounded-t-[3px]" :style="{ background: accent, height: '92%' }" />
			<div class="w-full rounded-t-[3px] bg-ink-300" style="height: 50%" />
		</div>
		<svg v-else-if="kind === 'line'" viewBox="0 0 100 50" class="h-[70%] w-[85%]">
			<line x1="0" y1="49" x2="100" y2="49" stroke="#cdd3dc" stroke-width="1" />
			<polyline
				points="2,40 26,34 50,30 74,18 98,8"
				fill="none"
				:stroke="accent"
				stroke-width="2.5"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<circle cx="98" cy="8" r="3.5" :fill="accent" stroke="#fff" stroke-width="1.5" />
		</svg>
		<div v-else-if="kind === 'split'" class="grid h-[75%] w-full grid-cols-2 gap-1.5">
			<div class="rounded-md bg-danger-50 p-1.5">
				<div class="h-1.5 w-1/2 rounded-sm bg-danger-600/60" />
				<div class="mt-1.5 h-1 w-full rounded-sm bg-white" />
				<div class="mt-1 h-1 w-4/5 rounded-sm bg-white" />
			</div>
			<div class="rounded-md bg-success-50 p-1.5">
				<div class="h-1.5 w-1/2 rounded-sm bg-success-600/60" />
				<div class="mt-1.5 h-1 w-full rounded-sm bg-white" />
				<div class="mt-1 h-1 w-4/5 rounded-sm bg-white" />
			</div>
		</div>
		<div v-else-if="kind === 'timeline'" class="relative h-6 w-[85%]">
			<div class="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 bg-ink-300" />
			<div class="absolute inset-0 flex items-center justify-between">
				<span
					v-for="i in 3"
					:key="i"
					class="h-3.5 w-3.5 rounded-full ring-2 ring-white"
					:style="{ background: i === 1 ? accent : soft }"
				/>
			</div>
		</div>
		<div
			v-else-if="kind === 'table'"
			class="grid w-[90%] grid-cols-3 gap-px overflow-hidden rounded-md bg-ink-200"
		>
			<div v-for="i in 9" :key="i" class="h-3" :style="{ background: i <= 3 ? soft : '#fff' }" />
		</div>
		<div v-else-if="kind === 'icons'" class="flex gap-3">
			<span
				v-for="i in 3"
				:key="i"
				class="h-7 w-7 rounded-full"
				:style="{ background: i === 2 ? accent : soft }"
			/>
		</div>
		<div v-else class="flex w-full items-center justify-center gap-1">
			<span
				v-for="i in 3"
				:key="i"
				class="flex h-6 flex-1 items-center justify-center rounded-md text-[9px] font-bold text-white"
				:style="{ background: accent, opacity: 1 - (i - 1) * 0.25 }"
				>{{ i }}</span
			>
		</div>
	</div>
</template>
