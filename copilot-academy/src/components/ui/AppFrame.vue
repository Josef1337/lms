<script setup lang="ts">
// A neutral "app window" used around examples. It hints at the app without
// reproducing Microsoft's interface, and always says it is a sample.
import type { Visual } from '@/types/content'
import AppTile from './AppTile.vue'

withDefaults(
	defineProps<{
		visual: Visual
		title: string
		subtitle?: string
		dark?: boolean
		tools?: string[]
	}>(),
	{ dark: false }
)
</script>

<template>
	<section
		:class="[
			'overflow-hidden rounded-2xl border shadow-raised',
			dark ? 'border-ink-800 bg-ink-900 text-ink-100' : 'border-ink-200 bg-white',
		]"
	>
		<header
			:class="[
				'flex items-center gap-3 border-b px-4 py-2.5',
				dark ? 'border-white/10 bg-ink-950/60' : 'border-ink-200/80 bg-ink-50/80',
			]"
		>
			<AppTile :visual="visual" size="xs" />
			<div class="min-w-0 flex-1">
				<p :class="['truncate text-[13px] font-semibold', dark ? 'text-white' : 'text-ink-800']">
					{{ title }}
				</p>
				<p
					v-if="subtitle"
					:class="['truncate text-[11px]', dark ? 'text-ink-400' : 'text-ink-500']"
				>
					{{ subtitle }}
				</p>
			</div>
			<span
				:class="[
					'hidden shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide sm:inline',
					dark ? 'bg-white/10 text-ink-300' : 'bg-ink-100 text-ink-500',
				]"
			>
				Örnek arayüz
			</span>
		</header>
		<div
			v-if="tools?.length"
			:class="[
				'flex gap-1.5 overflow-x-auto border-b px-4 py-2 scrollbar-thin',
				dark ? 'border-white/10' : 'border-ink-100',
			]"
			aria-hidden="true"
		>
			<span
				v-for="tool in tools"
				:key="tool"
				:class="[
					'whitespace-nowrap rounded-md px-2 py-1 text-[11px] font-medium',
					dark ? 'bg-white/5 text-ink-300' : 'bg-ink-50 text-ink-500',
				]"
			>
				{{ tool }}
			</span>
		</div>
		<slot />
	</section>
</template>
