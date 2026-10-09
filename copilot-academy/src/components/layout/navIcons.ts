// Line icons for the sidebar cards of the academy's own topics; the sidebar
// strokes them with a two-tone gradient. Modules about a Microsoft 365 app use
// that app's icon instead (see APP_LOGOS).
import type { Component } from 'vue'
import {
	ClipboardCheck,
	LayoutDashboard,
	ShieldCheck,
	Trophy,
	WandSparkles,
	Workflow,
} from 'lucide-vue-next'
import type { Visual } from '@/types/content'

export const NAV_ICONS: Partial<Record<Visual, Component>> = {
	overview: LayoutDashboard,
	prompt: WandSparkles,
	scenario: Workflow,
	shield: ShieldCheck,
	quiz: ClipboardCheck,
	trophy: Trophy,
}
