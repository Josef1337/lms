<script setup lang="ts">
// Renders content strings. `**bold**` is the only markup; everything else is
// text, so content can never inject HTML.
import { computed } from 'vue'

const props = defineProps<{ text: string; as?: string }>()

const parts = computed(() =>
	props.text
		.split(/(\*\*[^*]+\*\*)/g)
		.filter(Boolean)
		.map((chunk) =>
			chunk.startsWith('**') && chunk.endsWith('**')
				? { strong: true, value: chunk.slice(2, -2) }
				: { strong: false, value: chunk }
		)
)
</script>

<template>
	<component :is="as ?? 'span'">
		<template v-for="(part, i) in parts" :key="i">
			<strong v-if="part.strong" class="font-semibold text-ink-900">{{ part.value }}</strong>
			<template v-else>{{ part.value }}</template>
		</template>
	</component>
</template>
