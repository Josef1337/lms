<script setup lang="ts">
import { computed, ref } from 'vue'
import type { PromptAnatomyBlock, PromptPart } from '@/types/content'
import { PART_META, PART_ORDER } from '@/lib/promptBuilder'
import { PART_STYLE } from '@/components/ui/promptParts'
import RichText from '@/components/ui/RichText.vue'

const props = defineProps<{ block: PromptAnatomyBlock }>()
const focus = ref<PromptPart | null>(null)

const present = computed(() =>
	PART_ORDER.filter((p) => props.block.segments.some((s) => s.part === p))
)

function toggle(part: PromptPart) {
	focus.value = focus.value === part ? null : part
}
</script>

<template>
	<figure class="overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card">
		<div
			class="flex flex-wrap gap-2 border-b border-ink-100 bg-ink-50/70 px-4 py-3"
			role="group"
			aria-label="Prompt bileşenlerini vurgula"
		>
			<button
				v-for="part in present"
				:key="part"
				type="button"
				:aria-pressed="focus === part"
				:class="[
					'chip ring-1 ring-inset transition',
					PART_STYLE[part].chip,
					focus && focus !== part ? 'opacity-45' : '',
					focus === part ? 'shadow-raised' : '',
				]"
				@click="toggle(part)"
			>
				<span :class="['h-2 w-2 rounded-full', PART_STYLE[part].dot]" aria-hidden="true" />
				{{ PART_META[part].label }}
			</button>
			<span class="ms-auto hidden self-center text-xs text-ink-500 sm:inline"
				>Bir bileşene tıklayarak vurgulayın</span
			>
		</div>
		<blockquote class="px-5 py-5 text-[16px] leading-[2.1] text-ink-800">
			<template v-for="(seg, i) in block.segments" :key="i">
				<mark
					v-if="seg.part"
					:class="[
						'rounded px-1 py-0.5 underline decoration-2 underline-offset-4 transition [box-decoration-break:clone]',
						PART_STYLE[seg.part].mark,
						focus && focus !== seg.part ? 'bg-transparent !text-ink-400 no-underline' : '',
					]"
					>{{ seg.text }}</mark
				>
				<span v-else :class="focus ? 'text-ink-400' : ''">{{ seg.text }}</span>
			</template>
		</blockquote>
		<figcaption
			v-if="block.caption || focus"
			class="border-t border-ink-100 px-5 py-3 text-sm text-ink-600"
		>
			<template v-if="focus">
				<strong class="font-semibold text-ink-900">{{ PART_META[focus].label }}:</strong>
				{{ PART_META[focus].question }}
			</template>
			<RichText v-else :text="block.caption!" />
		</figcaption>
	</figure>
</template>
