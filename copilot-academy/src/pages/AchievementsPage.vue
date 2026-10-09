<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
	ArrowRight,
	CircleCheck,
	CircleDashed,
	Info,
	Printer,
	Sparkles,
	TrendingUp,
} from 'lucide-vue-next'
import { MODULES, QUIZ, SKILLS, getModule } from '@/content'
import { BADGES } from '@/content/badges'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { allTaskIds } from '@/components/lesson/phases'
import { formatDate } from '@/lib/format'
import { scoreQuiz } from '@/lib/quizScoring'
import { useProgress } from '@/stores/progress'
import type { SkillKey } from '@/types/content'
import BadgeGrid from '@/components/dashboard/BadgeGrid.vue'
import BrandMark from '@/components/layout/BrandMark.vue'
import AppTile from '@/components/ui/AppTile.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'

const progress = useProgress()
const learnerName = ref('')

const best = computed(() => progress.bestAttempt)
const bestScore = computed(() =>
	best.value ? scoreQuiz(QUIZ_QUESTIONS, best.value.answers) : null
)
const graduated = computed(
	() => progress.overall.modulesDone === MODULES.length && progress.quizPassed
)

/** Average first-try score of the tasks in a module, or null when none are done. */
function moduleTaskScore(moduleId: string): number | null {
	const module = getModule(moduleId)
	if (!module) return null
	const results = module.lessons
		.flatMap((l) => allTaskIds(l.steps))
		.map((id) => progress.taskResult(id))
		.filter((r) => !!r)
	if (!results.length) return null
	return results.reduce((s, r) => s + (r.score ?? (r.correct ? 1 : 0)), 0) / results.length
}

interface Area {
	moduleId: string
	reason: string
}

const improvementAreas = computed<Area[]>(() => {
	const areas = new Map<string, string>()
	for (const id of bestScore.value?.reviewModules ?? []) {
		const misses = bestScore.value!.results.filter(
			(r, i) => !r.correct && QUIZ_QUESTIONS[i].moduleId === id
		).length
		areas.set(id, `Final testinde bu modülle ilgili ${misses} soru yanlış yanıtlandı.`)
	}
	for (const m of MODULES) {
		if (areas.has(m.id)) continue
		const s = progress.moduleStats(m.id)
		const taskScore = moduleTaskScore(m.id)
		if (s.state !== 'completed' && s.state === 'in-progress')
			areas.set(m.id, `Modül yarım kaldı: ${s.done}/${s.total} ders tamamlandı.`)
		else if (taskScore !== null && taskScore < 0.7)
			areas.set(m.id, `Görevlerde ilk deneme başarınız %${Math.round(taskScore * 100)}.`)
	}
	return [...areas.entries()].map(([moduleId, reason]) => ({ moduleId, reason }))
})

const strongSkills = computed<SkillKey[]>(() => {
	const by = bestScore.value?.bySkill ?? {}
	return (Object.keys(by) as SkillKey[]).filter((k) => by[k] && by[k]!.correct === by[k]!.total)
})

const notStarted = computed(() =>
	MODULES.filter((m) => progress.moduleStats(m.id).state === 'not-started')
)

const nextSteps = computed(() => {
	const steps: { title: string; text: string }[] = []
	if (!graduated.value) {
		const t = progress.continueTarget
		if (t.kind === 'lesson')
			steps.push({
				title: 'Eğitimi tamamlayın',
				text: `Sıradaki ders: “${t.ref.lesson.title}” (Modül ${t.ref.module.number}).`,
			})
		else if (t.kind === 'quiz')
			steps.push({
				title: 'Final testini geçin',
				text: 'Bütün dersleri bitirdiniz; %80 ile testi geçerek mezun olun.',
			})
	}
	steps.push(
		{
			title: 'Kendi işinizle deneyin',
			text: 'Bu hafta tekrar eden bir görevinizi Prompt Builder’daki beş bileşenle prompt’a dönüştürün ve kurumunuzun onayladığı Copilot ortamında deneyin.',
		},
		{
			title: 'Kurum politikalarını okuyun',
			text: 'Yapay zekâ kullanım politikası, veri sınıflandırma kuralları ve onaylı araç listesi hakkında BT veya bilgi güvenliği ekibinizden bilgi alın.',
		},
		{
			title: 'Hangi özelliklerin açık olduğunu öğrenin',
			text: 'Copilot özelliklerinin lisansınıza ve yönetici ayarlarına bağlı olduğunu unutmayın; hangi uygulamalarda etkin olduğunu BT ekibinize sorun.',
		},
		{
			title: 'Doğrulama alışkanlığını sürdürün',
			text: 'Bir toplantı özetini veya rapor özetini kaynağıyla karşılaştırarak haftalık bir “doğrulama turu” yapın.',
		}
	)
	return steps
})

