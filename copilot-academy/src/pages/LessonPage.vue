<script setup lang="ts">
import { computed, nextTick, provide, ref, shallowReactive, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, CircleCheck, Clock, Flag, Target } from 'lucide-vue-next'
import { getLessonRef, nextLessonRef } from '@/content'
import { useProgress } from '@/stores/progress'
import BlockRenderer from '@/components/lesson/BlockRenderer.vue'
import LessonAside from '@/components/lesson/LessonAside.vue'
import LessonControls from '@/components/lesson/LessonControls.vue'
import LessonSummary from '@/components/lesson/LessonSummary.vue'
import PhaseStepper from '@/components/lesson/PhaseStepper.vue'
import {
	PHASES,
	PHASE_PURPOSE,
	TASK_GOALS,
	firstOpenStep,
	requiredTasks,
	taskIdOf,
	type GoalItem,
	type StepPhase,
} from '@/components/lesson/phases'
import AppTile from '@/components/ui/AppTile.vue'
import BrandText from '@/components/ui/BrandText.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'

const route = useRoute()
const router = useRouter()
const progress = useProgress()

const lessonId = computed(() => String(route.params.lessonId))
const ref_ = computed(() => getLessonRef(lessonId.value)!)
const lesson = computed(() => ref_.value.lesson)
const module = computed(() => ref_.value.module)
const next = computed(() => nextLessonRef(lessonId.value))
const lessonNumber = computed(
	() => module.value.lessons.findIndex((l) => l.id === lessonId.value) + 1
)

/** Authored steps plus the closing "Devam et" summary. */
const totalSteps = computed(() => lesson.value.steps.length + 1)
const stepIndex = ref(0)
const newBadges = ref<string[]>([])
const heading = ref<HTMLElement | null>(null)
const blocks = ref<HTMLElement | null>(null)

/** Goals of the open-ended labs on this step, registered by their checklists. */
const taskGoals = shallowReactive(new Map<string, () => GoalItem[]>())
provide(TASK_GOALS, taskGoals)

/** Furthest step an unfinished lesson may open: never past an open task. */
function gate(id: string): number {
	const ref = getLessonRef(id)
	if (!ref || progress.lessonState(id) === 'completed') return Infinity
	const open = firstOpenStep(ref.lesson.steps, progress.isTaskDone)
	return open === -1 ? Infinity : open
}

watch(
	lessonId,
	(id) => {
		progress.openLesson(id)
		const saved = progress.data.lessons[id]?.step ?? 0
		stepIndex.value = Math.min(Math.max(0, saved), totalSteps.value - 1, gate(id))
		newBadges.value = []
	},
	{ immediate: true }
)

const isSummary = computed(() => stepIndex.value === lesson.value.steps.length)
const step = computed(() => (isSummary.value ? null : lesson.value.steps[stepIndex.value]))
const phase = computed<StepPhase>(() => step.value?.phase ?? 'continue')
const completed = computed(() => progress.lessonState(lessonId.value) === 'completed')
const furthest = computed(() =>
	Math.min(progress.data.lessons[lessonId.value]?.furthest ?? 0, gate(lessonId.value))
)

const stepTasks = computed(() => (step.value ? requiredTasks(step.value) : []))
const pending = computed(() => stepTasks.value.filter((id) => !progress.isTaskDone(id)))
const canAdvance = computed(() => pending.value.length === 0)

/** Short line under the step title: how many tasks, and what unlocks "Sonraki". */
const taskLine = computed(() => {
	const total = stepTasks.value.length
	const left = pending.value.length
	if (!left)
		return total === 1 ? 'Bu adımın görevi tamamlandı.' : 'Bu adımdaki görevlerin hepsi tamamlandı.'
	if (total === 1) return 'Bu adımda bir görev var; tamamladığınızda “Sonraki” açılır.'
	return `Bu adımda ${total} görev var (${
		total - left
	}/${total} tamamlandı); hepsini bitirince “Sonraki” açılır.`
})
const pendingGoals = computed(() => pending.value.flatMap((id) => taskGoals.get(id)?.() ?? []))

