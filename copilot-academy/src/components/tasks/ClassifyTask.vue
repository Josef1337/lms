<script setup lang="ts">
// Each item is sorted into a category with one click and gets feedback
// straight away. A wrong pick can be changed; the score counts first picks.
import { computed, reactive } from 'vue'
import { CircleCheck, CircleX, Hand, ShieldAlert, UserCheck } from 'lucide-vue-next'
import type { ClassifyTaskBlock } from '@/types/content'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import FeedbackNote from './FeedbackNote.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ block: ClassifyTaskBlock }>()
const progress = useProgress()

interface Stored {
	picks: Record<string, string>
	first: Record<string, string>
}
const stored = progress.taskResult(props.block.id)?.answer as unknown as Stored | undefined
const picks = reactive<Record<string, string>>({ ...(stored?.picks ?? {}) })
const first = reactive<Record<string, string>>({ ...(stored?.first ?? {}) })

const TONE = {
	good: {
		icon: CircleCheck,
		active: 'border-success-600 bg-success-50 text-success-700',
		idle: 'hover:border-success-600/50 hover:bg-success-50/50',
	},
	warn: {
		icon: UserCheck,
		active: 'border-warning-600 bg-warning-50 text-warning-700',
		idle: 'hover:border-warning-600/50 hover:bg-warning-50/60',
	},
	stop: {
		icon: Hand,
		active: 'border-danger-600 bg-danger-50 text-danger-700',
		idle: 'hover:border-danger-600/50 hover:bg-danger-50/60',
	},
}

const answered = computed(() => props.block.items.filter((i) => picks[i.id]).length)
const firstCorrect = computed(
	() => props.block.items.filter((i) => first[i.id] === i.category).length
)
const allAnswered = computed(() => answered.value === props.block.items.length)

function pick(itemId: string, categoryId: string) {
	picks[itemId] = categoryId
	if (!first[itemId]) first[itemId] = categoryId
	if (allAnswered.value) {
		progress.recordTask(props.block.id, {
			correct: firstCorrect.value === props.block.items.length,
			score: firstCorrect.value / props.block.items.length,
			answer: { picks: { ...picks }, first: { ...first } },
		})
	}
}

const categoryLabel = (id: string) => props.block.categories.find((c) => c.id === id)?.label ?? ''
</script>

<template>
	<TaskCard data-task="classify" :prompt="block.prompt" :done="progress.isTaskDone(block.id)">
		<div class="mb-4 grid gap-2 sm:grid-cols-3">
			<div
				v-for="cat in block.categories"
				:key="cat.id"
				class="rounded-xl border border-ink-200/80 bg-ink-50/60 px-3 py-2.5"
			>
				<p class="flex items-center gap-1.5 text-[13px] font-semibold text-ink-900">
					<component :is="TONE[cat.tone].icon" :size="15" aria-hidden="true" />
					{{ cat.label }}
				</p>
				<p class="mt-0.5 text-xs leading-snug text-ink-500">{{ cat.description }}</p>
			</div>
		</div>

		<ol class="space-y-3" role="list">
			<li
				v-for="(item, index) in block.items"
				:key="item.id"
				class="rounded-xl border border-ink-200/80 bg-white p-3.5 sm:p-4"
			>
				<p class="flex gap-2 text-[15px] font-medium text-ink-900">
					<span class="text-ink-400">{{ index + 1 }}.</span>
					<RichText :text="item.text" />
				</p>
				<div
					class="mt-3 flex flex-wrap gap-2"
					role="radiogroup"
					:aria-label="`${index + 1}. iş için kategori`"
				>
					<button
						v-for="cat in block.categories"
						:key="cat.id"
						type="button"
						role="radio"
						:aria-checked="picks[item.id] === cat.id"
						:class="[
							'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] font-semibold transition',
							picks[item.id] === cat.id
								? TONE[cat.tone].active
								: ['border-ink-200 bg-white text-ink-700', TONE[cat.tone].idle],
						]"
						@click="pick(item.id, cat.id)"
					>
						<component :is="TONE[cat.tone].icon" :size="14" aria-hidden="true" />
						{{ cat.label }}
					</button>
				</div>
				<div v-if="picks[item.id]" class="mt-3" aria-live="polite">
					<div
						:class="[
							'flex gap-2 rounded-lg px-3 py-2 text-[13px] leading-relaxed',
							picks[item.id] === item.category
								? 'bg-success-50 text-ink-700'
								: 'bg-danger-50 text-ink-700',
						]"
					>
						<CircleCheck
							v-if="picks[item.id] === item.category"
							:size="16"
							class="mt-0.5 shrink-0 text-success-700"
							aria-hidden="true"
						/>
						<CircleX v-else :size="16" class="mt-0.5 shrink-0 text-danger-600" aria-hidden="true" />
						<p>
							<strong class="font-semibold text-ink-900">
								{{
									picks[item.id] === item.category
										? 'Doğru.'
										: `Daha uygun kategori: ${categoryLabel(item.category)}.`
								}}
							</strong>
							{{ ' ' }}<RichText :text="item.feedback" />
						</p>
					</div>
				</div>
			</li>
		</ol>

		<div v-if="allAnswered" class="mt-4">
			<FeedbackNote
				:tone="
					firstCorrect === block.items.length
						? 'correct'
						: firstCorrect >= block.items.length / 2
						? 'partial'
						: 'incorrect'
				"
				:title="`İlk denemede ${firstCorrect}/${block.items.length} doğru`"
				body="Copilot iyi bir başlangıç noktası üretir; sonuç bir karar, bir taahhüt veya hassas veri içerdiğinde son söz her zaman sizindir."
			>
				<p class="mt-1 flex items-center gap-1.5 text-[13px] text-ink-500">
					<ShieldAlert :size="14" aria-hidden="true" /> İsterseniz yanlış seçimleri değiştirip
					açıklamaları tekrar okuyabilirsiniz.
				</p>
			</FeedbackNote>
		</div>
		<template #footer>
			<span class="text-[13px] text-ink-600" aria-live="polite"
				>{{ answered }}/{{ block.items.length }} iş sınıflandırıldı</span
			>
		</template>
	</TaskCard>
</template>
