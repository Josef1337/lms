import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import CopilotTour from '@/components/interactive/CopilotTour.vue'
import { firstOpenStep } from '@/components/lesson/phases'
import { getLessonRef } from '@/content'
import { TOUR_IMAGE_SIZE, TOUR_STOPS } from '@/content/datasets/copilotTour'
import { STORAGE_KEY, emptyProgress, useProgress } from '@/stores/progress'

// The tour listens on the whole document, like the original.
const press = async (key: string, on: Element = document.body) => {
	on.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
	await flushPromises()
}

const badges = (wrapper: ReturnType<typeof mount>) =>
	wrapper
		.findAll<HTMLButtonElement>('button[aria-controls]')
		.filter((b) => /^\s*[1-9A-D]/.test(b.text()))

const cardButton = (wrapper: ReturnType<typeof mount>, label: string) =>
	wrapper.findAll<HTMLButtonElement>('article button').find((b) => b.text().includes(label))!

const title = (wrapper: ReturnType<typeof mount>) => wrapper.find('article h3').text()

/** A click as the browser sends it: detail 0 from Enter or Space, 1 from a mouse. */
const click = async (el: Element, detail: number) => {
	el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail }))
	await flushPromises()
}

// The tour listens on the document, so every mounted copy is unmounted after
// each test, even one that failed half-way.
const mounted = new Set<ReturnType<typeof mount>>()
const tour = (props: { taskId?: string } = {}) => {
	const wrapper = mount(CopilotTour, { props, attachTo: document.body })
	mounted.add(wrapper)
	return wrapper
}
const unmount = (wrapper: ReturnType<typeof mount>) => {
	mounted.delete(wrapper)
	wrapper.unmount()
}

/** A page element outside the tour, focused, as the learner would leave it. */
function outside<K extends keyof HTMLElementTagNameMap>(tag: K, setup?: (el: HTMLElement) => void) {
	const el = document.createElement(tag)
	setup?.(el)
	document.body.appendChild(el)
	el.focus()
	return el
}

