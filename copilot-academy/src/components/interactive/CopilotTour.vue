<script setup lang="ts">
// Clickable tour of the Microsoft 365 Copilot home screen. Each badge sits at
// a percentage of the screenshot, so it stays on its spot at every width. On
// wide screens the card floats next to the highlighted area; on narrow ones it
// drops below the image, which keeps a minimum width and scrolls sideways.
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue'
import {
	Check,
	ChevronLeft,
	ChevronRight,
	CircleCheck,
	MoveHorizontal,
	RotateCcw,
	TriangleAlert,
	X,
} from 'lucide-vue-next'
import shotUrl from '@/assets/tour/copilot-home.png'
import { TOUR_IMAGE_SIZE as IMG, TOUR_STOPS } from '@/content/datasets/copilotTour'
import { useProgress } from '@/stores/progress'
import CopyButton from '@/components/ui/CopyButton.vue'
import TaskGoal from './TaskGoal.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()
const uid = useId()
const cardId = `${uid}-card`
const titleId = `${uid}-title`
const stopsId = `${uid}-stops`

/** Below this frame width the card leaves the image and sits under it. */
const OVERLAY_MIN = 760
const LAST = TOUR_STOPS.length - 1
const LABEL = 'text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500'
const CORE_IDS = TOUR_STOPS.filter((s) => s.kind === 'core').map((s) => s.id)

// ------------------------------------------------------------ state

const savedIds = (key: 'seen' | 'tried'): string[] => {
	const answer = props.taskId ? progress.taskResult(props.taskId)?.answer : undefined
	if (!answer || typeof answer !== 'object' || Array.isArray(answer)) return []
	const list = answer[key]
	return Array.isArray(list)
		? list.filter((id): id is string => TOUR_STOPS.some((s) => s.id === id))
		: []
}

/** Open stop, or null while the card is closed. */
const current = ref<number | null>(null)
/** Last stop shown; the arrow keys carry on from it after the card closes. */
const last = ref(0)
const seen = ref(new Set<string>(savedIds('seen')))
const tried = ref(new Set<string>(savedIds('tried')))
const stop = computed(() => (current.value === null ? null : TOUR_STOPS[current.value]))
const seenCore = computed(() => CORE_IDS.filter((id) => seen.value.has(id)).length)
const done = computed(() => !!props.taskId && progress.isTaskDone(props.taskId))

function go(i: number) {
	if (i < 0 || i > LAST) return
	current.value = i
	last.value = i
	seen.value = new Set(seen.value).add(TOUR_STOPS[i].id)
}

function next() {
	go(last.value === LAST ? 0 : last.value + 1)
}

function prev() {
	const fromButton = document.activeElement === prevButton.value
	go(Math.max(last.value - 1, 0))
	// The button turns disabled at the first stop, which would drop focus to the page.
	if (fromButton && last.value === 0) nextTick(() => nextButton.value?.focus())
}

function hide() {
	const i = current.value
	if (i === null) return
	const focusInCard = !!card.value?.contains(document.activeElement)
	current.value = null
	// The focused control disappears with the card; hand focus back to the badge.
	if (focusInCard) nextTick(() => badgeEls.value[i]?.focus())
}

function toggleBadge(i: number) {
	if (current.value === i) hide()
	else go(i)
}

function setTried(id: string, value: boolean) {
	const next = new Set(tried.value)
	if (value) next.add(id)
	else next.delete(id)
	tried.value = next
}

const answer = () => ({ seen: [...seen.value], tried: [...tried.value] })

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, { correct: true, score: 1, answer: answer() })
}

// Once the task is stored, keep its record of seen and tried stops current.
watch([seen, tried], () => {
	if (done.value && props.taskId)
		progress.recordTask(props.taskId, { correct: true, score: 1, answer: answer() })
})

const goals = computed(() => [
	{
		label: `Kırmızı numaralı 9 durağın hepsini açın (${seenCore.value}/${CORE_IDS.length})`,
		done: seenCore.value === CORE_IDS.length,
	},
])

// ------------------------------------------------------------ layout

const stage = ref<HTMLElement>()
const frame = ref<HTMLElement>()
const shot = ref<HTMLElement>()
const card = ref<HTMLElement>()
const prevButton = ref<HTMLButtonElement>()
const nextButton = ref<HTMLButtonElement>()
const badgeEls = ref<(HTMLButtonElement | null)[]>([])

