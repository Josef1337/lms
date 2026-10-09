import type { PromptPart } from '@/types/content'

/** Colour coding for the five prompt parts, shared by every prompt view. */
export const PART_STYLE: Record<PromptPart, { mark: string; chip: string; dot: string }> = {
	goal: {
		mark: 'bg-brand-100/80 text-brand-900 decoration-brand-500',
		chip: 'bg-brand-50 text-brand-800 ring-brand-200',
		dot: 'bg-brand-600',
	},
	context: {
		mark: 'bg-iris-100/80 text-iris-900 decoration-iris-500',
		chip: 'bg-iris-50 text-iris-800 ring-iris-200',
		dot: 'bg-iris-600',
	},
	source: {
		mark: 'bg-lagoon-100/80 text-lagoon-900 decoration-lagoon-500',
		chip: 'bg-lagoon-50 text-lagoon-800 ring-lagoon-200',
		dot: 'bg-lagoon-600',
	},
	expectation: {
		mark: 'bg-amber-100/90 text-amber-900 decoration-amber-500',
		chip: 'bg-amber-50 text-amber-800 ring-amber-200',
		dot: 'bg-amber-500',
	},
	constraints: {
		mark: 'bg-rose-100/80 text-rose-900 decoration-rose-500',
		chip: 'bg-rose-50 text-rose-800 ring-rose-200',
		dot: 'bg-rose-500',
	},
}
