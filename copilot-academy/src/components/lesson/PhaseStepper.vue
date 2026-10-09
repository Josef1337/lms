<script setup lang="ts">
import { Check } from 'lucide-vue-next'
import { PHASES, type StepPhase } from './phases'

defineProps<{
	steps: { phase: StepPhase; title: string }[]
	current: number
	furthest: number
	completed: boolean
}>()
defineEmits<{ go: [index: number] }>()
</script>

<template>
	<nav aria-label="Ders adımları" class="-mx-1 overflow-x-auto px-1 pb-1 scrollbar-thin">
		<ol class="flex min-w-max items-center gap-1" role="list">
			<li v-for="(step, i) in steps" :key="i" class="flex items-center gap-1">
				<span
					v-if="i > 0"
					:class="['h-px w-4 sm:w-6', i <= furthest || completed ? 'bg-brand-300' : 'bg-ink-200']"
					aria-hidden="true"
				/>
				<button
					type="button"
					:disabled="!(completed || i <= furthest)"
					:aria-current="i === current ? 'step' : undefined"
					:title="step.title"
					:class="[
						'group flex items-center gap-2 rounded-full py-1 pe-3 ps-1 text-[13px] font-semibold transition',
						i === current
							? 'bg-ink-900 text-white shadow-raised'
							: completed || i <= furthest
							? 'bg-white text-ink-700 ring-1 ring-ink-200 hover:ring-brand-300'
							: 'bg-ink-50 text-ink-400 ring-1 ring-ink-200',
						'disabled:cursor-not-allowed',
					]"
					@click="$emit('go', i)"
				>
					<span
						:class="[
							'flex h-6 w-6 items-center justify-center rounded-full text-[11px]',
							i === current
								? 'bg-white/15 text-white'
								: i < furthest || completed
								? 'bg-success-50 text-success-700'
								: 'bg-ink-100 text-ink-500',
						]"
					>
						<Check
							v-if="(i < furthest || completed) && i !== current"
							:size="13"
							:stroke-width="3"
							aria-hidden="true"
						/>
						<component :is="PHASES[step.phase].icon" v-else :size="13" aria-hidden="true" />
					</span>
					<span :class="i === current ? '' : 'hidden sm:inline'">{{
						PHASES[step.phase].label
					}}</span>
					<span class="sr-only">— adım {{ i + 1 }}: {{ step.title }}</span>
				</button>
			</li>
		</ol>
	</nav>
</template>
