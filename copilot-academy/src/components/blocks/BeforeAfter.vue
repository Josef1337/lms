<script setup lang="ts">
import { ref } from 'vue'
import { ArrowRight, Check } from 'lucide-vue-next'
import type { BeforeAfterBlock } from '@/types/content'
import DraftText from '@/components/ui/DraftText.vue'
import BrandText from '@/components/ui/BrandText.vue'
import RichText from '@/components/ui/RichText.vue'

defineProps<{ block: BeforeAfterBlock }>()
const view = ref<'before' | 'after'>('after')
</script>

<template>
	<section class="space-y-3">
		<div
			class="inline-flex rounded-lg border border-ink-200 bg-ink-50 p-1 md:hidden"
			role="group"
			aria-label="Görünüm"
		>
			<button
				v-for="key in ['before', 'after'] as const"
				:key="key"
				type="button"
				:aria-pressed="view === key"
				:class="[
					'rounded-md px-3 py-1.5 text-[13px] font-semibold transition',
					view === key ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500',
				]"
				@click="view = key"
			>
				{{ key === 'before' ? block.before.label : block.after.label }}
			</button>
		</div>
		<div class="grid items-stretch gap-3 md:grid-cols-[1fr_auto_1fr]">
			<div
				:class="[
					'rounded-xl border border-dashed border-ink-300 bg-ink-50/70 p-4',
					view === 'after' && 'hidden md:block',
				]"
			>
				<p class="eyebrow mb-2"><BrandText :text="block.before.label" /></p>
				<DraftText
					as="p"
					:text="block.before.text"
					class="text-[15px] leading-relaxed text-ink-600"
				/>
			</div>
			<div class="hidden items-center md:flex" aria-hidden="true">
				<span
					class="flex h-8 w-8 items-center justify-center rounded-full bg-white text-ink-500 shadow-card ring-1 ring-ink-200"
				>
					<ArrowRight :size="16" class="rtl:-scale-x-100" />
				</span>
			</div>
			<div
				:class="[
					'rounded-xl border border-success-100 bg-white p-4 shadow-card ring-1 ring-success-100',
					view === 'before' && 'hidden md:block',
				]"
			>
				<p class="eyebrow mb-2 !text-success-700"><BrandText :text="block.after.label" /></p>
				<DraftText
					as="p"
					:text="block.after.text"
					class="text-[15px] leading-relaxed text-ink-800"
				/>
			</div>
		</div>
		<ul v-if="block.notes?.length" class="grid gap-2 sm:grid-cols-2" role="list">
			<li
				v-for="(n, i) in block.notes"
				:key="i"
				class="flex gap-2 rounded-lg bg-success-50/70 px-3 py-2 text-[13px] text-ink-700"
			>
				<Check :size="15" class="mt-0.5 shrink-0 text-success-700" aria-hidden="true" />
				<RichText :text="n" />
			</li>
		</ul>
	</section>
</template>
