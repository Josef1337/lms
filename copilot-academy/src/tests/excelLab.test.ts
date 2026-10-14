import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ExcelLab from '@/components/interactive/ExcelLab.vue'
import { SALES_ROWS } from '@/content/datasets/sales'
import { byRegion } from '@/lib/salesAnalytics'
import { useProgress } from '@/stores/progress'

// jsdom has no layout: each test says where the result block, its heading
// and everything else sit in the window (innerHeight is 768 in jsdom).
interface Layout {
	block: [number, number]
	heading: [number, number]
	other?: [number, number]
}

function placeElements(layout: Layout) {
	vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
		const [top, bottom] = this.matches('.scroll-mt-16')
			? layout.block
			: this.matches('h3#excel-result-title')
			? layout.heading
			: layout.other ?? [100, 130]
		return {
			top,
			bottom,
			left: 0,
			right: 0,
			width: 0,
			height: bottom - top,
			x: 0,
			y: top,
		} as DOMRect
	})
}

function preferReducedMotion(reduce: boolean) {
	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: (query: string) => ({
			matches: reduce && query.includes('reduce'),
			media: query,
			addEventListener() {},
			removeEventListener() {},
		}),
	})
}

const chip = (wrapper: VueWrapper, label: string) =>
	wrapper
		.get('[aria-label="Analiz türü"]')
		.findAll('button')
		.find((b) => b.text() === label)!

async function pick(wrapper: VueWrapper, label: string) {
	const button = chip(wrapper, label)
	;(button.element as HTMLElement).focus()
	await button.trigger('click')
	await flushPromises()
	return button
}

const spyOnScroll = () => vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

