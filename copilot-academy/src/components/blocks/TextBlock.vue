<script setup lang="ts">
import { computed } from 'vue'
import type { TextBlock } from '@/types/content'
import RichText from '@/components/ui/RichText.vue'

const props = defineProps<{ block: TextBlock }>()
const paragraphs = computed(() =>
	Array.isArray(props.block.body) ? props.block.body : [props.block.body]
)
</script>

<template>
	<div class="max-w-[68ch] space-y-3">
		<RichText
			v-for="(p, i) in paragraphs"
			:key="i"
			as="p"
			:text="p"
			:class="
				block.lead
					? 'text-[17px] leading-relaxed text-ink-700 text-pretty'
					: 'text-ink-700 text-pretty'
			"
		/>
	</div>
</template>
