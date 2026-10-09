<script setup lang="ts">
// Identity tile for a module or app. Original artwork: a coloured square with
// a letter or a line icon. These are not Microsoft product logos.
import { computed } from 'vue'
import {
	ClipboardCheck,
	LayoutDashboard,
	MessagesSquare,
	ShieldCheck,
	Sparkles,
	Trophy,
	WandSparkles,
	Workflow,
} from 'lucide-vue-next'
import type { Visual } from '@/types/content'

const props = withDefaults(
	defineProps<{ visual: Visual; size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' }>(),
	{
		size: 'md',
	}
)

const LETTERS: Partial<Record<Visual, string>> = {
	word: 'W',
	outlook: 'O',
	excel: 'X',
	powerpoint: 'P',
	teams: 'T',
}

const ICONS = {
	overview: LayoutDashboard,
	copilot: Sparkles,
	prompt: WandSparkles,
	chat: MessagesSquare,
	scenario: Workflow,
	shield: ShieldCheck,
	quiz: ClipboardCheck,
	trophy: Trophy,
}

const BG: Record<Visual, string> = {
	overview: 'bg-gradient-to-br from-ink-700 to-ink-900',
	copilot: 'bg-copilot',
	prompt: 'bg-gradient-to-br from-iris-500 to-iris-700',
	chat: 'bg-gradient-to-br from-brand-500 to-lagoon-600',
	word: 'bg-gradient-to-br from-[#2b7cd3] to-app-word',
	outlook: 'bg-gradient-to-br from-[#28a8ea] to-app-outlook',
	excel: 'bg-gradient-to-br from-[#21a366] to-app-excel',
	powerpoint: 'bg-gradient-to-br from-[#ed6c47] to-app-powerpoint',
	teams: 'bg-gradient-to-br from-[#7b83eb] to-app-teams',
	scenario: 'bg-gradient-to-br from-lagoon-500 to-lagoon-700',
	shield: 'bg-gradient-to-br from-ink-600 to-ink-800',
	quiz: 'bg-gradient-to-br from-brand-600 to-brand-800',
	trophy: 'bg-gradient-to-br from-[#f2b33d] to-[#d07d0a]',
}

const SIZE = {
	xs: { box: 'h-6 w-6 rounded-md', text: 'text-[11px]', icon: 13 },
	sm: { box: 'h-8 w-8 rounded-lg', text: 'text-[13px]', icon: 16 },
	md: { box: 'h-10 w-10 rounded-[10px]', text: 'text-base', icon: 20 },
	lg: { box: 'h-12 w-12 rounded-xl', text: 'text-lg', icon: 24 },
	xl: { box: 'h-16 w-16 rounded-2xl', text: 'text-2xl', icon: 30 },
}

const letter = computed(() => LETTERS[props.visual])
const icon = computed(() => (letter.value ? null : ICONS[props.visual as keyof typeof ICONS]))
const size = computed(() => SIZE[props.size])
</script>

<template>
	<span
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
		<span v-if="letter" :class="['relative font-display font-bold leading-none', size.text]">
			{{ letter }}
		</span>
		<component :is="icon" v-else :size="size.icon" :stroke-width="2" class="relative" />
	</span>
</template>
