<script setup lang="ts">
import type { ComparisonBlock } from '@/types/content'
import Icon from '@/components/ui/Icon.vue'
import RichText from '@/components/ui/RichText.vue'

defineProps<{ block: ComparisonBlock }>()
</script>

<template>
	<figure>
		<figcaption v-if="block.caption" class="mb-2.5 text-sm font-semibold text-ink-700">
			{{ block.caption }}
		</figcaption>
		<!-- Table from md up -->
		<div
			class="hidden overflow-hidden rounded-xl border border-ink-200/80 bg-white shadow-card md:block"
		>
			<table class="w-full border-collapse text-start text-sm">
				<thead>
					<tr class="bg-ink-50/80">
						<th
							scope="col"
							class="w-[22%] px-4 py-3 text-start text-xs font-semibold uppercase tracking-wide text-ink-500"
						>
							<span class="sr-only">Ölçüt</span>
						</th>
						<th
							v-for="col in block.columns"
							:key="col.title"
							scope="col"
							:class="[
								'px-4 py-3 text-start',
								col.highlight ? 'bg-brand-50 text-brand-800' : 'text-ink-700',
							]"
						>
							<span class="flex items-center gap-2 font-semibold">
								<Icon v-if="col.icon" :name="col.icon" :size="16" />
								{{ col.title }}
							</span>
						</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="row in block.rows" :key="row.label" class="border-t border-ink-100 align-top">
						<th scope="row" class="px-4 py-3 text-start font-semibold text-ink-800">
							{{ row.label }}
						</th>
						<td
							v-for="(value, i) in row.values"
							:key="i"
							:class="[
								'px-4 py-3 leading-relaxed text-ink-600',
								block.columns[i]?.highlight && 'bg-brand-50/50 text-ink-800',
							]"
						>
							<RichText :text="value" />
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<!-- Stacked cards on small screens -->
		<div class="space-y-3 md:hidden">
			<section
				v-for="(col, ci) in block.columns"
				:key="col.title"
				:class="[
					'rounded-xl border bg-white p-4 shadow-card',
					col.highlight ? 'border-brand-200 ring-1 ring-brand-100' : 'border-ink-200/80',
				]"
			>
				<h4 class="mb-2 flex items-center gap-2 text-[15px] font-semibold">
					<Icon v-if="col.icon" :name="col.icon" :size="16" />
					{{ col.title }}
				</h4>
				<dl class="space-y-2 text-sm">
					<div v-for="row in block.rows" :key="row.label">
						<dt class="text-xs font-semibold uppercase tracking-wide text-ink-500">
							{{ row.label }}
						</dt>
						<dd class="text-ink-700"><RichText :text="row.values[ci]" /></dd>
					</div>
				</dl>
			</section>
		</div>
	</figure>
</template>
