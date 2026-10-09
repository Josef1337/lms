<script setup lang="ts">
import { ArrowLeft, ArrowRight, CircleCheck, Lock } from 'lucide-vue-next'

defineProps<{
	current: number
	total: number
	canAdvance: boolean
	isSummary: boolean
	completed: boolean
	nextLabel: string
}>()
defineEmits<{ prev: []; next: []; complete: []; continueOn: [] }>()
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

			<div class="min-w-0 flex-1 text-center text-[13px]" aria-live="polite">
				<p
					v-if="!canAdvance"
					class="flex items-center justify-center gap-1.5 font-medium text-warning-700"
				>
					<Lock :size="14" class="shrink-0" aria-hidden="true" />
					<span class="truncate sm:hidden">Önce görevi tamamlayın</span>
					<span class="hidden truncate sm:inline"
						>Devam etmek için bu adımdaki görevi tamamlayın</span
					>
				</p>
				<p
					v-else-if="isSummary && completed"
					class="flex items-center justify-center gap-1.5 font-medium text-success-700"
				>
					<CircleCheck :size="14" aria-hidden="true" /> Ders tamamlandı
				</p>
				<p v-else class="text-ink-500">
					Adım <span class="font-semibold text-ink-800">{{ current + 1 }}</span> / {{ total }}
				</p>
			</div>

			<button
				v-if="!isSummary"
				type="button"
				class="btn btn-primary"
				:disabled="!canAdvance"
				@click="$emit('next')"
			>
				Sonraki
				<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</button>
			<button
				v-else-if="!completed"
				type="button"
				class="btn btn-accent"
				@click="$emit('complete')"
			>
				<CircleCheck :size="16" aria-hidden="true" />
				Dersi Tamamla
			</button>
			<button v-else type="button" class="btn btn-primary" @click="$emit('continueOn')">
				<span class="max-w-[42vw] truncate sm:max-w-none">{{ nextLabel }}</span>
				<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</button>
		</div>
	</div>
</template>
