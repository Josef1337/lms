<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'
import type { ChatMessage } from '@/types/content'
import RichText from './RichText.vue'

defineProps<{ message: ChatMessage; dark?: boolean }>()
</script>

<template>
	<div v-if="message.role === 'user'" class="flex justify-end">
		<div
			:class="[
				'max-w-[88%] rounded-2xl rounded-ee-md px-4 py-2.5 text-[14px] leading-relaxed shadow-card',
				dark ? 'bg-brand-600 text-white' : 'bg-brand-600 text-white',
			]"
		>
			<p class="mb-0.5 text-[11px] font-semibold uppercase tracking-wide text-white/70">Siz</p>
			<RichText as="p" :text="message.text ?? ''" class="[&_strong]:text-white" />
		</div>
	</div>
	<div v-else class="flex gap-2.5">
		<span
			class="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-copilot text-white shadow-card"
			aria-hidden="true"
		>
			<Sparkles :size="14" />
		</span>
		<div
			:class="[
				'min-w-0 max-w-[92%] rounded-2xl rounded-ss-md border px-4 py-3 text-[14px] leading-relaxed',
				dark
					? 'border-white/10 bg-white/5 text-ink-100'
					: 'border-ink-200/80 bg-white text-ink-700 shadow-card',
			]"
		>
			<p
				:class="[
					'mb-1 text-[11px] font-semibold uppercase tracking-wide',
					dark ? 'text-iris-300' : 'text-iris-700',
				]"
			>
				Copilot
				<span class="font-medium normal-case tracking-normal opacity-70">· örnek yanıt</span>
			</p>
			<p
				v-if="message.heading"
				:class="['mb-1 font-semibold', dark ? 'text-white' : 'text-ink-900']"
			>
				{{ message.heading }}
			</p>
			<RichText v-if="message.text" as="p" :text="message.text" />
			<ul v-if="message.bullets?.length" class="mt-1.5 space-y-1">
				<li v-for="(b, i) in message.bullets" :key="i" class="flex gap-2">
					<span
						:class="[
							'mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full',
							dark ? 'bg-iris-300' : 'bg-iris-500',
						]"
						aria-hidden="true"
					/>
					<RichText :text="b" />
				</li>
			</ul>
			<RichText
				v-if="message.note"
				as="p"
				:text="message.note"
				:class="[
					'mt-2 border-t pt-2 text-[12px]',
					dark ? 'border-white/10 text-ink-400' : 'border-ink-100 text-ink-500',
				]"
			/>
		</div>
	</div>
</template>
