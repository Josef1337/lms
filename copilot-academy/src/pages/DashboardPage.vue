<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight, CircleCheck, Clock, RotateCcw, Sparkles, TriangleAlert } from 'lucide-vue-next'
import { GRADUATION, LESSON_REFS, MODULES, QUIZ, moduleMinutes } from '@/content'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { formatMinutes, formatRelative } from '@/lib/format'
import { useProgress } from '@/stores/progress'
import ActivityList from '@/components/dashboard/ActivityList.vue'
import ModuleCard from '@/components/dashboard/ModuleCard.vue'
import StatTile from '@/components/dashboard/StatTile.vue'
import AppTile from '@/components/ui/AppTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'

const progress = useProgress()

const target = computed(() => progress.continueTarget)
const recommended = computed(() => progress.recommendedNext)

const continueInfo = computed(() => {
	const t = target.value
	if (t.kind !== 'lesson') return null
	const total = t.ref.lesson.steps.length + 1
	return {
		...t,
		total,
		percent: t.started ? Math.round((t.step / (total - 1)) * 100) : 0,
		to: { name: 'lesson', params: { moduleId: t.ref.module.id, lessonId: t.ref.lesson.id } },
	}
})

const completedLessons = computed(() =>
	LESSON_REFS.filter((r) => progress.data.lessons[r.lesson.id]?.completedAt)
		.map((r) => ({ ref: r, at: progress.data.lessons[r.lesson.id].completedAt! }))
		.sort((a, b) => b.at.localeCompare(a.at))
)

const quizState = computed(() => {
	const best = progress.bestAttempt
	if (!best) return { state: 'not-started' as const, label: 'Başlanmadı', percent: 0 }
	return best.passed
		? {
				state: 'completed' as const,
				label: `Geçildi · %${Math.round(best.ratio * 100)}`,
				percent: 100,
		  }
		: {
				state: 'in-progress' as const,
				label: `En iyi %${Math.round(best.ratio * 100)}`,
				percent: Math.round(best.ratio * 100),
		  }
})

// The "Başarılarım" card counts badges rather than saying "Devam ediyor".
const badgeLabel = computed(() => {
	if (progress.overall.percent === 100) return undefined
	const count = progress.earnedBadges.length
	return count ? `${count} rozet` : 'Henüz rozet yok'
})

const greeting = computed(() => (progress.hasProgress ? 'Tekrar hoş geldiniz' : 'Hoş geldiniz'))

const confirmReset = ref(false)
function reset() {
	progress.reset()
	confirmReset.value = false
}
</script>

