<script setup lang="ts">
import type { IconName } from '@/components/ui/icons'
import Icon from '@/components/ui/Icon.vue'

defineProps<{
	label: string
	value: string
	detail?: string
	icon: IconName
	tone?: 'brand' | 'iris' | 'lagoon' | 'amber'
}>()

const TONE = {
	brand: 'bg-brand-50 text-brand-700 ring-brand-100',
	iris: 'bg-iris-50 text-iris-700 ring-iris-100',
	lagoon: 'bg-lagoon-50 text-lagoon-700 ring-lagoon-100',
	amber: 'bg-amber-50 text-amber-700 ring-amber-100',
}
</script>

<template>
	<div
		class="flex flex-col gap-2.5 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card sm:flex-row sm:items-start sm:gap-3"
	>
		<span
			:class="[
				'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset',
				TONE[tone ?? 'brand'],
			]"
		>
			<Icon :name="icon" :size="19" />
		</span>
		<div class="min-w-0">
			<p class="text-[12.5px] font-medium text-ink-500">{{ label }}</p>
			<p class="text-[22px] font-bold leading-tight text-ink-900">{{ value }}</p>
			<p v-if="detail" class="text-[12px] leading-snug text-ink-500">{{ detail }}</p>
		</div>
	</div>
</template>
