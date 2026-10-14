<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import {
	ArrowRight,
	CircleCheck,
	CircleX,
	FileText,
	RotateCcw,
	TriangleAlert,
} from 'lucide-vue-next'
import {
	CHAT_TURNS,
	PROJECT_UPDATE,
	PROJECT_UPDATE_TITLE,
	type PromptQualityLevel,
	type SimOption,
} from '@/content/datasets/projectUpdate'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import TaskGoal from './TaskGoal.vue'
import CopilotMark from '@/components/ui/CopilotMark.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const turnIndex = ref(0)
const history = ref<{ turnId: string; option: SimOption }[]>([])
const firstTry = ref<Record<string, string>>({})
const thread = ref<HTMLElement | null>(null)

const finished = computed(() => turnIndex.value >= CHAT_TURNS.length)
const turn = computed(() => CHAT_TURNS[Math.min(turnIndex.value, CHAT_TURNS.length - 1)])
const resolved = (turnId: string) =>
	history.value.some((h) => h.turnId === turnId && h.option.quality === 'best')
const tried = (turnId: string, optionId: string) =>
	history.value.some((h) => h.turnId === turnId && h.option.id === optionId)

const bestOf = (turnId: string) =>
	CHAT_TURNS.find((t) => t.id === turnId)!.options.find((o) => o.quality === 'best')!

