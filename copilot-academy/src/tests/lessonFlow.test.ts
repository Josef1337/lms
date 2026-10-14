import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, h, nextTick, provide, shallowReactive } from 'vue'
import { createMemoryHistory, createRouter, type Router } from 'vue-router'
import TaskGoal from '@/components/interactive/TaskGoal.vue'
import LessonControls from '@/components/lesson/LessonControls.vue'
import LessonSummary from '@/components/lesson/LessonSummary.vue'
import { TASK_GOALS, allTaskIds, taskIdOf, type GoalItem } from '@/components/lesson/phases'
import { getLessonRef, nextLessonRef } from '@/content'
import DashboardPage from '@/pages/DashboardPage.vue'
import LessonPage from '@/pages/LessonPage.vue'
import { useProgress } from '@/stores/progress'

const Stub = defineComponent({ render: () => h('div') })

function makeRouter(): Router {
	return createRouter({
		history: createMemoryHistory(),
		routes: [
			{ path: '/', name: 'dashboard', component: Stub },
			{ path: '/modul/:moduleId', name: 'module', component: Stub },
			{ path: '/modul/:moduleId/ders/:lessonId', name: 'lesson', component: Stub },
			{ path: '/bilgi-testi', name: 'quiz', component: Stub },
			{ path: '/basarilarim', name: 'achievements', component: Stub },
		],
	})
}

const lesson1 = getLessonRef('giris-1')!
// giris-1: Öğren, Gör, Keşfet, Uygula (two choice tasks), Pekiştir, then the summary.
const PRACTICE = lesson1.lesson.steps.findIndex((s) => s.id === 'uygula')
const SUMMARY = lesson1.lesson.steps.length
const [task1, task2] = lesson1.lesson.steps[PRACTICE].blocks.map(taskIdOf)

const buttonByText = (wrapper: VueWrapper, text: string) =>
	wrapper.findAll('button').find((b) => b.text().includes(text))

beforeEach(() => {
	localStorage.clear()
	setActivePinia(createPinia())
})

describe('TaskGoal', () => {
	const goals = (...done: boolean[]) => done.map((d, i) => ({ label: `Hedef ${i + 1}`, done: d }))

	it('completes the task by itself once every goal is met, without a button', async () => {
		const progress = useProgress()
		const onComplete = vi.fn(() => progress.recordTask('lab', { correct: true, score: 1 }))
		const wrapper = mount(TaskGoal, {
			props: { taskId: 'lab', goals: goals(true, false), onComplete },
		})
		expect(buttonByText(wrapper, 'Görevi Tamamla')).toBeUndefined()
		expect(wrapper.text()).toContain('kendiliğinden tamamlanır')
		expect(onComplete).not.toHaveBeenCalled()

		await wrapper.setProps({ goals: goals(true, true) })
		expect(onComplete).toHaveBeenCalledTimes(1)
		expect(wrapper.text()).toContain('Görev tamamlandı')
	})

	it('reports later changes while the lab stays open, so the result stays current', async () => {
		const progress = useProgress()
		const onComplete = vi.fn(() => progress.recordTask('lab', { correct: true, score: 1 }))
		const wrapper = mount(TaskGoal, {
			props: { taskId: 'lab', goals: goals(true), onComplete },
		})
		expect(onComplete).toHaveBeenCalledTimes(1)
		await wrapper.setProps({ goals: goals(true) })
		expect(onComplete).toHaveBeenCalledTimes(2)
	})

	it('keeps an earlier result when a finished lab is opened again', async () => {
		const progress = useProgress()
		progress.recordTask('lab', { correct: true, score: 1 })
		const onComplete = vi.fn()
		const wrapper = mount(TaskGoal, {
			props: { taskId: 'lab', goals: goals(false), onComplete },
		})
		await wrapper.setProps({ goals: goals(true) })
		expect(onComplete).not.toHaveBeenCalled()
	})

	it('registers its goals with the lesson page and drops them on unmount', async () => {
		const registry = shallowReactive(new Map<string, () => GoalItem[]>())
		const Host = defineComponent({
			props: { show: { type: Boolean, default: true } },
			setup(props) {
				provide(TASK_GOALS, registry)
				return () => (props.show ? h(TaskGoal, { taskId: 'lab', goals: goals(false) }) : null)
			},
		})
		const wrapper = mount(Host)
		expect(registry.get('lab')?.()).toEqual(goals(false))
		await wrapper.setProps({ show: false })
		expect(registry.has('lab')).toBe(false)
	})
})