const today = new Date().toISOString()

function print() {
	window.print()
}
</script>

<template>
	<div class="mx-auto max-w-[1240px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<header class="no-print flex flex-col gap-1">
			<p class="eyebrow">Modül 12 / 12</p>
			<h1 class="text-[28px] font-bold leading-tight sm:text-[32px]">Mezuniyet ve Başarılarım</h1>
			<p class="text-[15px] text-ink-600">
				Gelişiminizi, rozetlerinizi ve eğitim tamamlama özetinizi burada görebilirsiniz.
			</p>
		</header>

		<!-- Summary tiles -->
		<div class="no-print mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			<div class="card flex items-center gap-4 p-5">
				<ProgressRing
					:value="progress.overall.percent"
					:size="64"
					:stroke="7"
					:tone="progress.overall.percent === 100 ? 'success' : 'brand'"
				/>
				<div>
					<p class="text-[12.5px] font-medium text-ink-500">Toplam tamamlanma</p>
					<p class="text-[22px] font-bold text-ink-900">%{{ progress.overall.percent }}</p>
				</div>
			</div>
			<div class="card p-5">
				<p class="text-[12.5px] font-medium text-ink-500">Doğru cevap (en iyi deneme)</p>
				<p class="text-[22px] font-bold text-ink-900">
					{{ best ? `${best.correct}/${best.total}` : '—' }}
				</p>
				<p class="text-[12px] text-ink-500">
					{{
						best
							? `%${Math.round(best.ratio * 100)} · ${best.passed ? 'geçti' : 'geçme puanı %80'}`
							: 'Final testi henüz çözülmedi'
					}}
				</p>
			</div>
			<div class="card p-5">
				<p class="text-[12.5px] font-medium text-ink-500">Kazanılan rozetler</p>
				<p class="text-[22px] font-bold text-ink-900">
					{{ progress.earnedBadges.length }}/{{ BADGES.length }}
				</p>
				<p class="text-[12px] text-ink-500">Ders, modül ve test başarılarına göre</p>
			</div>
			<div class="card p-5">
				<p class="text-[12.5px] font-medium text-ink-500">Tamamlanan modüller</p>
				<p class="text-[22px] font-bold text-ink-900">
					{{ progress.overall.modulesDone }}/{{ MODULES.length }}
				</p>
				<p class="text-[12px] text-ink-500">
					{{ progress.overall.lessonsDone }}/{{ progress.overall.lessonsTotal }} ders
				</p>
			</div>
		</div>

		<div class="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_400px]">
			<div class="no-print space-y-8">
				<section aria-labelledby="modules-title">
					<h2 id="modules-title" class="text-xl font-bold">Tamamlanan modüller</h2>
					<ul class="mt-4 grid gap-2.5 sm:grid-cols-2" role="list">
						<li v-for="m in MODULES" :key="m.id">
							<RouterLink
								:to="{ name: 'module', params: { moduleId: m.id } }"
								class="flex items-center gap-3 rounded-xl border border-ink-200/80 bg-white p-3 shadow-card transition hover:border-brand-200"
							>
								<AppTile :visual="m.visual" size="sm" />
								<span class="min-w-0 flex-1">
									<span class="block truncate text-[14px] font-semibold text-ink-900"
										>{{ m.number }}. {{ m.navLabel }}</span
									>
									<span class="block text-[12px] text-ink-500"
										>{{ progress.moduleStats(m.id).done }}/{{ m.lessons.length }} ders</span
									>
								</span>
								<CircleCheck
									v-if="progress.moduleStats(m.id).state === 'completed'"
									:size="18"
									class="shrink-0 text-success-600"
									aria-label="Tamamlandı"
								/>
								<CircleDashed
									v-else
									:size="18"
									class="shrink-0 text-ink-300"
									aria-label="Tamamlanmadı"
								/>
							</RouterLink>
						</li>
						<li>
							<RouterLink
								:to="{ name: 'quiz' }"
								class="flex items-center gap-3 rounded-xl border border-ink-200/80 bg-white p-3 shadow-card transition hover:border-brand-200"
							>
								<AppTile visual="quiz" size="sm" />
								<span class="min-w-0 flex-1">
									<span class="block truncate text-[14px] font-semibold text-ink-900"
										>11. {{ QUIZ.navLabel }}</span
									>
									<span class="block text-[12px] text-ink-500">{{
										best ? `En iyi %${Math.round(best.ratio * 100)}` : 'Çözülmedi'
									}}</span>
								</span>
								<CircleCheck
									v-if="progress.quizPassed"
									:size="18"
									class="shrink-0 text-success-600"
									aria-label="Geçildi"
								/>
								<CircleDashed
									v-else
									:size="18"
									class="shrink-0 text-ink-300"
									aria-label="Geçilmedi"
								/>
							</RouterLink>
						</li>
					</ul>
				</section>

				<section aria-labelledby="badges-title">
					<h2 id="badges-title" class="text-xl font-bold">Rozetler</h2>
					<p class="text-[13.5px] text-ink-500">Kilitli rozetlerde nasıl kazanılacakları yazar.</p>
					<BadgeGrid class="mt-4" />
				</section>

				<div class="grid gap-5 lg:grid-cols-2">
					<section class="card p-5" aria-labelledby="improve-title">
						<h2 id="improve-title" class="flex items-center gap-2 text-[15px] font-semibold">
							<TrendingUp :size="17" class="text-brand-600" aria-hidden="true" /> Geliştirilmesi
							gereken alanlar
						</h2>
						<ul v-if="improvementAreas.length" class="mt-3 space-y-2" role="list">
							<li v-for="a in improvementAreas" :key="a.moduleId">
								<RouterLink
									:to="{ name: 'module', params: { moduleId: a.moduleId } }"
									class="flex items-start gap-3 rounded-xl border border-ink-200/80 p-3 transition hover:border-brand-300 hover:bg-brand-50/40"
								>
									<AppTile :visual="getModule(a.moduleId)!.visual" size="sm" />
									<span class="min-w-0 flex-1">
										<span class="block text-[14px] font-semibold text-ink-900">{{
											getModule(a.moduleId)!.title
										}}</span>
										<span class="block text-[12.5px] text-ink-500">{{ a.reason }}</span>
									</span>
									<ArrowRight
										:size="16"
										class="mt-1 shrink-0 text-ink-400 rtl:-scale-x-100"
										aria-hidden="true"
									/>
								</RouterLink>
							</li>
						</ul>
						<p
							v-else-if="notStarted.length === MODULES.length"
							class="mt-3 text-[13.5px] text-ink-600"
						>
							Derslere başladıkça görev sonuçlarınıza ve test cevaplarınıza göre öneriler burada
							görünecek.
						</p>
						<p v-else class="mt-3 text-[13.5px] text-ink-600">
							Şu an belirgin bir gelişim alanı görünmüyor. Harika gidiyorsunuz.
						</p>
						<p
							v-if="notStarted.length && notStarted.length < MODULES.length"
							class="mt-3 text-[12.5px] text-ink-500"
						>
							Henüz başlanmayan modüller: {{ notStarted.map((m) => m.navLabel).join(', ') }}.
						</p>
					</section>

					<section class="card p-5" aria-labelledby="next-title">
						<h2 id="next-title" class="flex items-center gap-2 text-[15px] font-semibold">
							<Sparkles :size="17" class="text-iris-600" aria-hidden="true" /> Önerilen sonraki
							adımlar
						</h2>
						<ol class="mt-3 space-y-3" role="list">
							<li v-for="(s, i) in nextSteps" :key="s.title" class="flex gap-3">
								<span
									class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-iris-50 text-[12px] font-bold text-iris-700 ring-1 ring-inset ring-iris-200"
									>{{ i + 1 }}</span
								>
								<div>
									<p class="text-[14px] font-semibold text-ink-900">{{ s.title }}</p>
									<p class="text-[13px] leading-relaxed text-ink-600">{{ s.text }}</p>
								</div>
							</li>
						</ol>
					</section>
				</div>

				<section v-if="strongSkills.length" class="card p-5" aria-labelledby="strong-title">
					<h2 id="strong-title" class="text-[15px] font-semibold">Güçlü olduğunuz alanlar</h2>
					<ul class="mt-3 flex flex-wrap gap-2" role="list">
						<li
							v-for="s in strongSkills"
							:key="s"
							class="chip bg-success-50 py-1 text-[12.5px] text-success-700 ring-1 ring-inset ring-success-100"
						>
							<CircleCheck :size="13" aria-hidden="true" /> {{ SKILLS[s].label }}
						</li>
					</ul>
				</section>
			</div>

			<!-- Completion summary (printable) -->
			<aside class="xl:sticky xl:top-20 xl:self-start">
				<section
					class="print-area overflow-hidden rounded-3xl border border-ink-200 bg-white shadow-raised"
					aria-labelledby="summary-title"
				>
					<div class="bg-copilot px-6 py-5 text-white">
						<div class="rounded-xl bg-white/95 px-3 py-2 shadow-card inline-flex">
							<BrandMark />
						</div>
						<h2 id="summary-title" class="mt-4 text-[20px] font-bold leading-tight text-white">
							Copilot Academy Eğitim Tamamlama Özeti
						</h2>
						<p class="mt-1 text-[13px] text-white/80">
							{{ graduated ? 'Eğitim tamamlandı' : 'Ara özet · eğitim devam ediyor' }}
						</p>
					</div>
					<div class="space-y-4 px-6 py-5">
						<div class="no-print">
							<label for="learner-name" class="field-label"
								>Özette görünecek ad (isteğe bağlı)</label
							>
							<input
								id="learner-name"
								v-model="learnerName"
								type="text"
								maxlength="60"
								autocomplete="off"
								class="field-input"
								placeholder="Ad Soyad"
							/>
							<p class="mt-1 text-[12px] text-ink-500">
								Bu ad kaydedilmez; yalnızca yazdırma veya PDF için kullanılır.
							</p>
						</div>
						<dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-[13.5px]">
							<div class="col-span-2">
								<dt class="text-ink-500">Katılımcı</dt>
								<dd class="text-[16px] font-semibold text-ink-900">
									{{ learnerName.trim() || 'Belirtilmedi' }}
								</dd>
							</div>
							<div>
								<dt class="text-ink-500">Tarih</dt>
								<dd class="font-semibold text-ink-900">{{ formatDate(today) }}</dd>
							</div>
							<div>
								<dt class="text-ink-500">Tamamlanma</dt>
								<dd class="font-semibold text-ink-900">%{{ progress.overall.percent }}</dd>
							</div>
							<div>
								<dt class="text-ink-500">Modüller</dt>
								<dd class="font-semibold text-ink-900">
									{{ progress.overall.modulesDone }}/{{ MODULES.length }} ders modülü
								</dd>
							</div>
							<div>
								<dt class="text-ink-500">Final testi</dt>
								<dd class="font-semibold text-ink-900">
									{{
										best
											? `${best.correct}/${best.total} (%${Math.round(best.ratio * 100)})`
											: 'Çözülmedi'
									}}
								</dd>
							</div>
							<div class="col-span-2">
								<dt class="text-ink-500">Rozetler</dt>
								<dd class="font-semibold text-ink-900">
									{{
										progress.earnedBadges.length
											? progress.earnedBadges.map((e) => e.badge.title).join(', ')
											: 'Henüz rozet yok'
									}}
								</dd>
							</div>
						</dl>
						<div>
							<p class="text-[12.5px] font-semibold text-ink-500">Tamamlanan modüller</p>
							<ul class="mt-1.5 space-y-1 text-[13px]" role="list">
								<li
									v-for="m in MODULES"
									:key="m.id"
									class="flex items-center gap-2"
									:class="
										progress.moduleStats(m.id).state === 'completed'
											? 'text-ink-800'
											: 'text-ink-400'
									"
								>
									<CircleCheck
										v-if="progress.moduleStats(m.id).state === 'completed'"
										:size="14"
										class="shrink-0 text-success-600"
										aria-hidden="true"
									/>
									<CircleDashed v-else :size="14" class="shrink-0" aria-hidden="true" />
									{{ m.number }}. {{ m.title }}
								</li>
							</ul>
						</div>
						<p
							class="flex gap-2 rounded-xl bg-ink-50 px-3.5 py-3 text-[12px] leading-relaxed text-ink-600"
						>
							<Info :size="15" class="mt-0.5 shrink-0" aria-hidden="true" />
							Bu özet, Copilot Academy eğitim simülasyonundaki ilerlemeyi gösterir. Akredite bir
							sertifika veya Microsoft sertifikası değildir.
						</p>
						<button type="button" class="no-print btn btn-primary w-full" @click="print">
							<Printer :size="16" aria-hidden="true" /> Yazdır veya PDF olarak kaydet
						</button>
					</div>
				</section>
			</aside>
		</div>
	</div>
</template>
