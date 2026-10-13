<script setup lang="ts">
import { BookOpen, Lightbulb, MessageSquareQuote, StickyNote } from 'lucide-vue-next'
import type { AsideNote } from '@/types/content'
import RichText from '@/components/ui/RichText.vue'

withDefaults(defineProps<{ notes: AsideNote[]; grid?: boolean }>(), { grid: false })

const TONE = {
	tip: {
		icon: Lightbulb,
		label: 'İpucu',
		box: 'border-lagoon-200 bg-lagoon-50/60',
		icon_: 'bg-lagoon-100 text-lagoon-700',
	},
	example: {
		icon: MessageSquareQuote,
		label: 'Örnek',
		box: 'border-iris-200 bg-iris-50/50',
		icon_: 'bg-iris-100 text-iris-700',
	},
	explain: {
		icon: BookOpen,
		label: 'Açıklama',
		box: 'border-iris-200 bg-iris-50/50',
		icon_: 'bg-iris-100 text-iris-700',
	},
	note: {
		icon: StickyNote,
		label: 'Not',
		box: 'border-ink-200 bg-white',
		icon_: 'bg-ink-100 text-ink-600',
	},
}
const asList = (body: string | string[]) => (Array.isArray(body) ? body : [body])
</script>

<template>
	<div :class="grid ? 'contents' : 'space-y-3'">
		<section
			v-for="note in notes"
			:key="note.title"
			:class="['rounded-2xl border p-4', TONE[note.tone].box]"
		>
			<p class="mb-2 flex items-center gap-2">
				<span
					:class="['flex h-6 w-6 items-center justify-center rounded-md', TONE[note.tone].icon_]"
					aria-hidden="true"
				>
					<component :is="TONE[note.tone].icon" :size="14" />
				</span>
				<span class="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500">{{
					TONE[note.tone].label
				}}</span>
			</p>
			<h3 class="text-[15px] font-semibold leading-snug">{{ note.title }}</h3>
			<div class="mt-1.5 space-y-2 text-[13.5px] leading-relaxed text-ink-600">
				<RichText v-for="(p, i) in asList(note.body)" :key="i" as="p" :text="p" />
			</div>
		</section>
	</div>
</template>