const frameWidth = ref(0)
const shotWidth = ref(0)
const shotHeight = ref(0)
const cardPos = ref({ left: 0, top: 0 })
const stagePad = ref(0)

const sheet = computed(() => frameWidth.value > 0 && frameWidth.value < OVERLAY_MIN)
const scrollable = computed(() => shotWidth.value > frameWidth.value + 1)
const badgeSize = computed(() => Math.round(Math.min(32, Math.max(22, shotWidth.value * 0.026))))

const pct = (value: number, total: number) => `${(value / total) * 100}%`
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi)
const motion = (): ScrollBehavior =>
	window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'

/** Puts the floating card beside the highlighted area, like a callout. */
function place() {
	const s = stop.value
	if (!s || sheet.value || !shot.value || !card.value) {
		stagePad.value = 0
		return
	}
	const w = shot.value.clientWidth
	const h = shot.value.clientHeight
	const sx = w / IMG.width
	const sy = h / IMG.height
	const bx = s.badge[0] * sx
	const by = s.badge[1] * sy
	const x0 = Math.min(s.box[0], s.badge[0]) * sx
	const x1 = Math.max(s.box[2], s.badge[0]) * sx
	const ya = s.box[1] * sy
	const yb = s.box[3] * sy
	const cw = card.value.offsetWidth
	const ch = card.value.offsetHeight
	const gap = 28
	const edge = 12
	const roomRight = w - x1 - gap - edge
	const roomLeft = x0 - gap - edge

	let left: number | null
	if (bx < w / 2 && roomRight >= cw) left = x1 + gap
	else if (roomLeft >= cw) left = x0 - gap - cw
	else if (roomRight >= cw) left = x1 + gap
	else left = null

	let top: number
	if (left === null) {
		// No room on either side: centre the card under the area.
		left = (x0 + x1) / 2 - cw / 2
		top = yb + gap
	} else {
		top = clamp(Math.min(by, ya) - 40, edge, Math.max(edge, h - ch - edge))
	}
	left = clamp(left, edge, w - cw - edge)

	// The image sits inside the frame border; the card is positioned in the stage.
	const offX = shot.value.offsetLeft
	const offY = shot.value.offsetTop
	cardPos.value = { left: offX + left, top: offY + top }
	const overflow = top + ch - h
	stagePad.value = overflow > 0 ? overflow + 16 : 0
}

/** On narrow screens, slides the image so the current badge is in view. */
function revealBadge() {
	const s = stop.value
	if (!s || !frame.value || !scrollable.value) return
	const x = (s.badge[0] / IMG.width) * shotWidth.value
	frame.value.scrollTo({ left: x - frame.value.clientWidth / 2, behavior: motion() })
}

function measure() {
	frameWidth.value = frame.value?.clientWidth ?? 0
	shotWidth.value = shot.value?.clientWidth ?? 0
	shotHeight.value = shot.value?.clientHeight ?? 0
}

watch([current, sheet, shotWidth, shotHeight], async () => {
	await nextTick()
	place()
	revealBadge()
})

/** Picking a stop from the list below brings the screenshot back into view. */
async function pickFromList(i: number) {
	go(i)
	await nextTick()
	const top = stage.value?.getBoundingClientRect().top ?? 0
	if (top < 64 || top > window.innerHeight * 0.4)
		stage.value?.scrollIntoView({ block: 'start', behavior: motion() })
}

// Widgets that use these keys themselves keep them while they have focus.
const OWN_KEYS =
	'textarea, select, [contenteditable="true"], [role="dialog"], [role="radiogroup"], [role="tablist"], [role="listbox"], [role="menu"], [role="slider"]'

/** Page-wide shortcuts while the tour is on screen, as in the original tour. */
function onKey(e: KeyboardEvent) {
	if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
	const t = e.target instanceof Element ? e.target : null
	if (t?.closest(OWN_KEYS)) return
	if (t instanceof HTMLInputElement && t.type !== 'checkbox') return
	const key = e.key
	let target: number | null = null
	if (key === 'ArrowRight') target = Math.min(last.value + 1, LAST)
	else if (key === 'ArrowLeft') target = Math.max(last.value - 1, 0)
	else if (/^[1-9a-dA-D]$/.test(key))
		target = TOUR_STOPS.findIndex((s) => s.id === key.toUpperCase())
	else if (key === 'Escape' && current.value !== null) {
		e.preventDefault()
		hide()
		return
	}
	if (target === null || target < 0) return
	e.preventDefault()
	go(target)
}

