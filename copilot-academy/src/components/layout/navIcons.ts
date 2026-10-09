// Line icons for the sidebar cards. Each module gets a plain outline icon that
// the sidebar strokes with a two-tone gradient; the coloured AppTile squares are
// still used everywhere else.
import type { Component } from 'vue'
import {
	ClipboardCheck,
	FileText,
	LayoutDashboard,
	Mail,
	MessagesSquare,
	Presentation,
	ShieldCheck,
	Sheet,
	Sparkles,
	Trophy,
	Users,
	WandSparkles,
	Workflow,
} from 'lucide-vue-next'
import type { Visual } from '@/types/content'

export const NAV_ICONS: Record<Visual, Component> = {
	overview: LayoutDashboard,
	copilot: Sparkles,
	prompt: WandSparkles,
	chat: MessagesSquare,
	word: FileText,
	outlook: Mail,
	excel: Sheet,
	powerpoint: Presentation,
	teams: Users,
	scenario: Workflow,
	shield: ShieldCheck,
	quiz: ClipboardCheck,
	trophy: Trophy,
}
