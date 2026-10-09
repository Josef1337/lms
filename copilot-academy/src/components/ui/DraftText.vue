<script setup lang="ts">
// Draft text where "[...]" marks a gap Copilot left for the author to fill.
import { computed } from 'vue'
import RichText from './RichText.vue'

const props = defineProps<{ text: string; as?: string }>()
const parts = computed(() =>
	props.text
		.split(/(\[[^\]]+\])/g)
		.filter(Boolean)
		.map((value) => ({ gap: value.startsWith('[') && value.endsWith(']'), value }))
)
</script>

<template>
	<component :is="as ?? 'span'">
		<template v-for="(p, i) in parts" :key="i">
			<mark
				v-if="p.gap"
				class="rounded bg-amber-100 px-1 text-amber-900 ring-1 ring-inset ring-amber-300"
				title="Yer tutucu: bu bilgiyi siz doldurmalısınız"
				>{{ p.value }}<span class="sr-only"> (doldurulması gereken alan)</span></mark
			>
			<RichText v-else :text="p.value" />
		</template>
	</component>
</template>
