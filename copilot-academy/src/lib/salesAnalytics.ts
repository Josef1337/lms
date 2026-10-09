// Every figure the Excel lab shows is computed here from the sample rows;
// nothing on screen is a hand-typed "result".
import {
	MONTHS,
	PRODUCTS,
	REGIONS,
	type Month,
	type Product,
	type Region,
	type SalesRow,
} from '@/content/datasets/sales'

export interface Totals {
	target: number
	actual: number
	customers: number
	/** actual / target */
	attainment: number
}

function totals(rows: SalesRow[]): Totals {
	const target = rows.reduce((s, r) => s + r.target, 0)
	const actual = rows.reduce((s, r) => s + r.actual, 0)
	const customers = rows.reduce((s, r) => s + r.customers, 0)
	return { target, actual, customers, attainment: target ? actual / target : 0 }
}

export const attainment = (row: Pick<SalesRow, 'target' | 'actual'>) =>
	row.target ? row.actual / row.target : 0

export interface RegionSummary extends Totals {
	region: Region
	aboveTarget: boolean
}

export function byRegion(rows: SalesRow[]): RegionSummary[] {
	return REGIONS.map((region) => {
		const t = totals(rows.filter((r) => r.region === region))
		return { region, ...t, aboveTarget: t.actual >= t.target }
	})
}

export interface ProductSummary extends Totals {
	product: Product
	/** Share of all actual sales. */
	share: number
	/** Change from the first to the last month in the data. */
	growth: number
}

export function byProduct(rows: SalesRow[]): ProductSummary[] {
	const all = totals(rows).actual
	const months = MONTHS.filter((m) => rows.some((r) => r.month === m))
	const first = months[0]
	const last = months[months.length - 1]
	return PRODUCTS.map((product) => {
		const own = rows.filter((r) => r.product === product)
		const t = totals(own)
		const firstActual = totals(own.filter((r) => r.month === first)).actual
		const lastActual = totals(own.filter((r) => r.month === last)).actual
		return {
			product,
			...t,
			share: all ? t.actual / all : 0,
			growth: firstActual ? lastActual / firstActual - 1 : 0,
		}
	}).sort((a, b) => b.actual - a.actual)
}

export interface MonthSummary extends Totals {
	month: Month
	/** Change in actual sales against the previous month; null for the first. */
	change: number | null
}

export function byMonth(rows: SalesRow[]): MonthSummary[] {
	const months = MONTHS.filter((m) => rows.some((r) => r.month === m))
	let previous: number | null = null
	return months.map((month) => {
		const t = totals(rows.filter((r) => r.month === month))
		const change: number | null = previous ? t.actual / previous - 1 : null
		previous = t.actual
		return { month, ...t, change }
	})
}

export interface Segment extends Totals {
	region: Region
	product: Product
	/** target − actual, thousands of lira. */
	gap: number
	monthsBelow: number
}

/** Region × product combinations whose four-month total is under target, weakest first. */
export function belowTarget(rows: SalesRow[]): Segment[] {
	const segments: Segment[] = []
	for (const region of REGIONS) {
		for (const product of PRODUCTS) {
			const own = rows.filter((r) => r.region === region && r.product === product)
			if (!own.length) continue
			const t = totals(own)
			if (t.actual < t.target) {
				segments.push({
					region,
					product,
					...t,
					gap: t.target - t.actual,
					monthsBelow: own.filter((r) => r.actual < r.target).length,
				})
			}
		}
	}
	return segments.sort((a, b) => a.attainment - b.attainment)
}

/** Records more than `threshold` away from their target, in either direction. */
export function anomalies(rows: SalesRow[], threshold = 0.3): SalesRow[] {
	return rows.filter((r) => Math.abs(attainment(r) - 1) >= threshold)
}

export interface Insight {
	title: string
	detail: string
	tone: 'positive' | 'negative' | 'attention'
}

const pct = (ratio: number) =>
	'%' + (Math.abs(ratio) * 100).toLocaleString('tr-TR', { maximumFractionDigits: 1 })

/** Three findings for a manager, each derived from the summaries above. */
export function executiveInsights(rows: SalesRow[]): Insight[] {
	const regions = [...byRegion(rows)].sort((a, b) => b.attainment - a.attainment)
	const best = regions[0]
	const worst = regions[regions.length - 1]
	const products = byProduct(rows)
	const fastest = [...products].sort((a, b) => b.growth - a.growth)[0]
	const weakest = [...products].sort((a, b) => a.attainment - b.attainment)[0]
	const weakRows = rows.filter((r) => r.product === weakest.product)
	const weakMisses = weakRows.filter((r) => r.actual < r.target).length
	const outliers = anomalies(rows)

	const insights: Insight[] = [
		{
			tone: 'positive',
			title: `${best.region} hedefin ${pct(best.attainment - 1)} üzerinde, ${worst.region} ${pct(
				1 - worst.attainment
			)} altında`,
			detail: `Bölgeler arasındaki fark ${pct(best.attainment - worst.attainment)} puan. ${
				worst.region
			} için ${(worst.target - worst.actual).toLocaleString(
				'tr-TR'
			)} bin ₺ açık var; önce bu bölgenin hangi üründe geride kaldığına bakılmalı.`,
		},
		{
			tone: 'positive',
			title: `${fastest.product} ilk aydan son aya ${pct(fastest.growth)} büyüdü`,
			detail: `Toplam satışlardaki payı ${pct(fastest.share)}, hedef gerçekleşme oranı ${pct(
				fastest.attainment
			)}. Büyümenin hangi bölgeden geldiği, bir sonraki dönemin kaynak planına girdi olabilir.`,
		},
		{
			tone: 'negative',
			title: `${weakest.product} hedefin ${pct(1 - weakest.attainment)} altında kaldı`,
			detail: `Hedefin altında kalan kayıt sayısı: ${weakMisses}/${weakRows.length}. Hedeflerin gerçekçiliği ile satış ekibinin bu üründeki kapasitesi birlikte değerlendirilmeli.`,
		},
	]

	if (outliers.length) {
		const o = outliers[0]
		insights.push({
			tone: 'attention',
			title: `Kontrol edilmesi gereken ${outliers.length} sıra dışı kayıt var`,
			detail: `Örneğin ${o.month} · ${o.region} · ${o.product} kaydında gerçekleşme oranı ${pct(
				attainment(o)
			)}. Bu bir veri giriş hatası da olabilir, gerçek bir değişim de; karar vermeden önce kaynağı doğrulayın.`,
		})
	}
	return insights
}
