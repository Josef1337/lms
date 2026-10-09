// Learner progress. Lives in memory and is mirrored to localStorage, so a
// reload resumes where the learner left off. Only ids, choices and
// timestamps are stored: never free text the learner typed.
import { defineStore } from 'pinia'
import { computed, reactive, ref, watch } from 'vue'
import {
	GRADUATION,
	LESSON_REFS,
	MODULES,
	QUIZ,
	TOTAL_LESSONS,
	getLessonRef,
	getModule,
	type LessonRef,
} from '@/content'
import { BADGES, getBadge, type BadgeContext } from '@/content/badges'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { scoreQuiz } from '@/lib/quizScoring'
import { readJson, removeKey, writeJson } from '@/lib/storage'
import type { TaskResult } from '@/types/content'

export const STORAGE_KEY = 'copilot-academy:progress'
const VERSION = 1
const ACTIVITY_LIMIT = 30

export interface LessonProgress {
	step: number
	furthest: number
	startedAt: string
	completedAt?: string
}

export interface QuizAttempt {
	id: string
	at: string
	answers: Record<string, string>
	correct: number
	total: number
	ratio: number
	passed: boolean
}

export interface QuizDraft {
	answers: Record<string, string>
	index: number
}

export type ActivityKind = 'start' | 'lesson' | 'module' | 'badge' | 'quiz'

export interface Activity {
	id: string
	kind: ActivityKind
	title: string
	detail?: string
	at: string
}

export interface ProgressData {
	version: number
	startedAt: string | null
	lessons: Record<string, LessonProgress>
	tasks: Record<string, TaskResult>
	quiz: { attempts: QuizAttempt[]; draft: QuizDraft | null }
	badges: Record<string, string>
	activity: Activity[]
	last: { lessonId: string } | null
	sidebarCollapsed: boolean
}

export const emptyProgress = (): ProgressData => ({
	version: VERSION,
	startedAt: null,
	lessons: {},
	tasks: {},
	quiz: { attempts: [], draft: null },
	badges: {},
	activity: [],
	last: null,
	sidebarCollapsed: false,
})

const isObject = (v: unknown): v is Record<string, unknown> =>
	typeof v === 'object' && v !== null && !Array.isArray(v)

/** Accepts only a well-formed record of the current version; anything else starts fresh. */
export function parseProgress(raw: unknown): ProgressData {
	const base = emptyProgress()
	if (!isObject(raw) || raw.version !== VERSION) return base
	const quiz = isObject(raw.quiz) ? raw.quiz : {}
	return {
		version: VERSION,
		startedAt: typeof raw.startedAt === 'string' ? raw.startedAt : null,
		lessons: isObject(raw.lessons) ? (raw.lessons as ProgressData['lessons']) : {},
		tasks: isObject(raw.tasks) ? (raw.tasks as ProgressData['tasks']) : {},
		quiz: {
			attempts: Array.isArray(quiz.attempts) ? (quiz.attempts as QuizAttempt[]) : [],
			draft: isObject(quiz.draft) ? (quiz.draft as unknown as QuizDraft) : null,
		},
		badges: isObject(raw.badges) ? (raw.badges as ProgressData['badges']) : {},
		activity: Array.isArray(raw.activity) ? (raw.activity as Activity[]) : [],
		last:
			isObject(raw.last) && typeof raw.last.lessonId === 'string'
				? { lessonId: raw.last.lessonId }
				: null,
		sidebarCollapsed: raw.sidebarCollapsed === true,
	}
}

const now = () => new Date().toISOString()
const uid = () => Math.random().toString(36).slice(2, 10)

export type LessonState = 'not-started' | 'in-progress' | 'completed'

export type ContinueTarget =
	| { kind: 'lesson'; ref: LessonRef; started: boolean; step: number }
	| { kind: 'quiz' }
	| { kind: 'done' }

