<script setup lang="ts">
import { FlaskConical } from 'lucide-vue-next'

withDefaults(defineProps<{ text?: string; compact?: boolean }>(), {
	text: 'Bu bir eğitim simülasyonudur. Gerçek bir Microsoft 365 veya Copilot bağlantısı yoktur; yanıtlar örnek verilerle önceden hazırlanmıştır.',
	compact: false,
})
</script>

<template>
	<p
		:class="[
			'flex items-start gap-2 rounded-lg border border-iris-200/70 bg-iris-50/70 text-iris-800',
			compact ? 'px-3 py-1.5 text-xs' : 'px-3.5 py-2.5 text-[13px]',
		]"
	>
		<FlaskConical :size="compact ? 14 : 16" class="mt-0.5 shrink-0" aria-hidden="true" />
		<span>{{ text }}</span>
	</p>
</template>
