import { beforeEach, describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
import ReportExplorer from '@/components/interactive/ReportExplorer.vue'
import { LESSON_REFS, MODULES } from '@/content'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { STORAGE_KEY, emptyProgress, parseProgress, useProgress } from '@/stores/progress'

const allCorrect = () => Object.fromEntries(QUIZ_QUESTIONS.map((q) => [q.id, q.correct]))

describe('progress store', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
	})

	it('starts empty and points at the first lesson', () => {
		const p = useProgress()
		expect(p.hasProgress).toBe(false)
		expect(p.overall.percent).toBe(0)
		const target = p.continueTarget
		expect(target.kind).toBe('lesson')
		if (target.kind === 'lesson') expect(target.ref.lesson.id).toBe(LESSON_REFS[0].lesson.id)
	})

	it('records opening, steps and completion, and awards the first badge', () => {
		const p = useProgress()
		const first = LESSON_REFS[0].lesson.id
		p.openLesson(first)
		expect(p.hasProgress).toBe(true)
		expect(p.lessonState(first)).toBe('in-progress')

		p.setStep(first, 3)
		p.setStep(first, 1)
		expect(p.data.lessons[first].step).toBe(1)
		expect(p.data.lessons[first].furthest).toBe(3)

		const badges = p.completeLesson(first)
		expect(p.lessonState(first)).toBe('completed')
		expect(badges).toContain('ilk-adim')
		expect(p.data.activity.some((a) => a.kind === 'lesson')).toBe(true)
		// continue now moves on to the next lesson
		const target = p.continueTarget
		if (target.kind === 'lesson') expect(target.ref.lesson.id).toBe(LESSON_REFS[1].lesson.id)
	})

	it('awards the module badge when every lesson of a module is done', () => {
		const p = useProgress()
		const module = MODULES[0]
		for (const lesson of module.lessons) {
			p.openLesson(lesson.id)
			p.completeLesson(lesson.id)
		}
		expect(p.moduleStats(module.id).state).toBe('completed')
		expect(p.data.badges['copilot-kasifi']).toBeTruthy()
	})

	it('scores the quiz from real answers and graduates after everything', () => {
		const p = useProgress()
		for (const ref of LESSON_REFS) {
			p.openLesson(ref.lesson.id)
			p.completeLesson(ref.lesson.id)
		}
		expect(p.continueTarget.kind).toBe('quiz')
		const { attempt, badges } = p.submitQuiz(allCorrect())
		expect(attempt.correct).toBe(QUIZ_QUESTIONS.length)
		expect(attempt.passed).toBe(true)
		expect(badges).toEqual(
			expect.arrayContaining(['final-basarisi', 'kusursuz-skor', 'akademi-mezunu'])
		)
		expect(p.overall.percent).toBe(100)
		expect(p.continueTarget.kind).toBe('done')
	})

	it('keeps a failed attempt without passing', () => {
		const p = useProgress()
		const { attempt } = p.submitQuiz({})
		expect(attempt.correct).toBe(0)
		expect(p.quizPassed).toBe(false)
		expect(p.data.badges['final-basarisi']).toBeUndefined()
	})

	it('persists to localStorage and restores on reload', async () => {
		const p = useProgress()
		const first = LESSON_REFS[0].lesson.id
		p.openLesson(first)
		p.recordTask('ornek-gorev', { correct: true, score: 1 })
		await nextTick()
		const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!)
		expect(saved.lessons[first]).toBeTruthy()

		setActivePinia(createPinia())
		const again = useProgress()
		expect(again.lessonState(first)).toBe('in-progress')
		expect(again.isTaskDone('ornek-gorev')).toBe(true)
	})

	it('ignores corrupted or foreign storage', () => {
		expect(parseProgress('nonsense')).toEqual(emptyProgress())
		expect(parseProgress({ version: 99 })).toEqual(emptyProgress())
		localStorage.setItem(STORAGE_KEY, '{not json')
		setActivePinia(createPinia())
		expect(useProgress().hasProgress).toBe(false)
	})

	it('takes over progress saved by another tab instead of overwriting it', async () => {
		const p = useProgress()
		const first = LESSON_REFS[0].lesson.id
		// Another tab completes the first lesson and saves.
		const other = emptyProgress()
		other.lessons[first] = { step: 3, furthest: 3, startedAt: 'x', completedAt: 'y' }
		localStorage.setItem(STORAGE_KEY, JSON.stringify(other))
		window.dispatchEvent(new StorageEvent('storage', { key: STORAGE_KEY }))
		expect(p.lessonState(first)).toBe('completed')
		// This tab's next write keeps the other tab's lesson.
		p.toggleSidebar()
		await nextTick()
		expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}').lessons[first].completedAt).toBe(
			'y'
		)
	})

	it('resets everything', async () => {
		const p = useProgress()
		p.openLesson(LESSON_REFS[0].lesson.id)
		p.completeLesson(LESSON_REFS[0].lesson.id)
		p.saveLab('tur', { seen: ['1'] })
		p.reset()
		await nextTick()
		expect(p.hasProgress).toBe(false)
		expect(p.earnedBadges).toHaveLength(0)
		expect(p.overall.lessonsDone).toBe(0)
		expect(p.labState('tur')).toBeUndefined()
	})
})

