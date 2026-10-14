<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
	ArrowDown,
	ArrowUp,
	ArrowUpDown,
	ChevronDown,
	CircleCheck,
	Lightbulb,
	Table2,
	TrendingDown,
	TrendingUp,
	TriangleAlert,
} from 'lucide-vue-next'
import {
	MONTHS,
	SALES_ROWS,
	SALES_TITLE,
	type Month,
	type SalesRow,
} from '@/content/datasets/sales'
import {
	anomalies,
	attainment,
	belowTarget,
	byMonth,
	byProduct,
	byRegion,
	executiveInsights,
} from '@/lib/salesAnalytics'
import {
	attainmentChart,
	gapChart,
	monthChart,
	productChart,
	regionChart,
	type ChartOption,
} from '@/lib/salesCharts'
import { formatDelta, formatNumber, formatPercent } from '@/lib/format'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import EChart from './EChart.vue'
import TaskGoal from './TaskGoal.vue'
import CopilotMark from '@/components/ui/CopilotMark.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

type AnalysisId = 'regions' | 'products' | 'months' | 'below' | 'insights'

const ANALYSES: { id: AnalysisId; label: string; prompt: string }[] = [
	{
		id: 'regions',
		label: 'Hedefi aşan bölgeler',
		prompt:
			'Bölgelere göre hedef ve gerçekleşen satışları karşılaştır; hedefi aşan bölgeleri gerçekleşme oranlarıyla göster.',
	},
	{
		id: 'products',
		label: 'En çok satan ürünler',
		prompt:
			'Ürünleri toplam gerçekleşen satışa göre sırala; payını ve ilk aydan son aya büyümesini göster.',
	},
	{
		id: 'months',
		label: 'Aylık performans değişimi',
		prompt: 'Aylık toplam satışları hedefle karşılaştır ve bir önceki aya göre değişimi hesapla.',
	},
	{
		id: 'below',
		label: 'Hedefin altında kalan alanlar',
		prompt:
			'Bölge ve ürün kırılımında dört aylık toplamı hedefin altında kalan alanları, açık tutarıyla listele. Sıra dışı kayıtları ayrıca belirt.',
	},
	{
		id: 'insights',
		label: 'Yönetici için üç önemli bulgu',
		prompt:
			'Bu veriden yönetici için en önemli üç bulguyu çıkar. Her bulguyu rakamla destekle; veride olmayan neden ekleme.',
	},
]

const analysisId = ref<AnalysisId | null>(null)
const tried = ref<Set<AnalysisId>>(new Set())
const monthFilter = ref<Month | 'all'>('all')
type SortKey =
	| 'row'
	| 'month'
	| 'product'
	| 'region'
	| 'target'
	| 'actual'
	| 'customers'
	| 'attainment'
const sortKey = ref<SortKey>('row')
const sortDir = ref<1 | -1>(1)
const focusRow = ref(2)
// Below md the sheet starts folded, so the result sits right under the
// analysis buttons; from md up it is always shown (CSS decides).
const tableOpen = ref(false)

const rows = SALES_ROWS.map((r, i) => ({ ...r, excelRow: i + 2, att: attainment(r) }))
const regions = byRegion(SALES_ROWS)
const products = byProduct(SALES_ROWS)
const months = byMonth(SALES_ROWS)
const segments = belowTarget(SALES_ROWS)
const outliers = anomalies(SALES_ROWS)
const insights = executiveInsights(SALES_ROWS)
const weakRegions = regions.filter((r) => !r.aboveTarget).map((r) => r.region)

const visibleRows = computed(() => {
	const list = rows.filter((r) => monthFilter.value === 'all' || r.month === monthFilter.value)
	const key = sortKey.value
	const val = (r: typeof rows[number]): string | number =>
		key === 'row'
			? r.excelRow
			: key === 'month'
			? MONTHS.indexOf(r.month)
			: key === 'attainment'
			? r.att
			: r[key]
	return [...list].sort((a, b) => {
		const x = val(a)
		const y = val(b)
		return (
			(typeof x === 'string' ? x.localeCompare(String(y), 'tr') : x - (y as number)) * sortDir.value
		)
	})
})

