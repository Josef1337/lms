<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import {
	ChevronLeft,
	ChevronRight,
	Image,
	MessageSquareText,
	Presentation,
	Sparkles,
} from 'lucide-vue-next'
import { DECKS, DECK_STYLES, PPT_REPORT, type DeckStyle } from '@/content/datasets/presentation'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import DraftText from '@/components/ui/DraftText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import SegmentedControl from './SegmentedControl.vue'
import SlideVisual from './SlideVisual.vue'
import TaskGoal from './TaskGoal.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const style = ref<DeckStyle>('yonetici')
const deckStyle = ref<DeckStyle | null>(null)
const revealed = ref(0)
const selected = ref(0)
const generated = ref<Set<DeckStyle>>(new Set())
const viewed = ref<Record<string, number[]>>({})
let timer: ReturnType<typeof setInterval> | undefined

const styleMeta = computed(() => DECK_STYLES.find((s) => s.id === style.value)!)
const deck = computed(() => (deckStyle.value ? DECKS[deckStyle.value] : []))
const slide = computed(() => deck.value[selected.value])
const generating = computed(() => !!deckStyle.value && revealed.value < deck.value.length)

const THEME: Record<DeckStyle, { accent: string; soft: string; frame: string; title: string }> = {
	yonetici: { accent: '#c43e1c', soft: '#fbe3dc', frame: 'bg-white', title: 'text-ink-900' },
	veri: { accent: '#2a78d6', soft: '#dcebfb', frame: 'bg-white', title: 'text-ink-900' },
	egitim: { accent: '#088985', soft: '#cff8f3', frame: 'bg-[#f3fbfa]', title: 'text-lagoon-900' },
}

function markViewed(index: number) {
	if (!deckStyle.value) return
	const list = viewed.value[deckStyle.value] ?? []
	if (!list.includes(index)) viewed.value = { ...viewed.value, [deckStyle.value]: [...list, index] }
}

function generate() {
	clearInterval(timer)
	deckStyle.value = style.value
	selected.value = 0
	revealed.value = 0
	generated.value = new Set(generated.value).add(style.value)
	viewed.value = { ...viewed.value, [style.value]: [] }
	markViewed(0)
	const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
	if (reduce) {
		revealed.value = DECKS[style.value].length
		return
	}
	revealed.value = 1
	timer = setInterval(() => {
		revealed.value += 1
		if (revealed.value >= DECKS[style.value].length) clearInterval(timer)
	}, 260)
}

function select(i: number) {
	if (i < 0 || i >= revealed.value) return
	selected.value = i
	markViewed(i)
}

onBeforeUnmount(() => clearInterval(timer))

