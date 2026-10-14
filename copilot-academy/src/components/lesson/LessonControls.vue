<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { ArrowLeft, ArrowRight, CircleCheck, Lock } from 'lucide-vue-next'

const props = defineProps<{
	current: number
	total: number
	/** Required tasks of this step still open; "Sonraki" waits for them. */
	pending: number
	isSummary: boolean
	completed: boolean
	nextLabel: string
}>()
defineEmits<{ prev: []; next: []; goToTask: []; continueOn: [] }>()

const goToButton = ref<HTMLButtonElement | null>(null)
const nextButton = ref<HTMLButtonElement | null>(null)

// "Göreve git" goes away with the last open task; if it held focus, hand it
// to the now enabled "Sonraki" instead of dropping it on the page.
watch(
	() => props.pending,
	async (left) => {
		if (left > 0 || document.activeElement !== goToButton.value) return
		await nextTick()
		nextButton.value?.focus()
	}
)
</script>

<template>
	<div
		class="no-print sticky bottom-0 z-20 mt-10 border-t border-ink-200/80 bg-white/90 backdrop-blur-md"
	>
		<div class="mx-auto flex max-w-[1240px] items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
			<button
				type="button"
				class="btn btn-secondary px-3 sm:px-4"
				:disabled="current === 0"
				@click="$emit('prev')"
			>
				<ArrowLeft :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
				<span class="hidden sm:inline">Önceki</span>
				<span class="sr-only sm:hidden">Önceki adım</span>
			</button>

			<div class="flex min-w-0 flex-1 justify-center text-center text-[13px]" aria-live="polite">
				<!-- Says what is missing and takes the learner there, instead of a bare lock. -->
				<button
					v-if="pending > 0"
					ref="goToButton"
					type="button"
					class="flex min-h-[40px] min-w-0 items-center gap-2 rounded-lg border border-warning-100 bg-warning-50 px-3 py-1 text-start text-warning-700 transition hover:border-warning-600/40 hover:bg-warning-100"
					@click="$emit('goToTask')"
				>
					<Lock :size="14" class="shrink-0" aria-hidden="true" />
					<span class="flex min-w-0 flex-col leading-tight sm:flex-row sm:items-center sm:gap-1.5">
						<span class="truncate font-medium">{{ pending }} görev kaldı</span>
						<span class="hidden sm:inline" aria-hidden="true">·</span>
						<span class="truncate font-semibold underline underline-offset-2">Göreve git</span>
					</span>
				</button>
				<p
					v-else-if="isSummary && completed"
					class="flex items-center justify-center gap-1.5 font-medium text-success-700"
				>
					<CircleCheck :size="14" class="shrink-0" aria-hidden="true" />
					<!-- Short on phones, where the next-lesson button takes most of the bar. -->
					<span class="whitespace-nowrap sm:hidden">Tamamlandı</span>
					<span class="hidden whitespace-nowrap sm:inline">Ders tamamlandı</span>
				</p>
				<p v-else class="text-ink-500">
					Adım <span class="font-semibold text-ink-800">{{ current + 1 }}</span> / {{ total }}
				</p>
			</div>

			<button
				v-if="!isSummary"
				ref="nextButton"
				type="button"
				class="btn btn-primary"
				:disabled="pending > 0"
				@click="$emit('next')"
			>
				Sonraki
				<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</button>
			<button v-else type="button" class="btn btn-primary" @click="$emit('continueOn')">
				<span class="max-w-[42vw] truncate sm:max-w-none">{{ nextLabel }}</span>
				<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</button>
		</div>
	</div>
</template>
