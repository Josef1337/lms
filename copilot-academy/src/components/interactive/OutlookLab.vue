<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	ChevronDown,
	CircleHelp,
	FileText,
	Gavel,
	ListTodo,
	Mail,
	PenLine,
	Sparkles,
} from 'lucide-vue-next'
import {
	OUTLOOK_ACTIONS,
	THREAD,
	THREAD_ACTIONS,
	THREAD_DECISIONS,
	THREAD_DRAFT,
	THREAD_QUESTIONS,
	THREAD_SUBJECT,
	THREAD_SUMMARY,
	type OutlookAction,
	type OutlookSection,
} from '@/content/datasets/outlook'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import DraftText from '@/components/ui/DraftText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import TaskGoal from './TaskGoal.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const expanded = ref<Set<string>>(new Set([THREAD[THREAD.length - 1].id]))
const actionId = ref<OutlookAction | null>(null)
const tried = ref<Set<OutlookAction>>(new Set())

const action = computed(() => OUTLOOK_ACTIONS.find((a) => a.id === actionId.value) ?? null)
const allExpanded = computed(() => expanded.value.size === THREAD.length)

function toggle(id: string) {
	const next = new Set(expanded.value)
	if (next.has(id)) next.delete(id)
	else next.add(id)
	expanded.value = next
}

function toggleAll() {
	expanded.value = allExpanded.value ? new Set() : new Set(THREAD.map((m) => m.id))
}

function run(id: OutlookAction) {
	actionId.value = id
	tried.value = new Set(tried.value).add(id)
}

const SECTION_META: Record<OutlookSection, { title: string; icon: typeof Sparkles }> = {
	summary: { title: 'Kısa özet', icon: FileText },
	decisions: { title: 'Önemli kararlar', icon: Gavel },
	actions: { title: 'Bekleyen aksiyonlar', icon: ListTodo },
	draft: { title: 'Önerilen yanıt taslağı', icon: PenLine },
}

const draftText = THREAD_DRAFT.join('\n\n')

