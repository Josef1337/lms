// Content model. Lessons are plain data: the UI renders whatever a module
// file describes, so adding or editing a lesson never touches a component.
import type { IconName } from '@/components/ui/icons'

/** Identity tile used for a module (app accent + glyph). */
export type Visual =
	| 'overview'
	| 'copilot'
	| 'prompt'
	| 'chat'
	| 'word'
	| 'outlook'
	| 'excel'
	| 'powerpoint'
	| 'teams'
	| 'scenario'
	| 'shield'
	| 'quiz'
	| 'trophy'

/** The learning loop every lesson follows. "Kontrol et" happens inside a practice step. */
export type Phase = 'learn' | 'see' | 'explore' | 'practice' | 'reinforce'

/** The five parts of the prompt starting model taught in module 2. */
export type PromptPart = 'goal' | 'context' | 'source' | 'expectation' | 'constraints'

/** Inline text. `**bold**` is the only markup and renders as <strong>. */
export type RichText = string

// ---------------------------------------------------------------- blocks

export interface TextBlock {
	type: 'text'
	body: RichText | RichText[]
	lead?: boolean
}

export interface ConceptItem {
	icon: IconName
	title: string
	body: RichText
	detail?: RichText
}

export interface ConceptsBlock {
	type: 'concepts'
	items: ConceptItem[]
	columns?: 2 | 3
}

export interface CalloutBlock {
	type: 'callout'
	tone: 'info' | 'tip' | 'warning' | 'availability'
	title?: string
	body: RichText
}

export interface KeyPointBlock {
	type: 'keyPoint'
	label?: string
	body: RichText
}

export interface DisclosureBlock {
	type: 'disclosure'
	title?: string
	items: { title: string; body: RichText | RichText[] }[]
}

export interface ComparisonBlock {
	type: 'comparison'
	caption?: string
	columns: { title: string; icon?: IconName; highlight?: boolean }[]
	rows: { label: string; values: RichText[] }[]
}

export interface ChatMessage {
	role: 'user' | 'copilot'
	text?: RichText
	heading?: string
	bullets?: RichText[]
	note?: RichText
}

export interface ChatBlock {
	type: 'chat'
	surface?: Visual
	title?: string
	caption?: RichText
	messages: ChatMessage[]
}

export interface BeforeAfterBlock {
	type: 'beforeAfter'
	before: { label: string; text: RichText }
	after: { label: string; text: RichText }
	notes?: RichText[]
}

export interface RevealStep {
	title: string
	body: RichText
	prompt?: string
	output?: { label: string; lines: RichText[] }
}

export interface RevealBlock {
	type: 'reveal'
	title?: string
	intro?: RichText
	surface?: Visual
	steps: RevealStep[]
}

export interface ListBlock {
	type: 'list'
	style: 'check' | 'number' | 'bullet' | 'cross'
	title?: string
	items: RichText[]
}

export interface PromptAnatomyBlock {
	type: 'promptAnatomy'
	caption?: RichText
	segments: { text: string; part?: PromptPart }[]
}

// ---------------------------------------------------------------- tasks
// Every task carries an `id`; its result is stored under that id, and a step
// cannot be left until each of its required tasks has a stored result.

export interface ChoiceOption {
	id: string
	text: RichText
	correct?: boolean
	feedback: RichText
}

export interface ChoiceTaskBlock {
	type: 'choice'
	id: string
	prompt: RichText
	context?: RichText
	multiple?: boolean
	options: ChoiceOption[]
	explanation: RichText
}

export interface ClassifyCategory {
	id: string
	label: string
	description: string
	tone: 'good' | 'warn' | 'stop'
}

export interface ClassifyTaskBlock {
	type: 'classify'
	id: string
	prompt: RichText
	categories: ClassifyCategory[]
	items: { id: string; text: RichText; category: string; feedback: RichText }[]
}

export interface OrderTaskBlock {
	type: 'order'
	id: string
	prompt: RichText
	/** Items in the correct order. */
	items: { id: string; text: RichText; hint?: string }[]
	/** Starting order shown to the learner (ids). */
	initial: string[]
	explanation: RichText
}

export interface SpotTaskBlock {
	type: 'spot'
	id: string
	prompt: RichText
	reference?: { title: string; lines: RichText[] }
	output: { title: string; surface?: Visual }
	lines: { id: string; text: RichText; flawed?: boolean; reason: RichText }[]
	explanation: RichText
}

export interface Question {
	id: string
	prompt: RichText
	options: { id: string; text: RichText }[]
	correct: string
	explanation: RichText
}

export interface QuestionsBlock {
	type: 'questions'
	id: string
	title?: string
	questions: Question[]
}

export interface DecisionCase {
	id: string
	title: string
	situation: RichText
	options: { id: string; text: RichText; verdict: 'best' | 'risky' | 'wrong'; feedback: RichText }[]
}

export interface CasesTaskBlock {
	type: 'cases'
	id: string
	prompt?: RichText
	cases: DecisionCase[]
}

export type InteractiveKey =
	| 'reportExplorer'
	| 'promptBuilder'
	| 'promptCompare'
	| 'chatSimulator'
	| 'wordDraft'
	| 'wordRewriter'
	| 'outlookLab'
	| 'toneSwitcher'
	| 'excelLab'
	| 'pptStudio'
	| 'teamsLab'
	| 'scenarioRunner'

export interface InteractiveBlock {
	type: 'interactive'
	component: InteractiveKey
	/** When set, the component is a required task and reports completion under this id. */
	taskId?: string
	props?: Record<string, string | number | boolean>
}

export type TaskBlock =
	| ChoiceTaskBlock
	| ClassifyTaskBlock
	| OrderTaskBlock
	| SpotTaskBlock
	| QuestionsBlock
	| CasesTaskBlock

export type Block =
	| TextBlock
	| ConceptsBlock
	| CalloutBlock
	| KeyPointBlock
	| DisclosureBlock
	| ComparisonBlock
	| ChatBlock
	| BeforeAfterBlock
	| RevealBlock
	| ListBlock
	| PromptAnatomyBlock
	| TaskBlock
	| InteractiveBlock

// ---------------------------------------------------------------- structure

export interface AsideNote {
	tone: 'tip' | 'example' | 'explain' | 'note'
	title: string
	body: RichText | RichText[]
}

export interface Step {
	id: string
	phase: Phase
	title: string
	blocks: Block[]
	aside?: AsideNote[]
	/** Gives the step the full content width; the side panel moves below it. */
	wide?: boolean
}

export interface Lesson {
	id: string
	title: string
	summary: string
	minutes: number
	objectives: string[]
	steps: Step[]
	takeaways: RichText[]
}

export type SkillKey = 'basics' | 'prompting' | 'apps' | 'data' | 'meetings' | 'verify' | 'safety'

export interface Module {
	id: string
	number: number
	title: string
	navLabel: string
	tagline: string
	description: string
	visual: Visual
	objectives: string[]
	skills: SkillKey[]
	/** Licence / configuration note shown on the module page. */
	availability?: string
	lessons: Lesson[]
}

// ---------------------------------------------------------------- results

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json }

export interface TaskResult {
	correct: boolean
	/** 0–1 share of correct answers where a task has several parts. */
	score?: number
	answer?: Json
	at: string
}
