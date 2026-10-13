<script setup lang="ts">
import { nextTick, ref } from 'vue'
import { ChevronRight, RotateCcw } from 'lucide-vue-next'
import type { RevealBlock } from '@/types/content'
import AppFrame from '@/components/ui/AppFrame.vue'
import RichText from '@/components/ui/RichText.vue'

const props = defineProps<{ block: RevealBlock }>()
const shown = ref(1)
const list = ref<HTMLElement | null>(null)

async function next() {
	shown.value = Math.min(props.block.steps.length, shown.value + 1)
	await nextTick()
	list.value?.querySelectorAll<HTMLElement>('[data-reveal-step]')[shown.value - 1]?.focus()
}
</script>

<template>
	<section>
		<RichText
			v-if="block.intro"
			as="p"
			:text="block.intro"
			class="mb-4 max-w-[68ch] text-ink-700"
		/>
		<ol ref="list" class="relative space-y-3" role="list">
			<li
				v-for="(step, i) in block.steps.slice(0, shown)"
				:key="step.title"
				data-reveal-step
				tabindex="-1"
				class="animate-fade-up rounded-xl focus:outline-none"
			>
				<div class="flex gap-3">
					<div class="flex flex-col items-center">
						<span
							class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white shadow-card"
						>
							{{ i + 1 }}
						</span>
						<span
							v-if="i < block.steps.length - 1"
							class="mt-1 w-px flex-1 bg-ink-200"
							aria-hidden="true"
						/>
					</div>
					<div class="min-w-0 flex-1 pb-2">
						<h4 class="text-[15px] font-semibold">{{ step.title }}</h4>
						<RichText as="p" :text="step.body" class="mt-1 text-sm leading-relaxed text-ink-600" />
						<p
							v-if="step.prompt"
							class="mt-2.5 rounded-lg border border-iris-200 bg-iris-50 px-3 py-2 text-[13px] text-iris-800"
						>
							<span class="font-semibold">Örnek prompt: </span>“{{ step.prompt }}”
						</p>
						<AppFrame
							v-if="step.output"
							:visual="block.surface ?? 'chat'"
							:title="step.output.label"
							class="mt-2.5"
						>
							<ul class="space-y-1.5 px-4 py-3 text-[13px] leading-relaxed text-ink-700">
								<li v-for="(line, j) in step.output.lines" :key="j" class="flex gap-2">
									<span
										class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-500"
										aria-hidden="true"
									/>
									<RichText :text="line" />
								</li>
							</ul>
						</AppFrame>
					</div>
				</div>
			</li>
		</ol>
		<div class="mt-3 flex flex-wrap items-center gap-3 ps-10">
			<button
				v-if="shown < block.steps.length"
				type="button"
				class="btn btn-primary btn-sm"
				@click="next"
			>
				Sonraki adımı göster
				<ChevronRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</button>
			<button v-else type="button" class="btn btn-ghost btn-sm" @click="shown = 1">
				<RotateCcw :size="15" aria-hidden="true" />
				Baştan izle
			</button>
			<span class="text-xs text-ink-500" aria-live="polite"
				>{{ shown }}/{{ block.steps.length }} adım gösterildi</span
			>
		</div>
	</section>
</template>
