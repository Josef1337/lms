<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
</script>

<template>
	<footer
		:class="[
			'no-print border-t border-ink-200/80',
			compact ? 'px-4 py-5 sm:px-8' : 'px-4 py-10 sm:px-8',
		]"
	>
		<div
			class="mx-auto flex max-w-6xl flex-col gap-2 text-xs leading-relaxed text-ink-500 sm:flex-row sm:items-start sm:justify-between"
		>
			<p class="max-w-3xl">
				Copilot Academy, eğitim amaçlı bağımsız bir simülasyondur ve Microsoft ile bağlantılı
				değildir. Hiçbir Microsoft 365 hesabına bağlanmaz, e-posta göndermez, dosyalara erişmez. Tüm
				şirketler, kişiler ve veriler kurgusaldır. Microsoft 365, Copilot, Word, Excel, PowerPoint,
				Outlook ve Teams, Microsoft Corporation’ın ticari markalarıdır.
			</p>
			<p class="shrink-0 text-ink-400">İlerlemeniz yalnızca bu tarayıcıda saklanır.</p>
		</div>
	</footer>
</template>
