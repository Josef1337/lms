<script setup lang="ts">
// The Copilot icon wherever the UI shows Copilot itself answering or acting.
import { COPILOT_LOGO } from './appLogos'

withDefaults(defineProps<{ size?: number }>(), { size: 16 })
</script>

<template>
	<img
		:src="COPILOT_LOGO"
		alt=""
		aria-hidden="true"
		draggable="false"
		:width="size"
		:height="size"
		class="inline-block shrink-0 select-none object-contain"
	/>
</template>
