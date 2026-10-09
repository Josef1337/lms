<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { Check, Copy, TriangleAlert } from 'lucide-vue-next'
import { copyText } from '@/lib/clipboard'

const props = withDefaults(
	defineProps<{
		text: string
		label?: string
		variant?: 'primary' | 'secondary' | 'ghost'
		size?: 'sm' | 'md'
	}>(),
	{ label: 'Kopyala', variant: 'secondary', size: 'md' }
)
const emit = defineEmits<{ copied: [] }>()

const VARIANT = { primary: 'btn-primary', secondary: 'btn-secondary', ghost: 'btn-ghost' }
const state = ref<'idle' | 'copied' | 'failed'>('idle')
let timer: ReturnType<typeof setTimeout> | undefined

async function copy() {
	if (!props.text) return
	const ok = await copyText(props.text)
	state.value = ok ? 'copied' : 'failed'
	if (ok) emit('copied')
	clearTimeout(timer)
	timer = setTimeout(() => (state.value = 'idle'), 2200)
}

onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
	<button
		type="button"
		:class="['btn', VARIANT[variant], size === 'sm' && 'btn-sm']"
		:disabled="!text"
		@click="copy"
	>
		<Check v-if="state === 'copied'" :size="16" class="text-success-600" aria-hidden="true" />
		<TriangleAlert
			v-else-if="state === 'failed'"
			:size="16"
			class="text-warning-600"
			aria-hidden="true"
		/>
		<Copy v-else :size="16" aria-hidden="true" />
		<span>{{
			state === 'copied' ? 'Kopyalandı' : state === 'failed' ? 'Kopyalanamadı' : label
		}}</span>
		<span class="sr-only" aria-live="polite">
			{{
				state === 'copied'
					? 'Metin panoya kopyalandı.'
					: state === 'failed'
					? 'Tarayıcı kopyalamaya izin vermedi; metni seçip elle kopyalayın.'
					: ''
			}}
		</span>
	</button>
</template>
