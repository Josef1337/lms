<script setup lang="ts">
import { computed, ref } from 'vue'
import { Columns2, FileText, WandSparkles } from 'lucide-vue-next'
import { MESSY_FILE, MESSY_TEXT, REWRITES, type Rewrite } from '@/content/datasets/word'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import RichText from '@/components/ui/RichText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import TaskGoal from './TaskGoal.vue'
import BrandText from '@/components/ui/BrandText.vue'
import CopilotMark from '@/components/ui/CopilotMark.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

type View = 'original' | 'result' | 'compare'
const activeId = ref<string | null>(null)
const view = ref<View>('original')
const tried = ref<Set<string>>(new Set())
const compared = ref(false)

const active = computed<Rewrite | null>(() => REWRITES.find((r) => r.id === activeId.value) ?? null)
const originalWords = MESSY_TEXT.join(' ').split(/\s+/).length
const resultWords = computed(() => {
	const r = active.value
	if (!r) return 0
	const text = [
		...(r.paragraphs ?? []),
		...(r.bullets ?? []),
		...(r.table?.rows.flat() ?? []),
	].join(' ')
	return text.replace(/\*\*/g, '').split(/\s+/).filter(Boolean).length
})

function apply(id: string) {
	activeId.value = id
	view.value = 'result'
	tried.value = new Set(tried.value).add(id)
}

function setView(v: View) {
	if (v !== 'original' && !active.value) return
	view.value = v
	if (v === 'compare') compared.value = true
}

const goals = computed(() => [
	{ label: 'En az üç farklı dönüşümü deneyin', done: tried.value.size >= 3 },
	{
		label: 'Özgün ve iyileştirilmiş metni “Karşılaştır” görünümünde inceleyin',
		done: compared.value,
	},
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, {
		correct: true,
		score: 1,
		answer: { tried: [...tried.value] },
	})
}

const VIEWS: { id: View; label: string }[] = [
	{ id: 'original', label: 'Özgün metin' },
	{ id: 'result', label: 'Copilot önerisi' },
	{ id: 'compare', label: 'Karşılaştır' },
]
</script>