function sortBy(key: SortKey) {
	if (sortKey.value === key) sortDir.value = sortDir.value === 1 ? -1 : 1
	else {
		sortKey.value = key
		sortDir.value =
			key === 'row' || key === 'month' || key === 'product' || key === 'region' ? 1 : -1
	}
}

type ColumnKey = Exclude<SortKey, 'row'>
interface Column {
	key: ColumnKey
	letter: string
	label: string
	numeric?: boolean
}

const COLUMNS: Column[] = [
	{ key: 'month', letter: 'A', label: 'Ay' },
	{ key: 'product', letter: 'B', label: 'Ürün' },
	{ key: 'region', letter: 'C', label: 'Bölge' },
	{ key: 'target', letter: 'D', label: 'Satış hedefi', numeric: true },
	{ key: 'actual', letter: 'E', label: 'Gerçekleşen satış', numeric: true },
	{ key: 'customers', letter: 'F', label: 'Müşteri sayısı', numeric: true },
	{ key: 'attainment', letter: 'G', label: 'Gerçekleşme %', numeric: true },
]

// Where the sheet is narrower than the table (phones, and the side-by-side
// layout from xl until 2xl) the attainment column (G) sits right after the
// region, so the figure every analysis rests on is readable without
// scrolling sideways. Tables cannot reorder cells with CSS, so G is rendered
// in both places and only one copy is displayed (the other is display:none,
// so it is out of the accessibility tree too).
const attainmentColumn = COLUMNS[6]
const SHEET_COLUMNS: (Column & { id: string; only: string })[] = [
	...COLUMNS.slice(0, 3).map((c) => ({ ...c, id: c.key, only: '' })),
	{ ...attainmentColumn, id: 'attainment-near', only: 'sm:hidden xl:table-cell 2xl:hidden' },
	...COLUMNS.slice(3, 6).map((c) => ({ ...c, id: c.key, only: '' })),
	{ ...attainmentColumn, id: 'attainment', only: 'hidden sm:table-cell xl:hidden 2xl:table-cell' },
]
const TOTAL_COLUMNS = SHEET_COLUMNS.slice(3)

function cellText(r: typeof rows[number], key: ColumnKey) {
	if (key === 'attainment') return formatPercent(r.att)
	const v = r[key]
	return typeof v === 'number' ? formatNumber(v) : v
}

function cellClass(r: typeof rows[number], c: Column) {
	if (c.key === 'attainment')
		return [
			'text-end font-medium tabular-nums',
			r.att >= 1 ? 'text-success-700' : 'text-danger-700',
		]
	if (c.numeric) return 'text-end tabular-nums'
	return c.key === 'month' ? '' : 'whitespace-nowrap'
}

const ariaSort = (key: SortKey) =>
	sortKey.value === key ? (sortDir.value === 1 ? 'ascending' : 'descending') : 'none'

const isOutlier = (r: SalesRow) => outliers.includes(r)

function rowTone(r: typeof rows[number]) {
	const id = analysisId.value
	if (!id) return ''
	if (id === 'regions' && weakRegions.includes(r.region)) return 'bg-amber-50'
	if (id === 'below' && r.actual < r.target) return 'bg-danger-50/70'
	if ((id === 'below' || id === 'insights') && isOutlier(r)) return 'bg-amber-50'
	if (id === 'products' && r.product === products[0].product) return 'bg-success-50'
	return ''
}

const resultBlock = ref<HTMLElement | null>(null)
const resultHeading = ref<HTMLElement | null>(null)
const announcement = ref('')

const motion = (): ScrollBehavior =>
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

/**
 * Brings the new result (heading to summary) on screen when it is not. The
 * block's scroll margins stand for the sticky header (57px) and the lesson
 * bar at the bottom (65px), plus a few pixels of air. It scrolls only as far
 * as needed, so on a laptop the analysis buttons can stay in view, but never
 * so far that the heading slips under the header.
 */