// Reaching the summary with every required task done completes the lesson at
// once: the celebration shows straight away, and a learner who closes the tab
// on the summary still has the lesson, its badges and overall progress saved.
watch(
	[isSummary, lessonId],
	() => {
		if (!isSummary.value || completed.value) return
		if (firstOpenStep(lesson.value.steps, progress.isTaskDone) !== -1) return
		newBadges.value = progress.completeLesson(lessonId.value)
		progress.acknowledgeBadges(newBadges.value)
	},
	{ immediate: true }
)

const stepperItems = computed(() => [
	...lesson.value.steps.map((s) => ({ phase: s.phase as StepPhase, title: s.title })),
	{ phase: 'continue' as StepPhase, title: 'Ders özeti' },
])
const stepPercent = computed(() =>
	completed.value ? 100 : Math.round((stepIndex.value / (totalSteps.value - 1)) * 100)
)

const nextLabel = computed(() => (next.value ? 'Sonraki derse geç' : 'Final testine geç'))

async function go(index: number) {
	if (index < 0 || index >= totalSteps.value || index === stepIndex.value) return
	if (
		index > stepIndex.value &&
		!(
			completed.value ||
			index <= furthest.value ||
			(index === stepIndex.value + 1 && canAdvance.value)
		)
	)
		return
	stepIndex.value = index
	progress.setStep(lessonId.value, index)
	scrollToTop()
	await nextTick()
	heading.value?.focus({ preventScroll: true })
}

// The CSS reduced-motion rule does not reach a smooth scroll asked for in JS.
const scrollBehavior = (): ScrollBehavior =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

// Next frame: Firefox drops a smooth scroll requested in the same frame as an
// instant one when the page then gets shorter, leaving the next step half-way.
function scrollToTop() {
	requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: scrollBehavior() }))
}

/** "Göreve git" in the footer: scroll to the first open task and focus it. */
function goToTask() {
	const id = pending.value[0]
	const marked = blocks.value?.querySelectorAll<HTMLElement>('[data-task-id]') ?? []
	const target = Array.from(marked).find((el) => el.dataset.taskId === id)
	if (!target) return
	// The scroll-padding on <html> keeps it clear of the sticky header and footer.
	target.scrollIntoView({ behavior: scrollBehavior(), block: 'start' })
	// Focusable only while it holds focus, so clicks inside the task never land on it.
	target.tabIndex = -1
	target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true })
	target.focus({ preventScroll: true })
}

function continueOn() {
	if (next.value)
		router.push({
			name: 'lesson',
			params: { moduleId: next.value.module.id, lessonId: next.value.lesson.id },
		})
	else router.push({ name: 'quiz' })
}
</script>

