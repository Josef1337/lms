// Integrity checks over the whole curriculum: every lesson follows the
// learning loop, every task is answerable and every id is unique.
import { describe, expect, it } from 'vitest'
import { LESSON_REFS, MODULES, TOTAL_MINUTES } from '@/content'
import { BADGES } from '@/content/badges'
import { getScenario } from '@/content/datasets/scenarios'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { allTaskIds } from '@/components/lesson/phases'
import { icons } from '@/components/ui/icons'
import type { Block } from '@/types/content'

const allBlocks = (): Block[] => LESSON_REFS.flatMap((r) => r.lesson.steps.flatMap((s) => s.blocks))

const strings = (value: unknown): string[] => {
	if (typeof value === 'string') return [value]
	if (Array.isArray(value)) return value.flatMap(strings)
	if (value && typeof value === 'object') return Object.values(value).flatMap(strings)
	return []
}

describe('curriculum', () => {
	it('has ten lesson modules numbered 1–10', () => {
		expect(MODULES.map((m) => m.number)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
		expect(new Set(MODULES.map((m) => m.id)).size).toBe(MODULES.length)
		expect(TOTAL_MINUTES).toBeGreaterThan(0)
	})

	it('uses unique lesson ids and unique step ids within a lesson', () => {
		const ids = LESSON_REFS.map((r) => r.lesson.id)
		expect(new Set(ids).size).toBe(ids.length)
		for (const { lesson } of LESSON_REFS) {
			const stepIds = lesson.steps.map((s) => s.id)
			expect(new Set(stepIds).size, lesson.id).toBe(stepIds.length)
		}
	})

	it('follows the learning loop in every lesson', () => {
		for (const { lesson } of LESSON_REFS) {
			const phases = new Set(lesson.steps.map((s) => s.phase))
			for (const phase of ['learn', 'see', 'explore', 'practice', 'reinforce'] as const) {
				expect(phases.has(phase), `${lesson.id} is missing ${phase}`).toBe(true)
			}
			expect(lesson.steps[lesson.steps.length - 1].phase, lesson.id).toBe('reinforce')
			expect(lesson.takeaways.length, lesson.id).toBeGreaterThanOrEqual(3)
			expect(lesson.objectives.length, lesson.id).toBeGreaterThanOrEqual(3)
		}
	})

	it('gives every practice step a task and every reinforce step 1–3 questions', () => {
		for (const { lesson } of LESSON_REFS) {
			for (const step of lesson.steps) {
				if (step.phase === 'practice')
					expect(allTaskIds([step]).length, `${lesson.id}/${step.id}`).toBeGreaterThan(0)
				if (step.phase === 'reinforce') {
					const q = step.blocks.find((b) => b.type === 'questions')
					expect(q, `${lesson.id}/${step.id}`).toBeTruthy()
					if (q?.type === 'questions') {
						expect(q.questions.length).toBeGreaterThanOrEqual(1)
						expect(q.questions.length).toBeLessThanOrEqual(3)
					}
				}
			}
		}
	})

	it('uses globally unique task ids', () => {
		const ids = LESSON_REFS.flatMap((r) => allTaskIds(r.lesson.steps))
		expect(new Set(ids).size).toBe(ids.length)
	})

	it('only contains answerable tasks', () => {
		for (const b of allBlocks()) {
			switch (b.type) {
				case 'choice':
					expect(
						b.options.some((o) => o.correct),
						b.id
					).toBe(true)
					if (!b.multiple)
						expect(
							b.options.filter((o) => o.correct),
							b.id
						).toHaveLength(1)
					break
				case 'classify': {
					const cats = new Set(b.categories.map((c) => c.id))
					for (const item of b.items)
						expect(cats.has(item.category), `${b.id}/${item.id}`).toBe(true)
					break
				}
				case 'order':
					expect([...b.initial].sort(), b.id).toEqual(b.items.map((i) => i.id).sort())
					expect(b.initial, b.id).not.toEqual(b.items.map((i) => i.id))
					break
				case 'spot':
					expect(
						b.lines.some((l) => l.flawed),
						b.id
					).toBe(true)
					expect(
						b.lines.some((l) => !l.flawed),
						b.id
					).toBe(true)
					break
				case 'questions':
					for (const q of b.questions)
						expect(
							q.options.some((o) => o.id === q.correct),
							`${b.id}/${q.id}`
						).toBe(true)
					break
				case 'cases':
					for (const c of b.cases)
						expect(
							c.options.filter((o) => o.verdict === 'best'),
							`${b.id}/${c.id}`
						).toHaveLength(1)
					break
				case 'interactive':
					if (b.component === 'scenarioRunner')
						expect(getScenario(String(b.props?.scenarioId)), 'scenario').toBeTruthy()
					break
			}
		}
	})

	it('references only registered icons', () => {
		const known = new Set(Object.keys(icons))
		for (const b of allBlocks())
			if (b.type === 'concepts')
				for (const item of b.items) expect(known.has(item.icon), item.title).toBe(true)
		for (const badge of BADGES) expect(known.has(badge.icon), badge.id).toBe(true)
	})

	it('balances **bold** markers in every string', () => {
		for (const text of strings(MODULES)) {
			expect((text.match(/\*\*/g) ?? []).length % 2, text).toBe(0)
		}
	})

	it('has scenario steps with exactly one correct option each', () => {
		for (const id of ['yonetim', 'satis', 'toplanti']) {
			const scenario = getScenario(id)!
			expect(scenario.steps.length).toBeGreaterThanOrEqual(4)
			for (const step of scenario.steps)
				expect(
					step.options.filter((o) => o.correct),
					step.id
				).toHaveLength(1)
		}
	})

	it('links every quiz question to an existing module with one valid answer', () => {
		const moduleIds = new Set(MODULES.map((m) => m.id))
		const ids = QUIZ_QUESTIONS.map((q) => q.id)
		expect(new Set(ids).size).toBe(ids.length)
		for (const q of QUIZ_QUESTIONS) {
			expect(moduleIds.has(q.moduleId), q.id).toBe(true)
			expect(
				q.options.some((o) => o.id === q.correct),
				q.id
			).toBe(true)
		}
	})
})
