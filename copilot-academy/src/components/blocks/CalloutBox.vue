<script setup lang="ts">
import { computed } from 'vue'
import { Info, Lightbulb, Settings2, TriangleAlert } from 'lucide-vue-next'
import type { CalloutBlock } from '@/types/content'
import RichText from '@/components/ui/RichText.vue'

const props = defineProps<{ block: CalloutBlock }>()

const TONES = {
	info: {
		icon: Info,
		box: 'border-brand-200 bg-brand-50/70',
		icon_: 'text-brand-700',
		title: 'Bilgi',
	},
	tip: {
		icon: Lightbulb,
		box: 'border-lagoon-200 bg-lagoon-50/70',
		icon_: 'text-lagoon-700',
		title: 'İpucu',
	},
	warning: {
		icon: TriangleAlert,
		box: 'border-warning-100 bg-warning-50',
		icon_: 'text-warning-700',
		title: 'Dikkat',
	},
	availability: {
		icon: Settings2,
		box: 'border-ink-200 bg-ink-50',
		icon_: 'text-ink-600',
		title: 'Lisans ve yapılandırma notu',
	},
}

const tone = computed(() => TONES[props.block.tone])
</script>

<template>
	<aside
		:class="['flex gap-3 rounded-xl border px-4 py-3.5', tone.box]"
		:aria-label="block.title ?? tone.title"
	>
		<component
			:is="tone.icon"
			:size="18"
			:class="['mt-0.5 shrink-0', tone.icon_]"
			aria-hidden="true"
		/>
		<div class="min-w-0 text-sm leading-relaxed text-ink-700">
			<p class="font-semibold text-ink-900">{{ block.title ?? tone.title }}</p>
			<RichText as="p" :text="block.body" class="mt-0.5" />
		</div>
	</aside>
</template>
