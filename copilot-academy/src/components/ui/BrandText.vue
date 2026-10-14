<script setup lang="ts">
// Text for uppercase labels. The page language is Turkish, so the browser
// would capitalise the "i" of English brand names as "İ" (COPİLOT,
// POWERPOİNT); marking the brand names as English keeps them right while the
// Turkish words around them still get Turkish capitals.
import { computed } from 'vue'

const props = defineProps<{ text: string }>()

const BRANDS = /(Copilot|PowerPoint|Microsoft|OneDrive|OneNote|Builder)/
// split() with a capture group: odd entries are the brand names.
const parts = computed(() => props.text.split(BRANDS))
</script>

<template>
	<template v-for="(part, i) in parts" :key="i"
		><span v-if="i % 2" lang="en">{{ part }}</span
		><template v-else>{{ part }}</template></template
	>
</template>
