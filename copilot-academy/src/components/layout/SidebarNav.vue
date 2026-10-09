<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { CircleCheck, PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
import { getModule } from '@/content'
import { NAV_ITEMS, type NavItem } from '@/content/navigation'
import { useProgress, type LessonState } from '@/stores/progress'
import BrandMark from './BrandMark.vue'
import { NAV_ICONS } from './navIcons'

const props = withDefaults(defineProps<{ collapsed?: boolean; drawer?: boolean }>(), {
	collapsed: false,
	drawer: false,
})
const emit = defineEmits<{ navigate: [] }>()

const route = useRoute()
const progress = useProgress()

// Unique per instance: the desktop sidebar is display:none on phones, and a
// gradient defined inside a hidden subtree does not paint for the drawer.
const gradientId = `nav-icon-${useId()}`
const iconStroke = `url(#${gradientId})`

// Circumference of the r=6 status ring.
const RING = 2 * Math.PI * 6

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

interface Status {
	kind: 'done' | 'ring' | 'count'
	/** Read by screen readers next to the label. */
	label: string
	/** stroke-dasharray of the progress ring. */
	dash?: string
	value?: number
}

function status(item: NavItem): Status | null {
	if (item.kind === 'module' && item.moduleId) {
		const s = progress.moduleStats(item.moduleId)
		if (s.state === 'completed') return { kind: 'done', label: 'Tamamlandı' }
		if (s.state === 'in-progress') {
			// A started lesson counts as half, so a module that has been opened
			// never shows an empty ring.
			const started =
				getModule(item.moduleId)?.lessons.filter(
					(l) => progress.lessonState(l.id) === 'in-progress'
				).length ?? 0
			const share = (s.done + started / 2) / s.total
			return {
				kind: 'ring',
				label: `${s.done}/${s.total} ders tamamlandı`,
				dash: `${RING * share} ${RING}`,
			}
		}
		return null
	}
	if (item.kind === 'quiz' && progress.quizPassed) return { kind: 'done', label: 'Geçildi' }
	if (item.kind === 'achievements' && progress.earnedBadges.length) {
		const value = progress.earnedBadges.length
		return { kind: 'count', label: `${value} rozet kazanıldı`, value }
	}
	return null
}

const statuses = computed(() =>
	Object.fromEntries(NAV_ITEMS.map((item) => [item.key, status(item)]))
)

// Hover, keyboard focus and the current page share one filled look.
const FILLED =
	'border-flame-600 bg-flame-600 text-white forced-colors:forced-color-adjust-none forced-colors:border-[Highlight] forced-colors:bg-[Highlight] forced-colors:text-[HighlightText]'
const RESTING =
	'border-line bg-white text-[#1c1d22] hover:border-flame-600 hover:bg-flame-600 hover:text-white focus-visible:border-flame-600 focus-visible:bg-flame-600 focus-visible:text-white'

function cardClass(item: NavItem) {
	return [
		'group relative flex items-center rounded-[4px] border-[1.5px] font-medium transition-colors duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-500 focus-visible:ring-offset-2',
		props.collapsed
			? 'mx-auto h-11 w-11 justify-center'
			: 'gap-3 px-3 py-[11px] text-[14.5px] leading-snug',
		isActive(item) ? FILLED : RESTING,
	]
}

/**
 * Picks classes for a part that turns white when its card is filled. Both
 * arguments are complete literal class lists so Tailwind can see them.
 */
function onFill(item: NavItem, resting: string, filled: string) {
	return isActive(item) ? filled : resting
}

const LESSON_STATE_LABEL: Record<LessonState, string> = {
	completed: 'Tamamlandı',
	'in-progress': 'Devam ediyor',
	'not-started': 'Başlanmadı',
}

// Keep the current page in view: the card list is taller than most laptop
// screens, and the filled card is the only cue for where the learner is.
const list = ref<HTMLUListElement | null>(null)
watch(
	() => route.fullPath,
	() =>
		nextTick(() => {
			measureGutter()
			const el =
				list.value?.querySelector<HTMLElement>('a[aria-current="page"]') ??
				list.value?.querySelector<HTMLElement>('a[aria-current]')
			el?.scrollIntoView({ block: 'nearest' })
		}),
	{ immediate: true }
)

// The list keeps a stable scrollbar gutter so cards do not jump between pages
// that overflow and pages that do not. Where scrollbars take space (Windows),
// the end padding shrinks by the gutter width so cards keep their width and
// line up with the progress card; with overlay scrollbars the gutter is 0.
const listEnd = ref('16px')
function measureGutter() {
	const el = list.value
	if (!el || !el.offsetWidth) return
	listEnd.value = `${Math.max(4, 16 - (el.offsetWidth - el.clientWidth))}px`
}
onMounted(() => {
	measureGutter()
	window.addEventListener('resize', measureGutter)
})
onBeforeUnmount(() => window.removeEventListener('resize', measureGutter))
watch(
	() => props.collapsed,
	() => nextTick(measureGutter)
)

const expandedLessons = computed(() => {
	if (props.collapsed || !activeModuleId.value) return []
	return getModule(activeModuleId.value)?.lessons ?? []
})
</script>

<template>
	<nav aria-label="Ana menü" class="flex h-full flex-col">
		<svg width="0" height="0" class="absolute" aria-hidden="true" focusable="false">
			<defs>
				<linearGradient
					:id="gradientId"
					gradientUnits="userSpaceOnUse"
					x1="2"
					y1="3"
					x2="22"
					y2="21"
				>
					<stop offset="0" stop-color="#ef653e" />
					<stop offset="0.35" stop-color="#ef653e" />
					<stop offset="0.55" stop-color="#e03659" />
					<stop offset="0.72" stop-color="#8b57fb" />
				</linearGradient>
			</defs>
		</svg>

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
			class="mx-4 mb-2 rounded-[4px] border-[1.5px] border-line bg-white px-3.5 py-3"
		>
			<div class="mb-2 flex items-baseline justify-between text-xs">
				<span class="font-semibold text-[#1c1d22]">Genel ilerleme</span>
				<span class="font-semibold text-flame-700">%{{ progress.overall.percent }}</span>
			</div>
			<div
				class="h-1.5 w-full overflow-hidden rounded-full bg-[#f3f3f5]"
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax="100"
				:aria-valuenow="progress.overall.percent"
				aria-label="Genel ilerleme"
			>
				<div
					class="h-full rounded-full bg-gradient-to-r from-flame-500 via-[#e03659] to-[#8b57fb] transition-[width] duration-500 ease-out forced-colors:forced-color-adjust-none forced-colors:bg-[Highlight]"
					:style="{ width: `${progress.overall.percent}%` }"
				/>
			</div>
			<p class="mt-2 text-[11px] text-ink-500">
				{{ progress.overall.lessonsDone }}/{{ progress.overall.lessonsTotal }} ders ·
				{{ progress.earnedBadges.length }} rozet
			</p>
		</div>

		<ul
			ref="list"
			:class="[
				'flex-1 scroll-py-2 space-y-2 overflow-y-auto pb-4 pt-2 scrollbar-thin',
				collapsed ? 'px-2' : 'ps-4 [scrollbar-gutter:stable]',
			]"
			:style="collapsed ? undefined : { paddingInlineEnd: listEnd }"
			role="list"
		>
			<li v-for="item in NAV_ITEMS" :key="item.key">
				<p
					v-if="
						!collapsed && (item.kind === 'quiz' || (item.kind === 'module' && item.number === 1))
					"
					class="mx-1 mb-2 mt-5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500"
				>
					{{ item.kind === 'quiz' ? 'Değerlendirme' : 'Modüller' }}
				</p>
				<RouterLink
					:to="item.to"
					:title="collapsed ? item.label : undefined"
					:aria-current="isActive(item) ? (activeLessonId ? 'true' : 'page') : undefined"
					:class="cardClass(item)"
					@click="emit('navigate')"
				>
					<span class="relative h-[22px] w-[22px] shrink-0" aria-hidden="true">
						<component
							:is="NAV_ICONS[item.visual]"
							:size="22"
							:stroke-width="1.75"
							:color="iconStroke"
							:class="[
								'absolute inset-0 transition-opacity duration-300',
								onFill(
									item,
									'opacity-100 group-hover:opacity-0 group-focus-visible:opacity-0',
									'opacity-0'
								),
							]"
						/>
						<component
							:is="NAV_ICONS[item.visual]"
							:size="22"
							:stroke-width="1.75"
							:class="[
								'absolute inset-0 transition-opacity duration-300',
								onFill(
									item,
									'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100',
									'opacity-100'
								),
							]"
						/>
					</span>
					<span :class="collapsed ? 'sr-only' : 'min-w-0 flex-1'">{{ item.label }}</span>

					<span v-if="!collapsed" class="flex shrink-0 items-center gap-2">
						<template v-if="statuses[item.key]">
							<CircleCheck
								v-if="statuses[item.key]?.kind === 'done'"
								:size="16"
								:class="[
									'shrink-0 transition-colors duration-300',
									onFill(
										item,
										'text-success-600 group-hover:text-current group-focus-visible:text-current',
										'text-current'
									),
								]"
								aria-hidden="true"
							/>
							<svg
								v-else-if="statuses[item.key]?.kind === 'ring'"
								viewBox="0 0 16 16"
								class="h-4 w-4 shrink-0 -rotate-90"
								aria-hidden="true"
							>
								<circle
									cx="8"
									cy="8"
									r="6"
									fill="none"
									stroke-width="2"
									:class="[
										'transition-colors duration-300',
										onFill(
											item,
											'stroke-line group-hover:stroke-current group-hover:[stroke-opacity:0.35] group-focus-visible:stroke-current group-focus-visible:[stroke-opacity:0.35]',
											'stroke-current [stroke-opacity:0.35]'
										),
									]"
								/>
								<circle
									cx="8"
									cy="8"
									r="6"
									fill="none"
									stroke-width="2"
									stroke-linecap="round"
									:stroke-dasharray="statuses[item.key]?.dash"
									:class="[
										'transition-colors duration-300',
										onFill(
											item,
											'stroke-flame-500 group-hover:stroke-current group-focus-visible:stroke-current',
											'stroke-current'
										),
									]"
								/>
							</svg>
							<span
								v-else
								:class="[
									'shrink-0 rounded-full px-1.5 text-[11px] font-semibold tabular-nums transition-colors duration-300',
									onFill(
										item,
										'bg-flame-50 text-flame-700 group-hover:bg-flame-700 group-hover:text-white group-focus-visible:bg-flame-700 group-focus-visible:text-white',
										'bg-flame-700 text-white'
									),
								]"
								aria-hidden="true"
							>
								{{ statuses[item.key]?.value }}
							</span>
							<span class="sr-only">({{ statuses[item.key]?.label }})</span>
						</template>
						<svg
							width="20"
							height="12"
							viewBox="0 0 20 12"
							fill="none"
							stroke="currentColor"
							stroke-width="1.75"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="shrink-0 rtl:-scale-x-100"
							aria-hidden="true"
						>
							<path d="M1 6h18M13.5 1 19 6l-5.5 5" />
						</svg>
					</span>
				</RouterLink>

				<ul
					v-if="
						item.kind === 'module' && item.moduleId === activeModuleId && expandedLessons.length
					"
					class="mb-1 ms-[22px] mt-2 space-y-1 border-s-[1.5px] border-line ps-3"
					role="list"
				>
					<li v-for="(lesson, i) in expandedLessons" :key="lesson.id">
						<RouterLink
							:to="{ name: 'lesson', params: { moduleId: item.moduleId, lessonId: lesson.id } }"
							:aria-current="activeLessonId === lesson.id ? 'page' : undefined"
							:class="[
								'flex items-start gap-2 rounded-[4px] px-2.5 py-1.5 text-[13px] leading-snug transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-flame-500',
								activeLessonId === lesson.id
									? 'bg-flame-50 font-semibold text-flame-700'
									: 'text-ink-600 hover:bg-[#f6f6f8] hover:text-ink-900',
							]"
							@click="emit('navigate')"
						>
							<span
								:class="[
									'mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border',
									progress.lessonState(lesson.id) === 'completed'
										? 'border-success-600 bg-success-600 text-white'
										: progress.lessonState(lesson.id) === 'in-progress'
										? 'border-flame-500 bg-flame-100'
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
										stroke="currentColor"
										stroke-width="1.8"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</svg>
							</span>
							<span class="min-w-0">
								<span class="sr-only">Ders {{ i + 1 }}: </span>{{ lesson.title }}
								<span class="sr-only">
									({{ LESSON_STATE_LABEL[progress.lessonState(lesson.id)] }})</span
								>
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
