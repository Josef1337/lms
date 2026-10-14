<script setup lang="ts">
// Checklist for open-ended labs. The task completes itself as soon as every
// goal is met, so the learner never has to find a separate button below the
// lab; the result is stored by the lab itself (on "complete").
import { computed, inject, onBeforeUnmount, watch } from 'vue'
import { Check, CircleCheck, Flag } from 'lucide-vue-next'
import { TASK_GOALS } from '@/components/lesson/phases'
import { useProgress } from '@/stores/progress'

const props = defineProps<{
	taskId: string
	goals: { label: string; done: boolean }[]
	title?: string
}>()
const emit = defineEmits<{ complete: [] }>()
const progress = useProgress()

const ready = computed(() => props.goals.every((g) => g.done))
const done = computed(() => progress.isTaskDone(props.taskId))

// Completes once every goal is met. While the lab stays open, a later change
// (labs pass `goals` as a computed, so a new array means their state moved)
// is reported again, so the stored result matches where the learner ended:
// the prompt builder scores the fifth part added after the fourth. A lab
// reopened after it was done keeps its earlier result.
let completedHere = false
watch(
	() => props.goals,
	() => {
		if (!ready.value || (done.value && !completedHere)) return
		completedHere = true
		emit('complete')
	},
	{ immediate: true }
)

// Lets the lesson page name these goals under the step title.
const registry = inject(TASK_GOALS, null)
registry?.set(props.taskId, () => props.goals)
onBeforeUnmount(() => registry?.delete(props.taskId))
</script>

<template>
	<section
		:class="[
			'rounded-2xl border px-4 py-4 sm:px-5',
			done ? 'border-success-100 bg-success-50/70' : 'border-warning-100 bg-warning-50/60',
		]"
		aria-live="polite"
	>
		<p
			class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em]"
			:class="done ? 'text-success-700' : 'text-warning-700'"
		>
			<CircleCheck v-if="done" :size="14" aria-hidden="true" />
			<Flag v-else :size="14" aria-hidden="true" />
			{{ done ? 'Görev tamamlandı' : title ?? 'Görev' }}
		</p>
		<p v-if="done" class="mt-1 flex items-start gap-2 text-[14px] text-ink-700">
			<slot name="done" />
		</p>
		<template v-else>
			<ul class="mt-2 space-y-1.5" role="list">
				<li
					v-for="g in goals"
					:key="g.label"
					class="flex items-center gap-2 text-[14px]"
					:class="g.done ? 'text-ink-700' : 'text-ink-600'"
				>
					<span
						:class="[
							'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition',
							g.done ? 'border-success-600 bg-success-600 text-white' : 'border-ink-300 bg-white',
						]"
						aria-hidden="true"
					>
						<Check v-if="g.done" :size="11" :stroke-width="3.5" />
					</span>
					<span :class="g.done && 'line-through decoration-ink-300'">{{ g.label }}</span>
					<span class="sr-only">{{ g.done ? '(tamamlandı)' : '(bekliyor)' }}</span>
				</li>
			</ul>
			<p class="mt-2.5 text-[12.5px] text-ink-500">
				Hedeflerin hepsine ulaştığınızda görev kendiliğinden tamamlanır.
			</p>
		</template>
	</section>
</template>
