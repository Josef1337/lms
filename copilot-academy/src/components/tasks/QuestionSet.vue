<script setup lang="ts">
// Short reinforcement questions. Each answer is final and explained at once;
// the whole set can be reset to try again.
import { computed, reactive } from 'vue'
import { CircleCheck, CircleX, RotateCcw } from 'lucide-vue-next'
import type { QuestionsBlock } from '@/types/content'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ block: QuestionsBlock }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)?.answer as Record<string, string> | undefined
const answers = reactive<Record<string, string>>({ ...(stored ?? {}) })

const answered = computed(() => props.block.questions.filter((q) => answers[q.id]).length)
const correct = computed(
	() => props.block.questions.filter((q) => answers[q.id] === q.correct).length
)

function answer(questionId: string, optionId: string) {
	if (answers[questionId]) return
	answers[questionId] = optionId
	if (answered.value === props.block.questions.length) {
		progress.recordTask(props.block.id, {
			correct: correct.value === props.block.questions.length,
			score: correct.value / props.block.questions.length,
			answer: { ...answers },
		})
	}
}

function reset() {
	for (const key of Object.keys(answers)) delete answers[key]
}
</script>

<template>
	<TaskCard
		data-task="questions"
		:label="block.title ?? 'Pekiştirme soruları'"
		:done="progress.isTaskDone(block.id)"
	>
		<ol class="space-y-6" role="list">
			<li v-for="(q, qi) in block.questions" :key="q.id">
				<p :id="`${q.id}-label`" class="flex gap-2 text-[15px] font-semibold text-ink-900">
					<span class="text-brand-600">{{ qi + 1 }}.</span>
					<RichText :text="q.prompt" />
				</p>
				<div class="mt-2.5 space-y-2" role="radiogroup" :aria-labelledby="`${q.id}-label`">
					<button
						v-for="o in q.options"
						:key="o.id"
						type="button"
						role="radio"
						:aria-checked="answers[q.id] === o.id"
						:aria-disabled="!!answers[q.id]"
						:class="[
							'option-card py-2.5',
							answers[q.id]
								? o.id === q.correct
									? 'border-success-600/60 bg-success-50'
									: answers[q.id] === o.id
									? 'border-danger-600/50 bg-danger-50'
									: 'opacity-60'
								: '',
							answers[q.id] && 'cursor-default',
						]"
						@click="answer(q.id, o.id)"
					>
						<CircleCheck
							v-if="answers[q.id] && o.id === q.correct"
							:size="18"
							class="mt-0.5 shrink-0 text-success-700"
							aria-hidden="true"
						/>
						<CircleX
							v-else-if="answers[q.id] === o.id"
							:size="18"
							class="mt-0.5 shrink-0 text-danger-600"
							aria-hidden="true"
						/>
						<span
							v-else
							class="mt-0.5 h-[18px] w-[18px] shrink-0 rounded-full border-2 border-ink-300"
							aria-hidden="true"
						/>
						<RichText :text="o.text" class="text-[14px]" />
					</button>
				</div>
				<div
					v-if="answers[q.id]"
					:class="[
						'mt-2.5 animate-fade-in rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed',
						answers[q.id] === q.correct
							? 'bg-success-50 text-ink-700'
							: 'bg-danger-50 text-ink-700',
					]"
					role="status"
				>
					<strong class="font-semibold text-ink-900">{{
						answers[q.id] === q.correct ? 'Doğru. ' : 'Yanlış. '
					}}</strong>
					<RichText :text="q.explanation" />
				</div>
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
