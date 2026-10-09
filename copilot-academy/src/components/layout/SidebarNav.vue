<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CircleCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { getModule } from '@/content'
import { NAV_ITEMS, type NavItem } from '@/content/navigation'
import { useProgress } from '@/stores/progress'
import AppTile from '@/components/ui/AppTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import BrandMark from './BrandMark.vue'

const props = withDefaults(defineProps<{ collapsed?: boolean; drawer?: boolean }>(), {
	collapsed: false,
	drawer: false,
})
const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const progress = useProgress()

const activeModuleId = computed(() =>
	typeof route.params.moduleId === 'string' ? route.params.moduleId : null
)
const activeLessonId = computed(() =>
	typeof route.params.lessonId === 'string' ? route.params.lessonId : null
)

function isActive(item: NavItem) {
	if (item.kind === 'module') return activeModuleId.value === item.moduleId
	if (item.kind === 'overview') return route.name === 'dashboard'
	if (item.kind === 'quiz') return route.name === 'quiz'
	return route.name === 'achievements'
}

function status(item: NavItem): { done: boolean; text: string } | null {
	if (item.kind === 'module' && item.moduleId) {
		const s = progress.moduleStats(item.moduleId)
		if (s.state === 'completed') return { done: true, text: 'Tamamlandı' }
		if (s.state === 'in-progress') return { done: false, text: `${s.done}/${s.total}` }
		return null
	}
	if (item.kind === 'quiz' && progress.quizPassed) return { done: true, text: 'Geçildi' }
	if (item.kind === 'achievements' && progress.earnedBadges.length)
		return { done: false, text: String(progress.earnedBadges.length) }
	return null
}

const expandedLessons = computed(() => {
	if (props.collapsed || !activeModuleId.value) return []
	return getModule(activeModuleId.value)?.lessons ?? []
})
</script>

<template>
	<nav aria-label="Ana menü" class="flex h-full flex-col">
		<div :class="['flex h-16 shrink-0 items-center', collapsed ? 'justify-center px-2' : 'px-5']">
			<RouterLink
				:to="{ name: 'welcome' }"
				class="rounded-lg"
				:aria-label="collapsed ? 'Copilot Academy ana sayfa' : undefined"
				@click="emit('navigate')"
			>
				<BrandMark :compact="collapsed" />
			</RouterLink>
		</div>

		<div
			v-if="!collapsed"
			class="mx-5 mb-3 rounded-xl border border-ink-200/80 bg-ink-50/70 px-3.5 py-3"
		>
			<div class="mb-2 flex items-baseline justify-between text-xs">
				<span class="font-semibold text-ink-700">Genel ilerleme</span>
				<span class="font-semibold text-brand-700">%{{ progress.overall.percent }}</span>
			</div>
			<ProgressBar :value="progress.overall.percent" label="Genel ilerleme" />
			<p class="mt-2 text-[11px] text-ink-500">
				{{ progress.overall.lessonsDone }}/{{ progress.overall.lessonsTotal }} ders ·
				{{ progress.earnedBadges.length }} rozet
			</p>
		</div>

		<ul class="flex-1 space-y-0.5 overflow-y-auto px-3 pb-4 scrollbar-thin" role="list">
			<li v-for="item in NAV_ITEMS" :key="item.key">
				<p
					v-if="item.kind === 'quiz' && !collapsed"
					class="mx-2.5 mb-1 mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400"
				>
					Değerlendirme
				</p>
				<p
					v-else-if="item.kind === 'module' && item.number === 1 && !collapsed"
					class="mx-2.5 mb-1 mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-400"
				>
					Modüller
				</p>
				<RouterLink
					:to="item.to"
					:title="collapsed ? item.label : undefined"
					:aria-current="isActive(item) ? 'page' : undefined"
					:class="[
						'group flex items-center gap-3 rounded-lg py-1.5 text-sm font-medium transition-colors',
						collapsed ? 'justify-center px-1.5' : 'px-2.5',
						isActive(item)
							? 'bg-brand-50 text-brand-800'
							: 'text-ink-700 hover:bg-ink-100/70 hover:text-ink-900',
					]"
					@click="emit('navigate')"
				>
					<AppTile :visual="item.visual" size="sm" />
					<span :class="collapsed ? 'sr-only' : 'min-w-0 flex-1 truncate'">
						{{ item.label }}
					</span>
					<template v-if="!collapsed && status(item)">
						<CircleCheck
							v-if="status(item)!.done"
							:size="16"
							class="shrink-0 text-success-600"
							aria-hidden="true"
						/>
						<span
							v-else
							class="shrink-0 rounded-full bg-ink-100 px-1.5 text-[11px] font-semibold text-ink-600"
						>
							{{ status(item)!.text }}
						</span>
						<span class="sr-only"
							>({{
								status(item)!.done ? status(item)!.text : `${status(item)!.text} tamamlandı`
							}})</span
						>
					</template>
				</RouterLink>

				<ul
					v-if="
						item.kind === 'module' && item.moduleId === activeModuleId && expandedLessons.length
					"
					class="mb-1 ms-[1.65rem] mt-1 space-y-0.5 border-s border-ink-200 ps-3"
					role="list"
				>
					<li v-for="(lesson, i) in expandedLessons" :key="lesson.id">
						<RouterLink
							:to="{ name: 'lesson', params: { moduleId: item.moduleId, lessonId: lesson.id } }"
							:aria-current="activeLessonId === lesson.id ? 'page' : undefined"
							:class="[
								'flex items-start gap-2 rounded-md px-2 py-1.5 text-[13px] leading-snug transition-colors',
								activeLessonId === lesson.id
									? 'bg-white font-semibold text-brand-800 shadow-card'
									: 'text-ink-600 hover:bg-ink-100/70 hover:text-ink-900',
							]"
							@click="emit('navigate')"
						>
							<span
								:class="[
									'mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border',
									progress.lessonState(lesson.id) === 'completed'
										? 'border-success-600 bg-success-600'
										: progress.lessonState(lesson.id) === 'in-progress'
										? 'border-brand-500 bg-brand-100'
										: 'border-ink-300 bg-white',
								]"
								aria-hidden="true"
							>
								<svg
									v-if="progress.lessonState(lesson.id) === 'completed'"
									viewBox="0 0 12 12"
									class="h-2.5 w-2.5"
								>
									<path
										d="M2.5 6.2l2.2 2.2 4.8-4.8"
										fill="none"
										stroke="#fff"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span class="min-w-0">
								<span class="sr-only">Ders {{ i + 1 }}: </span>{{ lesson.title }}
							</span>
						</RouterLink>
					</li>
				</ul>
			</li>
		</ul>

		<div v-if="!drawer" class="hidden shrink-0 border-t border-ink-200/80 p-3 lg:block">
			<button
				type="button"
				:class="[
					'btn btn-ghost btn-sm w-full',
					collapsed ? 'justify-center px-0' : 'justify-start',
				]"
				:aria-label="collapsed ? 'Menüyü genişlet' : 'Menüyü daralt'"
				:aria-expanded="!collapsed"
				@click="progress.toggleSidebar()"
			>
				<PanelLeftOpen v-if="collapsed" :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
				<PanelLeftClose v-else :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
				<span v-if="!collapsed">Menüyü daralt</span>
			</button>
		</div>
	</nav>
</template>