function reveal(block: HTMLElement, heading: HTMLElement) {
	const style = getComputedStyle(block)
	const viewTop = parseFloat(style.scrollMarginTop) || 0
	const viewBottom = window.innerHeight - (parseFloat(style.scrollMarginBottom) || 0)
	const { top, bottom } = block.getBoundingClientRect()
	let delta = 0
	if (top < viewTop) delta = top - viewTop
	else if (bottom > viewBottom) delta = Math.min(top - viewTop, bottom - viewBottom)

	// Focus follows the result when its heading was out of sight, or when the
	// scroll would push the pressed button under the header or the bar.
	// (Measured before scrolling: an instant scroll moves everything at once.)
	const outOfSight = (r: DOMRect, shift: number) =>
		r.top - shift < viewTop || r.bottom - shift > viewBottom
	const active = document.activeElement
	const follow =
		outOfSight(heading.getBoundingClientRect(), 0) ||
		(delta !== 0 &&
			active instanceof HTMLElement &&
			active !== document.body &&
			outOfSight(active.getBoundingClientRect(), delta))

	if (delta) window.scrollTo({ top: window.scrollY + delta, behavior: motion() })
	return follow
}

async function run(id: AnalysisId) {
	analysisId.value = id
	tried.value = new Set(tried.value).add(id)
	await nextTick()
	if (!resultBlock.value || !resultHeading.value) return
	if (reveal(resultBlock.value, resultHeading.value)) {
		// Take keyboard and screen-reader users to the result as well; the
		// heading names the analysis, so the status line stays quiet.
		announcement.value = ''
		resultHeading.value.focus({ preventScroll: true })
	} else {
		// Visible next to the buttons: keep focus there and say what changed.
		announcement.value = `${analysis.value?.label} sonucu gösteriliyor. ${result.value?.summary}`
	}
}

const analysis = computed(() => ANALYSES.find((a) => a.id === analysisId.value) ?? null)

interface ResultView {
	chart: ChartOption
	chartLabel: string
	height: number
	summary: string
	table?: { columns: string[]; rows: { cells: string[]; status?: 'up' | 'down' }[] }
	formula: { tr: string; en: string; note: string }
}

