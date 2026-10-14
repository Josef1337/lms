import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { PASS_RATIO, scoreQuiz } from '@/lib/quizScoring'
import { seededShuffle } from '@/lib/shuffle'
import QuizPage from '@/pages/QuizPage.vue'
import { useProgress } from '@/stores/progress'

const allCorrect = () => Object.fromEntries(QUIZ_QUESTIONS.map((q) => [q.id, q.correct]))
const wrongOption = (id: string) =>
	QUIZ_QUESTIONS.find((q) => q.id === id)!.options.find(
		(o) => o.id !== QUIZ_QUESTIONS.find((q) => q.id === id)!.correct
	)!.id

describe('scoreQuiz', () => {
	it('has at least twelve questions and an 80% pass mark', () => {
		expect(QUIZ_QUESTIONS.length).toBeGreaterThanOrEqual(12)
		expect(PASS_RATIO).toBe(0.8)
	})

	it('scores a perfect attempt', () => {
		const score = scoreQuiz(QUIZ_QUESTIONS, allCorrect())
		expect(score.correct).toBe(QUIZ_QUESTIONS.length)
		expect(score.percent).toBe(100)
		expect(score.passed).toBe(true)
		expect(score.reviewModules).toEqual([])
	})

	it('passes at exactly the pass mark and fails one below it', () => {
		const needed = Math.ceil(QUIZ_QUESTIONS.length * PASS_RATIO)
		const answers = allCorrect()
		const toMiss = QUIZ_QUESTIONS.slice(0, QUIZ_QUESTIONS.length - needed)
		for (const q of toMiss) answers[q.id] = wrongOption(q.id)
		expect(scoreQuiz(QUIZ_QUESTIONS, answers).passed).toBe(true)

		const one = QUIZ_QUESTIONS[QUIZ_QUESTIONS.length - 1]
		answers[one.id] = wrongOption(one.id)
		const failed = scoreQuiz(QUIZ_QUESTIONS, answers)
		expect(failed.correct).toBe(needed - 1)
		expect(failed.passed).toBe(false)
	})

	it('treats unanswered questions as wrong and orders review modules by misses', () => {
		const answers = allCorrect()
		const teams = QUIZ_QUESTIONS.filter((q) => q.moduleId === 'teams')
		for (const q of teams) delete answers[q.id]
		const word = QUIZ_QUESTIONS.find((q) => q.moduleId === 'word')!
		answers[word.id] = wrongOption(word.id)

		const score = scoreQuiz(QUIZ_QUESTIONS, answers)
		expect(score.results.filter((r) => r.selected === null)).toHaveLength(teams.length)
		expect(score.reviewModules[0]).toBe('teams')
		expect(score.reviewModules).toContain('word')
		expect(score.bySkill.meetings?.correct).toBe(0)
	})
})

describe('QuizPage option order', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
		vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
	})

	const first = QUIZ_QUESTIONS[0]
	const mountQuiz = () => mount(QuizPage, { global: { stubs: { RouterLink: true } } })
	const button = (wrapper: VueWrapper, label: string) =>
		wrapper.findAll('button').find((b) => b.text().includes(label))!
	const radios = (wrapper: VueWrapper) => wrapper.findAll('[role="radio"]')
	const order = (attempt: number) =>
		seededShuffle(first.options, `${first.id}:${attempt}`).map((o) => o.text)
	/** The first question’s option texts in the order shown. */
	const shown = (wrapper: VueWrapper) =>
		radios(wrapper).map((r) => first.options.find((o) => r.text().endsWith(o.text))?.text)

	it('shuffles per attempt, keeps the order through a reload and scores by option id', async () => {
		const page = mountQuiz()
		await button(page, 'Teste başla').trigger('click')
		expect(shown(page)).toEqual(order(0))
		// The letters follow the shown order, not the authored one.
		expect(radios(page).map((r) => r.find('span').text())).toEqual(['A', 'B', 'C', 'D'])

		const right = first.options.find((o) => o.id === first.correct)!.text
		await radios(page)
			.find((r) => r.text().endsWith(right))!
			.trigger('click')
		await button(page, 'Yanıtı kontrol et').trigger('click')
		expect(page.text()).toContain('Doğru cevap')
		expect(useProgress().data.quiz.draft?.answers[first.id]).toBe(first.correct)
		await flushPromises()
		page.unmount()

		// A reload brings back the draft in the same order.
		setActivePinia(createPinia())
		const reloaded = mountQuiz()
		await button(reloaded, 'Kaldığım yerden devam et').trigger('click')
		expect(shown(reloaded)).toEqual(order(0))
		reloaded.unmount()

		// The next attempt is seeded with the new attempt count.
		useProgress().submitQuiz(allCorrect())
		const retake = mountQuiz()
		await button(retake, 'Testi tekrar çöz').trigger('click')
		expect(order(1)).not.toEqual(order(0))
		expect(shown(retake)).toEqual(order(1))
	})
})
