<script setup lang="ts">
import { RouterLink, type RouteLocationRaw } from 'vue-router'
import { CircleCheck, Clock } from 'lucide-vue-next'
import type { Visual } from '@/types/content'
import AppTile from '@/components/ui/AppTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'

defineProps<{
	to: RouteLocationRaw
	visual: Visual
	/** Module number for the "Modül N" label; cards that are not modules pass `eyebrow`. */
	number?: number
	eyebrow?: string
	title: string
	tagline: string
	meta: string
	minutes?: number
	percent: number
	state: 'not-started' | 'in-progress' | 'completed'
	stateLabel?: string
}>()
</script>

<template>
	<RouterLink
		:to="to"
		class="group flex h-full flex-col rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-raised"
	>
		<div class="flex items-start justify-between gap-3">
			<AppTile :visual="visual" size="md" />
			<span
				v-if="state === 'completed'"
				class="chip bg-success-50 text-success-700 ring-1 ring-inset ring-success-100"
			>
				<CircleCheck :size="12" aria-hidden="true" /> {{ stateLabel ?? 'Tamamlandı' }}
			</span>
			<span
				v-else-if="state === 'in-progress'"
				class="chip bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200"
			>
				{{ stateLabel ?? 'Devam ediyor' }}
			</span>
			<span v-else class="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{{
				eyebrow ?? `Modül ${number}`
			}}</span>
		</div>
		<p
			v-if="state !== 'not-started'"
			class="mt-3 text-[11px] font-semibold uppercase tracking-wide text-ink-500"
		>
			{{ eyebrow ?? `Modül ${number}` }}
		</p>
		<h3
			:class="[
				'text-[15.5px] font-semibold leading-snug text-ink-900 group-hover:text-brand-800',
				state === 'not-started' ? 'mt-3' : 'mt-0.5',
			]"
		>
			{{ title }}
		</h3>
		<p class="mt-1 line-clamp-2 text-[13px] leading-snug text-ink-500">{{ tagline }}</p>
		<div class="mt-auto pt-4">
			<div class="mb-1.5 flex items-center justify-between text-[12px] text-ink-500">
				<span>{{ meta }}</span>
				<span v-if="minutes" class="flex items-center gap-1"
					><Clock :size="12" aria-hidden="true" /> {{ minutes }} dk</span
				>
			</div>
			<ProgressBar
				:value="percent"
				:tone="state === 'completed' ? 'success' : 'brand'"
				size="xs"
				:label="`${title} ilerlemesi`"
			/>
		</div>
	</RouterLink>
</template>
