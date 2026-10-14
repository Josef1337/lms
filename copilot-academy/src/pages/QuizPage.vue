<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
	ArrowLeft,
	ArrowRight,
	ChevronDown,
	CircleCheck,
	CircleX,
	ClipboardCheck,
	Clock,
	History,
	RotateCcw,
	Trophy,
} from 'lucide-vue-next'
import { QUIZ, SKILLS, getModule } from '@/content'
import { getBadge } from '@/content/badges'
import { QUIZ_QUESTIONS } from '@/content/quiz'
import { formatDate } from '@/lib/format'
import { PASS_RATIO, scoreQuiz } from '@/lib/quizScoring'
import { seededShuffle } from '@/lib/shuffle'
import { useProgress, type QuizAttempt } from '@/stores/progress'
import AppTile from '@/components/ui/AppTile.vue'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import ProgressRing from '@/components/ui/ProgressRing.vue'
import RichText from '@/components/ui/RichText.vue'

const progress = useProgress()
type View = 'intro' | 'question' | 'result'

const view = ref<View>('intro')
const answers = ref<Record<string, string>>({ ...(progress.data.quiz.draft?.answers ?? {}) })
const index = ref(progress.data.quiz.draft?.index ?? 0)
const selection = ref<string | null>(null)
const resultAttempt = ref<QuizAttempt | null>(null)
const newBadges = ref<string[]>([])
const openExplanations = ref<Set<string>>(new Set())
const heading = ref<HTMLElement | null>(null)

const total = QUIZ_QUESTIONS.length
const passCount = Math.ceil(total * PASS_RATIO)
const question = computed(() => QUIZ_QUESTIONS[index.value])
// Options appear in a per-attempt order, seeded by the number of finished
// attempts: the same through an attempt and across a reload, new on the next
// attempt. Answers are stored by option id, so the order never affects the
// score, and the A–D letters follow what is on screen.
const shownOptions = computed(() =>
	seededShuffle(
		question.value.options,
		`${question.value.id}:${progress.data.quiz.attempts.length}`
	)
)
const answered = computed(() => answers.value[question.value.id])
const answeredCount = computed(() => QUIZ_QUESTIONS.filter((q) => answers.value[q.id]).length)
const hasDraft = computed(
	() => !!progress.data.quiz.draft && Object.keys(progress.data.quiz.draft.answers).length > 0
)

const score = computed(() =>
	resultAttempt.value ? scoreQuiz(QUIZ_QUESTIONS, resultAttempt.value.answers) : null
)

async function focusHeading() {
	await nextTick()
	heading.value?.focus({ preventScroll: true })
	window.scrollTo({ top: 0, behavior: 'smooth' })
}

function begin(fresh: boolean) {
	if (fresh) {
		answers.value = {}
		index.value = 0
		progress.discardQuizDraft()
	}
	selection.value = null
	view.value = 'question'
	focusHeading()
}

function check() {
	if (!selection.value || answered.value) return
	answers.value = { ...answers.value, [question.value.id]: selection.value }
	progress.saveQuizDraft({ answers: answers.value, index: index.value })
}

function goTo(i: number) {
	index.value = Math.max(0, Math.min(total - 1, i))
	selection.value = null
	progress.saveQuizDraft({ answers: answers.value, index: index.value })
	focusHeading()
}

function finish() {
	const { attempt, badges } = progress.submitQuiz(answers.value)
	resultAttempt.value = attempt
	newBadges.value = badges
	progress.acknowledgeBadges(badges)
	answers.value = {}
	index.value = 0
	view.value = 'result'
	focusHeading()
}

function showLast() {
	resultAttempt.value = progress.lastAttempt
	newBadges.value = []
	view.value = 'result'
	focusHeading()
}

function toggleExplanation(id: string) {
	const next = new Set(openExplanations.value)
	if (next.has(id)) next.delete(id)
	else next.add(id)
	openExplanations.value = next
}

const missesFor = (moduleId: string) =>
	score.value?.results.filter((r, i) => !r.correct && QUIZ_QUESTIONS[i].moduleId === moduleId)
		.length ?? 0

