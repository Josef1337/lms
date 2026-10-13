<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { ArrowRight, CircleCheck, CirclePlay, Clock, ListChecks, RotateCcw } from 'lucide-vue-next'
import { MODULES, SKILLS, getModule, moduleMinutes } from '@/content'
import { useProgress } from '@/stores/progress'
import CalloutBox from '@/components/blocks/CalloutBox.vue'
import AppTile from '@/components/ui/AppTile.vue'
import Icon from '@/components/ui/Icon.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'

const route = useRoute()
const progress = useProgress()

const module = computed(() => getModule(String(route.params.moduleId))!)
const stats = computed(() => progress.moduleStats(module.value.id))
const minutes = computed(() => moduleMinutes(module.value))

const availability = computed(() =>
	module.value.availability
		? { type: 'callout' as const, tone: 'availability' as const, body: module.value.availability }
		: null
)

const nextModule = computed(() => MODULES.find((m) => m.number === module.value.number + 1))

/** First lesson that is not finished, or the first lesson to review. */
const primary = computed(() => {
	const open = module.value.lessons.find((l) => progress.lessonState(l.id) !== 'completed')
	const lesson = open ?? module.value.lessons[0]
	const state = progress.lessonState(lesson.id)
	const label =
		stats.value.state === 'completed'
			? 'Modülü tekrar et'
			: state === 'in-progress'
			? 'Kaldığım yerden devam et'
			: stats.value.done > 0
			? 'Sonraki derse başla'
			: 'Modüle başla'
	return { lesson, label }
})

const STATE_LABEL = {
	'not-started': 'Başlanmadı',
	'in-progress': 'Devam ediyor',
	completed: 'Tamamlandı',
}
</script>

