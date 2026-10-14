// Guards the final quiz against answers that can be guessed without reading
// the course: the right option must not stand out by length, wording or
// position. QuizPage also shuffles options per attempt.
import { describe, expect, it } from 'vitest'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import type { QuizQuestion } from '@/lib/quizScoring'

const plain = (text: string) => text.replace(/\*\*/g, '')
const correctOf = (q: QuizQuestion) => q.options.find((o) => o.id === q.correct)!
const wrongOf = (q: QuizQuestion) => q.options.filter((o) => o.id !== q.correct)

/** Words that sound like “the careful answer”. */
const CAREFUL = /kontrol|doğrula|teyit|karşılaştır|gözden geçir/i

describe('final quiz options', () => {
	it('gives every question four options with unique ids', () => {
		for (const q of QUIZ_QUESTIONS) {
			expect(q.options, q.id).toHaveLength(4)
			expect(new Set(q.options.map((o) => o.id)).size, q.id).toBe(4)
		}
	})

	it('makes the right option the longest in at most four questions', () => {
		const longest = QUIZ_QUESTIONS.filter((q) => {
			const length = plain(correctOf(q).text).length
			return wrongOf(q).every((o) => plain(o.text).length <= length)
		}).map((q) => q.id)
		expect(longest.length, longest.join(', ')).toBeLessThanOrEqual(4)
	})

	it('keeps wrong options at a length close to the right one', () => {
		for (const q of QUIZ_QUESTIONS) {
			const lengths = q.options.map((o) => plain(o.text).length)
			expect(Math.min(...lengths) / Math.max(...lengths), q.id).toBeGreaterThanOrEqual(0.6)
		}
	})

	it('does not reserve “kontrol / doğrula / teyit” wording for the right option', () => {
		for (const q of QUIZ_QUESTIONS) {
			if (!CAREFUL.test(correctOf(q).text)) continue
			expect(
				wrongOf(q).some((o) => CAREFUL.test(o.text)),
				q.id
			).toBe(true)
		}
	})

	it('spreads the authored right answer over every position A–D', () => {
		const counts = [0, 0, 0, 0]
		for (const q of QUIZ_QUESTIONS) counts[q.options.findIndex((o) => o.id === q.correct)] += 1
		for (const count of counts) {
			expect(count).toBeGreaterThanOrEqual(3)
			expect(count).toBeLessThanOrEqual(5)
		}
	})

	it('keeps the stored id of every right answer', () => {
		// Saved attempts and drafts hold option ids; the result screen and the
		// achievements page re-score them. Changing a right answer’s id would
		// silently change past scores, so move or reword options instead.
		expect(Object.fromEntries(QUIZ_QUESTIONS.map((q) => [q.id, q.correct]))).toEqual({
			q01: 'b',
			q02: 'b',
			q03: 'c',
			q04: 'c',
			q05: 'b',
			q06: 'b',
			q07: 'a',
			q08: 'b',
			q09: 'b',
			q10: 'b',
			q11: 'c',
			q12: 'a',
			q13: 'b',
			q14: 'b',
			q15: 'c',
		})
	})
})