const optionText = (questionId: string, optionId: string | null) =>
	QUIZ_QUESTIONS.find((q) => q.id === questionId)?.options.find((o) => o.id === optionId)?.text ??
	'Yanıtlanmadı'

function optionState(optionId: string) {
	if (!answered.value) return selection.value === optionId ? 'selected' : 'idle'
	if (optionId === question.value.correct) return 'correct'
	if (optionId === answered.value) return 'wrong'
	return 'muted'
}

const OPTION_CLASS = {
	idle: '',
	selected: 'border-brand-500 bg-brand-50 ring-1 ring-brand-500',
	correct: 'border-success-600/60 bg-success-50',
	wrong: 'border-danger-600/50 bg-danger-50',
	muted: 'opacity-60',
}
const LETTERS = ['A', 'B', 'C', 'D', 'E']
</script>

<template>
	<div class="mx-auto max-w-[920px] px-4 pb-16 pt-6 sm:px-6 sm:pt-8 lg:px-8">
		<!-- Intro -->
		<template v-if="view === 'intro'">
			<section
				class="relative overflow-hidden rounded-3xl border border-ink-200/80 bg-white p-6 shadow-card sm:p-9"
			>
				<div
					class="pointer-events-none absolute -end-20 -top-20 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl"
					aria-hidden="true"
				/>
				<div class="relative">
					<div class="flex items-center gap-3">
						<AppTile visual="quiz" size="lg" />
						<p class="eyebrow">Modül {{ QUIZ.number }} / 12</p>
					</div>
					<h1
						ref="heading"
						tabindex="-1"
						class="mt-4 text-[30px] font-bold leading-tight focus:outline-none sm:text-[36px]"
					>
						{{ QUIZ.title }}
					</h1>
					<p class="mt-2 max-w-[60ch] text-[15.5px] leading-relaxed text-ink-600">
						{{ QUIZ.description }}
					</p>
					<ul class="mt-6 grid gap-3 sm:grid-cols-3" role="list">
						<li class="rounded-xl bg-ink-50 px-4 py-3">
							<p class="text-[12.5px] text-ink-500">Soru sayısı</p>
							<p class="text-[20px] font-bold">{{ total }} çoktan seçmeli</p>
						</li>
						<li class="rounded-xl bg-ink-50 px-4 py-3">
							<p class="text-[12.5px] text-ink-500">Geçme puanı</p>
							<p class="text-[20px] font-bold">%80 · en az {{ passCount }} doğru</p>
						</li>
						<li class="rounded-xl bg-ink-50 px-4 py-3">
							<p class="flex items-center gap-1 text-[12.5px] text-ink-500">
								<Clock :size="13" aria-hidden="true" /> Tahmini süre
							</p>
							<p class="text-[20px] font-bold">{{ QUIZ.minutes }} dk</p>
						</li>
					</ul>
					<ul class="mt-5 space-y-1.5 text-[14px] text-ink-600" role="list">
						<li class="flex gap-2">
							<CircleCheck :size="16" class="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
							Her sorudan sonra doğru cevabı ve açıklamasını görürsünüz.
						</li>
						<li class="flex gap-2">
							<CircleCheck :size="16" class="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
							Yanıtlarınız kaydedilir; ara verip daha sonra devam edebilirsiniz.
						</li>
						<li class="flex gap-2">
							<CircleCheck :size="16" class="mt-0.5 shrink-0 text-brand-600" aria-hidden="true" />
							Puan, gerçek cevaplarınızdan hesaplanır. Testi dilediğiniz kadar tekrar
							çözebilirsiniz.
						</li>
					</ul>
					<div class="mt-7 flex flex-wrap gap-3">
						<template v-if="hasDraft">
							<button type="button" class="btn btn-primary btn-lg" @click="begin(false)">
								Kaldığım yerden devam et ({{ answeredCount }}/{{ total }})
								<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
							</button>
							<button type="button" class="btn btn-secondary btn-lg" @click="begin(true)">
								<RotateCcw :size="17" aria-hidden="true" /> Baştan başla
							</button>
						</template>
						<button v-else type="button" class="btn btn-accent btn-lg" @click="begin(true)">
							{{ progress.lastAttempt ? 'Testi tekrar çöz' : 'Teste başla' }}
							<ArrowRight :size="18" class="rtl:-scale-x-100" aria-hidden="true" />
						</button>
						<button
							v-if="progress.lastAttempt"
							type="button"
							class="btn btn-ghost btn-lg"
							@click="showLast"
						>
							Son sonucu görüntüle
						</button>
					</div>
					<p
						v-if="progress.overall.lessonsDone < progress.overall.lessonsTotal"
						class="mt-5 rounded-xl border border-iris-200 bg-iris-50 px-4 py-3 text-[13.5px] text-iris-800"
					>
						Öneri: Teste başlamadan önce dersleri tamamlamanız daha iyi sonuç almanızı sağlar ({{
							progress.overall.lessonsDone
						}}/{{ progress.overall.lessonsTotal }} ders tamamlandı). Yine de testi şimdi
						çözebilirsiniz.
					</p>
				</div>
			</section>

			<section
				v-if="progress.data.quiz.attempts.length"
				class="card mt-5 p-5 sm:p-6"
				aria-labelledby="attempts-title"
			>
				<h2 id="attempts-title" class="flex items-center gap-2 text-[15px] font-semibold">
					<History :size="16" aria-hidden="true" /> Önceki denemeler
				</h2>
				<ol class="mt-3 divide-y divide-ink-100" role="list">
					<li
						v-for="(a, i) in [...progress.data.quiz.attempts].reverse().slice(0, 5)"
						:key="a.id"
						class="flex items-center gap-3 py-2.5 text-[14px]"
					>
						<span class="w-20 shrink-0 text-ink-500"
							>Deneme {{ progress.data.quiz.attempts.length - i }}</span
						>
						<span class="flex-1 text-ink-500">{{ formatDate(a.at) }}</span>
						<span class="font-semibold text-ink-900"
							>{{ a.correct }}/{{ a.total }} · %{{ Math.round(a.ratio * 100) }}</span
						>
						<span
							:class="[
								'chip',
								a.passed ? 'bg-success-50 text-success-700' : 'bg-ink-100 text-ink-600',
							]"
							>{{ a.passed ? 'Geçti' : 'Geçmedi' }}</span
						>
					</li>
				</ol>
			</section>
		</template>

		<!-- Question -->
		<template v-else-if="view === 'question'">
			<div class="flex items-center justify-between gap-3">
				<button type="button" class="btn btn-ghost btn-sm -ms-2" @click="view = 'intro'">
					<ArrowLeft :size="15" class="rtl:-scale-x-100" aria-hidden="true" /> Test bilgileri
				</button>
				<p class="text-[13px] text-ink-500">{{ answeredCount }}/{{ total }} yanıtlandı</p>
			</div>
			<div class="mt-3">
				<div class="mb-2 flex items-center justify-between text-[13px]">
					<span class="font-semibold text-ink-800">Soru {{ index + 1 }} / {{ total }}</span>
					<span class="text-ink-500">%{{ Math.round((answeredCount / total) * 100) }}</span>
				</div>
				<ProgressBar :value="(answeredCount / total) * 100" size="sm" label="Test ilerlemesi" />
				<ol class="mt-3 flex flex-wrap gap-1.5" role="list" aria-label="Sorular">
					<li v-for="(q, i) in QUIZ_QUESTIONS" :key="q.id">
						<button
							type="button"
							:aria-current="i === index ? 'step' : undefined"
							:aria-label="`Soru ${i + 1}${
								answers[q.id] ? (answers[q.id] === q.correct ? ', doğru' : ', yanlış') : ''
							}`"
							:class="[
								'flex h-7 w-7 items-center justify-center rounded-full text-[11.5px] font-bold transition',
								i === index
									? 'bg-ink-900 text-white'
									: answers[q.id]
									? answers[q.id] === q.correct
										? 'bg-success-50 text-success-700 ring-1 ring-success-100'
										: 'bg-danger-50 text-danger-700 ring-1 ring-danger-100'
									: 'bg-ink-100 text-ink-600 hover:bg-ink-200',
							]"
							@click="goTo(i)"
						>
							{{ i + 1 }}
						</button>
					</li>
				</ol>
			</div>

			<article
				:key="question.id"
				class="card mt-5 animate-fade-up p-5 sm:p-7"
				aria-labelledby="quiz-question"
			>
				<p class="flex flex-wrap items-center gap-2 text-[12px]">
					<span class="chip bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200">{{
						SKILLS[question.skill].label
					}}</span>
					<span class="text-ink-500"
						>Modül {{ getModule(question.moduleId)?.number }} ·
						{{ getModule(question.moduleId)?.navLabel }}</span
					>
				</p>
				<h1
					id="quiz-question"
					ref="heading"
					tabindex="-1"
					class="mt-3 text-[20px] font-semibold leading-snug focus:outline-none sm:text-[22px]"
				>
					<RichText :text="question.prompt" />
				</h1>
				<div class="mt-5 space-y-2.5" role="radiogroup" aria-labelledby="quiz-question">
					<button
						v-for="(o, oi) in shownOptions"
						:key="o.id"
						type="button"
						role="radio"
						:aria-checked="(answered ?? selection) === o.id"
						:aria-disabled="!!answered"
						:class="[
							'option-card items-center',
							OPTION_CLASS[optionState(o.id)],
							answered && 'cursor-default',
						]"
						@click="!answered && (selection = o.id)"
					>
						<span
							:class="[
								'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[12.5px] font-bold',
								optionState(o.id) === 'correct'
									? 'bg-success-600 text-white'
									: optionState(o.id) === 'wrong'
									? 'bg-danger-600 text-white'
									: optionState(o.id) === 'selected'
									? 'bg-brand-600 text-white'
									: 'bg-ink-100 text-ink-600',
							]"
							aria-hidden="true"
						>
							<CircleCheck v-if="optionState(o.id) === 'correct'" :size="15" />
							<CircleX v-else-if="optionState(o.id) === 'wrong'" :size="15" />
							<template v-else>{{ LETTERS[oi] }}</template>
						</span>
						<RichText :text="o.text" class="text-[15px]" />
					</button>
				</div>

				<div
					v-if="answered"
					:class="[
						'mt-5 animate-fade-in rounded-xl border px-4 py-3.5 text-[14px] leading-relaxed',
						answered === question.correct
							? 'border-success-100 bg-success-50'
							: 'border-danger-100 bg-danger-50',
					]"
					role="status"
				>
					<p class="flex items-center gap-2 font-semibold text-ink-900">
						<CircleCheck
							v-if="answered === question.correct"
							:size="17"
							class="text-success-700"
							aria-hidden="true"
						/>
						<CircleX v-else :size="17" class="text-danger-600" aria-hidden="true" />
						{{ answered === question.correct ? 'Doğru cevap' : 'Yanlış cevap' }}
					</p>
					<RichText as="p" :text="question.explanation" class="mt-1 text-ink-700" />
				</div>

				<div
					class="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5"
				>
					<button
						type="button"
						class="btn btn-secondary"
						:disabled="index === 0"
						@click="goTo(index - 1)"
					>
						<ArrowLeft :size="16" class="rtl:-scale-x-100" aria-hidden="true" /> Önceki
					</button>
					<button
						v-if="!answered"
						type="button"
						class="btn btn-primary"
						:disabled="!selection"
						@click="check"
					>
						Yanıtı kontrol et
					</button>
					<button
						v-else-if="index < total - 1"
						type="button"
						class="btn btn-primary"
						@click="goTo(index + 1)"
					>
						Sonraki soru <ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
					</button>
					<button
						v-else-if="answeredCount === total"
						type="button"
						class="btn btn-accent"
						@click="finish"
					>
						<ClipboardCheck :size="16" aria-hidden="true" /> Sonuçları gör
					</button>
					<button
						v-else
						type="button"
						class="btn btn-primary"
						@click="goTo(QUIZ_QUESTIONS.findIndex((q) => !answers[q.id]))"
					>
						Yanıtlanmamış soruya git
						<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
					</button>
				</div>
			</article>
		</template>

		<!-- Result -->
		<template v-else-if="score && resultAttempt">
			<section
				:class="[
					'relative overflow-hidden rounded-3xl p-6 shadow-float sm:p-9',
					score.passed ? 'bg-ink-900 text-white' : 'border border-ink-200 bg-white',
				]"
			>
				<div
					v-if="score.passed"
					class="pointer-events-none absolute -end-20 -top-24 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl"
					aria-hidden="true"
				/>
				<div
					v-if="score.passed"
					class="pointer-events-none absolute -bottom-24 start-1/4 h-64 w-64 rounded-full bg-brand-600/30 blur-3xl"
					aria-hidden="true"
				/>
				<div class="relative flex flex-col gap-6 sm:flex-row sm:items-center">
					<ProgressRing
						:value="score.percent"
						:size="132"
						:stroke="11"
						:tone="score.passed ? 'light' : 'brand'"
						:label="`Puan yüzde ${score.percent}`"
					>
						<span class="flex flex-col items-center leading-none">
							<span :class="['text-[32px] font-bold', score.passed ? 'text-white' : 'text-ink-900']"
								>%{{ score.percent }}</span
							>
							<span :class="['mt-1 text-[11.5px]', score.passed ? 'text-white/60' : 'text-ink-500']"
								>{{ score.correct }}/{{ score.total }} doğru</span
							>
						</span>
					</ProgressRing>
					<div class="min-w-0 flex-1">
						<p
							:class="[
								'text-[12px] font-semibold uppercase tracking-[0.1em]',
								score.passed ? 'text-white/60' : 'text-ink-500',
							]"
						>
							Test sonucu · {{ formatDate(resultAttempt.at) }}
						</p>
						<h1
							ref="heading"
							tabindex="-1"
							:class="[
								'mt-1 text-[26px] font-bold leading-tight focus:outline-none sm:text-[30px]',
								score.passed ? 'text-white' : 'text-ink-900',
							]"
						>
							{{
								score.passed
									? 'Tebrikler, testi geçtiniz.'
									: score.correct >= passCount - 2
									? 'Geçme puanına az kaldı.'
									: 'Bu sefer olmadı; birlikte tekrar edelim.'
							}}
						</h1>
						<p :class="['mt-1.5 text-[15px]', score.passed ? 'text-white/75' : 'text-ink-600']">
							{{
								score.passed
									? `${score.correct} soruyu doğru yanıtladınız. Geçme puanı %80’di.`
									: `Geçmek için en az ${passCount} doğru gerekiyor; ${score.correct} doğru yaptınız. Aşağıdaki modülleri tekrar edip yeniden deneyin.`
							}}
						</p>
						<div class="mt-5 flex flex-wrap gap-3">
							<button
								type="button"
								:class="['btn', score.passed ? 'btn-on-dark' : 'btn-primary']"
								@click="begin(true)"
							>
								<RotateCcw :size="16" aria-hidden="true" /> Testi tekrar çöz
							</button>
							<RouterLink
								:to="{ name: 'achievements' }"
								:class="[
									'btn',
									score.passed ? 'bg-white text-ink-900 hover:bg-brand-50' : 'btn-secondary',
								]"
							>
								<Trophy :size="16" aria-hidden="true" /> Başarılarım
							</RouterLink>
						</div>
					</div>
				</div>
				<ul
					v-if="newBadges.length"
					class="relative mt-6 flex flex-wrap gap-2"
					role="list"
					aria-label="Yeni rozetler"
				>
					<li
						v-for="id in newBadges"
						:key="id"
						class="flex items-center gap-2 rounded-full bg-white/10 py-1 pe-3 ps-1 ring-1 ring-white/15"
					>
						<AppTile :visual="getBadge(id)!.visual" size="xs" />
						<span class="text-[13px] font-semibold text-white"
							>Yeni rozet: {{ getBadge(id)!.title }}</span
						>
					</li>
				</ul>
			</section>

			<div class="mt-6 grid gap-5 md:grid-cols-2">
				<section class="card p-5" aria-labelledby="review-title">
					<h2 id="review-title" class="text-[15px] font-semibold">
						Tekrar çalışılması önerilen modüller
					</h2>
					<ul v-if="score.reviewModules.length" class="mt-3 space-y-2" role="list">
						<li v-for="id in score.reviewModules" :key="id">
							<RouterLink
								:to="{ name: 'module', params: { moduleId: id } }"
								class="flex items-center gap-3 rounded-xl border border-ink-200/80 p-2.5 transition hover:border-brand-300 hover:bg-brand-50/40"
							>
								<AppTile :visual="getModule(id)!.visual" size="sm" />
								<span class="min-w-0 flex-1">
									<span class="block text-[14px] font-semibold text-ink-900">{{
										getModule(id)!.title
									}}</span>
									<span class="block text-[12px] text-ink-500">
										{{ missesFor(id) }} soru yanlış
									</span>
								</span>
								<ArrowRight :size="16" class="text-ink-400 rtl:-scale-x-100" aria-hidden="true" />
							</RouterLink>
						</li>
					</ul>
					<p v-else class="mt-3 text-[14px] text-ink-600">
						Bütün soruları doğru yanıtladınız. Tekrar edilmesi gereken bir modül yok.
					</p>
				</section>
				<section class="card p-5" aria-labelledby="skills-title">
					<h2 id="skills-title" class="text-[15px] font-semibold">Becerilere göre sonuç</h2>
					<ul class="mt-3 space-y-3" role="list">
						<li v-for="(s, key) in score.bySkill" :key="key">
							<div class="mb-1 flex justify-between text-[13px]">
								<span class="text-ink-700">{{ SKILLS[key].label }}</span>
								<span class="font-semibold text-ink-900">{{ s!.correct }}/{{ s!.total }}</span>
							</div>
							<ProgressBar
								:value="(s!.correct / s!.total) * 100"
								:tone="s!.correct === s!.total ? 'success' : 'brand'"
								size="xs"
								:label="SKILLS[key].label"
							/>
						</li>
					</ul>
				</section>
			</div>

			<section class="card mt-5 overflow-hidden" aria-labelledby="answers-title">
				<header
					class="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 px-5 py-4"
				>
					<h2 id="answers-title" class="text-[15px] font-semibold">
						Doğru ve yanlış cevapların özeti
					</h2>
					<p class="text-[13px] text-ink-500">
						<span class="font-semibold text-success-700">{{ score.correct }} doğru</span> ·
						<span class="font-semibold text-danger-700"
							>{{ score.total - score.correct }} yanlış</span
						>
					</p>
				</header>
				<ol class="divide-y divide-ink-100" role="list">
					<li v-for="(r, i) in score.results" :key="r.questionId" class="px-5 py-4">
						<div class="flex gap-3">
							<CircleCheck
								v-if="r.correct"
								:size="18"
								class="mt-0.5 shrink-0 text-success-600"
								aria-label="Doğru"
							/>
							<CircleX
								v-else
								:size="18"
								class="mt-0.5 shrink-0 text-danger-600"
								aria-label="Yanlış"
							/>
							<div class="min-w-0 flex-1">
								<p class="text-[14.5px] font-medium text-ink-900">
									<span class="text-ink-500">{{ i + 1 }}.</span>{{ ' ' }}
									<RichText :text="QUIZ_QUESTIONS[i].prompt" />
								</p>
								<p class="mt-1 text-[13px] text-ink-600">
									<span class="text-ink-500">Cevabınız:</span>{{ ' ' }}
									<RichText :text="optionText(r.questionId, r.selected)" />
								</p>
								<p v-if="!r.correct" class="mt-0.5 text-[13px] text-success-700">
									<span class="text-ink-500">Doğru cevap:</span>{{ ' ' }}
									<RichText :text="optionText(r.questionId, QUIZ_QUESTIONS[i].correct)" />
								</p>
								<button
									type="button"
									class="mt-1.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-brand-700 hover:text-brand-800"
									:aria-expanded="openExplanations.has(r.questionId)"
									@click="toggleExplanation(r.questionId)"
								>
									Açıklama
									<ChevronDown
										:size="14"
										:class="[
											'transition-transform',
											openExplanations.has(r.questionId) && 'rotate-180',
										]"
										aria-hidden="true"
									/>
								</button>
								<RichText
									v-if="openExplanations.has(r.questionId)"
									as="p"
									:text="QUIZ_QUESTIONS[i].explanation"
									class="mt-1.5 rounded-lg bg-ink-50 px-3 py-2 text-[13px] leading-relaxed text-ink-700"
								/>
							</div>
						</div>
					</li>
				</ol>
			</section>
		</template>
	</div>
</template>
