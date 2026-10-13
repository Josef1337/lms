<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { ArrowRight, CircleCheck, CircleX, RotateCcw, Target, UserRound } from 'lucide-vue-next'
import { getScenario, type ScenarioOption } from '@/content/datasets/scenarios'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import AppTile from '@/components/ui/AppTile.vue'
import DraftText from '@/components/ui/DraftText.vue'
import RichText from '@/components/ui/RichText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'

const props = defineProps<{ taskId?: string; scenarioId: string }>()
const progress = useProgress()

const scenario = computed(() => getScenario(props.scenarioId)!)
const stepIndex = ref(0)
const picks = ref<Record<string, string[]>>({})
const panel = ref<HTMLElement | null>(null)

const finished = computed(() => stepIndex.value >= scenario.value.steps.length)
const step = computed(
	() => scenario.value.steps[Math.min(stepIndex.value, scenario.value.steps.length - 1)]
)
const stepPicks = computed(() => picks.value[step.value.id] ?? [])
const solved = (stepId: string) => {
	const s = scenario.value.steps.find((x) => x.id === stepId)!
	return (picks.value[stepId] ?? []).some((id) => s.options.find((o) => o.id === id)?.correct)
}
const lastPick = computed<ScenarioOption | null>(() => {
	const id = stepPicks.value[stepPicks.value.length - 1]
	return step.value.options.find((o) => o.id === id) ?? null
})

function pick(option: ScenarioOption) {
	if (solved(step.value.id) || stepPicks.value.includes(option.id)) return
	picks.value = { ...picks.value, [step.value.id]: [...stepPicks.value, option.id] }
}