describe('Excel lab', () => {
	let scrollTo: ReturnType<typeof spyOnScroll>
	let wrapper: VueWrapper | undefined

	const open = () => {
		wrapper = mount(ExcelLab, {
			props: { taskId: 'excel-lab-test' },
			attachTo: document.body,
			global: { stubs: { EChart: true } },
		})
		return wrapper
	}

	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
		scrollTo = spyOnScroll()
	})

	afterEach(() => {
		wrapper?.unmount()
		wrapper = undefined
		vi.restoreAllMocks()
		delete (window as { matchMedia?: unknown }).matchMedia
	})

	it('scrolls a result that is out of sight into view and moves focus to its heading', async () => {
		placeElements({ block: [1200, 1700], heading: [1200, 1224] })
		const w = open()
		await pick(w, 'Hedefi aşan bölgeler')

		// Just far enough to show the whole block above the window's bottom edge.
		expect(scrollTo).toHaveBeenCalledWith({ top: 1700 - 768, behavior: 'smooth' })
		const heading = w.get('h3#excel-result-title')
		expect(heading.text()).toBe('Hedefi aşan bölgeler')
		expect(heading.attributes('tabindex')).toBe('-1')
		expect(document.activeElement).toBe(heading.element)
		expect(w.get('[role="status"]').text()).toBe('')
	})

	it('never scrolls the heading under the header when the block is taller than the window', async () => {
		placeElements({ block: [1200, 2400], heading: [1200, 1224] })
		const w = open()
		await pick(w, 'Aylık performans değişimi')
		expect(scrollTo).toHaveBeenCalledWith({ top: 1200, behavior: 'smooth' })
	})

	it('jumps without animation when the learner prefers reduced motion', async () => {
		preferReducedMotion(true)
		placeElements({ block: [1200, 1700], heading: [1200, 1224] })
		const w = open()
		await pick(w, 'En çok satan ürünler')
		expect(scrollTo).toHaveBeenCalledWith({ top: 932, behavior: 'auto' })
		expect(document.activeElement).toBe(w.get('h3#excel-result-title').element)
	})

	it('keeps focus on the button and announces the result when it is already on screen', async () => {
		preferReducedMotion(false)
		placeElements({ block: [200, 600], heading: [200, 224] })
		const w = open()
		const button = await pick(w, 'Hedefi aşan bölgeler')

		expect(scrollTo).not.toHaveBeenCalled()
		expect(document.activeElement).toBe(button.element)
		expect(button.attributes('aria-pressed')).toBe('true')
		const status = w.get('[role="status"]').text()
		expect(status).toContain('Hedefi aşan bölgeler sonucu gösteriliyor.')
		expect(status).toContain('dört aylık toplamda hedefi aştı')
	})

	it('nudges a partly visible result without taking focus while the button stays in view', async () => {
		placeElements({ block: [400, 900], heading: [400, 424], other: [300, 330] })
		const w = open()
		const button = await pick(w, 'Hedefin altında kalan alanlar')
		expect(scrollTo).toHaveBeenCalledWith({ top: 900 - 768, behavior: 'smooth' })
		expect(document.activeElement).toBe(button.element)
	})

	it('moves focus to the heading when the nudge would hide the pressed button', async () => {
		placeElements({ block: [400, 900], heading: [400, 424], other: [60, 90] })
		const w = open()
		await pick(w, 'Hedefin altında kalan alanlar')
		expect(document.activeElement).toBe(w.get('h3#excel-result-title').element)
	})

	it('folds the sheet behind a toggle on narrow screens', async () => {
		const w = open()
		const toggle = w.get('button[aria-controls="excel-sheet"]')
		const sheet = () => w.get('#excel-sheet')
		expect(toggle.text()).toBe('Tabloyu göster (36 satır)')
		expect(toggle.attributes('aria-expanded')).toBe('false')
		// Hidden only below md; from md up the sheet always shows.
		expect(sheet().classes()).toEqual(expect.arrayContaining(['hidden', 'md:block']))
		expect(toggle.element.parentElement?.classList.contains('md:hidden')).toBe(true)

		await toggle.trigger('click')
		expect(toggle.attributes('aria-expanded')).toBe('true')
		expect(toggle.text()).toBe('Tabloyu gizle')
		expect(sheet().classes()).not.toContain('hidden')
		expect(sheet().findAll('tbody tr')).toHaveLength(SALES_ROWS.length)
	})

	it('shows column G next to the region where the sheet is narrow, and last elsewhere', () => {
		const w = open()
		const labels = w.findAll('thead tr:nth-child(2) th')
		const texts = labels.map((th) => th.text())
		expect(texts).toEqual([
			'1',
			'Ay',
			'Ürün',
			'Bölge',
			'Gerçekleşme %',
			'Satış hedefi',
			'Gerçekleşen satış',
			'Müşteri sayısı',
			'Gerçekleşme %',
		])
		const near = ['sm:hidden', 'xl:table-cell', '2xl:hidden']
		const last = ['hidden', 'sm:table-cell', 'xl:hidden', '2xl:table-cell']
		expect(labels[4].classes()).toEqual(expect.arrayContaining(near))
		expect(labels[8].classes()).toEqual(expect.arrayContaining(last))

		// Letters, every body row and the totals follow the same order.
		const letters = w.findAll('thead tr:first-child th').map((th) => th.text())
		expect(letters).toEqual(['#', 'A', 'B', 'C', 'G', 'D', 'E', 'F', 'G'])
		const first = w.findAll('tbody tr')[0].findAll('td')
		expect(first).toHaveLength(8)
		expect(first[3].text()).toBe(first[7].text())
		expect(first[3].text()).toMatch(/^%\d+$/)
		expect(first[3].classes()).toEqual(expect.arrayContaining(near))
		expect(first[7].classes()).toEqual(expect.arrayContaining(last))
		const totals = w.findAll('tfoot td')
		expect(totals).toHaveLength(6)
		expect(totals[1].text()).toBe(totals[5].text())
	})

	it('lists the result rows as cards where the column is narrow, as a table elsewhere', async () => {
		placeElements({ block: [200, 600], heading: [200, 224] })
		const w = open()
		await pick(w, 'Hedefi aşan bölgeler')
		const result = w.get('section[aria-labelledby="excel-result-title"]')
		const list = result.get('ul[role="list"]')
		// Phones, and the side column from xl until 2xl.
		expect(list.classes()).toEqual(expect.arrayContaining(['sm:hidden', 'xl:block', '2xl:hidden']))
		const items = list.findAll('li')
		expect(items).toHaveLength(byRegion(SALES_ROWS).length)
		expect(items[0].findAll('dt').map((dt) => dt.text())).toEqual([
			'Hedef',
			'Gerçekleşen',
			'Gerçekleşme',
			'Durum',
		])
		expect(items[0].findAll('dd')).toHaveLength(4)
		const table = result.get('table')
		expect([...table.element.parentElement!.classList]).toEqual(
			expect.arrayContaining(['hidden', 'sm:block', 'xl:hidden', '2xl:block'])
		)
		expect(table.findAll('tbody tr')).toHaveLength(items.length)
	})

	it('still records the analyses tried once the goals are met', async () => {
		placeElements({ block: [200, 600], heading: [200, 224] })
		const w = open()
		for (const label of [
			'Hedefi aşan bölgeler',
			'En çok satan ürünler',
			'Yönetici için üç önemli bulgu',
		])
			await pick(w, label)
		const finish = w.findAll('button').find((b) => b.text().includes('Görevi Tamamla'))!
		expect(finish.attributes('disabled')).toBeUndefined()
		await finish.trigger('click')
		expect(useProgress().taskResult('excel-lab-test')).toMatchObject({
			correct: true,
			answer: ['regions', 'products', 'insights'],
		})
	})
})
