<script setup lang="ts">
// Checklist + "Görevi tamamla" for open-ended labs. The button unlocks once
// every goal is met; the result is stored by the lab itself.
import { computed } from 'vue'
import { Check, CircleCheck, Flag } from 'lucide-vue-next'
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
</script>

<template>
	<section
		:class="[
			'rounded-2xl border px-4 py-4 sm:px-5',
			done ? 'border-success-100 bg-success-50/70' : 'border-warning-100 bg-warning-50/60',
		]"
		aria-live="polite"
	>
		<div class="flex flex-col gap-4 sm:flex-row sm:items-center">
			<div class="min-w-0 flex-1">
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
				<ul v-else class="mt-2 space-y-1.5" role="list">
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
			</div>
			<button
				v-if="!done"
				type="button"
				class="btn btn-primary shrink-0"
				:disabled="!ready"
				@click="emit('complete')"
			>
				<CircleCheck :size="16" aria-hidden="true" />
				Görevi Tamamla
			</button>
		</div>
	</section>
</template>
