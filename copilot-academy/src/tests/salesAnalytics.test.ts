import { describe, expect, it } from 'vitest'
import { SALES_ROWS } from '@/content/datasets/sales'
import {
	anomalies,
	belowTarget,
	byMonth,
	byProduct,
	byRegion,
	executiveInsights,
} from '@/lib/salesAnalytics'

describe('salesAnalytics', () => {
	it('has at least 12 meaningful rows', () => {
		expect(SALES_ROWS.length).toBeGreaterThanOrEqual(12)
		for (const row of SALES_ROWS) {
			expect(row.target).toBeGreaterThan(0)
			expect(row.actual).toBeGreaterThan(0)
			expect(row.customers).toBeGreaterThan(0)
		}
	})

	it('totals regions and flags those above target', () => {
		const regions = Object.fromEntries(byRegion(SALES_ROWS).map((r) => [r.region, r]))
		expect(regions['Ege'].target).toBe(3050)
		expect(regions['Ege'].actual).toBe(3340)
		expect(regions['Ege'].aboveTarget).toBe(true)
		expect(regions['Marmara'].aboveTarget).toBe(true)
		expect(regions['İç Anadolu'].aboveTarget).toBe(false)
		expect(regions['İç Anadolu'].attainment).toBeCloseTo(0.895, 3)
	})

	it('ranks products by actual sales and measures growth', () => {
		const products = byProduct(SALES_ROWS)
		expect(products[0].product).toBe('Bulut Yedekleme')
		const cyber = products.find((p) => p.product === 'Siber Güvenlik')!
		expect(cyber.growth).toBeCloseTo(0.1846, 3)
		expect(products.reduce((s, p) => s + p.share, 0)).toBeCloseTo(1, 6)
	})

	it('computes month-on-month change', () => {
		const months = byMonth(SALES_ROWS)
		expect(months.map((m) => m.month)).toEqual(['Ocak', 'Şubat', 'Mart', 'Nisan'])
		expect(months[0].change).toBeNull()
		expect(months[1].change).toBeCloseTo(2565 / 2690 - 1, 6)
		expect(months[1].actual).toBeLessThan(months[1].target)
	})

	it('lists below-target segments weakest first', () => {
		const segments = belowTarget(SALES_ROWS)
		expect(segments).toHaveLength(4)
		expect(segments[0]).toMatchObject({ region: 'İç Anadolu', product: 'Siber Güvenlik', gap: 155 })
		for (let i = 1; i < segments.length; i++) {
			expect(segments[i].attainment).toBeGreaterThanOrEqual(segments[i - 1].attainment)
		}
	})

	it('finds the two outliers', () => {
		const outliers = anomalies(SALES_ROWS)
		expect(outliers.map((r) => `${r.month}-${r.region}-${r.product}`)).toEqual([
			'Şubat-İç Anadolu-Siber Güvenlik',
			'Mart-Ege-Veri Analitiği',
		])
	})

	it('derives three findings plus an outlier warning', () => {
		const insights = executiveInsights(SALES_ROWS)
		expect(insights).toHaveLength(4)
		expect(insights[0].title).toMatch(/Ege/)
		expect(insights[0].title).toMatch(/İç Anadolu/)
		expect(insights[1].title).toMatch(/Siber Güvenlik/)
		expect(insights[2].title).toMatch(/Veri Analitiği/)
		expect(insights[3].tone).toBe('attention')
	})
})
