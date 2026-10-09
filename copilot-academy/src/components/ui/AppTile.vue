<script setup lang="ts">
// Identity tile for a module or app. A Microsoft 365 app (and Copilot) shows
// its product icon; the academy's own topics (overview, prompting, scenarios,
// safe use, quiz, trophy) keep a coloured square with a line icon.
import { computed, type Component } from 'vue'
import {
	ClipboardCheck,
	LayoutDashboard,
	ShieldCheck,
	Trophy,
	WandSparkles,
	Workflow,
} from 'lucide-vue-next'
import type { Visual } from '@/types/content'
import { APP_LOGOS } from './appLogos'

const props = withDefaults(
	defineProps<{ visual: Visual; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>(),
	{
		size: 'md',
	}
)

const ICONS: Partial<Record<Visual, Component>> = {
	overview: LayoutDashboard,
	prompt: WandSparkles,
	scenario: Workflow,
	shield: ShieldCheck,
	quiz: ClipboardCheck,
	trophy: Trophy,
}

const BG: Partial<Record<Visual, string>> = {
	overview: 'bg-gradient-to-br from-ink-700 to-ink-900',
	prompt: 'bg-gradient-to-br from-iris-500 to-iris-700',
	scenario: 'bg-gradient-to-br from-lagoon-500 to-lagoon-700',
	shield: 'bg-gradient-to-br from-ink-600 to-ink-800',
	quiz: 'bg-gradient-to-br from-brand-600 to-brand-800',
	trophy: 'bg-gradient-to-br from-[#f2b33d] to-[#d07d0a]',
}

const SIZE = {
	xs: { box: 'h-6 w-6 rounded-md', logo: 'h-6 w-6', px: 24, icon: 13 },
	sm: { box: 'h-8 w-8 rounded-lg', logo: 'h-8 w-8', px: 32, icon: 16 },
	md: { box: 'h-10 w-10 rounded-[10px]', logo: 'h-10 w-10', px: 40, icon: 20 },
	lg: { box: 'h-12 w-12 rounded-xl', logo: 'h-12 w-12', px: 48, icon: 24 },
	xl: { box: 'h-16 w-16 rounded-2xl', logo: 'h-16 w-16', px: 64, icon: 30 },
}

const logo = computed(() => APP_LOGOS[props.visual])
const icon = computed(() => ICONS[props.visual])
const size = computed(() => SIZE[props.size])
</script>

<template>
	<img
		v-if="logo"
		:src="logo"
		alt=""
		aria-hidden="true"
		draggable="false"
		:width="size.px"
		:height="size.px"
		:class="['shrink-0 select-none object-contain', size.logo]"
	/>
	<span
		v-else
		:class="[
			'relative inline-flex shrink-0 items-center justify-center overflow-hidden text-white shadow-[inset_0_1px_0_rgba(255,255,255,.25),0_1px_2px_rgba(13,17,26,.18)]',
			BG[visual],
			size.box,
		]"
		aria-hidden="true"
	>
		<span
			class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 to-transparent"
		/>
		<component :is="icon" :size="size.icon" :stroke-width="2" class="relative" />
	</span>
</template>
