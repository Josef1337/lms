<script setup lang="ts">
import { CircleCheck, PenLine } from 'lucide-vue-next'
import RichText from '@/components/ui/RichText.vue'

withDefaults(defineProps<{ prompt?: string; label?: string; done?: boolean }>(), {
	label: 'Görev',
	done: false,
})
</script>

<template>
	<section class="overflow-hidden rounded-2xl border border-ink-200/80 bg-white shadow-card">
		<header
			class="flex items-start gap-3 border-b border-ink-100 bg-gradient-to-r from-warning-50/80 via-white to-white px-4 py-3.5 sm:px-5"
		>
			<span
				class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning-100 text-warning-700"
				aria-hidden="true"
			>
				<PenLine :size="15" />
			</span>
			<div class="min-w-0 flex-1">
				<p
					class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-warning-700"
				>
					{{ label }}
					<span v-if="done" class="chip bg-success-50 normal-case tracking-normal text-success-700">
						<CircleCheck :size="12" aria-hidden="true" /> Tamamlandı
					</span>
				</p>
				<RichText
					v-if="prompt"
					as="p"
					:text="prompt"
					class="mt-0.5 text-[15px] font-semibold leading-snug text-ink-900"
				/>
			</div>
		</header>
		<div class="px-4 py-4 sm:px-5">
			<slot />
		</div>
		<footer
			v-if="$slots.footer"
			class="flex flex-wrap items-center gap-3 border-t border-ink-100 bg-ink-50/60 px-4 py-3 sm:px-5"
		>
			<slot name="footer" />
		</footer>
	</section>
</template>
