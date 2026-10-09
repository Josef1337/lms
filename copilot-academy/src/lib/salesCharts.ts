// Chart options for the Excel lab. Marks follow one spec everywhere: bars at
// most 24px with a 4px rounded end, 2px lines, 8px markers with a surface
// ring, hairline solid grid, text in ink tokens. Actual sales are the single
// coloured series; the target is a dark reference tick or dashed threshold,
// so the two never rely on hue alone.
import type { BarSeriesOption, LineSeriesOption, ScatterSeriesOption } from 'echarts/charts'
import type {
	GridComponentOption,
	LegendComponentOption,
	MarkLineComponentOption,
	TooltipComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'
import type { MonthSummary, ProductSummary, RegionSummary, Segment } from './salesAnalytics'

export type ChartOption = ComposeOption<
	| BarSeriesOption
	| LineSeriesOption
	| ScatterSeriesOption
	| GridComponentOption
	| LegendComponentOption
	| MarkLineComponentOption
	| TooltipComponentOption
>

const C = {
	actual: '#2a78d6',
	target: '#252b3a',
	grid: '#eff1f5',
	axis: '#cdd3dc',
	label: '#6b7487',
	text: '#252b3a',
	surface: '#ffffff',
}

const FONT = '"Segoe UI Variable Text","Segoe UI",Inter,system-ui,sans-serif'
const nf = new Intl.NumberFormat('tr-TR')
const pct = (ratio: number, digits = 1) =>
	'%' + (ratio * 100).toLocaleString('tr-TR', { maximumFractionDigits: digits })

const textStyle = { fontFamily: FONT, color: C.label, fontSize: 12 }

const tooltip: TooltipComponentOption = {
	trigger: 'axis',
	axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(42,120,214,0.06)' } },
	backgroundColor: '#ffffff',
	borderColor: '#e2e6ec',
	borderWidth: 1,
	padding: [8, 12],
	textStyle: { fontFamily: FONT, color: C.text, fontSize: 12 },
	extraCssText: 'box-shadow:0 6px 16px -4px rgba(22,27,39,.12);border-radius:10px;',
}

const legend = (items: { name: string; icon: string }[]): LegendComponentOption => ({
	top: 0,
	right: 0,
	itemWidth: 14,
	itemHeight: 8,
	itemGap: 16,
	textStyle: { ...textStyle, color: C.text },
	data: items,
})

const valueAxis = (name?: string) => ({
	type: 'value' as const,
	name,
	nameTextStyle: { ...textStyle, align: 'left' as const },
	axisLabel: { ...textStyle, formatter: (v: number) => nf.format(v) },
	splitLine: { lineStyle: { color: C.grid, width: 1 } },
	axisLine: { show: false },
	axisTick: { show: false },
})

const categoryAxis = (data: string[]) => ({
	type: 'category' as const,
	data,
	axisLabel: { ...textStyle, color: C.text },
	axisLine: { lineStyle: { color: C.axis } },
	axisTick: { show: false },
})

const targetTicks = (data: number[], horizontal = false): ScatterSeriesOption => ({
	name: 'Hedef',
	type: 'scatter',
	data,
	symbol: 'rect',
	symbolSize: horizontal ? [3, 30] : [34, 3],
	itemStyle: { color: C.target },
	z: 5,
})

/** Regions: actual bars with the target as a dark tick (bullet chart). */
export function regionChart(regions: RegionSummary[]): ChartOption {
	return {
		textStyle: { fontFamily: FONT },
		grid: { left: 8, right: 8, top: 44, bottom: 4, containLabel: true },
		legend: legend([
			{ name: 'Gerçekleşen', icon: 'roundRect' },
			{ name: 'Hedef', icon: 'rect' },
		]),
		tooltip: {
			...tooltip,
			formatter: (params: unknown) => {
				const list = params as { dataIndex: number }[]
				const r = regions[list[0].dataIndex]
				return `<b>${r.region}</b><br/>Gerçekleşen: ${nf.format(
					r.actual
				)} bin ₺<br/>Hedef: ${nf.format(r.target)} bin ₺<br/>Gerçekleşme: ${pct(r.attainment)}`
			},
		},
		// Attainment rides on the category label, so it never collides with
		// the target tick that may sit just above a bar.
		xAxis: {
			...categoryAxis(regions.map((r) => `${r.region}\n${pct(r.attainment)}`)),
			axisLabel: { ...textStyle, color: C.text, lineHeight: 18, fontWeight: 500 },
		},
		yAxis: valueAxis('bin ₺'),
		series: [
			{
				name: 'Gerçekleşen',
				type: 'bar',
				data: regions.map((r) => r.actual),
				barMaxWidth: 24,
				itemStyle: { color: C.actual, borderRadius: [4, 4, 0, 0] },
			},
			targetTicks(regions.map((r) => r.target)),
		],
	}
}

/** Products: horizontal actual bars, largest first, with target ticks. */
export function productChart(products: ProductSummary[]): ChartOption {
	const ordered = [...products].reverse()
	return {
		textStyle: { fontFamily: FONT },
		grid: { left: 8, right: 64, top: 36, bottom: 4, containLabel: true },
		legend: legend([
			{ name: 'Gerçekleşen', icon: 'roundRect' },
			{ name: 'Hedef', icon: 'rect' },
		]),
		tooltip: {
			...tooltip,
			formatter: (params: unknown) => {
				const p = ordered[(params as { dataIndex: number }[])[0].dataIndex]
				return `<b>${p.product}</b><br/>Gerçekleşen: ${nf.format(p.actual)} bin ₺<br/>Pay: ${pct(
					p.share
				)}<br/>Hedef gerçekleşme: ${pct(p.attainment)}`
			},
		},
		xAxis: valueAxis(),
		yAxis: categoryAxis(ordered.map((p) => p.product)),
		series: [
			{
				name: 'Gerçekleşen',
				type: 'bar',
				data: ordered.map((p) => p.actual),
				barMaxWidth: 24,
				itemStyle: { color: C.actual, borderRadius: [0, 4, 4, 0] },
				label: {
					show: true,
					position: 'right',
					distance: 10,
					...textStyle,
					color: C.text,
					fontWeight: 600,
					formatter: (p: { value: unknown }) => nf.format(Number(p.value)),
				},
			},
			targetTicks(
				ordered.map((p) => p.target),
				true
			),
		],
	}
}

/** Months: actual as a line, target as a dashed threshold. */
export function monthChart(months: MonthSummary[]): ChartOption {
	const values = months.flatMap((m) => [m.actual, m.target])
	const min = Math.floor((Math.min(...values) * 0.94) / 100) * 100
	return {
		textStyle: { fontFamily: FONT },
		grid: { left: 8, right: 56, top: 44, bottom: 4, containLabel: true },
		legend: legend([
			{ name: 'Gerçekleşen', icon: 'circle' },
			{ name: 'Hedef', icon: 'rect' },
		]),
		tooltip: {
			...tooltip,
			axisPointer: { type: 'line', lineStyle: { color: C.axis, width: 1 } },
			formatter: (params: unknown) => {
				const m = months[(params as { dataIndex: number }[])[0].dataIndex]
				const change =
					m.change === null
						? ''
						: `<br/>Önceki aya göre: ${m.change >= 0 ? '+' : '−'}${pct(Math.abs(m.change))}`
				return `<b>${m.month}</b><br/>Gerçekleşen: ${nf.format(
					m.actual
				)} bin ₺<br/>Hedef: ${nf.format(m.target)} bin ₺${change}`
			},
		},
		xAxis: { ...categoryAxis(months.map((m) => m.month)), boundaryGap: false },
		yAxis: { ...valueAxis('bin ₺'), min },
		series: [
			{
				name: 'Gerçekleşen',
				type: 'line',
				data: months.map((m) => m.actual),
				lineStyle: { color: C.actual, width: 2, cap: 'round', join: 'round' },
				itemStyle: { color: C.actual, borderColor: C.surface, borderWidth: 2 },
				symbol: 'circle',
				symbolSize: 9,
				areaStyle: { color: 'rgba(42,120,214,0.08)', origin: 'start' },
				endLabel: {
					show: true,
					...textStyle,
					color: C.text,
					fontWeight: 600,
					distance: 8,
					formatter: (p: { value: unknown }) => nf.format(Number(p.value)),
				},
			},
			{
				name: 'Hedef',
				type: 'line',
				data: months.map((m) => m.target),
				lineStyle: { color: C.target, width: 1.5, type: [6, 4] },
				itemStyle: { color: C.target },
				symbol: 'none',
			},
		],
	}
}

/** Below-target segments: the shortfall in thousands of lira, largest first. */
export function gapChart(segments: Segment[]): ChartOption {
	const ordered = [...segments].sort((a, b) => a.gap - b.gap)
	return {
		textStyle: { fontFamily: FONT },
		grid: { left: 8, right: 108, top: 12, bottom: 4, containLabel: true },
		tooltip: {
			...tooltip,
			formatter: (params: unknown) => {
				const s = ordered[(params as { dataIndex: number }[])[0].dataIndex]
				return `<b>${s.region} · ${s.product}</b><br/>Açık: ${nf.format(
					s.gap
				)} bin ₺<br/>Gerçekleşme: ${pct(s.attainment)}<br/>Hedef altı ay: ${s.monthsBelow}/4`
			},
		},
		xAxis: valueAxis(),
		yAxis: categoryAxis(ordered.map((s) => `${s.region} · ${s.product}`)),
		series: [
			{
				name: 'Hedefe göre açık',
				type: 'bar',
				data: ordered.map((s) => s.gap),
				barMaxWidth: 24,
				itemStyle: { color: C.actual, borderRadius: [0, 4, 4, 0] },
				label: {
					show: true,
					position: 'right',
					distance: 10,
					...textStyle,
					color: C.text,
					formatter: (p: { dataIndex: number }) =>
						`${nf.format(ordered[p.dataIndex].gap)} · ${pct(ordered[p.dataIndex].attainment)}`,
				},
			},
		],
	}
}

/** Region attainment against a 100% reference line. */
export function attainmentChart(regions: RegionSummary[]): ChartOption {
	const ordered = [...regions].sort((a, b) => a.attainment - b.attainment)
	return {
		textStyle: { fontFamily: FONT },
		grid: { left: 8, right: 64, top: 28, bottom: 4, containLabel: true },
		tooltip: {
			...tooltip,
			formatter: (params: unknown) => {
				const r = ordered[(params as { dataIndex: number }[])[0].dataIndex]
				return `<b>${r.region}</b><br/>Gerçekleşme: ${pct(r.attainment)}`
			},
		},
		xAxis: {
			...valueAxis(),
			min: 80,
			max: 115,
			axisLabel: { ...textStyle, formatter: (v: number) => `%${v}` },
		},
		yAxis: categoryAxis(ordered.map((r) => r.region)),
		series: [
			{
				name: 'Hedef gerçekleşme',
				type: 'bar',
				data: ordered.map((r) => Math.round(r.attainment * 1000) / 10),
				barMaxWidth: 24,
				itemStyle: { color: C.actual, borderRadius: [0, 4, 4, 0] },
				label: {
					show: true,
					position: 'right',
					distance: 10,
					...textStyle,
					color: C.text,
					fontWeight: 600,
					formatter: (p: { dataIndex: number }) => pct(ordered[p.dataIndex].attainment),
				},
				markLine: {
					symbol: 'none',
					silent: true,
					lineStyle: { color: C.target, width: 1, type: 'solid' },
					label: { ...textStyle, color: C.text, formatter: 'Hedef %100', position: 'end' },
					data: [{ xAxis: 100 }],
				},
			},
		],
	}
}
