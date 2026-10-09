<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ChevronRight, Menu, Trophy } from 'lucide-vue-next'
import { getLessonRef, getModule } from '@/content'
import { useProgress } from '@/stores/progress'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import BrandMark from './BrandMark.vue'

defineEmits<{ openMenu: [] }>()

const route = useRoute()
const progress = useProgress()

interface Crumb {
	label: string
	to?: { name: string; params?: Record<string, string> }
}

const crumbs = computed<Crumb[]>(() => {
	const list: Crumb[] = [{ label: 'Genel Bakış', to: { name: 'dashboard' } }]
	const moduleId = typeof route.params.moduleId === 'string' ? route.params.moduleId : ''
	const module = moduleId ? getModule(moduleId) : undefined
	if (module) {
		list.push({
			label: `Modül ${module.number} · ${module.navLabel}`,
			to: { name: 'module', params: { moduleId } },
		})
		const lessonId = typeof route.params.lessonId === 'string' ? route.params.lessonId : ''
		const ref = lessonId ? getLessonRef(lessonId) : undefined
		if (ref) list.push({ label: ref.lesson.title })
	} else if (route.name === 'quiz') list.push({ label: 'Final Bilgi Testi' })
	else if (route.name === 'achievements') list.push({ label: 'Başarılarım' })
	return list
})
</script>

<template>
	<header
		class="no-print sticky top-0 z-30 border-b border-ink-200/80 bg-white/85 backdrop-blur-md"
	>
		<div class="flex h-14 items-center gap-3 px-4 sm:px-6 lg:px-8">
			<button
				type="button"
				class="btn btn-ghost btn-sm -ms-2 px-2 lg:hidden"
				aria-label="Menüyü aç"
				@click="$emit('openMenu')"
			>
				<Menu :size="20" aria-hidden="true" />
			</button>
			<RouterLink :to="{ name: 'dashboard' }" class="rounded-lg lg:hidden" aria-label="Genel Bakış">
				<BrandMark compact />
			</RouterLink>

			<nav aria-label="Konum" class="hidden min-w-0 flex-1 md:block">
				<ol class="flex min-w-0 items-center gap-1.5 text-[13px] text-ink-500">
					<li v-for="(crumb, i) in crumbs" :key="i" class="flex min-w-0 items-center gap-1.5">
						<ChevronRight
							v-if="i > 0"
							:size="14"
							class="shrink-0 text-ink-300 rtl:-scale-x-100"
							aria-hidden="true"
						/>
						<RouterLink
							v-if="crumb.to && i < crumbs.length - 1"
							:to="crumb.to"
							class="truncate rounded hover:text-ink-900"
						>
							{{ crumb.label }}
						</RouterLink>
						<span v-else class="truncate font-semibold text-ink-800" aria-current="page">{{
							crumb.label
						}}</span>
					</li>
				</ol>
			</nav>
			<div class="flex-1 md:hidden" />

			<RouterLink
				:to="{ name: 'achievements' }"
				class="flex items-center gap-2.5 rounded-full border border-ink-200 bg-white py-1 pe-3 ps-1 text-[13px] font-semibold text-ink-700 shadow-card transition hover:border-ink-300"
				:aria-label="`Genel ilerleme yüzde ${progress.overall.percent}, ${progress.earnedBadges.length} rozet. Başarılarım sayfasını aç.`"
			>
				<ProgressRing :value="progress.overall.percent" :size="28" :stroke="3.5" label="">
					<span class="text-[9px] font-bold text-brand-700">{{ progress.overall.percent }}</span>
				</ProgressRing>
				<span class="hidden sm:inline">%{{ progress.overall.percent }} tamamlandı</span>
				<span class="flex items-center gap-1 text-ink-500">
					<Trophy :size="14" class="text-[#d07d0a]" aria-hidden="true" />
					{{ progress.earnedBadges.length }}
				</span>
			</RouterLink>
		</div>
	</header>
</template>
