import { describe, expect, it } from 'vitest'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { PASS_RATIO, scoreQuiz } from '@/lib/quizScoring'

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
