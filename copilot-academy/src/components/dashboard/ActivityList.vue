<script setup lang="ts">
import { computed } from 'vue'
import { Award, BookCheck, ClipboardCheck, Flag, Layers } from 'lucide-vue-next'
import type { Activity } from '@/stores/progress'
import { formatRelative } from '@/lib/format'

const props = withDefaults(defineProps<{ items: Activity[]; limit?: number }>(), { limit: 6 })
const ICON = { start: Flag, lesson: BookCheck, module: Layers, badge: Award, quiz: ClipboardCheck }
const TONE = {
	start: 'bg-brand-50 text-brand-700',
	lesson: 'bg-success-50 text-success-700',
	module: 'bg-lagoon-50 text-lagoon-700',
	badge: 'bg-amber-50 text-amber-700',
	quiz: 'bg-iris-50 text-iris-700',
}
const visible = computed(() => props.items.slice(0, props.limit))
</script>

<template>
	<ol v-if="visible.length" class="space-y-3" role="list">
		<li v-for="a in visible" :key="a.id" class="flex gap-3">
			<span
				:class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', TONE[a.kind]]"
				aria-hidden="true"
			>
				<component :is="ICON[a.kind]" :size="15" />
			</span>
			<div class="min-w-0">
				<p class="text-[13.5px] font-medium leading-snug text-ink-800">{{ a.title }}</p>
				<p class="text-[12px] text-ink-500">
					<time :datetime="a.at">{{ formatRelative(a.at) }}</time>
					<template v-if="a.detail"> · {{ a.detail }}</template>
				</p>
			</div>
		</li>
	</ol>
	<p
		v-else
		class="rounded-xl border border-dashed border-ink-300 px-4 py-5 text-center text-[13px] text-ink-500"
	>
		Henüz etkinlik yok. İlk derse başladığınızda ilerlemeniz burada görünecek.
	</p>
</template>
