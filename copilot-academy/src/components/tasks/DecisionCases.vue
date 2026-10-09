<script setup lang="ts">
// One incident at a time: the learner picks a response, reads why it is the
// best, a risky or a wrong call, and moves to the next incident.
import { computed, reactive, ref } from 'vue'
import { ChevronLeft, ChevronRight, CircleCheck, CircleX, TriangleAlert } from 'lucide-vue-next'
import type { CasesTaskBlock } from '@/types/content'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import FeedbackNote from './FeedbackNote.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ block: CasesTaskBlock }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)?.answer as Record<string, string> | undefined
const answers = reactive<Record<string, string>>({ ...(stored ?? {}) })
const viewing = reactive<Record<string, string>>({ ...(stored ?? {}) })
const index = ref(0)

const current = computed(() => props.block.cases[index.value])
const chosen = computed(() => current.value.options.find((o) => o.id === viewing[current.value.id]))
const best = computed(
	() =>
		props.block.cases.filter(
			(c) => c.options.find((o) => o.id === answers[c.id])?.verdict === 'best'
		).length
)
const done = computed(() => props.block.cases.every((c) => answers[c.id]))

const VERDICT = {
	best: { label: 'En doğru yaklaşım', icon: CircleCheck, tone: 'correct' as const },
	risky: { label: 'Riskli', icon: TriangleAlert, tone: 'partial' as const },
	wrong: { label: 'Yanlış', icon: CircleX, tone: 'incorrect' as const },
}

function choose(optionId: string) {
	viewing[current.value.id] = optionId
	if (!answers[current.value.id]) answers[current.value.id] = optionId
	if (done.value) {
		progress.recordTask(props.block.id, {
			correct: best.value === props.block.cases.length,
			score: best.value / props.block.cases.length,
			answer: { ...answers },
		})
	}
}
</script>

<template>
	<TaskCard
		data-task="cases"
		:prompt="block.prompt ?? 'Her olayda en doğru davranışı seçin.'"
		:done="progress.isTaskDone(block.id)"
	>
		<div class="mb-4 flex items-center gap-2" role="tablist" aria-label="Olaylar">
			<button
				v-for="(c, i) in block.cases"
				:key="c.id"
				type="button"
				role="tab"
				:aria-selected="i === index"
				:class="[
					'flex h-8 min-w-8 items-center justify-center rounded-full px-2.5 text-[13px] font-semibold transition',
					i === index
						? 'bg-ink-900 text-white'
						: answers[c.id]
						? 'bg-success-50 text-success-700 ring-1 ring-success-100'
						: 'bg-ink-100 text-ink-600 hover:bg-ink-200',
				]"
				@click="index = i"
			>
				{{ i + 1 }}
			</button>
			<span class="ms-auto text-[13px] text-ink-500"
				>Olay {{ index + 1 }}/{{ block.cases.length }}</span
			>
		</div>

		<article :key="current.id" class="animate-fade-up">
			<h4 class="text-[16px] font-semibold">{{ current.title }}</h4>
			<RichText
				as="p"
				:text="current.situation"
				class="mt-1.5 rounded-xl bg-ink-50 px-4 py-3 text-[14px] leading-relaxed text-ink-700"
			/>
			<p class="mb-2 mt-4 text-xs font-medium text-ink-500">Ne yaparsınız?</p>
			<div class="space-y-2" role="radiogroup" :aria-label="current.title">
				<button
					v-for="o in current.options"
					:key="o.id"
					type="button"
					role="radio"
					:aria-checked="viewing[current.id] === o.id"
					:class="[
						'option-card',
						viewing[current.id] === o.id
							? o.verdict === 'best'
								? 'border-success-600/60 bg-success-50'
								: o.verdict === 'risky'
								? 'border-warning-600/50 bg-warning-50'
								: 'border-danger-600/50 bg-danger-50'
							: '',
					]"
					@click="choose(o.id)"
				>
					<component
						:is="viewing[current.id] === o.id ? VERDICT[o.verdict].icon : 'span'"
						:size="18"
						:class="[
							'mt-0.5 shrink-0',
							viewing[current.id] === o.id
								? ''
								: 'h-[18px] w-[18px] rounded-full border-2 border-ink-300',
						]"
						aria-hidden="true"
					/>
					<RichText :text="o.text" />
				</button>
			</div>
			<div v-if="chosen" class="mt-4">
				<FeedbackNote
					:tone="VERDICT[chosen.verdict].tone"
					:title="VERDICT[chosen.verdict].label"
					:body="chosen.feedback"
				/>
			</div>
		</article>

		<template #footer>
			<button type="button" class="btn btn-ghost btn-sm" :disabled="index === 0" @click="index--">
				<ChevronLeft :size="16" class="rtl:-scale-x-100" aria-hidden="true" /> Önceki olay
			</button>
			<button
				type="button"
				class="btn btn-secondary btn-sm"
				:disabled="index === block.cases.length - 1 || !answers[current.id]"
				@click="index++"
			>
				Sonraki olay <ChevronRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</button>
			<span v-if="done" class="ms-auto text-[13px] font-medium text-ink-600"
				>İlk seçimlerde {{ best }}/{{ block.cases.length }} en doğru yaklaşım</span
			>
		</template>
	</TaskCard>
</template>
