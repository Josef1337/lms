<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, Target } from 'lucide-vue-next'
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
	firstOpenStep,
	requiredTasks,
	type StepPhase,
} from '@/components/lesson/phases'
import AppTile from '@/components/ui/AppTile.vue'
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

const pending = computed(() =>
	step.value ? requiredTasks(step.value).filter((id) => !progress.isTaskDone(id)) : []
)
const canAdvance = computed(() => pending.value.length === 0)

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

// Next frame: Firefox drops a smooth scroll requested in the same frame as an
// instant one when the page then gets shorter, leaving the next step half-way.
function scrollToTop() {
	requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
}

function complete() {
	newBadges.value = progress.completeLesson(lessonId.value)
	progress.acknowledgeBadges(newBadges.value)
	scrollToTop()
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
							Modül {{ module.number }} · {{ module.navLabel }} · Ders {{ lessonNumber }}/{{
								module.lessons.length
							}}
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

					<div v-if="step" class="mt-6 space-y-6">
						<BlockRenderer v-for="(block, i) in step.blocks" :key="i" :block="block" />
					</div>
					<LessonSummary
						v-else
						class="mt-6"
						:lesson-ref="ref_"
						:next="next"
						:completed="completed"
						:new-badges="newBadges"
						@complete="complete"
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
			:can-advance="canAdvance"
			:is-summary="isSummary"
			:completed="completed"
			:next-label="nextLabel"
			@prev="go(stepIndex - 1)"
			@next="go(stepIndex + 1)"
			@complete="complete"
			@continue-on="continueOn"
		/>
	</div>
</template>
