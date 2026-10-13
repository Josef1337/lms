import type { PromptPart } from '@/types/content'

/**
 * Colour coding for the five prompt parts, shared by every prompt view. These
 * are categorical hues, kept apart from the brand red so no two parts match.
 */
export const PART_STYLE: Record<PromptPart, { mark: string; chip: string; dot: string }> = {
	goal: {
		mark: 'bg-blue-100/80 text-blue-900 decoration-blue-500',
		chip: 'bg-blue-50 text-blue-800 ring-blue-200',
		dot: 'bg-blue-600',
	},
	context: {
		mark: 'bg-violet-100/80 text-violet-900 decoration-violet-500',
		chip: 'bg-violet-50 text-violet-800 ring-violet-200',
		dot: 'bg-violet-600',
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
