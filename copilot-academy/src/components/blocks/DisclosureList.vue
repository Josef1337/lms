<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'
import type { DisclosureBlock } from '@/types/content'
import RichText from '@/components/ui/RichText.vue'

defineProps<{ block: DisclosureBlock }>()
const asList = (body: string | string[]) => (Array.isArray(body) ? body : [body])
</script>

<template>
	<section>
		<h4 v-if="block.title" class="mb-2 text-sm font-semibold text-ink-700">{{ block.title }}</h4>
		<div
			class="divide-y divide-ink-200/80 overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-card"
		>
			<details v-for="item in block.items" :key="item.title" class="group">
				<summary
					class="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-[15px] font-semibold text-ink-800 hover:bg-ink-50 [&::-webkit-details-marker]:hidden"
				>
					{{ item.title }}
					<ChevronDown
						:size="18"
						class="shrink-0 text-ink-400 transition-transform group-open:rotate-180"
						aria-hidden="true"
					/>
				</summary>
				<div class="space-y-2 px-4 pb-4 text-sm leading-relaxed text-ink-600">
					<RichText v-for="(p, i) in asList(item.body)" :key="i" as="p" :text="p" />
				</div>
			</details>
		</div>
	</section>
</template>
