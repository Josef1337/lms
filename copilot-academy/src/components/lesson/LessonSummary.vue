<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, CircleCheck, Clock, PartyPopper, Target } from 'lucide-vue-next'
import type { LessonRef } from '@/content'
import { getBadge } from '@/content/badges'
import { useProgress } from '@/stores/progress'
import AppTile from '@/components/ui/AppTile.vue'
import Icon from '@/components/ui/Icon.vue'
import RichText from '@/components/ui/RichText.vue'
import { allTaskIds } from './phases'

const props = defineProps<{
	lessonRef: LessonRef
	next: LessonRef | undefined
	completed: boolean
	newBadges: string[]
}>()

const progress = useProgress()
const lesson = computed(() => props.lessonRef.lesson)

// Counted, not graded: how many tasks ended fully right, with a nudge to
// revisit the rest. Most tasks keep the answer of their latest check, so the
// count is not called a "first try" score.
const taskStats = computed(() => {
	const ids = allTaskIds(lesson.value.steps)
	const correct = ids.filter((id) => progress.taskResult(id)?.correct).length
	return { total: ids.length, correct }
})
const taskMessage = computed(() => {
	const { total, correct } = taskStats.value
	if (!total) return 'Bu derste görev yoktu.'
	if (correct === total)
		return total === 1 ? 'Görevi doğru yaptınız. Tebrikler!' : 'Hepsini doğru yaptınız. Tebrikler!'
	return 'Yanlışları ilgili adıma dönüp tekrar çözerek pekiştirebilirsiniz.'
})

const badges = computed(() => props.newBadges.map((id) => getBadge(id)).filter((b) => !!b))
const moduleDone = computed(
	() => progress.moduleStats(props.lessonRef.module.id).state === 'completed'
)
</script>

<template>
	<div class="space-y-6">
		<div
			v-if="completed"
			class="relative animate-pop overflow-hidden rounded-2xl bg-ink-900 px-5 py-6 text-white shadow-float sm:px-7"
		>
			<div
				class="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl"
				aria-hidden="true"
			/>
			<div
				class="pointer-events-none absolute -bottom-24 start-10 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl"
				aria-hidden="true"
			/>
			<div class="relative flex flex-col gap-4 sm:flex-row sm:items-center">
				<span
					class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15"
					aria-hidden="true"
				>
					<PartyPopper :size="24" />
				</span>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-semibold uppercase tracking-[0.1em] text-white/60">
						{{ moduleDone ? `Modül ${lessonRef.module.number} tamamlandı` : 'Ders tamamlandı' }}
					</p>
					<h3 class="mt-0.5 text-xl font-bold text-white">
						Tebrikler, “{{ lesson.title }}” dersini bitirdiniz.
					</h3>
					<p class="mt-1 text-sm text-white/70">
						İlerlemeniz kaydedildi. Genel ilerleme: %{{ progress.overall.percent }}.
					</p>
				</div>
			</div>
			<ul v-if="badges.length" class="relative mt-5 grid gap-2 sm:grid-cols-2" role="list">
				<li
					v-for="b in badges"
					:key="b!.id"
					class="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/10"
				>
					<AppTile :visual="b!.visual" size="md" />
					<div class="min-w-0">
						<p class="text-[11px] font-semibold uppercase tracking-wide text-[#f6c768]">
							Yeni rozet
						</p>
						<p class="font-semibold text-white">{{ b!.title }}</p>
						<p class="text-[12px] text-white/65">{{ b!.description }}</p>
					</div>
				</li>
			</ul>
		</div>

		<section class="card p-5 sm:p-6">
			<h3 class="flex items-center gap-2 text-lg font-semibold">
				<CircleCheck :size="20" class="text-success-600" aria-hidden="true" />
				Bu derste öğrendikleriniz
			</h3>
			<ul class="mt-4 space-y-3" role="list">
				<li
					v-for="(t, i) in lesson.takeaways"
					:key="i"
					class="flex gap-3 text-[15px] leading-relaxed text-ink-700"
				>
					<span
						class="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success-50 text-[12px] font-bold text-success-700 ring-1 ring-inset ring-success-100"
					>
						{{ i + 1 }}
					</span>
					<RichText :text="t" />
				</li>
			</ul>
		</section>

		<div class="grid gap-3 sm:grid-cols-2">
			<section class="card p-5">
				<p class="flex items-center gap-2 text-sm font-semibold text-ink-700">
					<Target :size="16" class="text-brand-600" aria-hidden="true" /> Ders hedefleri
				</p>
				<ul class="mt-3 space-y-2 text-[13.5px] text-ink-600" role="list">
					<li v-for="o in lesson.objectives" :key="o" class="flex gap-2">
						<CircleCheck :size="15" class="mt-0.5 shrink-0 text-success-600" aria-hidden="true" />
						{{ o }}
					</li>
				</ul>
			</section>
			<section class="card p-5">
				<p class="flex items-center gap-2 text-sm font-semibold text-ink-700">
					<Icon name="gauge" :size="16" /> Görevleriniz
				</p>
				<p v-if="taskStats.total" class="mt-3 flex items-baseline gap-2">
					<span class="text-3xl font-bold text-ink-900"
						>{{ taskStats.correct }}/{{ taskStats.total }}</span
					>
					<span class="text-[14px] font-semibold text-ink-600">görev doğru</span>
				</p>
				<p class="mt-1 text-[13px] text-ink-500">{{ taskMessage }}</p>
			</section>
		</div>

		<section class="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
			<template v-if="next">
				<AppTile :visual="next.module.visual" size="lg" />
				<div class="min-w-0 flex-1">
					<p class="eyebrow">Sıradaki ders · Modül {{ next.module.number }}</p>
					<p class="mt-0.5 text-[16px] font-semibold text-ink-900">{{ next.lesson.title }}</p>
					<p class="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-500">
						<Clock :size="13" aria-hidden="true" /> {{ next.lesson.minutes }} dk ·
						{{ next.lesson.summary }}
					</p>
				</div>
			</template>
			<template v-else>
				<AppTile visual="quiz" size="lg" />
				<div class="min-w-0 flex-1">
					<p class="eyebrow">Sıradaki adım · Modül 11</p>
					<p class="mt-0.5 text-[16px] font-semibold text-ink-900">Final Bilgi Testi</p>
					<p class="mt-0.5 text-[13px] text-ink-500">
						Bütün dersleri bitirdiniz. Şimdi öğrendiklerinizi ölçme zamanı.
					</p>
				</div>
			</template>
			<RouterLink
				:to="
					next
						? { name: 'lesson', params: { moduleId: next.module.id, lessonId: next.lesson.id } }
						: { name: 'quiz' }
				"
				class="btn btn-primary shrink-0"
			>
				{{ next ? 'Sonraki derse geç' : 'Final testine geç' }}
				<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
			</RouterLink>
		</section>
	</div>
</template>
