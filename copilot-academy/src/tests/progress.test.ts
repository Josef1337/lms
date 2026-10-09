import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { nextTick } from 'vue'
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
		p.reset()
		await nextTick()
		expect(p.hasProgress).toBe(false)
		expect(p.earnedBadges).toHaveLength(0)
		expect(p.overall.lessonsDone).toBe(0)
	})
})
