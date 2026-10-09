<script setup lang="ts">
// Thin wrapper around a tree-shaken ECharts build (SVG renderer). Only the
// Excel lab uses it, and it is loaded with that lab.
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { BarChart, LineChart, ScatterChart } from 'echarts/charts'
import {
	GridComponent,
	LegendComponent,
	MarkLineComponent,
	TooltipComponent,
} from 'echarts/components'
import { init, use, type ECharts } from 'echarts/core'
import { SVGRenderer } from 'echarts/renderers'
import type { ChartOption } from '@/lib/salesCharts'

use([
	BarChart,
	LineChart,
	ScatterChart,
	GridComponent,
	LegendComponent,
	MarkLineComponent,
	TooltipComponent,
	SVGRenderer,
])

const props = withDefaults(defineProps<{ option: ChartOption; height?: number; label: string }>(), {
	height: 280,
})

const el = ref<HTMLElement | null>(null)
let chart: ECharts | null = null
let observer: ResizeObserver | null = null

onMounted(() => {
	if (!el.value) return
	chart = init(el.value, undefined, { renderer: 'svg' })
	chart.setOption(props.option)
	observer = new ResizeObserver(() => chart?.resize())
	observer.observe(el.value)
})

watch(
	() => props.option,
	(option) => chart?.setOption(option, true)
)

onBeforeUnmount(() => {
	observer?.disconnect()
	chart?.dispose()
	chart = null
})
</script>

<template>
	<div ref="el" role="img" :aria-label="label" :style="{ height: `${height}px` }" class="w-full" />
</template>
