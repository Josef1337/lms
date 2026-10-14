<script setup lang="ts">
// Pick one option (or several), then “Kontrol et”. A pick stays neutral until
// it is checked; then the right options turn green and a wrong pick red.
import { computed, nextTick, ref } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import type { ChoiceTaskBlock } from '@/types/content'
import { seededShuffle } from '@/lib/shuffle'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import FeedbackNote from './FeedbackNote.vue'
import OptionMark from './OptionMark.vue'
import TaskCard from './TaskCard.vue'
import { OPTION_CARD, OPTION_SR, optionState } from './optionState'

const props = defineProps<{ block: ChoiceTaskBlock; label?: string }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)
const selected = ref<string[]>(Array.isArray(stored?.answer) ? (stored.answer as string[]) : [])
const checked = ref(!!stored)
const optionList = ref<HTMLElement | null>(null)
const result = ref<HTMLElement | null>(null)

// A fixed order per task, so the right answer is not always in the same
// place. No option, feedback or explanation points at another option by
// letter or position, so the order is free.
const options = computed(() =>
	seededShuffle(props.block.options, props.block.id).map((o) => ({
		...o,
		state: optionState(selected.value.includes(o.id), checked.value, !!o.correct),
	}))
)
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

async function check() {
	if (!selected.value.length) return
	checked.value = true
	const hits = selected.value.filter((id) => correctIds.value.includes(id)).length
	const wrong = selected.value.length - hits
	progress.recordTask(props.block.id, {
		correct: isCorrect.value,
		score: Math.max(0, (hits - wrong) / correctIds.value.length),
		answer: [...selected.value],
	})
	// The pressed button gives way to “Tekrar dene”; the feedback takes the focus.
	await nextTick()
	result.value?.focus()
}

async function retry() {
	checked.value = false
	selected.value = []
	// “Tekrar dene” goes away and “Kontrol et” waits for a pick: start there.
	await nextTick()
	optionList.value?.querySelector<HTMLElement>('button')?.focus()
}
</script>

<template>
	<TaskCard
		data-task="choice"
		:prompt="block.prompt"
		:label="label"
		:done="progress.isTaskDone(block.id)"
		:correct="progress.taskResult(block.id)?.correct"
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
		<div ref="optionList" :role="block.multiple ? 'group' : 'radiogroup'" class="space-y-2">
			<button
				v-for="option in options"
				:key="option.id"
				type="button"
				:role="block.multiple ? 'checkbox' : 'radio'"
				:aria-checked="selected.includes(option.id)"
				:aria-disabled="checked"
				:data-state="option.state"
				:class="['option-card', OPTION_CARD[option.state], checked && 'cursor-default']"
				@click="pick(option.id)"
			>
				<OptionMark :state="option.state" :multiple="block.multiple" />
				<span class="min-w-0 flex-1">
					<RichText :text="option.text" />
					<span v-if="OPTION_SR[option.state]" class="sr-only"
						>, {{ OPTION_SR[option.state] }}</span
					>
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
		<div v-if="checked" ref="result" tabindex="-1" class="mt-4 rounded-xl">
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
