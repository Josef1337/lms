<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import type { KeyPointBlock } from '@/types/content'
import RichText from '@/components/ui/RichText.vue'

defineProps<{ block: KeyPointBlock }>()
</script>

<template>
	<div class="rounded-2xl bg-copilot p-[1.5px] shadow-raised">
		<div class="rounded-[calc(1rem-1px)] bg-white px-5 py-4">
			<p
				class="mb-1.5 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.08em] text-iris-700"
			>
				<Sparkles :size="14" aria-hidden="true" />
				{{ block.label ?? 'Önemli kavram' }}
			</p>
			<RichText
				as="p"
				:text="block.body"
				class="text-[16px] font-medium leading-relaxed text-ink-800 text-pretty"
			/>
		</div>
	</div>
</template>