<template>
	<div class="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<header class="flex flex-col gap-1">
			<p class="eyebrow">Genel Bakış</p>
			<h1 class="text-[28px] font-bold leading-tight sm:text-[32px]">{{ greeting }}</h1>
			<p class="text-[15px] text-ink-600">
				{{
					progress.hasProgress
						? 'İlerlemeniz bu tarayıcıda kayıtlı. Kaldığınız yerden devam edebilirsiniz.'
						: 'Microsoft 365 Copilot’ı adım adım, örnek verilerle ve uygulayarak öğreneceksiniz.'
				}}
			</p>
		</header>

		<div class="mt-6 grid grid-cols-[minmax(0,1fr)] gap-5 xl:grid-cols-3">
			<!-- Continue -->
			<section
				class="relative isolate overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white shadow-[0_26px_50px_-30px_rgba(140,0,0,.75)] sm:p-7 xl:col-span-2"
				aria-labelledby="continue-title"
			>
				<!-- Rings, as on the welcome screen -->
				<div
					class="pointer-events-none absolute -end-24 -top-28 -z-10 h-[340px] w-[340px] rounded-full border-[30px] border-white/[.08] shadow-[0_0_0_46px_rgba(255,255,255,.04)]"
					aria-hidden="true"
				/>
				<div
					class="pointer-events-none absolute -bottom-40 end-10 -z-10 h-64 w-64 rounded-full border-2 border-dashed border-white/[.14]"
					aria-hidden="true"
				/>
				<div class="relative">
					<p
						id="continue-title"
						class="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-white"
					>
						<Sparkles :size="14" aria-hidden="true" />
						{{
							continueInfo?.started
								? 'Kaldığınız yerden devam edin'
								: target.kind === 'lesson'
								? 'Sıradaki dersiniz'
								: target.kind === 'quiz'
								? 'Final zamanı'
								: 'Eğitim tamamlandı'
						}}
					</p>

					<template v-if="continueInfo">
						<div class="mt-4 flex items-start gap-4">
							<AppTile :visual="continueInfo.ref.module.visual" size="lg" />
							<div class="min-w-0">
								<p class="text-[13px] text-white">
									Modül {{ continueInfo.ref.module.number }} ·
									{{ continueInfo.ref.module.navLabel }}
								</p>
								<h2 class="mt-0.5 text-[22px] font-bold leading-tight text-white sm:text-[26px]">
									{{ continueInfo.ref.lesson.title }}
								</h2>
								<p class="mt-1.5 max-w-[56ch] text-[14px] text-white">
									{{ continueInfo.ref.lesson.summary }}
								</p>
							</div>
						</div>
						<div class="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
							<RouterLink
								:to="continueInfo.to"
								class="btn btn-lg bg-white text-brand-700 shadow-raised hover:bg-brand-50 focus-visible:ring-white focus-visible:ring-offset-brand-800"
							>
								{{ continueInfo.started ? 'Devam et' : 'Derse başla' }}
								<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
							</RouterLink>
							<div class="flex min-w-0 flex-1 items-center gap-3 text-[13px] text-white">
								<span class="flex shrink-0 items-center gap-1.5"
									><Clock :size="14" aria-hidden="true" />
									{{ continueInfo.ref.lesson.minutes }} dk</span
								>
								<template v-if="continueInfo.started">
									<span class="shrink-0"
										>Adım {{ continueInfo.step + 1 }}/{{ continueInfo.total }}</span
									>
									<ProgressBar
										:value="continueInfo.percent"
										tone="light"
										class="max-w-[180px]"
										label="Ders ilerlemesi"
									/>
								</template>
							</div>
						</div>
						<!-- Information only: the lesson above is the one next step to click. -->
						<p
							v-if="recommended"
							class="mt-5 border-t border-white/20 pt-4 text-[13px] leading-snug text-white"
						>
							<span class="font-semibold">Bundan sonra:</span>
							{{ recommended.lesson.title }} · Modül {{ recommended.module.number }} ·
							{{ recommended.lesson.minutes }} dk
						</p>
					</template>

					<template v-else-if="target.kind === 'quiz'">
						<h2 class="mt-4 text-[24px] font-bold text-white">Bütün dersleri tamamladınız.</h2>
						<p class="mt-1.5 max-w-[56ch] text-[14px] text-white">
							{{ QUIZ_QUESTIONS.length }} soruluk final bilgi testiyle öğrendiklerinizi ölçün. Geçme
							puanı %80.
						</p>
						<RouterLink
							:to="{ name: 'quiz' }"
							class="btn btn-lg mt-6 bg-white text-brand-700 shadow-raised hover:bg-brand-50 focus-visible:ring-white focus-visible:ring-offset-brand-800"
						>
							Teste başla <ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
						</RouterLink>
					</template>

					<template v-else>
						<h2 class="mt-4 text-[24px] font-bold text-white">
							Tebrikler, Copilot Academy’yi tamamladınız.
						</h2>
						<p class="mt-1.5 max-w-[56ch] text-[14px] text-white">
							Tamamlama özetinizi görüntüleyebilir, dilediğiniz modülü tekrar edebilirsiniz.
						</p>
						<RouterLink
							:to="{ name: 'achievements' }"
							class="btn btn-lg mt-6 bg-white text-brand-700 shadow-raised hover:bg-brand-50 focus-visible:ring-white focus-visible:ring-offset-brand-800"
						>
							Tamamlama özetini gör
							<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
						</RouterLink>
					</template>
				</div>
			</section>

			<!-- Progress -->
			<section class="card flex flex-col p-6" aria-labelledby="progress-title">
				<h2 id="progress-title" class="text-[15px] font-semibold">Öğrenme ilerlemesi</h2>
				<div class="mt-4 flex items-center gap-5">
					<ProgressRing
						:value="progress.overall.percent"
						:size="112"
						:stroke="10"
						:label="`Genel ilerleme yüzde ${progress.overall.percent}`"
					>
						<span class="flex flex-col items-center leading-none">
							<span class="text-[26px] font-bold text-ink-900"
								>%{{ progress.overall.percent }}</span
							>
							<span class="mt-1 text-[11px] text-ink-500">tamamlandı</span>
						</span>
					</ProgressRing>
					<dl class="space-y-2 text-[13.5px]">
						<div>
							<dt class="text-ink-500">Dersler</dt>
							<dd class="font-semibold text-ink-900">
								{{ progress.overall.lessonsDone }}/{{ progress.overall.lessonsTotal }}
							</dd>
						</div>
						<div>
							<dt class="text-ink-500">Modüller</dt>
							<dd class="font-semibold text-ink-900">
								{{ progress.overall.modulesDone }}/{{ MODULES.length }}
							</dd>
						</div>
						<div>
							<dt class="text-ink-500">Final testi</dt>
							<dd class="font-semibold text-ink-900">{{ quizState.label }}</dd>
						</div>
					</dl>
				</div>
				<p class="mt-auto pt-4 text-[12.5px] text-ink-500">
					İlerleme; {{ progress.overall.lessonsTotal }} ders ve final testi üzerinden hesaplanır.
				</p>
			</section>
		</div>

		<div class="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
			<StatTile
				label="Tamamlanan dersler"
				:value="`${progress.overall.lessonsDone}`"
				:detail="`${progress.overall.lessonsTotal} dersten`"
				icon="book"
			/>
			<StatTile
				label="Kazanılan rozetler"
				:value="`${progress.earnedBadges.length}`"
				detail="Başarılarım’da tümü"
				icon="medal"
				tone="amber"
			/>
			<StatTile
				label="Final testi"
				:value="progress.bestAttempt ? `%${Math.round(progress.bestAttempt.ratio * 100)}` : '—'"
				:detail="
					progress.bestAttempt
						? progress.bestAttempt.passed
							? 'Geçildi'
							: 'Geçme puanı %80'
						: 'Henüz denenmedi'
				"
				icon="clipboard"
				tone="iris"
			/>
			<StatTile
				label="Tahmini kalan süre"
				:value="formatMinutes(progress.remainingMinutes)"
				detail="Derslerin süresine göre"
				icon="clock"
				tone="lagoon"
			/>
		</div>

		<div class="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
			<section aria-labelledby="modules-title">
				<div class="flex items-end justify-between gap-3">
					<div>
						<h2 id="modules-title" class="text-xl font-bold">Modüller</h2>
						<p class="text-[13.5px] text-ink-500">
							Önerilen sıra modül numarasıdır; dilediğiniz modülü istediğiniz zaman açabilirsiniz.
						</p>
					</div>
				</div>
				<ul
					class="mt-4 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 2xl:grid-cols-3"
					role="list"
				>
					<li v-for="m in MODULES" :key="m.id">
						<ModuleCard
							:to="{ name: 'module', params: { moduleId: m.id } }"
							:visual="m.visual"
							:number="m.number"
							:title="m.navLabel"
							:tagline="m.tagline"
							:meta="`${progress.moduleStats(m.id).done}/${m.lessons.length} ders`"
							:minutes="moduleMinutes(m)"
							:percent="progress.moduleStats(m.id).percent"
							:state="progress.moduleStats(m.id).state"
						/>
					</li>
					<li>
						<ModuleCard
							:to="{ name: 'quiz' }"
							visual="quiz"
							:number="QUIZ.number"
							:title="QUIZ.navLabel"
							:tagline="`${QUIZ_QUESTIONS.length} soru · geçme puanı %80`"
							:meta="
								quizState.state === 'completed'
									? 'Geçildi'
									: progress.bestAttempt
									? `${progress.data.quiz.attempts.length} deneme`
									: 'Değerlendirme'
							"
							:minutes="QUIZ.minutes"
							:percent="quizState.percent"
							:state="quizState.state"
							:state-label="quizState.label"
						/>
					</li>
					<li>
						<ModuleCard
							:to="{ name: 'achievements' }"
							visual="trophy"
							:number="GRADUATION.number"
							:title="GRADUATION.navLabel"
							tagline="Rozetler, tamamlanan modüller ve eğitim tamamlama özeti"
							:meta="`Genel ilerleme %${progress.overall.percent}`"
							:minutes="GRADUATION.minutes"
							:percent="progress.overall.percent"
							:state="
								progress.overall.percent === 100
									? 'completed'
									: progress.hasProgress
									? 'in-progress'
									: 'not-started'
							"
							:state-label="badgeLabel"
						/>
					</li>
				</ul>
			</section>

			<aside class="space-y-5">
				<section class="card p-5" aria-labelledby="badges-title">
					<div class="flex items-center justify-between">
						<h2 id="badges-title" class="text-[15px] font-semibold">Kazanılan rozetler</h2>
						<RouterLink
							:to="{ name: 'achievements' }"
							class="text-[13px] font-semibold text-brand-700 hover:text-brand-800"
							>Tümü</RouterLink
						>
					</div>
					<ul v-if="progress.earnedBadges.length" class="mt-3 flex flex-wrap gap-2" role="list">
						<li
							v-for="e in progress.earnedBadges.slice(0, 8)"
							:key="e.badge.id"
							class="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50/70 py-1 pe-3 ps-1"
							:title="e.badge.description"
						>
							<AppTile :visual="e.badge.visual" size="xs" />
							<span class="text-[12.5px] font-semibold text-ink-800">{{ e.badge.title }}</span>
						</li>
					</ul>
					<p
						v-else
						class="mt-3 rounded-xl border border-dashed border-ink-300 px-4 py-4 text-center text-[13px] text-ink-500"
					>
						İlk dersinizi tamamladığınızda “İlk Adım” rozetini kazanacaksınız.
					</p>
				</section>

				<section class="card p-5" aria-labelledby="activity-title">
					<h2 id="activity-title" class="mb-3 text-[15px] font-semibold">Son etkinlikler</h2>
					<ActivityList :items="progress.data.activity" />
				</section>

				<section class="card p-5" aria-labelledby="done-title">
					<h2 id="done-title" class="text-[15px] font-semibold">Tamamlanan dersler</h2>
					<ul v-if="completedLessons.length" class="mt-3 space-y-2" role="list">
						<li v-for="c in completedLessons.slice(0, 6)" :key="c.ref.lesson.id">
							<RouterLink
								:to="{
									name: 'lesson',
									params: { moduleId: c.ref.module.id, lessonId: c.ref.lesson.id },
								}"
								class="flex items-center gap-2.5 rounded-lg px-1 py-1 text-[13.5px] text-ink-700 hover:text-brand-800"
							>
								<CircleCheck :size="16" class="shrink-0 text-success-600" aria-hidden="true" />
								<span class="min-w-0 flex-1 truncate">{{ c.ref.lesson.title }}</span>
								<time :datetime="c.at" class="shrink-0 text-[12px] text-ink-500">{{
									formatRelative(c.at)
								}}</time>
							</RouterLink>
						</li>
					</ul>
					<p v-else class="mt-3 text-[13px] text-ink-500">Henüz tamamlanan ders yok.</p>
					<p v-if="completedLessons.length > 6" class="mt-2 text-[12px] text-ink-500">
						ve {{ completedLessons.length - 6 }} ders daha
					</p>
				</section>

				<section class="rounded-2xl border border-ink-200/80 bg-ink-50/70 p-5">
					<h2 class="text-[14px] font-semibold">İlerlemeyi sıfırla</h2>
					<p class="mt-1 text-[12.5px] text-ink-500">
						Tüm dersler, görevler, rozetler ve test sonuçları bu tarayıcıdan silinir.
					</p>
					<p class="mt-1 text-[12.5px] text-ink-500">
						İlerleme yalnızca bu cihazdaki bu tarayıcıda tutulur. Safari ve iOS, kursu yaklaşık bir
						hafta açmadığınızda bu kaydı silebilir.
					</p>
					<div class="mt-3 flex flex-wrap gap-2">
						<button
							v-if="!confirmReset"
							type="button"
							class="btn btn-secondary btn-sm"
							:disabled="!progress.hasProgress"
							@click="confirmReset = true"
						>
							<RotateCcw :size="14" aria-hidden="true" /> Sıfırla
						</button>
						<template v-else>
							<p
								class="flex w-full items-center gap-1.5 text-[12.5px] font-medium text-danger-700"
								role="alert"
							>
								<TriangleAlert :size="14" aria-hidden="true" /> Bu işlem geri alınamaz.
							</p>
							<button
								type="button"
								class="btn btn-sm bg-danger-600 text-white hover:bg-danger-700"
								@click="reset"
							>
								Evet, sıfırla
							</button>
							<button type="button" class="btn btn-ghost btn-sm" @click="confirmReset = false">
								Vazgeç
							</button>
						</template>
					</div>
				</section>
			</aside>
		</div>
	</div>
</template>