async function next() {
	stepIndex.value += 1
	if (finished.value) record()
	await nextTick()
	panel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function record() {
	if (!props.taskId) return
	const firstTry = scenario.value.steps.filter(
		(s) => s.options.find((o) => o.id === picks.value[s.id]?.[0])?.correct
	).length
	progress.recordTask(props.taskId, {
		correct: firstTry === scenario.value.steps.length,
		score: firstTry / scenario.value.steps.length,
		answer: Object.fromEntries(Object.entries(picks.value).map(([k, v]) => [k, v[0]])),
	})
}

function restart() {
	stepIndex.value = 0
	picks.value = {}
}

const firstTryCount = computed(
	() =>
		scenario.value.steps.filter(
			(s) => s.options.find((o) => o.id === picks.value[s.id]?.[0])?.correct
		).length
)
const solvedApp = (stepId: string) => {
	const s = scenario.value.steps.find((x) => x.id === stepId)!
	return s.options.find((o) => o.correct)!.app
}
</script>

<template>
	<div ref="panel" class="scroll-mt-24 space-y-4">
		<SimNotice
			text="Simülasyon: Senaryo, kişiler ve çıktılar kurgusaldır. Uygulamalar arası geçişler örnek olarak gösterilmiştir."
		/>

		<section
			class="relative overflow-hidden rounded-2xl bg-ink-900 p-5 text-white shadow-raised sm:p-6"
		>
			<div
				class="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-brand-600/30 blur-3xl"
				aria-hidden="true"
			/>
			<div class="relative">
				<p class="text-[11px] font-bold uppercase tracking-[0.1em] text-white/55">Senaryo</p>
				<h3 class="mt-1 text-[20px] font-bold text-white">{{ scenario.title }}</h3>
				<p class="mt-2 flex items-center gap-1.5 text-[13px] text-white/70">
					<UserRound :size="14" aria-hidden="true" /> Rolünüz: {{ scenario.role }}
				</p>
				<p class="mt-2 max-w-[70ch] text-[14px] leading-relaxed text-white/80">
					{{ scenario.context }}
				</p>
				<p class="mt-3 flex items-start gap-1.5 text-[13px] text-lagoon-200">
					<Target :size="14" class="mt-0.5 shrink-0" aria-hidden="true" /> {{ scenario.goal }}
				</p>
				<ol
					class="mt-5 flex flex-wrap items-center gap-2"
					role="list"
					aria-label="Senaryo adımları"
				>
					<li v-for="(s, i) in scenario.steps" :key="s.id" class="flex items-center gap-2">
						<span
							:class="[
								'flex items-center gap-2 rounded-full py-1 pe-3 ps-1 text-[12.5px] font-semibold ring-1',
								solved(s.id)
									? 'bg-white/10 text-white ring-white/20'
									: i === stepIndex
									? 'bg-white text-ink-900 ring-white'
									: 'bg-transparent text-white/50 ring-white/15',
							]"
						>
							<AppTile v-if="solved(s.id)" :visual="solvedApp(s.id)" size="xs" />
							<span
								v-else
								class="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-[11px]"
								aria-hidden="true"
								>{{ i + 1 }}</span
							>
							<span class="hidden sm:inline">{{ s.title }}</span>
							<span class="sr-only sm:hidden">{{ i + 1 }}. adım: {{ s.title }}</span>
						</span>
						<ArrowRight
							v-if="i < scenario.steps.length - 1"
							:size="14"
							class="text-white/30 rtl:-scale-x-100"
							aria-hidden="true"
						/>
					</li>
				</ol>
			</div>
		</section>

		<section
			v-if="!finished"
			:key="step.id"
			class="card animate-fade-up p-4 sm:p-5"
			:aria-label="`Adım ${stepIndex + 1}: ${step.title}`"
		>
			<p class="eyebrow">Adım {{ stepIndex + 1 }} / {{ scenario.steps.length }}</p>
			<h4 class="mt-1 text-[18px] font-semibold">{{ step.title }}</h4>
			<p class="mt-1 text-[13.5px] text-ink-600">
				Bu adım için hangi uygulamayı ve hangi prompt’u kullanırsınız?
			</p>
			<div class="mt-4 space-y-2.5" role="radiogroup" :aria-label="step.title">
				<button
					v-for="o in step.options"
					:key="o.id"
					type="button"
					role="radio"
					:aria-checked="stepPicks.includes(o.id)"
					:disabled="solved(step.id) && !o.correct"
					:class="[
						'option-card items-start disabled:cursor-default',
						stepPicks.includes(o.id)
							? o.correct
								? 'border-success-600/60 bg-success-50'
								: 'border-danger-600/40 bg-danger-50/70'
							: solved(step.id)
							? 'opacity-50'
							: '',
					]"
					@click="pick(o)"
				>
					<AppTile :visual="o.app" size="sm" />
					<span class="min-w-0 flex-1">
						<span class="block text-[12.5px] font-semibold text-ink-500">{{ o.appLabel }}</span>
						<span class="mt-0.5 block text-[14.5px] text-ink-800">“{{ o.prompt }}”</span>
					</span>
					<CircleCheck
						v-if="stepPicks.includes(o.id) && o.correct"
						:size="18"
						class="mt-1 shrink-0 text-success-700"
						aria-label="Doğru seçim"
					/>
					<CircleX
						v-else-if="stepPicks.includes(o.id)"
						:size="18"
						class="mt-1 shrink-0 text-danger-600"
						aria-label="Yanlış seçim"
					/>
				</button>
			</div>

			<div v-if="lastPick" :key="lastPick.id" class="mt-4 animate-fade-in" role="status">
				<div
					:class="[
						'rounded-xl border px-3.5 py-3 text-[14px] leading-relaxed',
						lastPick.correct
							? 'border-success-100 bg-success-50'
							: 'border-danger-100 bg-danger-50',
					]"
				>
					<p class="font-semibold text-ink-900">
						{{ lastPick.correct ? 'Doğru seçim.' : 'Bu seçim bu adım için uygun değil.' }}
					</p>
					<p class="mt-0.5 text-ink-700">{{ lastPick.feedback }}</p>
					<p v-if="!lastPick.correct" class="mt-1 text-[12.5px] text-ink-500">
						Başka bir seçeneği deneyin.
					</p>
				</div>
				<AppFrame
					v-if="lastPick.correct"
					:visual="step.output.app"
					:title="step.output.title"
					subtitle="Simüle edilmiş çıktı"
					class="mt-3"
				>
					<ul
						class="space-y-1.5 px-4 py-3.5 text-[13.5px] leading-relaxed text-ink-700"
						role="list"
					>
						<li v-for="(l, i) in step.output.lines" :key="i" class="flex gap-2">
							<span
								class="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-500"
								aria-hidden="true"
							/>
							<DraftText :text="l" />
						</li>
					</ul>
				</AppFrame>
				<button v-if="lastPick.correct" type="button" class="btn btn-primary mt-4" @click="next">
					{{
						stepIndex < scenario.steps.length - 1
							? `Sonraki adım: ${scenario.steps[stepIndex + 1].title}`
							: 'Senaryoyu tamamla'
					}}
					<ArrowRight :size="16" class="rtl:-scale-x-100" aria-hidden="true" />
				</button>
			</div>
		</section>

		<section v-else class="card animate-pop p-5 sm:p-6" aria-live="polite">
			<p
				class="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.08em] text-success-700"
			>
				<CircleCheck :size="16" aria-hidden="true" /> Senaryo tamamlandı
			</p>
			<h4 class="mt-1 text-[19px] font-bold">İş akışınız</h4>
			<ol class="mt-4 flex flex-wrap items-center gap-2" role="list">
				<li v-for="(s, i) in scenario.steps" :key="s.id" class="flex items-center gap-2">
					<span
						class="flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pe-3 ps-1.5 shadow-card"
					>
						<AppTile :visual="solvedApp(s.id)" size="sm" />
						<span class="text-[13px] font-semibold text-ink-800">{{ s.title }}</span>
					</span>
					<ArrowRight
						v-if="i < scenario.steps.length - 1"
						:size="15"
						class="text-ink-300 rtl:-scale-x-100"
						aria-hidden="true"
					/>
				</li>
			</ol>
			<p class="mt-4 text-[14px] text-ink-600">
				İlk denemede doğru seçim:
				<strong class="font-semibold text-ink-900"
					>{{ firstTryCount }}/{{ scenario.steps.length }}</strong
				>
			</p>
			<ul class="mt-3 space-y-2" role="list">
				<li
					v-for="(w, i) in scenario.wrapUp"
					:key="i"
					class="flex gap-2.5 text-[14px] leading-relaxed text-ink-700"
				>
					<CircleCheck :size="16" class="mt-0.5 shrink-0 text-success-600" aria-hidden="true" />
					<RichText :text="w" />
				</li>
			</ul>
			<button type="button" class="btn btn-ghost btn-sm mt-4" @click="restart">
				<RotateCcw :size="14" aria-hidden="true" /> Senaryoyu baştan oyna
			</button>
		</section>
	</div>
</template>
