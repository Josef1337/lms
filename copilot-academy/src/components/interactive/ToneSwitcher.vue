<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleCheck, CircleX, Sparkles, TriangleAlert } from 'lucide-vue-next'
import { TONE_SCENARIO, TONE_VARIANTS } from '@/content/datasets/outlook'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import DraftText from '@/components/ui/DraftText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import TaskGoal from './TaskGoal.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const activeId = ref(TONE_VARIANTS[0].id)
const tried = ref<Set<string>>(new Set([TONE_VARIANTS[0].id]))
const active = computed(() => TONE_VARIANTS.find((t) => t.id === activeId.value)!)

function pick(id: string) {
	activeId.value = id
	tried.value = new Set(tried.value).add(id)
}

const goals = computed(() => [
	{
		label: 'En az üç farklı tonu deneyin',
		done:
			[...tried.value].filter((id) => !TONE_VARIANTS.find((t) => t.id === id)?.risky).length >= 3,
	},
	{ label: '“Fazla iddialı” taslaktaki sorunları inceleyin', done: tried.value.has('iddiali') },
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, { correct: true, score: 1, answer: [...tried.value] })
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice text="Simülasyon: Taslaklar önceden hazırlanmıştır ve hiçbir yere gönderilmez." />
		<div class="grid gap-4 xl:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
			<section class="card p-4 sm:p-5" aria-labelledby="tone-title">
				<h3 id="tone-title" class="text-[15px] font-semibold">Durum</h3>
				<p class="mt-1 text-[13.5px] text-ink-600">
					Bir müşteriye teslimat gecikmesini bildireceksiniz. Copilot’tan aynı bilgiyi farklı
					tonlarda yazmasını isteyin.
				</p>
				<p class="mt-3 text-[12px] font-semibold uppercase tracking-wide text-ink-500">
					Verilmesi gereken bilgiler
				</p>
				<ul class="mt-1.5 space-y-1.5" role="list">
					<li
						v-for="f in TONE_SCENARIO.facts"
						:key="f.id"
						:class="[
							'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[13px]',
							active.facts.includes(f.id)
								? 'bg-success-50 text-ink-800'
								: 'bg-danger-50 text-ink-800',
						]"
					>
						<CircleCheck
							v-if="active.facts.includes(f.id)"
							:size="15"
							class="shrink-0 text-success-700"
							aria-hidden="true"
						/>
						<CircleX v-else :size="15" class="shrink-0 text-danger-600" aria-hidden="true" />
						{{ f.label }}
						<span class="sr-only">{{
							active.facts.includes(f.id) ? '(taslakta var)' : '(taslakta yok)'
						}}</span>
					</li>
				</ul>
				<p class="mb-1.5 mt-4 text-[12px] font-semibold uppercase tracking-wide text-ink-500">
					Ton seçin
				</p>
				<div class="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Ton">
					<button
						v-for="t in TONE_VARIANTS"
						:key="t.id"
						type="button"
						role="radio"
						:aria-checked="activeId === t.id"
						:class="[
							'rounded-full border px-3 py-1.5 text-[13px] font-semibold transition',
							activeId === t.id
								? t.risky
									? 'border-danger-600 bg-danger-600 text-white'
									: 'border-app-outlook bg-app-outlook text-white'
								: t.risky
								? 'border-danger-100 bg-danger-50 text-danger-700 hover:border-danger-600/40'
								: 'border-ink-200 bg-white text-ink-800 hover:border-brand-300',
						]"
						@click="pick(t.id)"
					>
						{{ t.label }}
					</button>
				</div>
			</section>

			<AppFrame visual="outlook" title="Yeni ileti · taslak" subtitle="Copilot ile taslak">
				<div class="space-y-1 border-b border-ink-100 px-4 py-2.5 text-[13px]">
					<p>
						<span class="inline-block w-14 text-ink-500">Kime</span>
						<span class="text-ink-800">{{ TONE_SCENARIO.to }}</span>
					</p>
					<p>
						<span class="inline-block w-14 text-ink-500">Konu</span>
						<span class="font-medium text-ink-800">{{ TONE_SCENARIO.subject }}</span>
					</p>
				</div>
				<div :key="active.id" class="animate-fade-in space-y-3 p-4">
					<p
						class="flex items-start gap-2 rounded-lg bg-iris-50 px-3 py-2 text-[12.5px] leading-relaxed text-iris-800"
					>
						<Sparkles :size="14" class="mt-0.5 shrink-0" aria-hidden="true" />
						<span><span class="font-semibold">Prompt:</span> “{{ active.prompt }}”</span>
					</p>
					<div
						:class="[
							'space-y-2.5 rounded-xl border px-4 py-3.5 text-[14px] leading-relaxed text-ink-800',
							active.risky ? 'border-danger-100 bg-danger-50/30' : 'border-ink-200 bg-white',
						]"
					>
						<DraftText
							v-for="(p, i) in active.paragraphs"
							:key="i"
							as="p"
							:text="p"
							class="whitespace-pre-line"
						/>
					</div>
					<div
						v-if="active.issues"
						class="rounded-xl border border-danger-100 bg-danger-50 px-3.5 py-3"
						role="status"
					>
						<p class="flex items-center gap-1.5 text-[13px] font-semibold text-danger-700">
							<TriangleAlert :size="15" aria-hidden="true" /> Bu taslak gönderilmemeli
						</p>
						<ul class="mt-1.5 list-disc space-y-1 ps-5 text-[13px] text-ink-700">
							<li v-for="issue in active.issues" :key="issue">{{ issue }}</li>
						</ul>
						<p class="mt-2 text-[12.5px] text-ink-600">
							Neden oldu? Prompt bir amaç (“ikna et”) verdi ama hangi bilgilerin kullanılacağını ve
							sınırları belirtmedi.
						</p>
					</div>
					<div v-else>
						<p class="text-[12.5px] font-semibold text-ink-800">Ne değişti?</p>
						<ul class="mt-1 list-disc space-y-0.5 ps-5 text-[12.5px] text-ink-600">
							<li v-for="n in active.notes" :key="n">{{ n }}</li>
						</ul>
					</div>
				</div>
			</AppFrame>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Tonun değişebileceğini ama bilgilerin ve taahhütlerin değişmemesi gerektiğini
				gördünüz.</template
			>
		</TaskGoal>
	</div>
</template>