describe('LessonControls', () => {
	const props = { current: 3, total: 6, isSummary: false, completed: false, nextLabel: 'X' }

	it('says how many tasks are left and offers a way to them', async () => {
		const wrapper = mount(LessonControls, { props: { ...props, pending: 1 } })
		const go = buttonByText(wrapper, 'Göreve git')!
		expect(go.text()).toContain('1 görev kaldı')
		expect(buttonByText(wrapper, 'Sonraki')!.attributes('disabled')).toBeDefined()
		await go.trigger('click')
		expect(wrapper.emitted('goToTask')).toHaveLength(1)
	})

	it('hands focus to “Sonraki” when the last task is done while “Göreve git” has it', async () => {
		const wrapper = mount(LessonControls, {
			props: { ...props, pending: 1 },
			attachTo: document.body,
		})
		const go = buttonByText(wrapper, 'Göreve git')!.element as HTMLButtonElement
		go.focus()
		await wrapper.setProps({ pending: 0 })
		await nextTick()
		const next = buttonByText(wrapper, 'Sonraki')!.element as HTMLButtonElement
		expect(next.disabled).toBe(false)
		expect(document.activeElement).toBe(next)
		wrapper.unmount()
	})

	it('offers only the way on from the summary, never “Dersi Tamamla”', () => {
		const wrapper = mount(LessonControls, {
			props: { ...props, current: 5, pending: 0, isSummary: true, completed: true },
		})
		expect(wrapper.text()).not.toContain('Dersi Tamamla')
		expect(wrapper.text()).toContain('Ders tamamlandı')
		expect(buttonByText(wrapper, 'X')).toBeDefined()
	})
})

