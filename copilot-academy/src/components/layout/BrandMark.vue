<script setup lang="ts">
import { useId } from 'vue'

// Unique per instance: a gradient referenced from a hidden copy (the desktop
// sidebar on a phone) would otherwise render the mark empty.
const gradientId = `brand-mark-${useId()}`

withDefaults(defineProps<{ compact?: boolean; onDark?: boolean; tagline?: boolean }>(), {
	compact: false,
	onDark: false,
	tagline: false,
})
</script>

<template>
	<span class="inline-flex items-center gap-2.5">
		<svg viewBox="0 0 64 64" class="h-9 w-9 shrink-0 drop-shadow-sm" aria-hidden="true">
			<defs>
				<linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stop-color="#0f6cbd" />
					<stop offset=".55" stop-color="#6b46db" />
					<stop offset="1" stop-color="#0faaa4" />
				</linearGradient>
			</defs>
			<rect width="64" height="64" rx="16" :fill="`url(#${gradientId})`" />
			<path d="M32 13l4.6 10.9L48 28.5l-11.4 4.6L32 44l-4.6-10.9L16 28.5l11.4-4.6z" fill="#fff" />
			<circle cx="46" cy="46" r="4" fill="#fff" opacity=".85" />
		</svg>
		<span v-if="!compact" class="flex flex-col leading-tight">
			<span
				:class="[
					'font-display text-[15px] font-bold tracking-tight',
					onDark ? 'text-white' : 'text-ink-900',
				]"
			>
				Copilot Academy
			</span>
			<span
				v-if="tagline"
				:class="[
					'hidden text-[11px] font-medium sm:block',
					onDark ? 'text-white/60' : 'text-ink-500',
				]"
			>
				Work smarter. Create faster. Learn Copilot.
			</span>
		</span>
	</span>
</template>