const result = computed<ResultView | null>(() => {
	switch (analysisId.value) {
		case 'regions': {
			const above = regions.filter((r) => r.aboveTarget)
			const below = regions.filter((r) => !r.aboveTarget)
			return {
				chart: regionChart(regions),
				chartLabel: `Bölgelere göre gerçekleşen satış ve hedef. ${regions
					.map((r) => `${r.region} ${formatPercent(r.attainment, true)}`)
					.join(', ')}.`,
				height: 290,
				summary: `${above
					.map((r) => `${r.region} (${formatPercent(r.attainment, true)})`)
					.join(' ve ')} dört aylık toplamda hedefi aştı. ${below
					.map((r) => `${r.region} ${formatPercent(r.attainment, true)} ile hedefin altında kaldı`)
					.join('; ')}.`,
				table: {
					columns: ['Bölge', 'Hedef', 'Gerçekleşen', 'Gerçekleşme', 'Durum'],
					rows: regions.map((r) => ({
						cells: [
							r.region,
							formatNumber(r.target),
							formatNumber(r.actual),
							formatPercent(r.attainment, true),
							r.aboveTarget ? 'Hedef aşıldı' : 'Hedefin altında',
						],
						status: r.aboveTarget ? 'up' : 'down',
					})),
				},
				formula: {
					tr: '=ÇOKETOPLA(E:E;C:C;"Ege")/ÇOKETOPLA(D:D;C:C;"Ege")',
					en: '=SUMIFS(E:E,C:C,"Ege")/SUMIFS(D:D,C:C,"Ege")',
					note: 'Bir bölgenin gerçekleşme oranını kendiniz hesaplayarak Copilot’ın sonucunu doğrulayın.',
				},
			}
		}
		case 'products': {
			const top = products[0]
			const fastest = [...products].sort((a, b) => b.growth - a.growth)[0]
			return {
				chart: productChart(products),
				chartLabel: `Ürünlere göre toplam gerçekleşen satış. ${products
					.map((p) => `${p.product} ${formatNumber(p.actual)} bin lira`)
					.join(', ')}.`,
				height: 230,
				summary: `${top.product} ${formatNumber(
					top.actual
				)} bin ₺ ile en çok satan ürün; toplam satışlardaki payı ${formatPercent(
					top.share,
					true
				)}. En hızlı büyüyen ürün ${fastest.product}; Ocak’tan Nisan’a satışları ${formatPercent(
					fastest.growth,
					true
				)} arttı.`,
				table: {
					columns: ['Ürün', 'Gerçekleşen', 'Pay', 'Gerçekleşme', 'Ocak → Nisan'],
					rows: products.map((p) => ({
						cells: [
							p.product,
							formatNumber(p.actual),
							formatPercent(p.share, true),
							formatPercent(p.attainment, true),
							formatDelta(p.growth),
						],
						status: p.attainment >= 1 ? 'up' : 'down',
					})),
				},
				formula: {
					tr: '=ÇOKETOPLA(E:E;B:B;"Bulut Yedekleme")',
					en: '=SUMIFS(E:E,B:B,"Bulut Yedekleme")',
					note: 'Ürün toplamlarını bir pivot tabloyla da karşılaştırabilirsiniz.',
				},
			}
		}
		case 'months': {
			const dip = [...months]
				.filter((m) => m.change !== null)
				.sort((a, b) => a.change! - b.change!)[0]
			const peak = [...months]
				.filter((m) => m.change !== null)
				.sort((a, b) => b.change! - a.change!)[0]
			const missed = months.filter((m) => m.actual < m.target)
			return {
				chart: monthChart(months),
				chartLabel: `Aylara göre gerçekleşen satış ve hedef. ${months
					.map((m) => `${m.month} ${formatNumber(m.actual)}`)
					.join(', ')}.`,
				height: 290,
				summary: `${dip.month} ayında satışlar bir önceki aya göre ${formatPercent(
					Math.abs(dip.change!),
					true
				)} ${dip.change! < 0 ? 'azaldı' : 'arttı'}${
					missed.length
						? `; hedefin altında kalan ay: ${missed.map((m) => m.month).join(', ')}`
						: ''
				}. En güçlü artış ${peak.month} ayında görüldü (${formatPercent(
					peak.change!,
					true
				)}). Dört aylık veri, uzun vadeli bir eğilim için sınırlıdır.`,
				table: {
					columns: ['Ay', 'Hedef', 'Gerçekleşen', 'Önceki aya göre'],
					rows: months.map((m) => ({
						cells: [
							m.month,
							formatNumber(m.target),
							formatNumber(m.actual),
							m.change === null ? '—' : formatDelta(m.change),
						],
						status: m.change === null ? undefined : m.change >= 0 ? 'up' : 'down',
					})),
				},
				formula: {
					tr: '=ÇOKETOPLA(E:E;A:A;"Mart")/ÇOKETOPLA(E:E;A:A;"Şubat")-1',
					en: '=SUMIFS(E:E,A:A,"Mart")/SUMIFS(E:E,A:A,"Şubat")-1',
					note: 'Aylık değişim = bu ay / önceki ay − 1. Sonucu yüzde biçiminde gösterin.',
				},
			}
		}
		case 'below': {
			const worst = [...segments].sort((a, b) => b.gap - a.gap)[0]
			return {
				chart: gapChart(segments),
				chartLabel: `Hedefin altında kalan bölge ve ürünler, açık tutarına göre. ${segments
					.map((s) => `${s.region} ${s.product} ${formatNumber(s.gap)} bin lira`)
					.join(', ')}.`,
				height: 250,
				summary: `${
					segments.length
				} bölge-ürün kombinasyonu dört aylık toplamda hedefin altında. En büyük açık ${
					worst.region
				} · ${worst.product}: ${formatNumber(worst.gap)} bin ₺ (gerçekleşme ${formatPercent(
					worst.attainment,
					true
				)}). Tabloda kırmızı satırlar hedefin altındaki kayıtları, sarı satırlar sıra dışı kayıtları gösterir.`,
				table: {
					columns: ['Bölge · Ürün', 'Gerçekleşme', 'Açık', 'Hedef altı ay'],
					rows: segments.map((s) => ({
						cells: [
							`${s.region} · ${s.product}`,
							formatPercent(s.attainment, true),
							`${formatNumber(s.gap)} bin ₺`,
							`${s.monthsBelow}/4`,
						],
						status: 'down',
					})),
				},
				formula: {
					tr: '=EĞER(E2>=D2;"Hedef aşıldı";"Hedef altı")',
					en: '=IF(E2>=D2,"Hedef aşıldı","Hedef altı")',
					note: 'Bu formülle her satırı etiketleyip filtre uygulayarak listeyi kendiniz doğrulayabilirsiniz.',
				},
			}
		}
		case 'insights':
			return {
				chart: attainmentChart(regions),
				chartLabel: `Bölgelerin hedef gerçekleşme oranları ve yüzde yüz hedef çizgisi. ${regions
					.map((r) => `${r.region} ${formatPercent(r.attainment, true)}`)
					.join(', ')}.`,
				height: 200,
				summary:
					'Aşağıdaki bulgular örnek veriden hesaplanmıştır. Neden açıklaması içermezler; çünkü veride fiyat, kâr marjı veya kampanya bilgisi yoktur.',
				formula: {
					tr: '=E2/D2',
					en: '=E2/D2',
					note: 'Gerçekleşme oranı sütunu (G) bütün bulguların temelidir. Birkaç satırda elle kontrol edin.',
				},
			}
		default:
			return null
	}
})

