<script setup lang="ts">
import { Check, X } from 'lucide-vue-next'
import type { ListBlock } from '@/types/content'
import RichText from '@/components/ui/RichText.vue'

defineProps<{ block: ListBlock }>()
</script>

<template>
	<section class="max-w-[72ch]">
		<h4 v-if="block.title" class="mb-2.5 text-sm font-semibold text-ink-800">{{ block.title }}</h4>
		<ol v-if="block.style === 'number'" class="space-y-2.5" role="list">
			<li v-for="(item, i) in block.items" :key="i" class="flex gap-3 text-ink-700">
				<span
					class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-bold text-brand-700 ring-1 ring-inset ring-brand-200"
				>
					{{ i + 1 }}
				</span>
				<RichText :text="item" class="text-pretty" />
			</li>
		</ol>
		<ul v-else class="space-y-2" role="list">
			<li v-for="(item, i) in block.items" :key="i" class="flex gap-2.5 text-ink-700">
				<span
					v-if="block.style === 'check'"
					class="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-success-50 text-success-700 ring-1 ring-inset ring-success-100"
				>
					<Check :size="12" :stroke-width="3" aria-hidden="true" />
				</span>
				<span
					v-else-if="block.style === 'cross'"
					class="mt-[3px] flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-danger-50 text-danger-600 ring-1 ring-inset ring-danger-100"
				>
					<X :size="12" :stroke-width="3" aria-hidden="true" />
				</span>
				<span
					v-else
					class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
					aria-hidden="true"
				/>
				<RichText :text="item" class="text-pretty" />
			</li>
		</ul>
	</section>
</template>