describe('LessonPage', () => {
	let router: Router
	let wrapper: VueWrapper | undefined

	async function open(lessonId = 'giris-1') {
		router = makeRouter()
		await router.push({ name: 'lesson', params: { moduleId: 'copilot-giris', lessonId } })
		await router.isReady()
		wrapper = mount(LessonPage, { global: { plugins: [router] }, attachTo: document.body })
		await flushPromises()
		return wrapper
	}

	beforeEach(() => {
		window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never
		Element.prototype.scrollIntoView = vi.fn()
		window.scrollTo = vi.fn() as never
	})
	afterEach(() => {
		wrapper?.unmount()
		wrapper = undefined
	})

	it('completes the lesson as soon as the summary opens', async () => {
		const progress = useProgress()
		progress.openLesson('giris-1')
		for (const id of allTaskIds(lesson1.lesson.steps))
			progress.recordTask(id, { correct: true, score: 1 })
		progress.setStep('giris-1', SUMMARY)

		const page = await open()
		expect(progress.lessonState('giris-1')).toBe('completed')
		expect(progress.overall.percent).toBeGreaterThan(0)
		expect(page.text()).toContain('Tebrikler')
		expect(page.text()).not.toContain('Dersi Tamamla')
		// One way on: the footer and the next-lesson card say the same thing.
		expect(page.text()).toContain('Sonraki derse geç')
	})

	it('takes the learner to the open task and focuses it', async () => {
		const progress = useProgress()
		progress.openLesson('giris-1')
		progress.setStep('giris-1', PRACTICE)
		progress.recordTask(task1!, { correct: true, score: 1 })

		const page = await open()
		expect(page.text()).toContain('Bu adımda 2 görev var (1/2 tamamlandı)')
		await buttonByText(page, 'Göreve git')!.trigger('click')

		const target = page.find(`[data-task-id="${task2}"]`).element as HTMLElement
		expect(target.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto', block: 'start' })
		expect(document.activeElement).toBe(target)
		// Focusable only while focused: clicks inside the task never land on the wrapper.
		target.blur()
		expect(target.hasAttribute('tabindex')).toBe(false)
	})

	it('names a lab’s goals under the step title', async () => {
		const progress = useProgress()
		const lesson2 = getLessonRef('giris-2')!.lesson
		const index = lesson2.steps.findIndex((s) =>
			s.blocks.some((b) => b.type === 'interactive' && b.component === 'reportExplorer')
		)
		progress.openLesson('giris-2')
		for (const s of lesson2.steps.slice(0, index))
			for (const block of s.blocks) {
				const id = taskIdOf(block)
				if (id) progress.recordTask(id, { correct: true, score: 1 })
			}
		progress.setStep('giris-2', index)

		const page = await open('giris-2')
		await vi.waitFor(() => expect(page.find('[data-task-id] section').exists()).toBe(true))
		await nextTick()
		const goal = page.findAll('li').filter((li) => li.text().includes('En az iki farklı prompt'))
		// Once in the line under the title, once in the checklist under the lab.
		expect(goal).toHaveLength(2)
		expect(goal[0].element.compareDocumentPosition(page.find('[data-task-id]').element)).toBe(
			Node.DOCUMENT_POSITION_FOLLOWING
		)
	})
})

describe('LessonSummary', () => {
	it('words the task result as encouragement, not a grade', async () => {
		const progress = useProgress()
		const ids = allTaskIds(lesson1.lesson.steps)
		ids.forEach((id, i) => progress.recordTask(id, { correct: i > 0, score: i > 0 ? 1 : 0 }))
		const router = makeRouter()
		const wrapper = mount(LessonSummary, {
			props: { lessonRef: lesson1, next: nextLessonRef('giris-1'), completed: true, newBadges: [] },
			global: { plugins: [router] },
		})
		expect(wrapper.text()).toContain(`${ids.length - 1}/${ids.length}`)
		expect(wrapper.text()).toContain('görev doğru')
		expect(wrapper.text()).toContain(
			'Yanlışları ilgili adıma dönüp tekrar çözerek pekiştirebilirsiniz.'
		)
		expect(wrapper.text()).not.toMatch(/%\d+\s*Puan|ilk denemelerinize/)
		expect(wrapper.text()).not.toContain('Dersi Tamamla')
		expect(wrapper.find('a').text()).toContain('Sonraki derse geç')
	})
})

describe('DashboardPage', () => {
	it('offers one next lesson to click and counts badges on the achievements card', async () => {
		const progress = useProgress()
		progress.openLesson('giris-1')
		progress.completeLesson('giris-1')
		const target = progress.continueTarget
		const recommended = progress.recommendedNext!
		expect(target.kind === 'lesson' && target.ref.lesson.id).toBe('giris-2')

		const router = makeRouter()
		const wrapper = mount(DashboardPage, { global: { plugins: [router] } })
		expect(wrapper.text()).not.toContain('Önerilen sonraki ders')
		expect(wrapper.text()).toContain(`Bundan sonra: ${recommended.lesson.title}`)
		const linksTo = (id: string) =>
			wrapper.findAll('a').filter((a) => a.attributes('href')?.endsWith(`/ders/${id}`))
		expect(linksTo('giris-2')).toHaveLength(1)
		expect(linksTo(recommended.lesson.id)).toHaveLength(0)

		const achievements = wrapper
			.findAll('a')
			.find((a) => a.attributes('href') === '/basarilarim' && a.text().includes('Başarılarım'))!
		expect(achievements.text()).toContain(`${progress.earnedBadges.length} rozet`)
		expect(achievements.text()).not.toContain('Devam ediyor')
	})
})