<template>
	<div class="min-h-full">
		<div class="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
			<header class="pb-5 pt-6 sm:pt-8">
				<div class="flex items-center gap-3">
					<AppTile :visual="module.visual" size="md" />
					<div class="min-w-0">
						<p class="eyebrow">
							Modül {{ module.number }} · <BrandText :text="module.navLabel" /> · Ders
							{{ lessonNumber }}/{{ module.lessons.length }}
						</p>
						<h1 class="text-[21px] font-bold leading-tight text-balance sm:truncate sm:text-[26px]">
							{{ lesson.title }}
						</h1>
					</div>
				</div>
				<div class="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-ink-500">
					<span class="flex items-center gap-1.5"
						><Clock :size="14" aria-hidden="true" /> Yaklaşık {{ lesson.minutes }} dk</span
					>
					<span>Adım {{ stepIndex + 1 }}/{{ totalSteps }}</span>
					<div class="flex min-w-[160px] flex-1 items-center gap-2 sm:max-w-xs">
						<ProgressBar
							:value="stepPercent"
							:tone="completed ? 'success' : 'brand'"
							label="Ders ilerlemesi"
						/>
						<span class="w-10 shrink-0 text-end font-semibold text-ink-700"
							>%{{ stepPercent }}</span
						>
					</div>
				</div>
				<PhaseStepper
					class="mt-5"
					:steps="stepperItems"
					:current="stepIndex"
					:furthest="Math.max(furthest, stepIndex)"
					:completed="completed"
					@go="go"
				/>
			</header>

			<div
				:class="[
					'grid gap-8',
					!step?.wide && 'lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_330px]',
				]"
			>
				<article
					:key="`${lessonId}-${stepIndex}`"
					class="min-w-0 animate-fade-up"
					aria-labelledby="step-heading"
				>
					<p :class="['chip ring-1 ring-inset', PHASES[phase].chip]">
						<component :is="PHASES[phase].icon" :size="13" aria-hidden="true" />
						{{ PHASES[phase].label }}
					</p>
					<h2
						id="step-heading"
						ref="heading"
						tabindex="-1"
						class="mt-3 text-[24px] font-bold leading-tight focus:outline-none sm:text-[28px]"
					>
						{{ step?.title ?? 'Ders özeti' }}
					</h2>
					<p class="mt-1.5 text-[14px] text-ink-500">{{ PHASE_PURPOSE[phase] }}</p>
					<div
						v-if="stepTasks.length"
						:class="[
							'mt-4 flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-[13.5px] leading-snug',
							canAdvance
								? 'border-success-100 bg-success-50/70 text-success-700'
								: 'border-warning-100 bg-warning-50/60 text-ink-700',
						]"
					>
						<CircleCheck v-if="canAdvance" :size="16" class="mt-px shrink-0" aria-hidden="true" />
						<Flag v-else :size="16" class="mt-px shrink-0 text-warning-700" aria-hidden="true" />
						<div class="min-w-0">
							<p class="font-semibold">{{ taskLine }}</p>
							<ul v-if="pendingGoals.length" class="mt-1.5 space-y-1" role="list">
								<li v-for="g in pendingGoals" :key="g.label" class="flex items-start gap-2">
									<span
										:class="[
											'mt-[3px] flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border-[1.5px]',
											g.done
												? 'border-success-600 bg-success-600 text-white'
												: 'border-ink-300 bg-white',
										]"
										aria-hidden="true"
									>
										<Check v-if="g.done" :size="9" :stroke-width="3.5" />
									</span>
									<span :class="g.done && 'text-ink-500 line-through decoration-ink-300'">{{
										g.label
									}}</span>
									<span class="sr-only">{{ g.done ? '(tamamlandı)' : '(bekliyor)' }}</span>
								</li>
							</ul>
						</div>
					</div>

					<div v-if="step" ref="blocks" class="mt-6 space-y-6">
						<template v-for="(block, i) in step.blocks" :key="i">
							<!-- Tasks are marked so "Göreve git" can find and focus them. -->
							<div v-if="taskIdOf(block)" :data-task-id="taskIdOf(block)" class="rounded-2xl">
								<BlockRenderer :block="block" />
							</div>
							<BlockRenderer v-else :block="block" />
						</template>
					</div>
					<LessonSummary
						v-else
						class="mt-6"
						:lesson-ref="ref_"
						:next="next"
						:completed="completed"
						:new-badges="newBadges"
					/>
				</article>

				<aside
					:class="
						step?.wide
							? 'grid gap-3 md:grid-cols-2 xl:grid-cols-3 [&>*]:h-full'
							: 'space-y-3 lg:sticky lg:top-20 lg:self-start'
					"
					aria-label="Ders yardımcısı"
				>
					<LessonAside v-if="step?.aside?.length" :notes="step.aside" :grid="step.wide" />
					<section class="rounded-2xl border border-ink-200/80 bg-white p-4">
						<p
							class="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500"
						>
							<Target :size="14" aria-hidden="true" /> Bu dersin hedefleri
						</p>
						<ul class="mt-2.5 space-y-1.5 text-[13.5px] leading-snug text-ink-700" role="list">
							<li v-for="o in lesson.objectives" :key="o" class="flex gap-2">
								<span
									class="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500"
									aria-hidden="true"
								/>
								{{ o }}
							</li>
						</ul>
					</section>
				</aside>
			</div>
		</div>

		<LessonControls
			:current="stepIndex"
			:total="totalSteps"
			:pending="pending.length"
			:is-summary="isSummary"
			:completed="completed"
			:next-label="nextLabel"
			@prev="go(stepIndex - 1)"
			@next="go(stepIndex + 1)"
			@go-to-task="goToTask"
			@continue-on="continueOn"
		/>
	</div>
</template>
