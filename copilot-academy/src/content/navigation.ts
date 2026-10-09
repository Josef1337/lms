import type { RouteLocationRaw } from 'vue-router'
import type { Visual } from '@/types/content'
import { GRADUATION, MODULES, QUIZ } from '.'

export interface NavItem {
	key: string
	label: string
	visual: Visual
	to: RouteLocationRaw
	kind: 'overview' | 'module' | 'quiz' | 'achievements'
	moduleId?: string
	number?: number
}

export const NAV_ITEMS: NavItem[] = [
	{
		key: 'overview',
		label: 'Genel Bakış',
		visual: 'overview',
		to: { name: 'dashboard' },
		kind: 'overview',
	},
	...MODULES.map<NavItem>((m) => ({
		key: m.id,
		label: m.navLabel,
		visual: m.visual,
		to: { name: 'module', params: { moduleId: m.id } },
		kind: 'module',
		moduleId: m.id,
		number: m.number,
	})),
	{
		key: QUIZ.id,
		label: QUIZ.navLabel,
		visual: 'quiz',
		to: { name: 'quiz' },
		kind: 'quiz',
		number: QUIZ.number,
	},
	{
		key: GRADUATION.id,
		label: GRADUATION.navLabel,
		visual: 'trophy',
		to: { name: 'achievements' },
		kind: 'achievements',
		number: GRADUATION.number,
	},
]
