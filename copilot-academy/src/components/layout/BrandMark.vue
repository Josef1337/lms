<script setup lang="ts">
// The academy's mark: the Copilot icon next to the name.
import { COPILOT_LOGO } from '@/components/ui/appLogos'

withDefaults(defineProps<{ compact?: boolean; onDark?: boolean; tagline?: boolean }>(), {
	compact: false,
	onDark: false,
	tagline: false,
})
</script>

<template>
	<span class="inline-flex items-center gap-2.5">
		<img
			:src="COPILOT_LOGO"
			alt=""
			aria-hidden="true"
			draggable="false"
			width="36"
			height="36"
			class="h-9 w-9 shrink-0 select-none object-contain"
		/>
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