<template>
	<div class="space-y-4">
		<SimNotice
			text="Simülasyon: Dönüşümler önceden hazırlanmıştır. Gerçek Word’de öneriyi kabul etmeden önce gözden geçirirsiniz."
		/>
		<AppFrame
			visual="word"
			:title="MESSY_FILE"
			subtitle="Dağınık bir iş notu"
			:tools="['Giriş', 'Ekle', 'Düzen', 'Gözden Geçir', 'Copilot']"
		>
			<div class="grid lg:grid-cols-[minmax(0,1fr)_300px]">
				<div class="min-w-0 bg-ink-100/70 p-3 sm:p-5">
					<div class="mb-3 flex flex-wrap items-center gap-2">
						<div
							class="inline-flex rounded-xl border border-ink-200 bg-white p-1"
							role="tablist"
							aria-label="Görünüm"
						>
							<button
								v-for="v in VIEWS"
								:key="v.id"
								type="button"
								role="tab"
								:aria-selected="view === v.id"
								:disabled="v.id !== 'original' && !active"
								:class="[
									'rounded-lg px-3 py-1.5 text-[13px] font-semibold transition disabled:opacity-40',
									view === v.id ? 'bg-ink-900 text-white' : 'text-ink-600 hover:text-ink-900',
								]"
								@click="setView(v.id)"
							>
								<Columns2
									v-if="v.id === 'compare'"
									:size="14"
									class="me-1 inline"
									aria-hidden="true"
								/>{{ v.label }}
							</button>
						</div>
						<span v-if="active" class="text-[12.5px] text-ink-500"
							>{{ originalWords }} → {{ resultWords }} kelime</span
						>
					</div>

					<div :class="['grid gap-3', view === 'compare' && 'md:grid-cols-2']" aria-live="polite">
						<article
							v-if="view === 'original' || view === 'compare'"
							class="rounded-md bg-white px-5 py-6 shadow-raised sm:px-7"
							aria-label="Özgün metin"
						>
							<p
								class="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500"
							>
								<FileText :size="12" aria-hidden="true" /> Özgün metin
							</p>
							<div class="space-y-2.5 text-[14.5px] leading-relaxed text-ink-600">
								<p v-for="(p, i) in MESSY_TEXT" :key="i">{{ p }}</p>
							</div>
						</article>
						<article
							v-if="active && (view === 'result' || view === 'compare')"
							:key="active.id"
							class="animate-fade-in rounded-md bg-white px-5 py-6 shadow-raised ring-2 ring-app-word/20 sm:px-7"
							aria-label="Copilot önerisi"
						>
							<p
								class="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-app-word"
							>
								<CopilotMark :size="14" /> <span lang="en">Copilot</span> önerisi ·
								<BrandText :text="active.label" />
							</p>
							<div
								v-if="active.paragraphs"
								class="space-y-2.5 text-[14.5px] leading-relaxed text-ink-800"
							>
								<RichText v-for="(p, i) in active.paragraphs" :key="i" as="p" :text="p" />
							</div>
							<ul
								v-if="active.bullets"
								class="space-y-1.5 text-[14.5px] leading-relaxed text-ink-800"
								role="list"
							>
								<li v-for="(b, i) in active.bullets" :key="i" class="flex gap-2">
									<span
										class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-app-word"
										aria-hidden="true"
									/>{{ b }}
								</li>
							</ul>
							<div v-if="active.table" class="-mx-2 overflow-x-auto scrollbar-thin">
								<table class="w-full min-w-[440px] border-collapse text-start text-[13.5px]">
									<thead>
										<tr class="bg-ink-50">
											<th
												v-for="c in active.table.columns"
												:key="c"
												scope="col"
												class="border border-ink-200 px-2.5 py-1.5 text-start font-semibold"
											>
												{{ c }}
											</th>
										</tr>
									</thead>
									<tbody>
										<tr v-for="(row, ri) in active.table.rows" :key="ri">
											<td
												v-for="(cell, ci) in row"
												:key="ci"
												:class="[
													'border border-ink-200 px-2.5 py-1.5 align-top',
													cell === 'Belirtilmedi'
														? 'font-semibold text-warning-700'
														: 'text-ink-700',
												]"
											>
												{{ cell }}
											</td>
										</tr>
									</tbody>
								</table>
							</div>
						</article>
					</div>
				</div>

				<aside
					class="border-t border-ink-200 bg-white lg:border-s lg:border-t-0"
					aria-label="Copilot bölmesi"
				>
					<div class="flex items-center gap-2 border-b border-ink-100 px-4 py-3">
						<CopilotMark :size="22" />
						<p class="text-[13.5px] font-semibold">Copilot</p>
					</div>
					<div class="space-y-3 p-4">
						<p class="text-[12.5px] font-medium text-ink-500">Bu metni nasıl dönüştürelim?</p>
						<div class="space-y-1.5">
							<button
								v-for="r in REWRITES"
								:key="r.id"
								type="button"
								:aria-pressed="activeId === r.id"
								:class="[
									'flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-start text-[13.5px] font-semibold transition',
									activeId === r.id
										? 'border-app-word bg-[#185abd]/[.06] text-ink-900'
										: tried.has(r.id)
										? 'border-ink-200 bg-ink-50 text-ink-700'
										: 'border-ink-200 bg-white text-ink-800 hover:border-brand-300',
								]"
								@click="apply(r.id)"
							>
								<WandSparkles :size="14" class="shrink-0 text-app-word" aria-hidden="true" />
								{{ r.label }}
							</button>
						</div>
						<template v-if="active">
							<div
								class="rounded-lg bg-iris-50 px-3 py-2.5 text-[12.5px] leading-relaxed text-iris-800"
							>
								<span class="font-semibold">Prompt:</span> “{{ active.prompt }}”
							</div>
							<div>
								<p class="text-[12.5px] font-semibold text-ink-800">Ne değişti?</p>
								<ul
									class="mt-1.5 space-y-1.5 text-[12.5px] leading-relaxed text-ink-600"
									role="list"
								>
									<li v-for="c in active.changes" :key="c" class="flex gap-2">
										<span
											class="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-ink-400"
											aria-hidden="true"
										/>{{ c }}
									</li>
								</ul>
							</div>
						</template>
					</div>
				</aside>
			</div>
		</AppFrame>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Aynı içeriğin farklı amaçlar için nasıl dönüştürülebileceğini gördünüz ve anlamın korunup
				korunmadığını karşılaştırdınız.</template
			>
		</TaskGoal>
	</div>
</template>
