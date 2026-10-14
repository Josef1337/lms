<script setup lang="ts">
// Short reinforcement questions. Each question works like a choice task: pick
// an option (neutral until checked), then “Kontrol et”. A checked answer is
// final and explained at once; the whole set can be reset to try again.
import { computed, nextTick, reactive, ref } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import type { QuestionsBlock } from '@/types/content'
import { seededShuffle } from '@/lib/shuffle'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import OptionMark from './OptionMark.vue'
import TaskCard from './TaskCard.vue'
import { OPTION_CARD, OPTION_SR, optionState } from './optionState'

const props = defineProps<{ block: QuestionsBlock }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)?.answer as Record<string, string> | undefined
/** Checked answers: these count and are stored once every question is checked. */
const answers = reactive<Record<string, string>>({ ...(stored ?? {}) })
/** Picks not checked yet. Kept in memory only. */
const picks = reactive<Record<string, string>>({})
const list = ref<HTMLElement | null>(null)

const answered = computed(() => props.block.questions.filter((q) => answers[q.id]).length)
const correct = computed(
	() => props.block.questions.filter((q) => answers[q.id] === q.correct).length
)

// Each question keeps a fixed order of its own, so the right answer is not
// usually in the same place; no option or explanation refers to another
// option by letter or position.
const questions = computed(() =>
	props.block.questions.map((q) => ({
		...q,
		options: seededShuffle(q.options, `${props.block.id}:${q.id}`).map((o) => ({
			...o,
			state: optionState(
				(answers[q.id] ?? picks[q.id]) === o.id,
				!!answers[q.id],
				o.id === q.correct
			),
		})),
	}))
)

function pick(questionId: string, optionId: string) {
	if (answers[questionId]) return
	picks[questionId] = optionId
}

async function check(questionId: string) {
	const choice = picks[questionId]
	if (!choice || answers[questionId]) return
	answers[questionId] = choice
	delete picks[questionId]
	if (answered.value === props.block.questions.length) {
		progress.recordTask(props.block.id, {
			correct: correct.value === props.block.questions.length,
			score: correct.value / props.block.questions.length,
			answer: { ...answers },
		})
	}
	// The pressed button is gone; the explanation takes the focus (and is read
	// out from there, so it needs no live region).
	await nextTick()
	document.getElementById(`${props.block.id}-${questionId}-result`)?.focus()
}

async function reset() {
	for (const key of Object.keys(answers)) delete answers[key]
	for (const key of Object.keys(picks)) delete picks[key]
	// The reset button goes away with the answers: start again at the top.
	await nextTick()
	list.value?.querySelector<HTMLElement>('button')?.focus()
}
</script>

<template>
	<TaskCard
		data-task="questions"
		:label="block.title ?? 'Pekiştirme soruları'"
		:done="progress.isTaskDone(block.id)"
		:correct="progress.taskResult(block.id)?.correct"
	>
		<ol ref="list" class="space-y-6" role="list">
			<li v-for="(q, qi) in questions" :key="q.id">
				<p
					:id="`${block.id}-${q.id}-label`"
					class="flex gap-2 text-[15px] font-semibold text-ink-900"
				>
					<span class="text-brand-600">{{ qi + 1 }}.</span>
					<RichText :text="q.prompt" />
				</p>
				<div
					class="mt-2.5 space-y-2"
					role="radiogroup"
					:aria-labelledby="`${block.id}-${q.id}-label`"
				>
					<button
						v-for="o in q.options"
						:key="o.id"
						type="button"
						role="radio"
						:aria-checked="(answers[q.id] ?? picks[q.id]) === o.id"
						:aria-disabled="!!answers[q.id]"
						:data-state="o.state"
						:class="['option-card py-2.5', OPTION_CARD[o.state], answers[q.id] && 'cursor-default']"
						@click="pick(q.id, o.id)"
					>
						<OptionMark :state="o.state" />
						<span class="min-w-0 flex-1 text-[14px]">
							<RichText :text="o.text" />
							<span v-if="OPTION_SR[o.state]" class="sr-only">, {{ OPTION_SR[o.state] }}</span>
						</span>
					</button>
				</div>
				<div
					v-if="answers[q.id]"
					:id="`${block.id}-${q.id}-result`"
					tabindex="-1"
					:class="[
						'mt-2.5 animate-fade-in rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed',
						answers[q.id] === q.correct
							? 'bg-success-50 text-ink-700'
							: 'bg-danger-50 text-ink-700',
					]"
				>
					<strong class="font-semibold text-ink-900">{{
						answers[q.id] === q.correct ? 'Doğru. ' : 'Yanlış. '
					}}</strong>
					<RichText :text="q.explanation" />
				</div>
				<button
					v-else
					type="button"
					class="btn btn-primary btn-sm mt-2.5"
					:disabled="!picks[q.id]"
					@click="check(q.id)"
				>
					Kontrol et
				</button>
			</li>
		</ol>
		<template #footer>
			<span class="text-[13px] text-ink-600" aria-live="polite">
				{{ answered }}/{{ block.questions.length }} yanıtlandı
				<template v-if="answered === block.questions.length"> · {{ correct }} doğru</template>
			</span>
			<button
				v-if="answered === block.questions.length && correct < block.questions.length"
				type="button"
				class="btn btn-ghost btn-sm ms-auto"
				@click="reset"
			>
				<RotateCcw :size="14" aria-hidden="true" /> Soruları tekrar çöz
			</button>
		</template>
	</TaskCard>
</template>
