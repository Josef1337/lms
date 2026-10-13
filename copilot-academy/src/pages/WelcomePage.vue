<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import {
	ArrowRight,
	BookOpen,
	Brain,
	CircleCheck,
	Compass,
	Eye,
	Flag,
	PenLine,
	ScanSearch,
	ShieldCheck,
} from 'lucide-vue-next'
import {
	GRADUATION,
	LESSON_REFS,
	MODULES,
	QUIZ,
	SKILLS,
	TOTAL_LESSONS,
	TOTAL_MINUTES,
	TOTAL_MODULES,
	moduleMinutes,
} from '@/content'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { allTaskIds } from '@/components/lesson/phases'
import { formatMinutes } from '@/lib/format'
import { useProgress } from '@/stores/progress'
import BrandMark from '@/components/layout/BrandMark.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import AppTile from '@/components/ui/AppTile.vue'
import Icon from '@/components/ui/Icon.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import CopilotMark from '@/components/ui/CopilotMark.vue'
import { SUITE_APPS } from '@/components/ui/appLogos'

const router = useRouter()
const progress = useProgress()

const taskCount =
	LESSON_REFS.reduce((n, r) => n + allTaskIds(r.lesson.steps).length, 0) + QUIZ_QUESTIONS.length

const primaryLabel = computed(() =>
	progress.hasProgress ? 'Kaldığım Yerden Devam Et' : 'Eğitime Başla'
)

function start() {
	const t = progress.continueTarget
	if (!progress.hasProgress && t.kind === 'lesson') {
		router.push({
			name: 'lesson',
			params: { moduleId: t.ref.module.id, lessonId: t.ref.lesson.id },
		})
		return
	}
	if (t.kind === 'lesson')
		router.push({
			name: 'lesson',
			params: { moduleId: t.ref.module.id, lessonId: t.ref.lesson.id },
		})
	else if (t.kind === 'quiz') router.push({ name: 'quiz' })
	else router.push({ name: 'achievements' })
}