let observer: ResizeObserver | undefined
onMounted(() => {
	measure()
	go(0)
	document.addEventListener('keydown', onKey)
	if (typeof ResizeObserver !== 'undefined') {
		observer = new ResizeObserver(() => {
			measure()
			place()
		})
		if (frame.value) observer.observe(frame.value)
		if (shot.value) observer.observe(shot.value)
	}
})
onBeforeUnmount(() => {
	observer?.disconnect()
	document.removeEventListener('keydown', onKey)
})

const announcement = computed(() =>
	stop.value
		? `Durak ${current.value! + 1} / ${TOUR_STOPS.length}: ${stop.value.title}. ${
				stop.value.where
		  }.`
		: ''
)
</script>

<template>
	<div class="space-y-4">
		<div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
			<p class="max-w-2xl text-[14.5px] leading-relaxed text-ink-700">
				Ekrandaki numaralara tıklayın ya da
				<kbd
					class="rounded border border-b-2 border-ink-200 bg-white px-1.5 font-mono text-[12px] text-ink-800"
					>←</kbd
				>
				<kbd
					class="rounded border border-b-2 border-ink-200 bg-white px-1.5 font-mono text-[12px] text-ink-800"
					>→</kbd
				>
				ile sırayla gezin. Kırmızı numaralar temel 9 alan, beyaz harfler sık sorulan diğer alanlar.
				Her kartın sonundaki küçük görevi kendi Copilot uygulamanızda deneyip işaretleyin.
			</p>
			<div class="flex items-center gap-3 text-[13px] text-ink-500" aria-live="polite">
				<span>Denenen</span>
				<span class="tabular-nums">
					<b class="font-display text-[20px] font-semibold text-ink-900">{{ tried.size }}</b>
					/ {{ TOUR_STOPS.length }}
				</span>
				<span class="h-1.5 w-[120px] overflow-hidden rounded-full bg-ink-200" aria-hidden="true">
					<span
						class="block h-full rounded-full bg-success-600 transition-[width] duration-300"
						:style="{ width: `${(tried.size / TOUR_STOPS.length) * 100}%` }"
					/>
				</span>
			</div>
		</div>

		<section
			ref="stage"
			class="relative scroll-mt-24"
			:style="stagePad ? { paddingBottom: `${stagePad}px` } : undefined"
			aria-label="Copilot ana ekranı"
		>
			<div
				ref="frame"
				class="overflow-x-auto overflow-y-hidden rounded-2xl border border-ink-200 bg-white shadow-card"
			>
				<!-- The screenshot is never mirrored, so its hotspots keep physical
				     left/top coordinates even in a right-to-left page. -->
				<div ref="shot" dir="ltr" class="relative min-w-[720px] overflow-hidden">
					<img
						:src="shotUrl"
						:width="IMG.width"
						:height="IMG.height"
						alt="Microsoft 365 Copilot uygulamasının ana ekranı: sol menü, üstte Work IQ ve yanıt modu, ortada mesaj kutusu ve öneri düğmeleri, sol altta profil ve ayarlar."
						draggable="false"
						class="block h-auto w-full select-none"
					/>
					<div
						v-if="stop"
						class="pointer-events-none absolute rounded-[10px] shadow-[0_0_0_9999px_rgba(20,20,22,0.45)] outline outline-[3px] outline-offset-2 outline-brand-600 transition-all duration-300 forced-colors:outline-[Highlight]"
						:style="{
							left: pct(stop.box[0], IMG.width),
							top: pct(stop.box[1], IMG.height),
							width: pct(stop.box[2] - stop.box[0], IMG.width),
							height: pct(stop.box[3] - stop.box[1], IMG.height),
						}"
						aria-hidden="true"
					/>
					<button
						v-for="(s, i) in TOUR_STOPS"
						:key="s.id"
						:ref="(el) => (badgeEls[i] = el as HTMLButtonElement | null)"
						type="button"
						:class="[
							'absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-bold leading-none transition-transform duration-150 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink-900',
							s.kind === 'core'
								? 'border-[3px] border-white bg-brand-600 text-white'
								: 'border-2 border-brand-600 bg-white text-brand-600',
							current === i
								? 'z-[2] scale-[1.18] shadow-[0_0_0_6px_rgba(230,0,0,0.35),0_3px_10px_rgba(0,0,0,0.3)]'
								: 'z-[1] shadow-[0_3px_10px_rgba(0,0,0,0.25)] hover:scale-110',
						]"
						:style="{
							left: pct(s.badge[0], IMG.width),
							top: pct(s.badge[1], IMG.height),
							width: `${badgeSize}px`,
							height: `${badgeSize}px`,
							fontSize: `${Math.round(badgeSize * 0.47)}px`,
						}"
						:aria-label="`${s.id}. ${s.title}${tried.has(s.id) ? ' (denendi)' : ''}`"
						:aria-current="current === i ? 'step' : undefined"
						:aria-controls="cardId"
						@click="toggleBadge(i)"
					>
						{{ s.id }}
						<span
							v-if="current === i"
							class="pointer-events-none absolute -inset-[9px] rounded-full border-2 border-white motion-safe:animate-ping-soft"
							aria-hidden="true"
						/>
						<span
							v-if="tried.has(s.id)"
							class="absolute -bottom-[7px] -end-[7px] flex h-[15px] w-[15px] items-center justify-center rounded-full border-[1.5px] border-white bg-success-600 text-white"
							aria-hidden="true"
						>
							<Check :size="9" :stroke-width="4" />
						</span>
					</button>
				</div>
			</div>
			<p
				v-if="scrollable"
				class="mt-2 flex items-center gap-1.5 text-[12.5px] text-ink-500"
				aria-hidden="true"
			>
				<MoveHorizontal :size="14" /> Ekranın tamamını görmek için görseli yana kaydırın.
			</p>

			<article
				v-if="stop"
				:id="cardId"
				ref="card"
				:class="[
					'grid gap-3 rounded-2xl border border-ink-200 bg-white p-4 text-ink-800 shadow-float sm:p-5',
					sheet ? 'mt-4' : 'absolute z-10 w-[min(400px,92%)] transition-[left,top] duration-300',
				]"
				:style="sheet ? undefined : { left: `${cardPos.left}px`, top: `${cardPos.top}px` }"
				:aria-labelledby="titleId"
			>
				<div class="flex items-start gap-3">
					<span
						:class="[
							'flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full text-[16px] font-bold',
							stop.kind === 'core'
								? 'bg-brand-600 text-white'
								: 'border-2 border-brand-600 bg-white text-brand-600',
						]"
						aria-hidden="true"
						>{{ stop.id }}</span
					>
					<div class="min-w-0 flex-1">
						<h3 :id="titleId" class="text-[19px] font-bold leading-tight">
							<span class="sr-only">{{ stop.id }}. </span>{{ stop.title }}
						</h3>
						<p class="mt-0.5 text-[12.5px] text-ink-500">{{ stop.where }}</p>
					</div>
					<button
						type="button"
						class="btn btn-ghost btn-sm -me-1.5 -mt-1 shrink-0 px-2"
						aria-label="Kartı kapat"
						@click="hide"
					>
						<X :size="18" aria-hidden="true" />
					</button>
				</div>

				<div class="grid gap-1">
					<p :class="LABEL">Ne işe yarar</p>
					<p class="text-[14px] leading-relaxed">{{ stop.what }}</p>
				</div>
				<div class="grid gap-1">
					<p :class="LABEL">Ne zaman kullanırım</p>
					<p class="text-[14px] leading-relaxed">{{ stop.when }}</p>
				</div>
				<div class="grid gap-1">
					<p :class="LABEL">Nasıl yapılır</p>
					<ol class="list-decimal space-y-0.5 ps-5 text-[14px] leading-relaxed marker:text-ink-500">
						<li v-for="h in stop.how" :key="h">{{ h }}</li>
					</ol>
				</div>
				<div v-if="stop.prompt" class="grid gap-1">
					<p :class="LABEL">Örnek prompt</p>
					<div class="rounded-xl border border-iris-200 bg-iris-50 p-3">
						<p class="font-mono text-[13px] leading-relaxed text-ink-800">{{ stop.prompt }}</p>
						<CopyButton class="mt-2" :text="stop.prompt" size="sm" label="Promptu kopyala" />
					</div>
				</div>
				<div class="grid gap-1">
					<p :class="LABEL">Ne göreceksiniz</p>
					<p class="text-[14px] leading-relaxed">{{ stop.expect }}</p>
				</div>
				<p
					v-if="stop.note"
					class="flex gap-2 rounded-xl border border-warning-100 bg-warning-50 px-3 py-2 text-[13.5px] leading-snug text-warning-700"
				>
					<TriangleAlert :size="15" class="mt-0.5 shrink-0" aria-hidden="true" />
					<span>{{ stop.note }}</span>
				</p>
				<label
					class="flex cursor-pointer items-start gap-2.5 rounded-xl bg-success-50 px-3 py-2.5 text-[14px] leading-snug"
				>
					<input
						type="checkbox"
						class="mt-0.5 h-[18px] w-[18px] shrink-0 accent-success-600"
						:checked="tried.has(stop.id)"
						@change="setTried(stop.id, ($event.target as HTMLInputElement).checked)"
					/>
					<span><b class="text-success-700">Siz deneyin:</b> {{ stop.tryIt }}</span>
				</label>

				<div class="flex items-center justify-between gap-3 border-t border-ink-200 pt-3">
					<span class="text-[13px] tabular-nums text-ink-500">
						{{ current! + 1 }} / {{ TOUR_STOPS.length }}
					</span>
					<div class="flex gap-2">
						<button
							ref="prevButton"
							type="button"
							class="btn btn-secondary btn-sm"
							:disabled="current === 0"
							@click="prev"
						>
							<ChevronLeft :size="15" aria-hidden="true" /> Önceki
						</button>
						<button ref="nextButton" type="button" class="btn btn-primary btn-sm" @click="next">
							<template v-if="current === LAST">
								<RotateCcw :size="15" aria-hidden="true" /> Başa dön
							</template>
							<template v-else>Sonraki <ChevronRight :size="15" aria-hidden="true" /></template>
						</button>
					</div>
				</div>
			</article>
		</section>
		<p class="sr-only" aria-live="polite">{{ announcement }}</p>

		<section :aria-labelledby="stopsId" class="space-y-3 pt-1">
			<div class="flex flex-wrap items-baseline justify-between gap-2">
				<h3 :id="stopsId" class="text-[17px] font-bold">Tur durakları</h3>
				<p class="text-[13px] text-ink-500">Temel 9 durak + 4 ek alan</p>
			</div>
			<ol class="grid gap-2 sm:grid-cols-2 xl:grid-cols-3" role="list">
				<li v-for="(s, i) in TOUR_STOPS" :key="s.id">
					<button
						type="button"
						:class="[
							'flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start text-[14px] transition',
							current === i
								? 'border-brand-600 bg-brand-50 ring-1 ring-brand-600'
								: 'border-ink-200 bg-white hover:border-ink-300 hover:bg-ink-50',
						]"
						:aria-current="current === i ? 'step' : undefined"
						@click="pickFromList(i)"
					>
						<span
							:class="[
								'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold',
								s.kind === 'core'
									? 'bg-brand-600 text-white'
									: 'border-2 border-brand-600 bg-white text-brand-600',
							]"
							aria-hidden="true"
							>{{ s.id }}</span
						>
						<span class="min-w-0 flex-1 font-medium text-ink-800">
							<span class="sr-only">{{ s.id }}. </span>{{ s.title }}
						</span>
						<CircleCheck
							v-if="tried.has(s.id)"
							:size="18"
							class="shrink-0 text-success-600"
							aria-hidden="true"
						/>
						<Check
							v-else-if="seen.has(s.id)"
							:size="16"
							class="shrink-0 text-ink-500"
							aria-hidden="true"
						/>
						<span class="sr-only">{{
							tried.has(s.id) ? '(denendi)' : seen.has(s.id) ? '(görüldü)' : ''
						}}</span>
					</button>
				</li>
			</ol>
		</section>

		<p class="text-[12.5px] leading-relaxed text-ink-500">
			Ekran görüntüsü, gerçek bir kurumun Microsoft 365 Copilot uygulamasından alınmıştır; sol
			menüdeki ajan adları o kuruma aittir ve kişisel hesap bilgileri gizlenmiştir. Menü adları ve
			yerleri; sürüme, lisansa ve kurumunuzun ayarlarına göre farklı olabilir. Görseldeki öğeler
			tıklanabilir değildir, yalnızca numaralar kartları açar.
		</p>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done>
				<CircleCheck :size="16" class="mt-0.5 shrink-0 text-success-600" aria-hidden="true" />
				Copilot ana ekranındaki temel alanları tanıdınız. A–D alanlarına ve “Siz deneyin”
				görevlerine istediğiniz zaman dönebilirsiniz.
			</template>
		</TaskGoal>
	</div>
</template>