const goals = computed(() => [
	{ label: '“Özetle” eylemini deneyin', done: tried.value.has('ozet') },
	{ label: '“Aksiyonları çıkar” eylemini deneyin', done: tried.value.has('aksiyon') },
	{ label: '“Yanıt hazırla” eylemini deneyin', done: tried.value.has('yanit') },
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, { correct: true, score: 1, answer: [...tried.value] })
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice
			text="Simülasyon: E-posta zinciri ve kişiler kurgusaldır. Bu laboratuvar e-posta göndermez; yalnızca taslak gösterir."
		/>
		<div class="grid gap-4 xl:grid-cols-2">
			<AppFrame visual="outlook" title="Gelen Kutusu" subtitle="Örnek posta kutusu">
				<div class="border-b border-ink-100 px-4 py-3">
					<p class="text-[11px] font-semibold uppercase tracking-wide text-ink-400">
						{{ THREAD.length }} ileti · {{ THREAD[0].time.split(' ').slice(0, 2).join(' ') }} –
						{{ THREAD[THREAD.length - 1].time.split(' ').slice(0, 2).join(' ') }}
					</p>
					<h3 class="mt-0.5 text-[16px] font-semibold leading-snug">{{ THREAD_SUBJECT }}</h3>
					<div
						class="mt-3 flex flex-wrap items-center gap-2"
						role="group"
						aria-label="Copilot eylemleri"
					>
						<span class="flex items-center gap-1.5 text-[12.5px] font-semibold text-iris-700">
							<Sparkles :size="14" aria-hidden="true" /> Copilot:
						</span>
						<button
							v-for="a in OUTLOOK_ACTIONS"
							:key="a.id"
							type="button"
							:aria-pressed="actionId === a.id"
							:class="[
								'rounded-full border px-3 py-1.5 text-[13px] font-semibold transition',
								actionId === a.id
									? 'border-app-outlook bg-app-outlook text-white'
									: 'border-ink-200 bg-white text-ink-800 hover:border-brand-300',
							]"
							@click="run(a.id)"
						>
							{{ a.label }}
						</button>
					</div>
				</div>
				<div class="flex items-center justify-between px-4 pt-3">
					<p class="text-[12.5px] text-ink-500">İletileri okumak için başlıklara tıklayın.</p>
					<button
						type="button"
						class="text-[12.5px] font-semibold text-brand-700 hover:text-brand-800"
						@click="toggleAll"
					>
						{{ allExpanded ? 'Tümünü daralt' : 'Tümünü genişlet' }}
					</button>
				</div>
				<ol class="space-y-2 p-4 pt-2.5" role="list">
					<li
						v-for="m in THREAD"
						:key="m.id"
						class="overflow-hidden rounded-xl border border-ink-200 bg-white"
					>
						<button
							type="button"
							class="flex w-full items-center gap-3 px-3.5 py-2.5 text-start hover:bg-ink-50"
							:aria-expanded="expanded.has(m.id)"
							@click="toggle(m.id)"
						>
							<span
								class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11.5px] font-bold text-brand-800"
								aria-hidden="true"
								>{{ m.initials }}</span
							>
							<span class="min-w-0 flex-1">
								<span class="flex items-baseline justify-between gap-2">
									<span class="truncate text-[13.5px] font-semibold text-ink-900"
										>{{ m.from }} <span class="font-normal text-ink-500">· {{ m.role }}</span></span
									>
									<span class="shrink-0 text-[11.5px] text-ink-500">{{ m.time }}</span>
								</span>
								<span
									v-if="!expanded.has(m.id)"
									class="block truncate text-[12.5px] text-ink-500"
									>{{ m.body }}</span
								>
							</span>
							<ChevronDown
								:size="16"
								:class="[
									'shrink-0 text-ink-400 transition-transform',
									expanded.has(m.id) && 'rotate-180',
								]"
								aria-hidden="true"
							/>
						</button>
						<p
							v-if="expanded.has(m.id)"
							class="border-t border-ink-100 px-3.5 py-3 text-[14px] leading-relaxed text-ink-700"
						>
							{{ m.body }}
						</p>
					</li>
				</ol>
			</AppFrame>

			<section
				class="card overflow-hidden xl:sticky xl:top-20 xl:self-start"
				aria-labelledby="outlook-result"
				aria-live="polite"
			>
				<header class="flex items-center gap-2 border-b border-ink-100 px-4 py-3">
					<span
						class="flex h-6 w-6 items-center justify-center rounded-full bg-copilot text-white"
						aria-hidden="true"
						><Sparkles :size="13"
					/></span>
					<h3 id="outlook-result" class="text-[14.5px] font-semibold">Copilot sonuç paneli</h3>
				</header>
				<div
					v-if="!action"
					class="flex flex-col items-center gap-2 px-6 py-14 text-center text-[13.5px] text-ink-500"
				>
					<Mail :size="26" class="text-brand-300" aria-hidden="true" />
					Zincirin üstündeki Copilot eylemlerinden birini seçin:
					<strong class="font-semibold text-ink-700">Özetle</strong>,
					<strong class="font-semibold text-ink-700">Aksiyonları çıkar</strong> veya
					<strong class="font-semibold text-ink-700">Yanıt hazırla</strong>.
				</div>
				<div v-else :key="action.id" class="animate-fade-in space-y-3 p-4">
					<p
						class="rounded-lg bg-brand-50/70 px-3 py-2 text-[12.5px] leading-relaxed text-brand-900"
					>
						<span class="font-semibold">Prompt:</span> “{{ action.prompt }}”
					</p>
					<section
						v-for="(sec, i) in action.order"
						:key="sec"
						:class="[
							'rounded-xl border p-3.5',
							i === 0
								? 'border-app-outlook/40 bg-brand-50/30 ring-1 ring-app-outlook/20'
								: 'border-ink-200',
						]"
					>
						<h4 class="flex items-center gap-2 text-[13.5px] font-semibold text-ink-900">
							<component
								:is="SECTION_META[sec].icon"
								:size="15"
								class="text-app-outlook"
								aria-hidden="true"
							/>
							{{ SECTION_META[sec].title }}
							<span v-if="i === 0" class="chip bg-app-outlook/10 text-[10.5px] text-app-outlook"
								>İstenen</span
							>
						</h4>

						<p v-if="sec === 'summary'" class="mt-1.5 text-[13.5px] leading-relaxed text-ink-700">
							{{ THREAD_SUMMARY }}
						</p>

						<ul v-else-if="sec === 'decisions'" class="mt-2 space-y-2" role="list">
							<li v-for="d in THREAD_DECISIONS" :key="d.text" class="text-[13.5px] leading-relaxed">
								<p class="font-medium text-ink-800">{{ d.text }}</p>
								<p class="text-[12px] text-ink-500">{{ d.note }} · Kaynak: {{ d.source }}</p>
							</li>
							<li class="pt-1">
								<p class="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-700">
									<CircleHelp :size="13" aria-hidden="true" /> Açık sorular
								</p>
								<ul class="mt-1 list-disc space-y-0.5 ps-5 text-[12.5px] text-ink-600">
									<li v-for="q in THREAD_QUESTIONS" :key="q">{{ q }}</li>
								</ul>
							</li>
						</ul>

						<div v-else-if="sec === 'actions'" class="-mx-1 mt-2 overflow-x-auto scrollbar-thin">
							<table class="w-full min-w-[420px] border-collapse text-start text-[13px]">
								<thead>
									<tr class="border-b border-ink-200">
										<th
											v-for="c in THREAD_ACTIONS.columns"
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
										v-for="(row, ri) in THREAD_ACTIONS.rows"
										:key="ri"
										class="border-b border-ink-100 last:border-0"
									>
										<td
											v-for="(cell, ci) in row"
											:key="ci"
											:class="[
												'px-2 py-1.5 align-top',
												cell === 'Belirtilmedi'
													? 'font-semibold text-warning-700'
													: cell === 'Siz'
													? 'font-semibold text-brand-700'
													: 'text-ink-700',
											]"
										>
											{{ cell }}
										</td>
									</tr>
								</tbody>
							</table>
						</div>

						<div v-else class="mt-2">
							<div
								class="space-y-2 rounded-lg border border-dashed border-ink-300 bg-white px-3.5 py-3 text-[13.5px] leading-relaxed text-ink-700"
							>
								<DraftText
									v-for="(p, pi) in THREAD_DRAFT"
									:key="pi"
									as="p"
									:text="p"
									class="whitespace-pre-line"
								/>
							</div>
							<div class="mt-2 flex flex-wrap items-center gap-2">
								<CopyButton :text="draftText" label="Taslağı kopyala" size="sm" />
								<span class="text-[12px] text-ink-500"
									>Taslak gönderilmez. Sarı alanları doldurup kendi e-posta istemcinizde gözden
									geçirin.</span
								>
							</div>
						</div>
					</section>
				</div>
			</section>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Aynı zincirden özet, aksiyon listesi ve yanıt taslağı çıkardınız. Hepsini göndermeden önce
				iletilerle karşılaştırmayı unutmayın.</template
			>
		</TaskGoal>
	</div>
</template>
