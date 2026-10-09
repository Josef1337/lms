<script setup lang="ts" generic="T extends string">
defineProps<{ label: string; options: { value: T; label: string }[] }>()
const model = defineModel<T>({ required: true })
</script>

<template>
	<div>
		<p class="mb-1.5 text-[12.5px] font-semibold text-ink-600">{{ label }}</p>
		<div
			class="inline-flex flex-wrap gap-1 rounded-xl border border-ink-200 bg-ink-50 p-1"
			role="radiogroup"
			:aria-label="label"
		>
			<button
				v-for="o in options"
				:key="o.value"
				type="button"
				role="radio"
				:aria-checked="model === o.value"
				:class="[
					'rounded-lg px-3 py-1.5 text-[13px] font-semibold transition',
					model === o.value
						? 'bg-white text-ink-900 shadow-card ring-1 ring-ink-200'
						: 'text-ink-500 hover:text-ink-800',
				]"
				@click="model = o.value"
			>
				{{ o.label }}
			</button>
		</div>
	</div>
</template>
