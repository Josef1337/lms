<script setup lang="ts">
import type { ChatBlock } from '@/types/content'
import AppFrame from '@/components/ui/AppFrame.vue'
import ChatBubble from '@/components/ui/ChatBubble.vue'
import RichText from '@/components/ui/RichText.vue'

defineProps<{ block: ChatBlock }>()
</script>

<template>
	<figure>
		<AppFrame
			:visual="block.surface ?? 'chat'"
			:title="block.title ?? 'Copilot Chat'"
			subtitle="Örnek konuşma"
		>
			<div class="space-y-4 bg-gradient-to-b from-ink-50/60 to-white px-4 py-5 sm:px-5">
				<ChatBubble v-for="(m, i) in block.messages" :key="i" :message="m" />
			</div>
		</AppFrame>
		<figcaption v-if="block.caption" class="mt-2.5 text-[13px] text-ink-500">
			<RichText :text="block.caption" />
		</figcaption>
	</figure>
</template>
