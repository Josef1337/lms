import { BookOpen, Brain, Compass, Eye, Flag, PenLine } from 'lucide-vue-next'
import type { Component } from 'vue'
import type { Block, Phase, Step } from '@/types/content'

export type StepPhase = Phase | 'continue'

export const PHASES: Record<
	StepPhase,
	{ label: string; icon: Component; chip: string; dot: string }
> = {
	learn: {
		label: 'Öğren',
		icon: BookOpen,
		chip: 'bg-brand-50 text-brand-700 ring-brand-200',
		dot: 'bg-brand-600',
	},
	see: {
		label: 'Gör',
		icon: Eye,
		chip: 'bg-iris-50 text-iris-700 ring-iris-200',
		dot: 'bg-iris-600',
	},
	explore: {
		label: 'Keşfet',
		icon: Compass,
		chip: 'bg-lagoon-50 text-lagoon-700 ring-lagoon-200',
		dot: 'bg-lagoon-600',
	},
	practice: {
		label: 'Uygula',
		icon: PenLine,
		chip: 'bg-warning-50 text-warning-700 ring-warning-100',
		dot: 'bg-warning-600',
	},
	reinforce: {
		label: 'Pekiştir',
		icon: Brain,
		chip: 'bg-iris-50 text-iris-700 ring-iris-200',
		dot: 'bg-iris-600',
	},
	continue: {
		label: 'Devam et',
		icon: Flag,
		chip: 'bg-success-50 text-success-700 ring-success-100',
		dot: 'bg-success-600',
	},
}

/** One line under the step title saying what this phase asks of the learner. */
export const PHASE_PURPOSE: Record<StepPhase, string> = {
	learn: 'Konuyu kısa ve anlaşılır bölümlerle öğrenin.',
	see: 'Gerçekçi bir iş örneğinde nasıl göründüğünü inceleyin.',
	explore: 'Örnekle etkileşime girin; seçenekleri deneyip sonuçları karşılaştırın.',
	practice: 'Küçük görevi yapın; “Kontrol et” veya “Görevi Tamamla” ile geri bildirim alın.',
	reinforce: 'Birkaç kısa soruyla öğrendiklerinizi pekiştirin.',
	continue: 'Bu derste öğrendiklerinizi gözden geçirin ve devam edin.',
}

const taskIdOf = (block: Block): string | null => {
	switch (block.type) {
		case 'choice':
		case 'classify':
		case 'order':
		case 'spot':
		case 'questions':
		case 'cases':
			return block.id
		case 'interactive':
			return block.taskId ?? null
		default:
			return null
	}
}

/** Task ids a learner must finish before leaving the step. */
export const requiredTasks = (step: Step): string[] =>
	step.blocks.map(taskIdOf).filter((id): id is string => !!id)

export const allTaskIds = (steps: Step[]): string[] => steps.flatMap(requiredTasks)