const anyFullyViewed = computed(() => Object.values(viewed.value).some((v) => v.length === 5))
const goals = computed(() => [
	{ label: 'İki farklı stilde sunum taslağı oluşturun', done: generated.value.size >= 2 },
	{ label: 'Bir taslağın beş slaytının hepsini inceleyin', done: anyFullyViewed.value },
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, { correct: true, score: 1, answer: [...generated.value] })
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice
			text="Simülasyon: Bu stüdyo gerçek bir PowerPoint dosyası üretmez. Slaytlar, rapordaki bilgilerle önceden hazırlanmış örneklerdir."
		/>
		<div class="grid gap-4 xl:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
			<AppFrame
				visual="word"
				:title="PPT_REPORT.file"
				subtitle="Kaynak rapor · kurgusal"
				class="xl:sticky xl:top-20 xl:self-start"
			>
				<article
					class="max-h-[460px] space-y-3 overflow-y-auto px-4 py-4 scrollbar-thin xl:max-h-[640px]"
				>
					<h3 class="text-[16px] font-bold leading-snug">{{ PPT_REPORT.title }}</h3>
					<section v-for="s in PPT_REPORT.sections" :key="s.heading">
						<h4 class="text-[13px] font-semibold text-app-word">{{ s.heading }}</h4>
						<p class="mt-0.5 text-[13.5px] leading-relaxed text-ink-700">{{ s.text }}</p>
					</section>
				</article>
			</AppFrame>

			<AppFrame
				visual="powerpoint"
				title="Sunum stüdyosu"
				subtitle="Copilot ile sunum taslağı"
				:tools="['Giriş', 'Ekle', 'Tasarım', 'Slayt Gösterisi', 'Copilot']"
			>
				<div class="space-y-4 p-4">
					<div class="flex flex-wrap items-end gap-4">
						<SegmentedControl
							v-model="style"
							label="Sunum stili"
							:options="DECK_STYLES.map((s) => ({ value: s.id, label: s.label }))"
						/>
						<p class="pb-1.5 text-[12.5px] text-ink-500">{{ styleMeta.audience }}</p>
					</div>
					<p
						class="rounded-xl border border-iris-200 bg-iris-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-iris-900"
					>
						<span class="font-semibold">Prompt:</span> “{{ styleMeta.prompt }}”
					</p>
					<button type="button" class="btn btn-primary" :disabled="generating" @click="generate">
						<Sparkles :size="16" aria-hidden="true" />
						{{
							generating
								? 'Slaytlar oluşturuluyor…'
								: deckStyle === style
								? 'Taslağı yeniden oluştur'
								: 'Sunum taslağı oluştur'
						}}
					</button>

					<div
						v-if="!deckStyle"
						class="flex flex-col items-center gap-2 rounded-xl border border-dashed border-ink-300 px-4 py-12 text-center text-[13.5px] text-ink-500"
					>
						<Presentation :size="26" class="text-app-powerpoint/60" aria-hidden="true" />
						Bir stil seçip “Sunum taslağı oluştur” düğmesine basın. Copilot, kaynak rapordan 5
						slaytlık bir taslak hazırlar.
					</div>

					<template v-else>
						<p
							v-if="deckStyle !== style"
							class="rounded-lg bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700"
						>
							Gösterilen taslak “{{ DECK_STYLES.find((s) => s.id === deckStyle)!.label }}” stilinde.
							Seçtiğiniz stille görmek için taslağı yeniden oluşturun.
						</p>

						<!-- Thumbnails -->
						<ol class="grid grid-cols-5 gap-2" role="list" aria-label="Slaytlar">
							<li v-for="(s, i) in deck" :key="`${deckStyle}-${i}`">
								<button
									v-if="i < revealed"
									type="button"
									:aria-current="selected === i ? 'true' : undefined"
									:aria-label="`Slayt ${i + 1}: ${s.title}`"
									:class="[
										'flex aspect-video w-full animate-pop flex-col justify-between overflow-hidden rounded-md border p-1.5 text-start transition',
										THEME[deckStyle].frame,
										selected === i
											? 'border-app-powerpoint ring-2 ring-app-powerpoint/30'
											: 'border-ink-200 hover:border-ink-300',
									]"
									@click="select(i)"
								>
									<span
										class="block h-1 w-1/3 rounded-sm"
										:style="{ background: THEME[deckStyle].accent }"
									/>
									<span
										class="line-clamp-2 text-[8.5px] font-semibold leading-tight text-ink-800"
										>{{ s.title }}</span
									>
									<span class="text-[8px] font-bold text-ink-400">{{ i + 1 }}</span>
								</button>
								<span
									v-else
									class="block aspect-video w-full animate-pulse rounded-md bg-ink-100"
									aria-hidden="true"
								/>
							</li>
						</ol>

						<!-- Selected slide -->
						<figure
							v-if="slide && selected < revealed"
							:key="`${deckStyle}-${selected}`"
							class="animate-fade-in"
						>
							<div
								:class="[
									'relative aspect-video w-full overflow-hidden rounded-xl border border-ink-200 shadow-raised',
									THEME[deckStyle].frame,
								]"
								role="img"
								:aria-label="`Slayt ${selected + 1}: ${slide.title}. ${slide.bullets.join('. ')}`"
							>
								<div
									class="absolute inset-x-0 top-0 h-1.5"
									:style="{ background: THEME[deckStyle].accent }"
								/>
								<div class="flex h-full flex-col p-[4.5%]">
									<p
										class="text-[clamp(8px,1.4vw,11px)] font-semibold uppercase tracking-wide text-ink-400"
									>
										{{ selected + 1 }} / 5 · {{ slide.section }}
									</p>
									<p
										:class="[
											'mt-[1.5%] font-display text-[clamp(13px,2.4vw,22px)] font-bold leading-tight',
											THEME[deckStyle].title,
										]"
									>
										{{ slide.title }}
									</p>
									<div class="mt-[3%] grid min-h-0 flex-1 grid-cols-[1.25fr_1fr] gap-[4%]">
										<ul class="space-y-[3%] text-[clamp(9px,1.5vw,14px)] leading-snug text-ink-700">
											<li v-for="(b, bi) in slide.bullets" :key="bi" class="flex gap-2">
												<span
													v-if="deckStyle === 'egitim'"
													class="mt-[1px] flex h-[1.4em] w-[1.4em] shrink-0 items-center justify-center rounded-full text-[0.75em] font-bold text-white"
													:style="{ background: THEME[deckStyle].accent }"
													>{{ bi + 1 }}</span
												>
												<span
													v-else
													class="mt-[0.5em] h-[0.4em] w-[0.4em] shrink-0 rounded-full"
													:style="{ background: THEME[deckStyle].accent }"
												/>
												<DraftText :text="b" />
											</li>
										</ul>
										<div class="rounded-lg bg-ink-50/80 p-[6%]">
											<SlideVisual
												:kind="slide.visual.kind"
												:accent="THEME[deckStyle].accent"
												:soft="THEME[deckStyle].soft"
											/>
										</div>
									</div>
								</div>
							</div>
							<figcaption class="mt-3 grid gap-3 md:grid-cols-2">
								<div class="rounded-xl border border-ink-200 bg-white p-3.5">
									<p class="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-800">
										<Image :size="14" class="text-app-powerpoint" aria-hidden="true" /> Görsel
										önerisi
									</p>
									<p class="mt-1 text-[13px] leading-relaxed text-ink-600">
										{{ slide.visual.text }}
									</p>
								</div>
								<div class="rounded-xl border border-ink-200 bg-white p-3.5">
									<p class="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-800">
										<MessageSquareText :size="14" class="text-app-powerpoint" aria-hidden="true" />
										Konuşmacı notları
									</p>
									<DraftText
										as="p"
										:text="slide.notes"
										class="mt-1 block text-[13px] leading-relaxed text-ink-600"
									/>
								</div>
							</figcaption>
						</figure>

						<div class="flex items-center justify-between">
							<button
								type="button"
								class="btn btn-secondary btn-sm"
								:disabled="selected === 0"
								@click="select(selected - 1)"
							>
								<ChevronLeft :size="15" class="rtl:-scale-x-100" aria-hidden="true" /> Önceki slayt
							</button>
							<span class="text-[12.5px] text-ink-500" aria-live="polite"
								>Slayt {{ selected + 1 }} / {{ deck.length }}</span
							>
							<button
								type="button"
								class="btn btn-secondary btn-sm"
								:disabled="selected >= revealed - 1"
								@click="select(selected + 1)"
							>
								Sonraki slayt
								<ChevronRight :size="15" class="rtl:-scale-x-100" aria-hidden="true" />
							</button>
						</div>
					</template>
				</div>
			</AppFrame>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Aynı raporun farklı hedef kitleler için nasıl farklı sunumlara dönüştüğünü
				gördünüz.</template
			>
		</TaskGoal>
	</div>
</template>