async function choose(option: SimOption) {
	if (finished.value || tried(turn.value.id, option.id) || resolved(turn.value.id)) return
	history.value = [...history.value, { turnId: turn.value.id, option }]
	if (!firstTry.value[turn.value.id])
		firstTry.value = { ...firstTry.value, [turn.value.id]: option.id }
	await nextTick()
	thread.value?.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

function advance() {
	turnIndex.value += 1
}

function restart() {
	turnIndex.value = 0
	history.value = []
	firstTry.value = {}
}

const QUALITY: Record<
	PromptQualityLevel,
	{ label: string; icon: typeof CircleCheck; box: string; text: string }
> = {
	best: {
		label: 'Etkili prompt',
		icon: CircleCheck,
		box: 'border-success-100 bg-success-50',
		text: 'text-success-700',
	},
	ok: {
		label: 'Geliştirilebilir',
		icon: TriangleAlert,
		box: 'border-warning-100 bg-warning-50',
		text: 'text-warning-700',
	},
	weak: {
		label: 'Zayıf prompt',
		icon: CircleX,
		box: 'border-danger-100 bg-danger-50',
		text: 'text-danger-700',
	},
}

const goals = computed(() =>
	CHAT_TURNS.map((t) => ({ label: `${t.title}: etkili prompt’u bulun`, done: resolved(t.id) }))
)

function complete() {
	if (!props.taskId) return
	const firstBest = CHAT_TURNS.filter((t) => bestOf(t.id).id === firstTry.value[t.id]).length
	progress.recordTask(props.taskId, {
		correct: firstBest === CHAT_TURNS.length,
		score: firstBest / CHAT_TURNS.length,
		answer: { ...firstTry.value },
	})
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice />
		<div class="grid gap-4 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
			<AppFrame
				visual="word"
				:title="PROJECT_UPDATE_TITLE"
				subtitle="Kaynak metin · kurgusal"
				class="xl:sticky xl:top-20 xl:self-start"
			>
				<div
					class="max-h-[420px] space-y-3 overflow-y-auto px-4 py-4 text-[14px] leading-relaxed text-ink-700 scrollbar-thin xl:max-h-[620px]"
				>
					<p
						class="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-ink-500"
					>
						<FileText :size="13" aria-hidden="true" /> Uzun proje güncellemesi
					</p>
					<p v-for="(p, i) in PROJECT_UPDATE" :key="i">{{ p }}</p>
				</div>
			</AppFrame>

			<AppFrame visual="chat" title="Copilot Chat" subtitle="Simülasyon">
				<div class="border-b border-ink-100 px-4 py-2.5">
					<ol class="flex flex-wrap gap-1.5" role="list" aria-label="Simülasyon adımları">
						<li
							v-for="(t, i) in CHAT_TURNS"
							:key="t.id"
							:class="[
								'chip ring-1 ring-inset',
								resolved(t.id)
									? 'bg-success-50 text-success-700 ring-success-100'
									: i === turnIndex
									? 'bg-ink-900 text-white ring-ink-900'
									: 'bg-white text-ink-500 ring-ink-200',
							]"
						>
							<CircleCheck v-if="resolved(t.id)" :size="12" aria-hidden="true" />
							{{ i + 1 }}. {{ t.title }}
						</li>
					</ol>
				</div>

				<div class="space-y-4 bg-gradient-to-b from-ink-50/60 to-white px-4 py-4">
					<ol ref="thread" class="space-y-4" role="list" aria-live="polite">
						<li
							v-if="!history.length"
							class="rounded-xl border border-dashed border-ink-300 px-4 py-5 text-center text-[13px] text-ink-500"
						>
							Senaryo: Elinizde uzun bir proje güncellemesi var. Bunu yönetici özeti, riskler ve
							aksiyon maddelerine dönüştüreceksiniz. Aşağıdan ilk prompt’u seçin.
						</li>
						<li v-for="(h, i) in history" :key="i" class="animate-fade-up space-y-2.5">
							<div class="flex justify-end">
								<p
									class="max-w-[90%] rounded-2xl rounded-ee-md bg-brand-600 px-4 py-2.5 text-[14px] leading-relaxed text-white"
								>
									{{ h.option.prompt }}
								</p>
							</div>
							<div class="flex gap-2.5">
								<CopilotMark :size="28" class="mt-0.5" />
								<div
									class="min-w-0 flex-1 rounded-2xl rounded-ss-md border border-ink-200 bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-700 shadow-card"
								>
									<p class="mb-1 text-[11px] font-semibold uppercase tracking-wide text-iris-700">
										<span lang="en">Copilot</span> · simüle edilmiş yanıt
									</p>
									<p v-if="h.option.response.text">{{ h.option.response.text }}</p>
									<ul v-if="h.option.response.bullets" class="space-y-1">
										<li v-for="(b, bi) in h.option.response.bullets" :key="bi" class="flex gap-2">
											<span
												class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-500"
												aria-hidden="true"
											/>
											{{ b }}
										</li>
									</ul>
									<div v-if="h.option.response.table" class="-mx-1 overflow-x-auto scrollbar-thin">
										<table class="w-full min-w-[460px] border-collapse text-start text-[13px]">
											<thead>
												<tr class="border-b border-ink-200">
													<th
														v-for="c in h.option.response.table.columns"
														:key="c"
														scope="col"
														class="px-2 py-1.5 text-start font-semibold text-ink-800"
													>
														{{ c }}
													</th>
												</tr>
											</thead>
											<tbody>
												<tr
													v-for="(row, ri) in h.option.response.table.rows"
													:key="ri"
													class="border-b border-ink-100 align-top last:border-0"
												>
													<td
														v-for="(cell, ci) in row"
														:key="ci"
														:class="[
															'px-2 py-1.5',
															cell === 'Belirtilmedi'
																? 'font-semibold text-warning-700'
																: ci === 0
																? 'font-medium text-ink-800'
																: 'text-ink-600',
														]"
													>
														{{ cell }}
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<div
								:class="[
									'ms-9 flex gap-2 rounded-xl border px-3.5 py-2.5 text-[13px] leading-relaxed text-ink-700',
									QUALITY[h.option.quality].box,
								]"
							>
								<component
									:is="QUALITY[h.option.quality].icon"
									:size="16"
									:class="['mt-0.5 shrink-0', QUALITY[h.option.quality].text]"
									aria-hidden="true"
								/>
								<p>
									<strong :class="['font-semibold', QUALITY[h.option.quality].text]"
										>{{ QUALITY[h.option.quality].label }}.</strong
									>
									{{ h.option.coaching }}
								</p>
							</div>
						</li>
					</ol>

					<section
						v-if="!finished"
						class="rounded-2xl border border-ink-200 bg-white p-3.5 shadow-card"
						:aria-label="`Adım ${turnIndex + 1}: ${turn.title}`"
					>
						<p class="px-1 text-[13px] font-semibold text-ink-800">
							Adım {{ turnIndex + 1 }} · {{ turn.question }}
						</p>
						<div class="mt-2.5 space-y-2">
							<button
								v-for="o in turn.options"
								:key="o.id"
								type="button"
								:disabled="tried(turn.id, o.id) || resolved(turn.id)"
								:class="[
									'option-card py-2.5 text-[14px] disabled:cursor-default',
									tried(turn.id, o.id)
										? o.quality === 'best'
											? 'border-success-600/50 bg-success-50'
											: 'opacity-60'
										: resolved(turn.id)
										? 'opacity-50'
										: '',
								]"
								@click="choose(o)"
							>
								<span class="mt-0.5 shrink-0 text-[12px] font-bold text-brand-600">Prompt</span>
								<span class="min-w-0">“{{ o.prompt }}”</span>
							</button>
						</div>
						<div class="mt-3 flex flex-wrap items-center gap-3 px-1">
							<button
								v-if="resolved(turn.id)"
								type="button"
								class="btn btn-primary btn-sm"
								@click="advance"
							>
								{{
									turnIndex < CHAT_TURNS.length - 1
										? `Sonraki adım: ${CHAT_TURNS[turnIndex + 1].title}`
										: 'Sonucu gör'
								}}
								<ArrowRight :size="15" class="rtl:-scale-x-100" aria-hidden="true" />
							</button>
							<p
								v-else-if="history.some((h) => h.turnId === turn.id)"
								class="text-[12.5px] text-ink-500"
							>
								Diğer seçenekleri de deneyerek farkı görün; etkili prompt’u bulduğunuzda bir sonraki
								adıma geçebilirsiniz.
							</p>
						</div>
					</section>

					<section
						v-else
						class="animate-fade-up rounded-2xl border border-success-100 bg-white p-4 shadow-card"
					>
						<p class="flex items-center gap-2 text-[14px] font-semibold text-success-700">
							<CircleCheck :size="17" aria-hidden="true" /> Yöneticiye hazır, doğrulanmış taslak
						</p>
						<p class="mt-1 text-[13px] text-ink-500">
							Bu simülasyon hiçbir yere gönderim yapmaz. Gerçek hayatta bu taslağı gözden geçirip
							kendi kanalınızdan paylaşırsınız.
						</p>
						<h4 class="mt-3 text-[13.5px] font-semibold">Yönetici özeti</h4>
						<ul class="mt-1 list-disc space-y-0.5 ps-5 text-[13px] text-ink-700">
							<li v-for="b in bestOf('ozet').response.bullets" :key="b">{{ b }}</li>
						</ul>
						<h4 class="mt-3 text-[13.5px] font-semibold">Öne çıkan riskler</h4>
						<p class="mt-1 text-[13px] text-ink-700">
							{{
								bestOf('riskler')
									.response.table!.rows.map((r) => r[0])
									.join(' · ')
							}}
						</p>
						<h4 class="mt-3 text-[13.5px] font-semibold">Netleştirilecek aksiyonlar</h4>
						<p class="mt-1 text-[13px] text-ink-700">
							{{
								bestOf('aksiyonlar')
									.response.table!.rows.filter((r) => r[1] === 'Belirtilmedi')
									.map((r) => r[0])
									.join(' · ')
							}}
						</p>
						<button type="button" class="btn btn-ghost btn-sm mt-3" @click="restart">
							<RotateCcw :size="14" aria-hidden="true" /> Simülasyonu baştan oyna
						</button>
					</section>
				</div>
			</AppFrame>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Karmaşık bir işi dört adımda, her adımı kontrol ederek tamamladınız.</template
			>
		</TaskGoal>
	</div>
</template>
