import type { RichText, SkillKey } from '@/types/content'

export interface QuizQuestion {
	id: string
	skill: SkillKey
	/** Module to revisit when this question is missed. */
	moduleId: string
	prompt: RichText
	scenario?: RichText
	options: { id: string; text: RichText }[]
	correct: string
	explanation: RichText
}

export const PASS_RATIO = 0.8

export interface QuestionResult {
	questionId: string
	selected: string | null
	correct: boolean
}

export interface QuizScore {
	correct: number
	total: number
	ratio: number
	/** Rounded for display only; pass/fail uses the exact ratio. */
	percent: number
	passed: boolean
	results: QuestionResult[]
	/** Modules behind missed questions, most misses first. */
	reviewModules: string[]
	bySkill: Partial<Record<SkillKey, { correct: number; total: number }>>
}

export function scoreQuiz(
	questions: QuizQuestion[],
	answers: Record<string, string | undefined>
): QuizScore {
	const results: QuestionResult[] = questions.map((q) => {
		const selected = answers[q.id] ?? null
		return { questionId: q.id, selected, correct: selected === q.correct }
	})
	const correct = results.filter((r) => r.correct).length
	const total = questions.length
	const ratio = total ? correct / total : 0

	const misses = new Map<string, number>()
	const bySkill: QuizScore['bySkill'] = {}
	questions.forEach((q, i) => {
		const skill = (bySkill[q.skill] ??= { correct: 0, total: 0 })
		skill.total += 1
		if (results[i].correct) skill.correct += 1
		else misses.set(q.moduleId, (misses.get(q.moduleId) ?? 0) + 1)
	})
	const reviewModules = [...misses.entries()].sort((a, b) => b[1] - a[1]).map(([id]) => id)

	return {
		correct,
		total,
		ratio,
		percent: Math.round(ratio * 100),
		passed: ratio >= PASS_RATIO,
		results,
		reviewModules,
		bySkill,
	}
}