function explore(id: string) {
	document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const LOOP = [
	{ label: 'Öğren', text: 'Konu kısa ve anlaşılır bölümlerle anlatılır.', icon: BookOpen },
	{ label: 'Gör', text: 'Gerçekçi bir iş örneği adım adım gösterilir.', icon: Eye },
	{ label: 'Keşfet', text: 'Örnekle etkileşime girer, seçenekleri denersiniz.', icon: Compass },
	{ label: 'Uygula', text: 'Kısa bir görevi kendiniz yaparsınız.', icon: PenLine },
	{
		label: 'Kontrol et',
		text: 'Cevabınıza göre açıklayıcı geri bildirim alırsınız.',
		icon: ScanSearch,
	},
	{
		label: 'Pekiştir',
		text: 'Birkaç kısa soruyla öğrendiğinizi sağlamlaştırırsınız.',
		icon: Brain,
	},
	{ label: 'Devam et', text: 'Öğrendiklerinizi özetler, sonraki derse geçersiniz.', icon: Flag },
]

const LABS = [
	{
		visual: 'prompt' as const,
		title: 'Prompt Builder',
		text: 'Alanları doldurun; renkli, okunabilir ve kopyalanabilir bir prompt oluşsun.',
	},
	{
		visual: 'chat' as const,
		title: 'Sohbet simülasyonu',
		text: 'Uzun bir proje güncellemesini adım adım özet, risk ve aksiyona dönüştürün.',
	},
	{
		visual: 'excel' as const,
		title: 'Excel laboratuvarı',
		text: '36 satırlık satış verisinde hedef, ürün ve aylık performansı analiz edin.',
	},
	{
		visual: 'powerpoint' as const,
		title: 'Sunum stüdyosu',
		text: 'Bir rapordan üç farklı tarzda 5 slaytlık sunum taslağı oluşturun.',
	},
	{
		visual: 'teams' as const,
		title: 'Toplantı notları',
		text: 'Transkriptten özet, kararlar, aksiyonlar ve takip e-postası çıkarın.',
	},
	{
		visual: 'scenario' as const,
		title: 'Uçtan uca senaryolar',
		text: 'Birden fazla uygulamayı tek bir iş akışında doğru sırayla kullanın.',
	},
]
</script>

<template>
	<div class="relative min-h-screen overflow-x-hidden">
		<!-- Top bar, laid over the red hero -->
		<header class="absolute inset-x-0 top-0 z-20 text-white">
			<div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
				<RouterLink
					:to="{ name: 'welcome' }"
					class="rounded-lg"
					aria-label="Copilot Academy ana sayfa"
				>
					<BrandMark tagline on-dark />
				</RouterLink>
				<nav aria-label="Sayfa içi" class="ms-auto hidden items-center gap-1 md:flex">
					<button
						type="button"
						class="btn btn-sm text-white hover:bg-black/10"
						@click="explore('nasil')"
					>
						Nasıl öğrenirsiniz?
					</button>
					<button
						type="button"
						class="btn btn-sm text-white hover:bg-black/10"
						@click="explore('mufredat')"
					>
						Müfredat
					</button>
				</nav>
				<RouterLink
					:to="{ name: 'dashboard' }"
					class="btn btn-sm ms-auto rounded-full border-[1.5px] border-white/70 text-white hover:bg-black/10 md:ms-2"
				>
					Genel Bakış
				</RouterLink>
			</div>
		</header>

		<main>
			<!-- Hero -->
			<section class="relative isolate overflow-hidden bg-lobby text-white">
				<!-- Concentric rings, as on the Vodafone session screen -->
				<svg
					viewBox="0 0 400 400"
					class="pointer-events-none absolute -bottom-[22vmin] -end-[14vmin] -z-10 h-[78vmin] w-[78vmin] opacity-90"
					fill="none"
					stroke="rgba(255,255,255,.16)"
					aria-hidden="true"
				>
					<circle cx="200" cy="200" r="192" stroke-width="1.5" />
					<g class="origin-center animate-[spin_90s_linear_infinite] [transform-box:fill-box]">
						<circle cx="200" cy="200" r="170" stroke-width="2" stroke-dasharray="4 10" />
					</g>
					<circle cx="200" cy="200" r="148" stroke-width="16" />
					<g
						class="origin-center animate-[spin_120s_linear_infinite_reverse] [transform-box:fill-box]"
					>
						<circle cx="200" cy="200" r="122" stroke-width="1.5" stroke-dasharray="2 8" />
					</g>
				</svg>

				<div
					class="mx-auto grid max-w-6xl items-center gap-12 px-4 pb-20 pt-24 sm:px-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:pb-28 lg:pt-28"
				>
					<div class="animate-fade-up">
						<p
							class="inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/15 px-3 py-1 text-[12.5px] font-semibold text-white"
						>
							<CopilotMark :size="16" />
							Microsoft 365 Copilot için uygulamalı Türkçe eğitim
						</p>
						<h1
							class="mt-5 text-[38px] font-bold leading-[1.08] tracking-[-0.025em] text-white text-balance sm:text-[52px] lg:text-[56px]"
						>
							Microsoft 365 Copilot ile çalışma şeklinizi yeniden keşfedin.
						</h1>
						<p
							class="mt-5 max-w-[56ch] text-[17px] leading-relaxed text-white text-pretty sm:text-[18px]"
						>
							Yapay zekâyı günlük iş akışınıza dahil edin. Daha iyi
							<span class="whitespace-nowrap">e-postalar</span> yazın, verileri analiz edin,
							sunumlar oluşturun ve işlerinizi daha verimli tamamlayın.
						</p>
						<div class="mt-8 flex flex-wrap gap-3">
							<button
								type="button"
								class="btn btn-lg rounded-full bg-white text-brand-700 shadow-[0_14px_30px_-14px_rgba(60,0,0,.6)] hover:bg-[#fff1f1] focus-visible:ring-white focus-visible:ring-offset-brand-800"
								@click="start"
							>
								{{ primaryLabel }}
								<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
							</button>
							<button
								type="button"
								class="btn btn-lg rounded-full border-[1.5px] border-white/70 text-white hover:bg-black/10"
								@click="explore('mufredat')"
							>
								Eğitimi Keşfet
							</button>
						</div>
						<ul class="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-white" role="list">
							<li class="flex items-center gap-1.5">
								<CircleCheck :size="15" class="text-white" aria-hidden="true" /> Gerçek hesap
								gerekmez
							</li>
							<li class="flex items-center gap-1.5">
								<CircleCheck :size="15" class="text-white" aria-hidden="true" /> Kurgusal örnek
								verilerle
							</li>
							<li class="flex items-center gap-1.5">
								<CircleCheck :size="15" class="text-white" aria-hidden="true" /> İlerleme
								tarayıcınızda saklanır
							</li>
						</ul>
					</div>

					<!-- Visual composition: original artwork evoking M365 + Copilot, not a product screenshot -->
					<figure
						class="relative mx-auto aspect-[1.02] w-full max-w-[540px] animate-fade-in max-sm:hidden"
					>
						<div aria-hidden="true">
							<!-- document -->
							<div
								class="absolute start-[2%] top-[4%] w-[60%] rotate-[-3deg] rounded-2xl border border-ink-200 bg-white p-4 shadow-float"
							>
								<div class="flex items-center gap-2">
									<AppTile visual="word" size="xs" />
									<span class="text-[11px] font-semibold text-ink-700">Q3 Müşteri Raporu</span>
								</div>
								<div class="mt-3 space-y-1.5">
									<div class="h-2 w-4/5 rounded bg-ink-800/80" />
									<div class="h-1.5 w-full rounded bg-ink-200" />
									<div class="h-1.5 w-11/12 rounded bg-ink-200" />
									<div class="h-1.5 w-full rounded bg-brand-200" />
									<div class="h-1.5 w-3/4 rounded bg-ink-200" />
									<div class="mt-2 h-1.5 w-full rounded bg-ink-200" />
									<div class="h-1.5 w-5/6 rounded bg-ink-200" />
								</div>
							</div>
							<!-- excel chart -->
							<div
								class="absolute end-[0%] top-[0%] w-[44%] rotate-[3deg] rounded-2xl border border-ink-200 bg-white p-3.5 shadow-raised"
							>
								<div class="flex items-center gap-2">
									<AppTile visual="excel" size="xs" />
									<span class="text-[11px] font-semibold text-ink-700">Hedef gerçekleşme</span>
								</div>
								<div
									class="mt-3 flex h-[56px] items-end gap-2 border-b border-ink-200 px-1 xl:h-[72px]"
								>
									<span class="w-full rounded-t-[4px] bg-[#2a78d6]" style="height: 78%" />
									<span class="w-full rounded-t-[4px] bg-[#2a78d6]" style="height: 96%" />
									<span class="w-full rounded-t-[4px] bg-ink-300" style="height: 58%" />
									<span class="w-full rounded-t-[4px] bg-[#2a78d6]" style="height: 84%" />
								</div>
								<div class="mt-1 flex justify-between text-[9px] text-ink-400">
									<span>Mar.</span><span>Ege</span><span>İ.A.</span><span>Top.</span>
								</div>
							</div>
							<!-- copilot panel -->
							<div
								class="absolute end-[4%] top-[30%] w-[66%] rounded-2xl border border-white/10 bg-ink-900 p-4 text-white shadow-float animate-float"
							>
								<div class="flex items-center gap-2">
									<CopilotMark :size="22" />
									<span class="text-[12px] font-semibold">Copilot</span>
									<span
										class="ms-auto rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white/60"
										>Örnek</span
									>
								</div>
								<p
									class="mt-3 rounded-xl rounded-ee-sm bg-brand-600 px-3 py-2 text-[12px] leading-snug"
								>
									Bu raporu yönetim için üç maddede özetle.
								</p>
								<ul
									class="mt-2.5 space-y-1.5 rounded-xl rounded-ss-sm bg-white/[.06] px-3 py-2.5 text-[11.5px] leading-snug text-white/85"
								>
									<li class="flex gap-2">
										<span class="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-300" />Müşteri
										kaybı %8’den %11’e yükseldi.
									</li>
									<li class="flex gap-2">
										<span class="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-300" />Destek
										yanıt süresi hedefin üzerinde.
									</li>
									<li class="flex gap-2">
										<span class="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-300" />Üç karar
										maddesi onay bekliyor.<span
											class="ms-0.5 inline-block h-3 w-[2px] translate-y-[1px] bg-white/80 animate-caret"
										/>
									</li>
								</ul>
							</div>
							<!-- mail draft -->
							<div
								class="absolute bottom-[8%] start-[0%] w-[50%] rotate-[-2deg] rounded-2xl border border-ink-200 bg-white p-3.5 shadow-raised"
							>
								<div class="flex items-center gap-2">
									<AppTile visual="outlook" size="xs" />
									<span class="text-[11px] font-semibold text-ink-700">Yanıt taslağı</span>
									<span
										class="ms-auto rounded-full bg-amber-50 px-1.5 py-0.5 text-[9px] font-semibold text-amber-700"
										>Taslak</span
									>
								</div>
								<div class="mt-2.5 space-y-1.5">
									<div class="h-1.5 w-full rounded bg-ink-200" />
									<div class="h-1.5 w-5/6 rounded bg-ink-200" />
									<div class="h-1.5 w-2/3 rounded bg-ink-200" />
								</div>
							</div>
							<!-- teams chip -->
							<div
								class="absolute bottom-[2%] end-[6%] flex items-center gap-2.5 rounded-2xl border border-ink-200 bg-white px-3 py-2.5 shadow-raised"
							>
								<AppTile visual="teams" size="sm" />
								<div>
									<p class="text-[11.5px] font-semibold text-ink-800">Toplantı özeti</p>
									<p class="text-[10.5px] text-ink-500">3 karar · 5 aksiyon</p>
								</div>
							</div>
							<!-- floating tile -->
							<div class="absolute bottom-[19%] start-[55%] rotate-[8deg]">
								<AppTile visual="powerpoint" size="md" />
							</div>
						</div>
						<figcaption class="sr-only">
							Word belgesi, Excel grafiği, Copilot sohbet paneli, Outlook yanıt taslağı ve Teams
							toplantı özetinden oluşan örnek bir kompozisyon.
						</figcaption>
					</figure>
				</div>
			</section>

			<!-- Stats -->
			<section class="relative z-10 -mt-6 px-4 sm:px-6" aria-label="Eğitim özeti">
				<dl
					class="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink-200/80 bg-ink-200/80 shadow-raised md:grid-cols-4"
				>
					<div class="bg-white px-5 py-5">
						<dt class="text-[13px] font-medium text-ink-500">Eğitim modülü</dt>
						<dd class="mt-1 text-[30px] font-bold leading-none text-ink-900">
							{{ TOTAL_MODULES }}
						</dd>
						<dd class="mt-1.5 text-[12.5px] text-ink-500">
							{{ TOTAL_LESSONS }} ders, final testi ve mezuniyet
						</dd>
					</div>
					<div class="bg-white px-5 py-5">
						<dt class="text-[13px] font-medium text-ink-500">Tahmini toplam süre</dt>
						<dd class="mt-1 text-[30px] font-bold leading-none text-ink-900">
							{{ formatMinutes(TOTAL_MINUTES) }}
						</dd>
						<dd class="mt-1.5 text-[12.5px] text-ink-500">Kendi hızınızda, bölüm bölüm</dd>
					</div>
					<div class="flex items-center gap-4 bg-white px-5 py-5">
						<ProgressRing
							:value="progress.overall.percent"
							:size="56"
							:stroke="6"
							:label="`Tamamlanma yüzde ${progress.overall.percent}`"
						/>
						<div>
							<dt class="text-[13px] font-medium text-ink-500">Tamamlanma</dt>
							<dd class="mt-0.5 text-[13px] text-ink-700">
								{{
									progress.hasProgress
										? `${progress.overall.lessonsDone}/${TOTAL_LESSONS} ders tamamlandı`
										: 'Henüz başlamadınız'
								}}
							</dd>
						</div>
					</div>
					<div class="bg-white px-5 py-5">
						<dt class="text-[13px] font-medium text-ink-500">Uygulamalı görev ve soru</dt>
						<dd class="mt-1 text-[30px] font-bold leading-none text-ink-900">{{ taskCount }}</dd>
						<dd class="mt-1.5 text-[12.5px] text-ink-500">Anında geri bildirimle</dd>
					</div>
				</dl>
			</section>

			<!-- Apps -->
			<section class="mx-auto max-w-6xl px-4 pt-14 sm:px-6" aria-labelledby="apps-title">
				<div
					class="flex flex-col gap-6 rounded-2xl border border-ink-200/80 bg-white px-5 py-6 shadow-card sm:px-7 lg:flex-row lg:items-center lg:gap-10"
				>
					<div class="lg:max-w-[320px]">
						<h2 id="apps-title" class="text-[17px] font-semibold leading-snug">
							Copilot, Microsoft 365 uygulamalarının içinde çalışır
						</h2>
						<p class="mt-1.5 text-[13.5px] leading-relaxed text-ink-600">
							Hangi uygulamada hangi özelliğin açık olduğu lisansınıza ve kurum ayarlarınıza
							bağlıdır. Bu eğitim Copilot Chat, Word, Excel, PowerPoint, Outlook ve Teams üzerine
							odaklanır.
						</p>
					</div>
					<ul class="grid flex-1 grid-cols-4 gap-x-2 gap-y-5 sm:grid-cols-8" role="list">
						<li
							v-for="app in SUITE_APPS"
							:key="app.key"
							class="flex flex-col items-center gap-2 text-center"
						>
							<img
								:src="app.src"
								alt=""
								width="44"
								height="44"
								draggable="false"
								class="h-11 w-11 select-none object-contain"
							/>
							<span class="text-[12px] font-medium text-ink-700">{{ app.label }}</span>
						</li>
					</ul>
				</div>
			</section>

			<!-- Skills -->
			<section class="mx-auto max-w-6xl px-4 pt-20 sm:px-6" aria-labelledby="skills-title">
				<div class="max-w-2xl">
					<p class="eyebrow !text-brand-700">Öğrenilecek temel yetkinlikler</p>
					<h2 id="skills-title" class="mt-2 text-[28px] font-bold leading-tight sm:text-[34px]">
						Copilot’ı güvenle ve etkili kullanmak için gereken her şey
					</h2>
				</div>
				<ul class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" role="list">
					<li
						v-for="(skill, key) in SKILLS"
						:key="key"
						class="rounded-2xl border border-ink-200/80 bg-white p-5 shadow-card"
					>
						<span
							class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-iris-50 text-brand-700 ring-1 ring-inset ring-brand-100"
						>
							<Icon :name="skill.icon" :size="20" />
						</span>
						<h3 class="mt-3 text-[15.5px] font-semibold leading-snug">{{ skill.label }}</h3>
						<p class="mt-1 text-[13.5px] leading-relaxed text-ink-600">{{ skill.description }}</p>
					</li>
					<li
						class="flex flex-col justify-between rounded-2xl bg-ink-900 p-5 text-white shadow-raised"
					>
						<ShieldCheck :size="22" class="text-lagoon-300" aria-hidden="true" />
						<p class="mt-3 text-[14px] leading-relaxed text-white/80">
							Her modülde, Copilot özelliklerinin
							<strong class="font-semibold text-white">lisansa, sürüme ve kurum ayarlarına</strong>
							göre değişebileceğini gösteren kısa notlar bulunur.
						</p>
					</li>
				</ul>
			</section>

			<!-- Learning loop -->
			<section
				id="nasil"
				class="mx-auto max-w-6xl scroll-mt-6 px-4 pt-20 sm:px-6"
				aria-labelledby="loop-title"
			>
				<div class="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
					<div>
						<p class="eyebrow !text-brand-700">Nasıl öğrenirsiniz?</p>
						<h2 id="loop-title" class="mt-2 text-[28px] font-bold leading-tight sm:text-[34px]">
							Her ders aynı yedi adımlık döngüyü izler
						</h2>
						<p class="mt-3 text-[15.5px] leading-relaxed text-ink-600">
							Her ekranda tek bir öğrenme hedefi vardır. Bir sonraki adıma geçmeden önce kısa bir
							görev yapar, anında geri bildirim alırsınız. İlerlemeniz otomatik kaydedilir.
						</p>
					</div>
					<ol class="grid gap-2.5 sm:grid-cols-2" role="list">
						<li
							v-for="(s, i) in LOOP"
							:key="s.label"
							:class="[
								'flex gap-3 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card',
								i === LOOP.length - 1 && 'sm:col-span-2',
							]"
						>
							<span
								class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100"
							>
								<component :is="s.icon" :size="18" aria-hidden="true" />
							</span>
							<div>
								<p class="text-[15px] font-semibold">
									<span class="text-ink-500">{{ i + 1 }}.</span> {{ s.label }}
								</p>
								<p class="text-[13.5px] text-ink-600">{{ s.text }}</p>
							</div>
						</li>
					</ol>
				</div>

				<h3 class="mt-14 text-[20px] font-bold">Uygulamalı laboratuvarlar</h3>
				<ul class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
					<li
						v-for="lab in LABS"
						:key="lab.title"
						class="flex gap-3.5 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card"
					>
						<AppTile :visual="lab.visual" size="md" />
						<div>
							<p class="text-[15px] font-semibold">{{ lab.title }}</p>
							<p class="text-[13.5px] leading-relaxed text-ink-600">{{ lab.text }}</p>
						</div>
					</li>
				</ul>
			</section>

			<!-- Curriculum -->
			<section
				id="mufredat"
				class="mx-auto max-w-6xl scroll-mt-6 px-4 pt-20 sm:px-6"
				aria-labelledby="curriculum-title"
			>
				<div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
					<div class="max-w-2xl">
						<p class="eyebrow !text-brand-700">Müfredat</p>
						<h2
							id="curriculum-title"
							class="mt-2 text-[28px] font-bold leading-tight sm:text-[34px]"
						>
							{{ TOTAL_MODULES }} modülde sıfırdan uygulamaya
						</h2>
					</div>
					<p class="text-[14px] text-ink-500">
						{{ TOTAL_LESSONS }} ders · {{ QUIZ_QUESTIONS.length }} soruluk final testi ·
						{{ formatMinutes(TOTAL_MINUTES) }}
					</p>
				</div>
				<ol class="mt-8 grid gap-3 md:grid-cols-2" role="list">
					<li v-for="m in MODULES" :key="m.id">
						<RouterLink
							:to="{ name: 'module', params: { moduleId: m.id } }"
							class="group flex h-full items-start gap-4 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-raised"
						>
							<AppTile :visual="m.visual" size="lg" />
							<div class="min-w-0 flex-1">
								<p class="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
									Modül {{ m.number }}
								</p>
								<p
									class="text-[16px] font-semibold leading-snug text-ink-900 group-hover:text-brand-800"
								>
									{{ m.title }}
								</p>
								<p class="mt-0.5 text-[13.5px] text-ink-500">{{ m.tagline }}</p>
								<p class="mt-2 text-[12.5px] text-ink-500">
									{{ m.lessons.length }} ders · {{ moduleMinutes(m) }} dk
								</p>
							</div>
							<CircleCheck
								v-if="progress.moduleStats(m.id).state === 'completed'"
								:size="18"
								class="shrink-0 text-success-600"
								aria-label="Tamamlandı"
							/>
						</RouterLink>
					</li>
					<li>
						<RouterLink
							:to="{ name: 'quiz' }"
							class="group flex h-full items-start gap-4 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-raised"
						>
							<AppTile visual="quiz" size="lg" />
							<div class="min-w-0 flex-1">
								<p class="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
									Modül {{ QUIZ.number }}
								</p>
								<p
									class="text-[16px] font-semibold leading-snug text-ink-900 group-hover:text-brand-800"
								>
									{{ QUIZ.title }}
								</p>
								<p class="mt-0.5 text-[13.5px] text-ink-500">{{ QUIZ.description }}</p>
							</div>
						</RouterLink>
					</li>
					<li>
						<RouterLink
							:to="{ name: 'achievements' }"
							class="group flex h-full items-start gap-4 rounded-2xl border border-ink-200/80 bg-white p-4 shadow-card transition hover:border-brand-200 hover:shadow-raised"
						>
							<AppTile visual="trophy" size="lg" />
							<div class="min-w-0 flex-1">
								<p class="text-[12px] font-semibold uppercase tracking-wide text-ink-500">
									Modül {{ GRADUATION.number }}
								</p>
								<p
									class="text-[16px] font-semibold leading-snug text-ink-900 group-hover:text-brand-800"
								>
									{{ GRADUATION.title }}
								</p>
								<p class="mt-0.5 text-[13.5px] text-ink-500">{{ GRADUATION.description }}</p>
							</div>
						</RouterLink>
					</li>
				</ol>
			</section>

			<!-- Closing CTA -->
			<section class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
				<div
					class="relative isolate transform-gpu overflow-hidden rounded-3xl bg-brand-gradient px-6 py-10 text-white shadow-[0_26px_50px_-30px_rgba(140,0,0,.75)] sm:px-10"
				>
					<div
						class="pointer-events-none absolute -end-24 -top-32 -z-10 h-[340px] w-[340px] rounded-full border-[30px] border-white/[.08] shadow-[0_0_0_46px_rgba(255,255,255,.04)]"
						aria-hidden="true"
					/>
					<div
						class="pointer-events-none absolute -bottom-40 end-20 -z-10 h-64 w-64 rounded-full border-2 border-dashed border-white/[.14]"
						aria-hidden="true"
					/>
					<div class="relative flex flex-col gap-6 md:flex-row md:items-center">
						<div class="flex-1">
							<h2 class="text-[26px] font-bold leading-tight text-white sm:text-[30px]">
								Hazırsanız ilk dersle başlayalım.
							</h2>
							<p class="mt-2 max-w-[56ch] text-[15px] text-white">
								İlk ders yaklaşık {{ MODULES[0].lessons[0].minutes }} dakika sürer. İstediğiniz
								zaman ara verebilir, kaldığınız yerden devam edebilirsiniz.
							</p>
						</div>
						<button
							type="button"
							class="btn btn-lg shrink-0 rounded-full bg-white text-brand-700 shadow-raised hover:bg-[#fff1f1] focus-visible:ring-white focus-visible:ring-offset-brand-800"
							@click="start"
						>
							{{ primaryLabel }}
							<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
						</button>
					</div>
				</div>
			</section>
		</main>

		<SiteFooter />
	</div>
</template>
