<script setup lang="ts">
import { computed } from 'vue'
import { icons, type IconName } from './icons'

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 18 })
const component = computed(() => icons[props.name])
</script>

<template>
	<component :is="component" :size="size" :stroke-width="1.9" aria-hidden="true" />
</template>