describe('Copilot tour', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
	})
	afterEach(() => {
		mounted.forEach(unmount)
		document.body.innerHTML = ''
		vi.restoreAllMocks()
		vi.unstubAllGlobals()
	})

	it('has nine numbered stops and four lettered ones, each inside the screenshot', () => {
		expect(TOUR_STOPS.map((s) => s.id).join('')).toBe('123456789ABCD')
		expect(TOUR_STOPS.filter((s) => s.kind === 'core')).toHaveLength(9)
		for (const s of TOUR_STOPS) {
			const [x0, y0, x1, y1] = s.box
			expect(x0 < x1 && y0 < y1, s.id).toBe(true)
			for (const [x, y] of [s.badge, [x1, y1]])
				expect(x <= TOUR_IMAGE_SIZE.width && y <= TOUR_IMAGE_SIZE.height, s.id).toBe(true)
		}
	})

	it('pins every badge to its spot as a share of the image size', () => {
		const wrapper = tour()
		const list = badges(wrapper)
		expect(list).toHaveLength(TOUR_STOPS.length)
		list.forEach((b, i) => {
			const [x, y] = TOUR_STOPS[i].badge
			const style = b.attributes('style') ?? ''
			expect(style).toContain(`left: ${(x / TOUR_IMAGE_SIZE.width) * 100}%`)
			expect(style).toContain(`top: ${(y / TOUR_IMAGE_SIZE.height) * 100}%`)
			expect(b.text().trim().startsWith(TOUR_STOPS[i].id)).toBe(true)
		})
	})

	it('names the card buttons apart from the lesson’s own Önceki and Sonraki', async () => {
		const wrapper = tour()
		await nextTick()
		expect(cardButton(wrapper, 'Önceki durak').exists()).toBe(true)
		expect(cardButton(wrapper, 'Sonraki durak').exists()).toBe(true)
	})

	it('completes the task by itself once all nine numbered stops are seen', async () => {
		const wrapper = tour({ taskId: 'tur' })
		await nextTick()
		const progress = useProgress()
		expect(title(wrapper)).toContain(TOUR_STOPS[0].title)

		for (let i = 1; i < 8; i++) await press('ArrowRight')
		expect(progress.isTaskDone('tur')).toBe(false)
		await press('ArrowRight')
		expect(title(wrapper)).toContain(TOUR_STOPS[8].title)
		expect(progress.isTaskDone('tur')).toBe(true)
		const answer = progress.taskResult('tur')?.answer as { seen: string[] }
		expect(answer.seen).toEqual(expect.arrayContaining(['1', '5', '9']))
		expect(wrapper.text()).not.toContain('Görevi Tamamla')

		await press('b')
		expect(title(wrapper)).toContain('Diğer aracılar')
		await wrapper.find('article input[type="checkbox"]').setValue(true)
		expect(progress.labState('tur')).toMatchObject({ tried: ['B'] })
	})

	it('keeps opened and ticked stops after a reload, before the task is completed', async () => {
		const first = tour({ taskId: 'tur' })
		await nextTick()
		await press('3')
		await press('A')
		await first.find('article input[type="checkbox"]').setValue(true)
		await nextTick()
		unmount(first)
		expect(useProgress().isTaskDone('tur')).toBe(false)

		// A reload: a fresh store reads what was written to localStorage.
		setActivePinia(createPinia())
		const again = tour({ taskId: 'tur' })
		await nextTick()
		expect(again.text()).toContain('(2/9)')
		const item = again.findAll('li button').find((b) => b.text().includes(TOUR_STOPS[2].title))!
		expect(item.text()).toContain('(görüldü)')
		expect(again.text()).toMatch(/Denenen\s*1\s*\/\s*13/)
	})

	it('keeps opened stops when the learner leaves the step and comes back', async () => {
		const first = tour({ taskId: 'tur' })
		await nextTick()
		await press('4')
		await press('9')
		unmount(first)
		const again = tour({ taskId: 'tur' })
		await nextTick()
		expect(again.text()).toContain('(3/9)')
	})

	it('records the completed task once, even when the checklist asks again', async () => {
		const wrapper = tour({ taskId: 'tur' })
		await nextTick()
		for (let i = 1; i < 9; i++) await press('ArrowRight')
		const progress = useProgress()
		const at = progress.taskResult('tur')?.at
		expect(at).toBeDefined()
		const record = vi.spyOn(progress, 'recordTask')
		wrapper.findComponent({ name: 'TaskGoal' }).vm.$emit('complete')
		await press('A')
		expect(record).not.toHaveBeenCalled()
		expect(progress.taskResult('tur')?.at).toBe(at)
	})

	it('reads the stops kept with a task completed before lab state was saved', async () => {
		const saved = emptyProgress()
		const seen = TOUR_STOPS.filter((s) => s.kind === 'core').map((s) => s.id)
		saved.tasks.tur = { correct: true, score: 1, answer: { seen, tried: ['A', 'X'] }, at: 'x' }
		localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
		setActivePinia(createPinia())
		const wrapper = tour({ taskId: 'tur' })
		await nextTick()
		expect(wrapper.text()).toMatch(/Denenen\s*1\s*\/\s*13/)
		expect(useProgress().labState('tur')).toEqual({
			seen: expect.arrayContaining(seen),
			tried: ['A'],
		})
	})

	it('carries on from the closed stop after Escape', async () => {
		const wrapper = tour()
		await nextTick()
		await press('8')
		await press('Escape')
		expect(wrapper.find('article').exists()).toBe(false)
		await press('ArrowRight')
		expect(title(wrapper)).toContain(TOUR_STOPS[8].title)
		await press('Escape')
		await press('ArrowLeft')
		expect(title(wrapper)).toContain(TOUR_STOPS[7].title)
	})

	it('leaves keys alone while a text field has focus', async () => {
		const wrapper = tour()
		await nextTick()
		await press('5', outside('input'))
		expect(title(wrapper)).toContain(TOUR_STOPS[0].title)
	})

	it('takes shortcuts from the page and the tour, not from links and buttons elsewhere', async () => {
		const wrapper = tour()
		await nextTick()
		await press(
			'7',
			outside('a', (a) => a.setAttribute('href', '#/modul'))
		)
		await press('b', outside('button'))
		await press(
			'ArrowRight',
			outside('div', (d) => (d.tabIndex = 0))
		)
		expect(title(wrapper)).toContain(TOUR_STOPS[0].title)

		// A heading focused by the lesson (tabindex -1) counts as the page.
		await press(
			'7',
			outside('h2', (h) => (h.tabIndex = -1))
		)
		expect(title(wrapper)).toContain(TOUR_STOPS[6].title)
		const badge = badges(wrapper)[2].element
		badge.focus()
		await press('ArrowRight', badge)
		expect(title(wrapper)).toContain(TOUR_STOPS[7].title)
	})

	it('moves focus to the card title when a badge is opened from the keyboard', async () => {
		const wrapper = tour()
		await nextTick()
		const badge = badges(wrapper)[4]
		badge.element.focus()
		// Enter or Space on a button fires a click with no pointer behind it.
		await click(badge.element, 0)
		expect(title(wrapper)).toContain(TOUR_STOPS[4].title)
		expect(document.activeElement).toBe(wrapper.find('article h3').element)

		// Closing hands focus back to the badge.
		await wrapper.find('article button[aria-label="Kartı kapat"]').trigger('click')
		await flushPromises()
		expect(wrapper.find('article').exists()).toBe(false)
		expect(document.activeElement).toBe(badge.element)

		// A mouse click leaves focus where it is.
		const other = badges(wrapper)[6]
		other.element.focus()
		await click(other.element, 1)
		expect(title(wrapper)).toContain(TOUR_STOPS[6].title)
		expect(document.activeElement).toBe(other.element)
	})

	it('keeps focus in the card when the focused control leaves or turns disabled', async () => {
		const wrapper = tour()
		await nextTick()
		await press('4')
		const copy = wrapper
			.findAll<HTMLButtonElement>('article button')
			.find((b) => b.text().includes('kopyala'))!
		copy.element.focus()
		await press('ArrowRight', copy.element)
		expect(TOUR_STOPS[4].prompt).toBeUndefined()
		expect(title(wrapper)).toContain(TOUR_STOPS[4].title)
		expect(document.activeElement).toBe(wrapper.find('article h3').element)

		await press('2')
		const prev = cardButton(wrapper, 'Önceki durak')
		prev.element.focus()
		await prev.trigger('click')
		await flushPromises()
		expect(prev.attributes('disabled')).toBeDefined()
		expect(document.activeElement).toBe(cardButton(wrapper, 'Sonraki durak').element)
	})

	describe('scrolling after a stop change', () => {
		/** Lays every element out at the same spot, as if the tour sat at `top`. */
		const layOut = (top: number) =>
			vi
				.spyOn(Element.prototype, 'getBoundingClientRect')
				.mockImplementation(
					() =>
						({ top, bottom: top + 500, left: 0, right: 900, width: 900, height: 500 } as DOMRect)
				)

		it('brings the highlight and the card back into view, but not on first load', async () => {
			const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
			layOut(-900)
			const wrapper = tour()
			await flushPromises()
			expect(scroll).not.toHaveBeenCalled()

			await cardButton(wrapper, 'Sonraki durak').trigger('click')
			await flushPromises()
			expect(title(wrapper)).toContain(TOUR_STOPS[1].title)
			expect(scroll).toHaveBeenCalledTimes(1)
			const options = scroll.mock.calls[0][0] as ScrollToOptions
			expect(options.top).toBeLessThan(-800)
			expect(options.behavior).toBe('smooth')

			await press('6')
			expect(scroll).toHaveBeenCalledTimes(2)

			// Picking from the list below and clicking a badge behave the same.
			const item = wrapper.findAll('li button').find((b) => b.text().includes(TOUR_STOPS[9].title))!
			await click(item.element, 1)
			await click(badges(wrapper)[2].element, 1)
			expect(title(wrapper)).toContain(TOUR_STOPS[2].title)
			expect(scroll).toHaveBeenCalledTimes(4)
		})

		it('stays put when everything is already in view', async () => {
			const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
			layOut(100)
			const wrapper = tour()
			await flushPromises()
			await cardButton(wrapper, 'Sonraki durak').trigger('click')
			await click(badges(wrapper)[5].element, 1)
			expect(title(wrapper)).toContain(TOUR_STOPS[5].title)
			expect(scroll).not.toHaveBeenCalled()
		})

		it('jumps instead of gliding when the learner asks for reduced motion', async () => {
			const scroll = vi.spyOn(window, 'scrollBy').mockImplementation(() => {})
			vi.stubGlobal('matchMedia', (query: string) => ({ matches: query.includes('reduce') }))
			layOut(-900)
			tour()
			await flushPromises()
			await press('ArrowRight')
			expect((scroll.mock.calls[0][0] as ScrollToOptions).behavior).toBe('auto')
		})
	})
})

describe('saved step indexes', () => {
	it('stop at the first step whose task is still open', () => {
		// Learners who saved progress before the tour step was added must not skip it.
		const steps = getLessonRef('giris-2')!.lesson.steps
		expect(steps[1].id).toBe('arayuz-turu')
		expect(firstOpenStep(steps, () => false)).toBe(1)
		expect(firstOpenStep(steps, (id) => id === 'giris-2-arayuz-turu')).toBeGreaterThan(1)
		expect(firstOpenStep(steps, () => true)).toBe(-1)
	})
})
