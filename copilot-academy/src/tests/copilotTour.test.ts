import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import CopilotTour from '@/components/interactive/CopilotTour.vue'
import { firstOpenStep } from '@/components/lesson/phases'
import { getLessonRef } from '@/content'
import { TOUR_IMAGE_SIZE, TOUR_STOPS } from '@/content/datasets/copilotTour'
import { useProgress } from '@/stores/progress'

// The tour listens on the whole document, like the original.
const press = async (key: string) => {
	document.body.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
	await nextTick()
}

const badges = (wrapper: ReturnType<typeof mount>) =>
	wrapper.findAll('button[aria-controls]').filter((b) => /^\s*[1-9A-D]/.test(b.text()))

describe('Copilot tour', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
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
		const wrapper = mount(CopilotTour)
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

	it('opens the first stop, steps through with page-wide keys and stores the task', async () => {
		const wrapper = mount(CopilotTour, { props: { taskId: 'tur' }, attachTo: document.body })
		await nextTick()
		const title = () => wrapper.find('article h3').text()
		expect(title()).toContain(TOUR_STOPS[0].title)

		for (let i = 1; i < 9; i++) await press('ArrowRight')
		expect(title()).toContain(TOUR_STOPS[8].title)
		await press('b')
		expect(title()).toContain('Diğer aracılar')

		await wrapper.find('article input[type="checkbox"]').setValue(true)
		const finish = wrapper.findAll('button').find((b) => b.text().includes('Görevi Tamamla'))!
		expect(finish.attributes('disabled')).toBeUndefined()
		await finish.trigger('click')
		const answer = useProgress().taskResult('tur')?.answer as { seen: string[]; tried: string[] }
		expect(answer.seen).toEqual(expect.arrayContaining(['1', '9', 'B']))
		expect(answer.tried).toEqual(['B'])
		wrapper.unmount()
	})

	it('carries on from the closed stop after Escape', async () => {
		const wrapper = mount(CopilotTour, { attachTo: document.body })
		await nextTick()
		await press('8')
		await press('Escape')
		expect(wrapper.find('article').exists()).toBe(false)
		await press('ArrowRight')
		expect(wrapper.find('article h3').text()).toContain(TOUR_STOPS[8].title)
		await press('Escape')
		await press('ArrowLeft')
		expect(wrapper.find('article h3').text()).toContain(TOUR_STOPS[7].title)
		wrapper.unmount()
	})

	it('leaves keys alone while a text field has focus', async () => {
		const wrapper = mount(CopilotTour, { attachTo: document.body })
		await nextTick()
		const field = document.createElement('input')
		document.body.appendChild(field)
		field.dispatchEvent(new KeyboardEvent('keydown', { key: '5', bubbles: true }))
		await nextTick()
		expect(wrapper.find('article h3').text()).toContain(TOUR_STOPS[0].title)
		field.remove()
		wrapper.unmount()
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