export const useProgress = defineStore('progress', () => {
	const data = reactive<ProgressData>(parseProgress(readJson(STORAGE_KEY)))
	/** Badges earned in this session that the learner has not been shown yet. */
	const freshBadges = ref<string[]>([])

	watch(data, () => writeJson(STORAGE_KEY, data), { deep: true })

	// Another tab saved: take its copy, so this tab's next write does not undo
	// it. The write that follows is identical, so the tabs settle at once.
	if (typeof window !== 'undefined')
		window.addEventListener('storage', (event) => {
			if (event.key !== STORAGE_KEY) return
			Object.assign(data, parseProgress(readJson(STORAGE_KEY)))
		})

	// ------------------------------------------------------------ lessons

	const lessonState = (lessonId: string): LessonState => {
		const p = data.lessons[lessonId]
		if (!p) return 'not-started'
		return p.completedAt ? 'completed' : 'in-progress'
	}

	const completedLessonIds = computed(() =>
		LESSON_REFS.filter((r) => data.lessons[r.lesson.id]?.completedAt).map((r) => r.lesson.id)
	)

	const moduleStats = (moduleId: string) => {
		const module = getModule(moduleId)
		const total = module?.lessons.length ?? 0
		const done = module?.lessons.filter((l) => lessonState(l.id) === 'completed').length ?? 0
		const started = module?.lessons.some((l) => lessonState(l.id) !== 'not-started') ?? false
		return {
			done,
			total,
			percent: total ? Math.round((done / total) * 100) : 0,
			state: (done === total && total > 0
				? 'completed'
				: started
				? 'in-progress'
				: 'not-started') as LessonState,
		}
	}

	const bestAttempt = computed<QuizAttempt | null>(() =>
		data.quiz.attempts.reduce<QuizAttempt | null>(
			(best, a) => (!best || a.ratio > best.ratio ? a : best),
			null
		)
	)
	const lastAttempt = computed<QuizAttempt | null>(
		() => data.quiz.attempts[data.quiz.attempts.length - 1] ?? null
	)
	const quizPassed = computed(() => !!bestAttempt.value?.passed)

	/** Lessons plus the final quiz, each one unit. */
	const overall = computed(() => {
		const lessonsDone = completedLessonIds.value.length
		const units = TOTAL_LESSONS + 1
		const done = lessonsDone + (quizPassed.value ? 1 : 0)
		return {
			lessonsDone,
			lessonsTotal: TOTAL_LESSONS,
			modulesDone: MODULES.filter((m) => moduleStats(m.id).state === 'completed').length,
			percent: Math.round((done / units) * 100),
		}
	})

	const remainingMinutes = computed(
		() =>
			LESSON_REFS.filter((r) => lessonState(r.lesson.id) !== 'completed').reduce(
				(sum, r) => sum + r.lesson.minutes,
				0
			) + (quizPassed.value ? 0 : QUIZ.minutes)
	)

	const firstOpenLesson = (after = -1) =>
		LESSON_REFS.find((r) => r.index > after && lessonState(r.lesson.id) !== 'completed')

	const continueTarget = computed<ContinueTarget>(() => {
		const last = data.last ? getLessonRef(data.last.lessonId) : undefined
		const ref = last && lessonState(last.lesson.id) !== 'completed' ? last : firstOpenLesson()
		if (ref) {
			const p = data.lessons[ref.lesson.id]
			return { kind: 'lesson', ref, started: !!p, step: p?.step ?? 0 }
		}
		return quizPassed.value ? { kind: 'done' } : { kind: 'quiz' }
	})

	/** The lesson after the one "continue" points at, so the two cards never repeat. */
	const recommendedNext = computed<LessonRef | null>(() => {
		const target = continueTarget.value
		if (target.kind !== 'lesson') return null
		return firstOpenLesson(target.ref.index) ?? null
	})

	function log(kind: ActivityKind, title: string, detail?: string) {
		data.activity.unshift({ id: uid(), kind, title, detail, at: now() })
		if (data.activity.length > ACTIVITY_LIMIT) data.activity.length = ACTIVITY_LIMIT
	}

	function openLesson(lessonId: string) {
		const ref = getLessonRef(lessonId)
		if (!ref) return
		if (!data.startedAt) {
			data.startedAt = now()
			log('start', 'Eğitime başladınız', ref.lesson.title)
		}
		if (!data.lessons[lessonId]) {
			data.lessons[lessonId] = { step: 0, furthest: 0, startedAt: now() }
		}
		data.last = { lessonId }
	}

	function setStep(lessonId: string, step: number) {
		const p = data.lessons[lessonId]
		if (!p) return
		p.step = step
		p.furthest = Math.max(p.furthest, step)
	}

	function completeLesson(lessonId: string): string[] {
		const ref = getLessonRef(lessonId)
		const p = data.lessons[lessonId]
		if (!ref || !p) return []
		if (!p.completedAt) {
			p.completedAt = now()
			p.furthest = Math.max(p.furthest, ref.lesson.steps.length)
			log('lesson', `“${ref.lesson.title}” dersini tamamladınız`, ref.module.title)
			if (moduleStats(ref.module.id).state === 'completed') {
				log('module', `${ref.module.title} modülünü tamamladınız`, `Modül ${ref.module.number}`)
			}
		}
		return evaluateBadges()
	}

	// ------------------------------------------------------------ tasks

	const taskResult = (taskId: string): TaskResult | undefined => data.tasks[taskId]
	const isTaskDone = (taskId: string) => !!data.tasks[taskId]

	function recordTask(taskId: string, result: Omit<TaskResult, 'at'>) {
		data.tasks[taskId] = { ...result, at: now() }
	}

	function clearTask(taskId: string) {
		delete data.tasks[taskId]
	}

	// ------------------------------------------------------------ quiz

	function saveQuizDraft(draft: QuizDraft) {
		data.quiz.draft = { answers: { ...draft.answers }, index: draft.index }
	}

	function discardQuizDraft() {
		data.quiz.draft = null
	}

	function submitQuiz(answers: Record<string, string>): { attempt: QuizAttempt; badges: string[] } {
		const score = scoreQuiz(QUIZ_QUESTIONS, answers)
		const attempt: QuizAttempt = {
			id: uid(),
			at: now(),
			answers: { ...answers },
			correct: score.correct,
			total: score.total,
			ratio: score.ratio,
			passed: score.passed,
		}
		data.quiz.attempts.push(attempt)
		data.quiz.draft = null
		if (!data.startedAt) data.startedAt = attempt.at
		log(
			'quiz',
			score.passed ? 'Final bilgi testini geçtiniz' : 'Final bilgi testini tamamladınız',
			`${score.correct}/${score.total} doğru · %${score.percent}`
		)
		return { attempt, badges: evaluateBadges() }
	}

	// ------------------------------------------------------------ badges

	function badgeContext(): BadgeContext {
		return {
			completedLessons: completedLessonIds.value.length,
			totalLessons: TOTAL_LESSONS,
			isModuleComplete: (id) => moduleStats(id).state === 'completed',
			allModulesComplete: MODULES.every((m) => moduleStats(m.id).state === 'completed'),
			bestQuizRatio: bestAttempt.value?.ratio ?? null,
			overallPercent: overall.value.percent,
		}
	}

	/** Awards every badge whose condition now holds; returns the new ones. */
	function evaluateBadges(): string[] {
		const ctx = badgeContext()
		const fresh: string[] = []
		for (const badge of BADGES) {
			if (!data.badges[badge.id] && badge.earned(ctx)) {
				data.badges[badge.id] = now()
				fresh.push(badge.id)
				log('badge', `“${badge.title}” rozetini kazandınız`, badge.description)
			}
		}
		if (fresh.length) freshBadges.value = [...freshBadges.value, ...fresh]
		return fresh
	}

	function acknowledgeBadges(ids: string[]) {
		freshBadges.value = freshBadges.value.filter((id) => !ids.includes(id))
	}

	const earnedBadges = computed(() =>
		Object.entries(data.badges)
			.sort((a, b) => b[1].localeCompare(a[1]))
			.map(([id, at]) => ({ badge: getBadge(id), at }))
			.filter(
				(e): e is { badge: NonNullable<ReturnType<typeof getBadge>>; at: string } => !!e.badge
			)
	)

	// ------------------------------------------------------------ misc

	function toggleSidebar() {
		data.sidebarCollapsed = !data.sidebarCollapsed
	}

	function reset() {
		Object.assign(data, emptyProgress())
		freshBadges.value = []
		removeKey(STORAGE_KEY)
	}

	const hasProgress = computed(() => !!data.startedAt)

	return {
		data,
		freshBadges,
		hasProgress,
		lessonState,
		completedLessonIds,
		moduleStats,
		overall,
		remainingMinutes,
		continueTarget,
		recommendedNext,
		bestAttempt,
		lastAttempt,
		quizPassed,
		earnedBadges,
		openLesson,
		setStep,
		completeLesson,
		taskResult,
		isTaskDone,
		recordTask,
		clearTask,
		saveQuizDraft,
		discardQuizDraft,
		submitQuiz,
		evaluateBadges,
		acknowledgeBadges,
		toggleSidebar,
		reset,
		quizMeta: QUIZ,
		graduationMeta: GRADUATION,
	}
})
