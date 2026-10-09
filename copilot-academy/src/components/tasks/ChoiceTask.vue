<script setup lang="ts">
import { computed, ref } from 'vue'
import { Check, RotateCcw } from 'lucide-vue-next'
import type { ChoiceTaskBlock } from '@/types/content'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import FeedbackNote from './FeedbackNote.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ block: ChoiceTaskBlock; label?: string }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)
const selected = ref<string[]>(Array.isArray(stored?.answer) ? (stored.answer as string[]) : [])
const checked = ref(!!stored)

const correctIds = computed(() => props.block.options.filter((o) => o.correct).map((o) => o.id))
const isCorrect = computed(
	() =>
		selected.value.length === correctIds.value.length &&
		correctIds.value.every((id) => selected.value.includes(id))
)
const partial = computed(
	() => !isCorrect.value && selected.value.some((id) => correctIds.value.includes(id))
)

function pick(id: string) {
	if (checked.value) return
	if (props.block.multiple) {
		selected.value = selected.value.includes(id)
			? selected.value.filter((x) => x !== id)
			: [...selected.value, id]
	} else selected.value = [id]
}

function check() {
	if (!selected.value.length) return
	checked.value = true
	const hits = selected.value.filter((id) => correctIds.value.includes(id)).length
	const wrong = selected.value.length - hits
	progress.recordTask(props.block.id, {
		correct: isCorrect.value,
		score: Math.max(0, (hits - wrong) / correctIds.value.length),
		answer: [...selected.value],
	})
}

function retry() {
	checked.value = false
	selected.value = []
}

function optionClass(id: string, correct?: boolean) {
	const isSelected = selected.value.includes(id)
	if (!checked.value) return isSelected ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500' : ''
	if (correct) return 'border-success-600/60 bg-success-50'
	if (isSelected) return 'border-danger-600/50 bg-danger-50'
	return 'opacity-70'
}
</script>

<template>
	<TaskCard
		data-task="choice"
		:prompt="block.prompt"
		:label="label"
		:done="progress.isTaskDone(block.id)"
	>
		<RichText
			v-if="block.context"
			as="p"
			:text="block.context"
			class="mb-3 rounded-lg bg-ink-50 px-3.5 py-2.5 text-sm text-ink-700"
		/>
		<p class="mb-2 text-xs font-medium text-ink-500">
			{{ block.multiple ? 'Uygun olanların hepsini seçin.' : 'Bir seçenek seçin.' }}
		</p>
		<div :role="block.multiple ? 'group' : 'radiogroup'" class="space-y-2">
			<button
				v-for="option in block.options"
				:key="option.id"
				type="button"
				:role="block.multiple ? 'checkbox' : 'radio'"
				:aria-checked="selected.includes(option.id)"
				:aria-disabled="checked"
				:class="[
					'option-card',
					optionClass(option.id, option.correct),
					checked && 'cursor-default hover:bg-transparent',
				]"
				@click="pick(option.id)"
			>
				<span
					:class="[
						'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition',
						block.multiple ? 'rounded-md' : 'rounded-full',
						selected.includes(option.id)
							? 'border-brand-600 bg-brand-600 text-white'
							: 'border-ink-300 bg-white',
					]"
					aria-hidden="true"
				>
					<Check v-if="selected.includes(option.id)" :size="12" :stroke-width="3.5" />
				</span>
				<span class="min-w-0 flex-1">
					<RichText :text="option.text" />
					<RichText
						v-if="checked && (selected.includes(option.id) || option.correct)"
						as="span"
						:text="option.feedback"
						:class="[
							'mt-1.5 block text-[13px] leading-relaxed',
							option.correct ? 'text-success-700' : 'text-danger-700',
						]"
					/>
				</span>
			</button>
		</div>
		<div v-if="checked" class="mt-4">
			<FeedbackNote
				:tone="isCorrect ? 'correct' : partial ? 'partial' : 'incorrect'"
				:body="block.explanation"
			/>
		</div>
		<template #footer>
			<button
				v-if="!checked"
				type="button"
				class="btn btn-primary"
				:disabled="!selected.length"
				@click="check"
			>
				Kontrol et
			</button>
			<button v-else type="button" class="btn btn-secondary" @click="retry">
				<RotateCcw :size="15" aria-hidden="true" /> Tekrar dene
			</button>
			<span v-if="!checked && !selected.length" class="text-xs text-ink-500"
				>Önce bir seçim yapın.</span
			>
		</template>
	</TaskCard>
</template>