const totals = computed(() => {
	const list = visibleRows.value
	const target = list.reduce((s, r) => s + r.target, 0)
	const actual = list.reduce((s, r) => s + r.actual, 0)
	return {
		target,
		actual,
		customers: list.reduce((s, r) => s + r.customers, 0),
		att: target ? actual / target : 0,
	}
})

const goals = computed(() => [
	{ label: 'En az üç analiz türünü çalıştırın', done: tried.value.size >= 3 },
	{
		label: '“Yönetici için üç önemli bulgu” analizini inceleyin',
		done: tried.value.has('insights'),
	},
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, { correct: true, score: 1, answer: [...tried.value] })
}

const INSIGHT_TONE = {
	positive: {
		icon: TrendingUp,
		box: 'border-success-100 bg-success-50/60',
		icon_: 'text-success-700',
		label: 'Olumlu',
	},
	negative: {
		icon: TrendingDown,
		box: 'border-danger-100 bg-danger-50/60',
		icon_: 'text-danger-600',
		label: 'Dikkat',
	},
	attention: {
		icon: TriangleAlert,
		box: 'border-amber-200 bg-amber-50/70',
		icon_: 'text-amber-700',
		label: 'Doğrulanmalı',
	},
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice
			text="Simülasyon: Analizler, tablodaki örnek veriden bu uygulama içinde hesaplanır; gerçek bir Copilot analizi değildir. Excel’deki Copilot özellikleri sürüme, lisansa ve çalışma kitabının yapısına bağlı olabilir."
		/>

		<AppFrame
			visual="excel"
			title="Satis_Verileri_Ocak-Nisan.xlsx"
			:subtitle="`${SALES_TITLE} · ${SALES_ROWS.length} satır · kurgusal`"
			:tools="['Giriş', 'Ekle', 'Formüller', 'Veri', 'Copilot']"
		>
			<div class="border-b border-ink-100 bg-white px-4 py-3">
				<p class="flex items-center gap-1.5 text-[12.5px] font-semibold text-iris-700">
					<CopilotMark :size="16" /> Copilot’a sorun: bir analiz türü seçin
				</p>
				<div class="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Analiz türü">
					<button
						v-for="a in ANALYSES"
						:key="a.id"
						type="button"
						:aria-pressed="analysisId === a.id"
						:class="[
							'rounded-full border px-3 py-1.5 text-[13px] font-semibold transition',
							analysisId === a.id
								? 'border-app-excel bg-app-excel text-white'
								: tried.has(a.id)
								? 'border-success-600/30 bg-success-50 text-success-700'
								: 'border-ink-200 bg-white text-ink-800 hover:border-app-excel/50',
						]"
						@click="run(a.id)"
					>
						{{ a.label }}
					</button>
				</div>
			</div>

			<div class="grid xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
				<!-- Sheet -->
				<section
					class="min-w-0 border-b border-ink-100 xl:border-b-0 xl:border-e"
					aria-label="Çalışma sayfası"
				>
					<div class="px-3 py-2.5 md:hidden">
						<button
							type="button"
							class="btn btn-secondary btn-sm w-full"
							aria-controls="excel-sheet"
							:aria-expanded="tableOpen"
							@click="tableOpen = !tableOpen"
						>
							<Table2 :size="15" class="text-app-excel" aria-hidden="true" />
							{{ tableOpen ? 'Tabloyu gizle' : `Tabloyu göster (${SALES_ROWS.length} satır)` }}
							<ChevronDown
								:size="15"
								:class="['text-ink-400 transition-transform', tableOpen && 'rotate-180']"
								aria-hidden="true"
							/>
						</button>
					</div>
					<div
						id="excel-sheet"
						:class="tableOpen ? 'border-t border-ink-100 md:border-t-0' : 'hidden md:block'"
					>
						<div class="flex flex-wrap items-center gap-2 px-3 py-2.5">
							<span class="text-[12px] font-semibold text-ink-500">Ay filtresi:</span>
							<button
								v-for="m in ['all', ...MONTHS] as const"
								:key="m"
								type="button"
								:aria-pressed="monthFilter === m"
								:class="[
									'rounded-md px-2 py-0.5 text-[12px] font-semibold transition',
									monthFilter === m
										? 'bg-ink-900 text-white'
										: 'bg-ink-100 text-ink-600 hover:bg-ink-200',
								]"
								@click="monthFilter = m"
							>
								{{ m === 'all' ? 'Tümü' : m }}
							</button>
							<span class="ms-auto text-[12px] text-ink-500">{{ visibleRows.length }} satır</span>
						</div>
						<div
							class="flex items-center gap-2 border-y border-ink-100 bg-ink-50/80 px-3 py-1.5 font-mono text-[12px] text-ink-700"
						>
							<span
								class="rounded bg-white px-1.5 py-px font-sans font-semibold text-ink-500 ring-1 ring-ink-200"
								>G{{ focusRow }}</span
							>
							<span class="font-sans italic text-ink-400">fx</span>
							<span>=E{{ focusRow }}/D{{ focusRow }}</span>
							<span class="ms-auto hidden font-sans text-[11px] text-ink-500 sm:inline"
								>G sütunu Copilot’ın formül önerisiyle eklendi</span
							>
						</div>
						<!-- About nine rows tall (fewer on short screens), so the analysis
						     buttons, the start of the sheet and the result fit on a laptop. -->
						<div class="max-h-[min(360px,60vh)] overflow-auto scrollbar-thin">
							<table class="w-full min-w-[560px] border-collapse text-[12.5px]">
								<caption class="sr-only">
									{{
										SALES_TITLE
									}}. Sütun başlıklarına tıklayarak sıralayabilirsiniz.
								</caption>
								<thead class="sticky top-0 z-10">
									<tr class="bg-ink-100 text-[11px] text-ink-500">
										<th
											scope="col"
											class="w-8 border border-ink-200 px-1 py-0.5 text-center font-medium sm:w-10"
										>
											<button
												type="button"
												class="w-full"
												:aria-sort="ariaSort('row')"
												aria-label="Satır numarasına göre sırala"
												@click="sortBy('row')"
											>
												#
											</button>
										</th>
										<th
											v-for="c in SHEET_COLUMNS"
											:key="c.id"
											scope="col"
											:class="['border border-ink-200 px-2 py-0.5 text-center font-medium', c.only]"
										>
											{{ c.letter }}
										</th>
									</tr>
									<tr class="bg-[#e9f3ec]">
										<th
											scope="col"
											class="border border-ink-200 px-1 py-1 text-center text-[11px] font-medium text-ink-500"
										>
											1
										</th>
										<th
											v-for="c in SHEET_COLUMNS"
											:key="c.id"
											scope="col"
											:aria-sort="ariaSort(c.key)"
											:class="[
												'border border-ink-200 p-0 font-semibold text-ink-800',
												c.key === 'attainment' && 'bg-[#dcefe2]',
												c.only,
											]"
										>
											<button
												type="button"
												:class="[
													'flex w-full items-center gap-1 px-1 py-1.5 text-[12px] leading-tight hover:bg-white/60 sm:px-1.5',
													c.numeric ? 'justify-end text-end' : 'justify-start text-start',
												]"
												@click="sortBy(c.key)"
											>
												{{ c.label }}
												<ArrowUp
													v-if="sortKey === c.key && sortDir === 1"
													:size="12"
													aria-hidden="true"
												/>
												<ArrowDown v-else-if="sortKey === c.key" :size="12" aria-hidden="true" />
												<ArrowUpDown v-else :size="12" class="text-ink-300" aria-hidden="true" />
											</button>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr
										v-for="r in visibleRows"
										:key="r.excelRow"
										:class="[
											'transition-colors',
											rowTone(r),
											focusRow === r.excelRow &&
												'outline outline-2 -outline-offset-2 outline-app-excel',
										]"
										@click="focusRow = r.excelRow"
									>
										<th
											scope="row"
											class="border border-ink-200 bg-ink-50 px-1 py-1 text-center text-[11px] font-medium text-ink-500"
										>
											{{ r.excelRow }}
										</th>
										<td
											v-for="c in SHEET_COLUMNS"
											:key="c.id"
											:class="[
												'border border-ink-200 px-1 py-1 sm:px-1.5',
												cellClass(r, c),
												c.only,
											]"
										>
											{{ cellText(r, c.key) }}
										</td>
									</tr>
								</tbody>
								<tfoot class="sticky bottom-0">
									<tr class="bg-ink-100 font-semibold text-ink-800">
										<th
											scope="row"
											class="border border-ink-200 px-1 py-1 text-center text-[11px] text-ink-500"
										>
											Σ
										</th>
										<td colspan="3" class="border border-ink-200 px-2 py-1">
											Toplam ({{ monthFilter === 'all' ? 'tüm aylar' : monthFilter }})
										</td>
										<td
											v-for="c in TOTAL_COLUMNS"
											:key="c.id"
											:class="[
												'border border-ink-200 px-1 py-1 text-end tabular-nums sm:px-1.5',
												c.only,
											]"
										>
											{{
												c.key === 'attainment'
													? formatPercent(totals.att)
													: formatNumber(totals[c.key as 'target' | 'actual' | 'customers'])
											}}
										</td>
									</tr>
								</tfoot>
							</table>
						</div>
						<p class="px-3 py-2 text-[11.5px] text-ink-500">
							Tutarlar bin ₺. D: Satış hedefi · E: Gerçekleşen satış · G: Gerçekleşme oranı (E/D).
						</p>
					</div>
				</section>

				<!-- Result -->
				<section class="min-w-0 bg-white p-4" aria-labelledby="excel-result-title">
					<!-- Speaks only when the result shows up beside the buttons; when it
					     scrolls into view, focus moves to its heading instead. -->
					<p class="sr-only" role="status">{{ announcement }}</p>
					<div
						v-if="!analysis || !result"
						class="flex h-full min-h-[160px] flex-col items-center justify-center gap-2 text-center text-[13.5px] text-ink-500 xl:min-h-[320px]"
					>
						<CopilotMark :size="30" class="opacity-80" />
						<p id="excel-result-title">
							Yukarıdan bir analiz türü seçin. Sonuç, grafik ve kısa açıklama burada görünecek.
						</p>
					</div>
					<div v-else :key="analysis.id" class="animate-fade-in space-y-4">
						<div ref="resultBlock" class="scroll-mb-[4.5rem] scroll-mt-16 space-y-4">
							<div>
								<h3
									id="excel-result-title"
									ref="resultHeading"
									tabindex="-1"
									class="rounded-sm text-[16px] font-semibold"
								>
									{{ analysis.label }}
								</h3>
								<p
									class="mt-1 rounded-lg bg-iris-50 px-3 py-2 text-[12.5px] leading-relaxed text-iris-800"
								>
									<span class="font-semibold">Prompt:</span> “{{ analysis.prompt }}”
								</p>
							</div>
							<EChart :option="result.chart" :height="result.height" :label="result.chartLabel" />
							<p class="text-[14px] leading-relaxed text-ink-700">{{ result.summary }}</p>
						</div>

						<div v-if="analysisId === 'insights'" class="space-y-2.5">
							<article
								v-for="(ins, i) in insights"
								:key="ins.title"
								:class="['rounded-xl border p-3.5', INSIGHT_TONE[ins.tone].box]"
							>
								<p
									class="flex items-start gap-2 text-[14px] font-semibold leading-snug text-ink-900"
								>
									<component
										:is="INSIGHT_TONE[ins.tone].icon"
										:size="16"
										:class="['mt-0.5 shrink-0', INSIGHT_TONE[ins.tone].icon_]"
										aria-hidden="true"
									/>
									<span
										><span class="sr-only">{{ INSIGHT_TONE[ins.tone].label }}: </span
										>{{ i < 3 ? `${i + 1}. ` : '' }}{{ ins.title }}</span
									>
								</p>
								<p class="mt-1 ps-6 text-[13px] leading-relaxed text-ink-600">{{ ins.detail }}</p>
							</article>
						</div>

						<template v-if="result.table">
							<!-- Where this column is narrow (phones, and beside the sheet from
							     xl until 2xl) one small card per row replaces a table that
							     would scroll sideways. -->
							<ul
								class="divide-y divide-ink-100 border-y border-ink-100 sm:hidden xl:block 2xl:hidden"
								role="list"
							>
								<li v-for="(row, ri) in result.table.rows" :key="ri" class="py-2">
									<p class="text-[13.5px] font-semibold text-ink-800">{{ row.cells[0] }}</p>
									<dl class="mt-1 grid grid-cols-2 gap-x-4 gap-y-1">
										<div v-for="(cell, ci) in row.cells.slice(1)" :key="ci" class="min-w-0">
											<dt class="text-[11.5px] leading-tight text-ink-500">
												{{ result.table.columns[ci + 1] }}
											</dt>
											<dd
												class="flex items-center gap-1 text-[13px] leading-snug tabular-nums text-ink-800"
											>
												<template v-if="ci === row.cells.length - 2 && row.status">
													<CircleCheck
														v-if="row.status === 'up'"
														:size="13"
														class="shrink-0 text-success-700"
														aria-hidden="true"
													/>
													<TriangleAlert
														v-else
														:size="13"
														class="shrink-0 text-danger-600"
														aria-hidden="true"
													/>
												</template>
												{{ cell }}
											</dd>
										</div>
									</dl>
								</li>
							</ul>
							<div class="-mx-1 hidden overflow-x-auto scrollbar-thin sm:block xl:hidden 2xl:block">
								<table class="w-full min-w-[380px] border-collapse text-[12.5px]">
									<thead>
										<tr class="border-b border-ink-200">
											<th
												v-for="(c, ci) in result.table.columns"
												:key="c"
												scope="col"
												:class="[
													'whitespace-nowrap px-2 py-1.5 font-semibold text-ink-800',
													ci === 0 ? 'text-start' : 'text-end',
												]"
											>
												{{ c }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr
											v-for="(row, ri) in result.table.rows"
											:key="ri"
											class="border-b border-ink-100 last:border-0"
										>
											<td
												v-for="(cell, ci) in row.cells"
												:key="ci"
												:class="[
													'whitespace-nowrap px-2 py-1.5 tabular-nums',
													ci === 0
														? 'text-start font-medium text-ink-800'
														: 'text-end text-ink-700',
												]"
											>
												<span
													v-if="ci === row.cells.length - 1 && row.status"
													class="inline-flex items-center gap-1"
												>
													<CircleCheck
														v-if="row.status === 'up'"
														:size="13"
														class="text-success-700"
														aria-hidden="true"
													/>
													<TriangleAlert
														v-else
														:size="13"
														class="text-danger-600"
														aria-hidden="true"
													/>
													{{ cell }}
												</span>
												<template v-else>{{ cell }}</template>
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</template>

						<div class="rounded-xl border border-ink-200 bg-ink-50/70 p-3.5">
							<p class="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-800">
								<Lightbulb :size="14" class="text-warning-600" aria-hidden="true" /> Nasıl
								doğrularsınız?
							</p>
							<p class="mt-1.5 font-mono text-[12.5px] text-ink-800">{{ result.formula.tr }}</p>
							<p class="mt-0.5 font-mono text-[11.5px] text-ink-500">
								İngilizce Excel: {{ result.formula.en }}
							</p>
							<p class="mt-1.5 text-[12.5px] text-ink-600">{{ result.formula.note }}</p>
						</div>
					</div>
				</section>
			</div>
		</AppFrame>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Aynı veri setine beş farklı soru sorarak her analizin farklı bir karara destek olduğunu
				gördünüz.</template
			>
		</TaskGoal>
	</div>
</template>
