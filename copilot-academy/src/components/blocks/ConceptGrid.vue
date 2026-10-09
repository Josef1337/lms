<script setup lang="ts">
import { ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { ConceptsBlock } from '@/types/content'
import Icon from '@/components/ui/Icon.vue'
import RichText from '@/components/ui/RichText.vue'

const props = defineProps<{ block: ConceptsBlock }>()
const open = ref<Set<number>>(new Set())

function toggle(i: number) {
	const next = new Set(open.value)
	if (next.has(i)) next.delete(i)
	else next.add(i)
	open.value = next
}

const cols = props.block.columns === 3 ? 'md:grid-cols-2 xl:grid-cols-3' : 'md:grid-cols-2'
</script>

<template>
	<ul :class="['grid gap-3', cols]" role="list">
		<li
			v-for="(item, i) in block.items"
			:key="item.title"
			class="group flex flex-col rounded-xl border border-ink-200/80 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-raised"
		>
			<div class="flex items-start gap-3">
				<span
					class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
				>
					<Icon :name="item.icon" :size="18" />
				</span>
				<div class="min-w-0">
					<h4 class="text-[15px] font-semibold leading-snug">{{ item.title }}</h4>
					<RichText as="p" :text="item.body" class="mt-1 text-sm leading-relaxed text-ink-600" />
				</div>
			</div>
			<template v-if="item.detail">
				<button
					type="button"
					class="mt-3 inline-flex items-center gap-1 self-start rounded-md text-[13px] font-semibold text-brand-700 hover:text-brand-800"
					:aria-expanded="open.has(i)"
					@click="toggle(i)"
				>
					{{ open.has(i) ? 'Daha az göster' : 'Ayrıntıyı göster' }}
					<ChevronDown
						:size="14"
						:class="['transition-transform', open.has(i) && 'rotate-180']"
						aria-hidden="true"
					/>
				</button>
				<RichText
					v-if="open.has(i)"
					as="p"
					:text="item.detail"
					class="mt-2 animate-fade-in rounded-lg bg-ink-50 px-3 py-2.5 text-[13px] leading-relaxed text-ink-700"
				/>
			</template>
		</li>
	</ul>
</template>