<template>
	<div class="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<section
			class="relative overflow-hidden rounded-3xl border border-ink-200/80 bg-white shadow-card"
		>
			<div
				class="pointer-events-none absolute inset-0 bg-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
				aria-hidden="true"
			/>
			<div
				class="pointer-events-none absolute -end-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl"
				aria-hidden="true"
			/>
			<div class="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:p-10">
				<div>
					<div class="flex items-center gap-3">
						<AppTile :visual="module.visual" size="lg" />
						<p class="eyebrow">Modül {{ module.number }} / 12</p>
					</div>
					<h1 class="mt-4 text-[28px] font-bold leading-tight text-balance sm:text-[36px]">
						{{ module.title }}
					</h1>
					<p class="mt-2 text-[17px] font-medium text-iris-700">{{ module.tagline }}</p>
					<p class="mt-3 max-w-[64ch] text-[15.5px] leading-relaxed text-ink-600 text-pretty">
						{{ module.description }}
					</p>
					<div class="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13.5px] text-ink-500">
						<span class="flex items-center gap-1.5"
							><ListChecks :size="15" aria-hidden="true" /> {{ module.lessons.length }} ders</span
						>
						<span class="flex items-center gap-1.5"
							><Clock :size="15" aria-hidden="true" /> Yaklaşık {{ minutes }} dk</span
						>
						<span v-for="s in module.skills" :key="s" class="flex items-center gap-1.5">
							<Icon :name="SKILLS[s].icon" :size="15" /> {{ SKILLS[s].label }}
						</span>
					</div>
					<div class="mt-6 flex flex-wrap gap-3">
						<RouterLink
							:to="{ name: 'lesson', params: { moduleId: module.id, lessonId: primary.lesson.id } }"
							class="btn btn-primary btn-lg"
						>
							<RotateCcw v-if="stats.state === 'completed'" :size="18" aria-hidden="true" />
							<CirclePlay v-else :size="18" aria-hidden="true" />
							{{ primary.label }}
						</RouterLink>
						<RouterLink
							v-if="stats.state === 'completed'"
							:to="
								nextModule
									? { name: 'module', params: { moduleId: nextModule.id } }
									: { name: 'quiz' }
							"
							class="btn btn-secondary btn-lg"
						>
							{{ nextModule ? `Sonraki modül: ${nextModule.navLabel}` : 'Final testine geç' }}
							<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
						</RouterLink>
					</div>
				</div>
				<div
					class="flex flex-row items-center gap-5 rounded-2xl border border-ink-200/80 bg-white/80 p-5 lg:flex-col lg:justify-center lg:text-center"
				>
					<ProgressRing
						:value="stats.percent"
						:size="104"
						:stroke="9"
						:tone="stats.state === 'completed' ? 'success' : 'brand'"
					>
						<span class="text-[22px] font-bold text-ink-900">%{{ stats.percent }}</span>
					</ProgressRing>
					<div>
						<p class="text-[15px] font-semibold text-ink-900">{{ STATE_LABEL[stats.state] }}</p>
						<p class="text-[13px] text-ink-500">
							{{ stats.done }}/{{ stats.total }} ders tamamlandı
						</p>
					</div>
				</div>
			</div>
		</section>

		<div class="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
			<section aria-labelledby="lessons-title">
				<h2 id="lessons-title" class="text-xl font-bold">Dersler</h2>
				<ol class="mt-4 space-y-3" role="list">
					<li v-for="(lesson, i) in module.lessons" :key="lesson.id">
						<RouterLink
							:to="{ name: 'lesson', params: { moduleId: module.id, lessonId: lesson.id } }"
							class="group flex items-center gap-4 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition hover:border-brand-300 hover:shadow-raised sm:p-5"
						>
							<span
								:class="[
									'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[15px] font-bold',
									progress.lessonState(lesson.id) === 'completed'
										? 'bg-success-50 text-success-700 ring-1 ring-inset ring-success-100'
										: progress.lessonState(lesson.id) === 'in-progress'
										? 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200'
										: 'bg-ink-100 text-ink-600',
								]"
							>
								<CircleCheck
									v-if="progress.lessonState(lesson.id) === 'completed'"
									:size="20"
									aria-hidden="true"
								/>
								<template v-else>{{ i + 1 }}</template>
							</span>
							<div class="min-w-0 flex-1">
								<p class="text-[16px] font-semibold text-ink-900 group-hover:text-brand-800">
									{{ lesson.title }}
								</p>
								<p class="mt-0.5 text-[13.5px] text-ink-500">{{ lesson.summary }}</p>
								<p class="mt-1.5 flex flex-wrap items-center gap-x-3 text-[12.5px] text-ink-500">
									<span class="flex items-center gap-1"
										><Clock :size="12" aria-hidden="true" /> {{ lesson.minutes }} dk</span
									>
									<span>{{ lesson.steps.length + 1 }} adım</span>
									<span
										:class="[
											'font-semibold',
											progress.lessonState(lesson.id) === 'completed'
												? 'text-success-700'
												: progress.lessonState(lesson.id) === 'in-progress'
												? 'text-brand-700'
												: 'text-ink-500',
										]"
									>
										{{ STATE_LABEL[progress.lessonState(lesson.id)] }}
									</span>
								</p>
							</div>
							<ArrowRight
								:size="18"
								class="shrink-0 text-ink-300 transition group-hover:translate-x-0.5 group-hover:text-brand-600 rtl:-scale-x-100"
								aria-hidden="true"
							/>
						</RouterLink>
					</li>
				</ol>
			</section>

			<aside class="space-y-4">
				<section class="card p-5">
					<h2 class="text-[15px] font-semibold">Bu modülün sonunda</h2>
					<ul class="mt-3 space-y-2.5" role="list">
						<li
							v-for="o in module.objectives"
							:key="o"
							class="flex gap-2.5 text-[14px] leading-snug text-ink-700"
						>
							<CircleCheck :size="16" class="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
							{{ o }}
						</li>
					</ul>
				</section>
				<CalloutBox v-if="availability" :block="availability" />
				<section class="rounded-2xl border border-ink-200/80 bg-ink-50/70 p-5">
					<h2 class="text-[15px] font-semibold">Her ders aynı akışı izler</h2>
					<ol class="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px] text-ink-600" role="list">
						<li
							v-for="(p, i) in [
								'Öğren',
								'Gör',
								'Keşfet',
								'Uygula',
								'Kontrol et',
								'Pekiştir',
								'Devam et',
							]"
							:key="p"
							class="flex items-center gap-2"
						>
							<span
								class="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[11px] font-bold text-brand-700 ring-1 ring-ink-200"
								>{{ i + 1 }}</span
							>
							{{ p }}
						</li>
					</ol>
				</section>
			</aside>
		</div>
	</div>
</template>
