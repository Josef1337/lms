<script setup lang="ts">
import { computed } from 'vue'
import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-vue-next'
import RichText from '@/components/ui/RichText.vue'

const props = defineProps<{
	tone: 'correct' | 'incorrect' | 'partial' | 'info'
	title?: string
	body?: string
}>()

const TONES = {
	correct: {
		icon: CircleCheck,
		box: 'border-success-100 bg-success-50',
		icon_: 'text-success-700',
		title: 'Doğru',
	},
	incorrect: {
		icon: CircleX,
		box: 'border-danger-100 bg-danger-50',
		icon_: 'text-danger-600',
		title: 'Tam olarak değil',
	},
	partial: {
		icon: TriangleAlert,
		box: 'border-warning-100 bg-warning-50',
		icon_: 'text-warning-700',
		title: 'Kısmen doğru',
	},
	info: {
		icon: Info,
		box: 'border-iris-200 bg-iris-50',
		icon_: 'text-iris-700',
		title: 'Açıklama',
	},
}
const tone = computed(() => TONES[props.tone])
</script>

<template>
	<div
		:class="[
			'flex animate-fade-in gap-2.5 rounded-xl border px-3.5 py-3 text-sm leading-relaxed',
			tone.box,
		]"
		role="status"
	>
		<component
			:is="tone.icon"
			:size="18"
			:class="['mt-0.5 shrink-0', tone.icon_]"
			aria-hidden="true"
		/>
		<div class="min-w-0 text-ink-700">
			<p class="font-semibold text-ink-900">{{ title ?? tone.title }}</p>
			<RichText v-if="body" as="p" :text="body" class="mt-0.5" />
			<slot />
		</div>
	</div>
</template>
