<script setup lang="ts">
// The round (radio) or square (checkbox) mark in front of an option: empty,
// a graphite dot or fill while picked, a check when right and an X when the
// pick was wrong, so the result does not rest on colour alone.
import { computed } from 'vue'
import { Check, X } from 'lucide-vue-next'
import type { OptionState } from './optionState'

const props = defineProps<{ state: OptionState; multiple?: boolean }>()

const MARK: Record<OptionState, string> = {
	idle: 'border-ink-300 bg-white',
	selected: 'border-ink-900 bg-white',
	correct: 'border-success-600 bg-success-600 text-white',
	missed: 'border-success-600 bg-white text-success-700',
	wrong: 'border-danger-600 bg-danger-600 text-white',
	muted: 'border-ink-300 bg-white',
}
// A picked checkbox is filled; a picked radio keeps a dot (in the template).
// High contrast mode drops author fills, so the pick uses the system
// highlight there, like the option's border (see .option-card-selected).
const mark = computed(() =>
	props.state === 'selected' && props.multiple
		? 'border-ink-900 bg-ink-900 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]'
		: MARK[props.state]
)
</script>

<template>
	<span
		:class="[
			'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 transition',
			multiple ? 'rounded-md' : 'rounded-full',
			mark,
		]"
		aria-hidden="true"
	>
		<span
			v-if="state === 'selected' && !multiple"
			class="h-2 w-2 rounded-full bg-ink-900 forced-colors:bg-[Highlight]"
		/>
		<X v-else-if="state === 'wrong'" :size="12" :stroke-width="3.5" />
		<Check v-else-if="state !== 'idle' && state !== 'muted'" :size="12" :stroke-width="3.5" />
	</span>
</template>