describe('lab state', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
	})

	it('is saved at once and read back after a reload', async () => {
		const p = useProgress()
		expect(p.labState('tur')).toBeUndefined()
		p.saveLab('tur', { seen: ['1', '2'], tried: [] })
		await nextTick()
		expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).labs.tur.seen).toEqual(['1', '2'])

		setActivePinia(createPinia())
		expect(useProgress().labState('tur')).toEqual({ seen: ['1', '2'], tried: [] })
	})

	it('starts empty for saves from before it existed or with a broken record', () => {
		const { labs, ...older } = emptyProgress()
		expect(labs).toEqual({})
		expect(parseProgress(older).labs).toEqual({})
		expect(parseProgress({ ...older, labs: ['x'] }).labs).toEqual({})
		expect(parseProgress({ ...older, labs: 'x' }).labs).toEqual({})
		expect(parseProgress({ ...older, labs: { tur: { seen: ['3'] } } }).labs).toEqual({
			tur: { seen: ['3'] },
		})
	})

	it('keeps the report explorer’s prompts and pages across a reload, before completion', async () => {
		const first = mount(ReportExplorer, { props: { taskId: 'rapor' } })
		const prompts = first.findAll('button[aria-pressed]').filter((b) => !/^\s*\d/.test(b.text()))
		// One prompt and one page: the goals (two prompts, one page) are not met yet.
		await prompts[0].trigger('click')
		await first
			.findAll('button[aria-pressed]')
			.find((b) => /^\s*4\b/.test(b.text()))!
			.trigger('click')
		await nextTick()
		first.unmount()
		const p = useProgress()
		expect(p.isTaskDone('rapor')).toBe(false)
		expect(p.labState('rapor')).toEqual({ asked: ['ozet'], opened: [4] })
		// Only ids of the ready-made prompts are kept, never their text.
		expect(JSON.stringify(p.labState('rapor'))).not.toMatch(/\s/)

		setActivePinia(createPinia())
		const again = mount(ReportExplorer, { props: { taskId: 'rapor' } })
		// The restored prompt counts: one more completes the task by itself.
		await again
			.findAll('button[aria-pressed]')
			.filter((b) => !/^\s*\d/.test(b.text()))[1]
			.trigger('click')
		await nextTick()
		expect(useProgress().isTaskDone('rapor')).toBe(true)
		expect(useProgress().labState('rapor')).toEqual({ asked: ['ozet', 'kararlar'], opened: [4] })
		again.unmount()
	})
})
