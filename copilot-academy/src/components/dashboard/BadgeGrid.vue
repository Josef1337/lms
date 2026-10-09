<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
import { BADGES } from '@/content/badges'
import { useProgress } from '@/stores/progress'
import { formatDate } from '@/lib/format'
import AppTile from '@/components/ui/AppTile.vue'

withDefaults(defineProps<{ compact?: boolean }>(), { compact: false })
const progress = useProgress()
</script>

<template>
	<ul
		:class="['grid gap-2.5', compact ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3']"
		role="list"
	>
		<li
			v-for="b in BADGES"
			:key="b.id"
			:class="[
				'flex items-center gap-3 rounded-xl border p-3 transition',
				progress.data.badges[b.id]
					? 'border-amber-200 bg-gradient-to-br from-amber-50/80 to-white'
					: 'border-ink-200/80 bg-ink-50/50',
			]"
		>
			<span class="relative">
				<AppTile
					:visual="b.visual"
					size="md"
					:class="!progress.data.badges[b.id] && 'opacity-35 grayscale'"
				/>
				<span
					v-if="!progress.data.badges[b.id]"
					class="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-ink-500 shadow-card ring-1 ring-ink-200"
					aria-hidden="true"
				>
					<Lock :size="11" />
				</span>
			</span>
			<div class="min-w-0">
				<p
					:class="[
						'text-[14px] font-semibold leading-snug',
						progress.data.badges[b.id] ? 'text-ink-900' : 'text-ink-500',
					]"
				>
					{{ b.title }}
					<span class="sr-only">{{
						progress.data.badges[b.id] ? '(kazanıldı)' : '(kilitli)'
					}}</span>
				</p>
				<p class="text-[12.5px] leading-snug text-ink-500">
					{{ progress.data.badges[b.id] ? b.description : b.hint }}
				</p>
				<p
					v-if="progress.data.badges[b.id] && !compact"
					class="mt-0.5 text-[11.5px] text-amber-700"
				>
					{{ formatDate(progress.data.badges[b.id]) }}
				</p>
			</div>
		</li>
	</ul>
</template>
