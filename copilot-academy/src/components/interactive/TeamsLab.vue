<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { CalendarDays, NotebookPen, Users } from 'lucide-vue-next'
import {
	MEETING,
	MEETING_ACTIONS,
	MEETING_DECISIONS,
	MEETING_EMAIL,
	MEETING_OUTPUTS,
	MEETING_RISKS,
	MEETING_SUMMARY,
	TRANSCRIPT,
	type MeetingOutput,
	type NoteLine,
} from '@/content/datasets/meeting'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import CopyButton from '@/components/ui/CopyButton.vue'
import DraftText from '@/components/ui/DraftText.vue'
import RichText from '@/components/ui/RichText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import TaskGoal from './TaskGoal.vue'
import CopilotMark from '@/components/ui/CopilotMark.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const outputId = ref<MeetingOutput | null>(null)
const tried = ref<Set<MeetingOutput>>(new Set())
const highlighted = ref<string[]>([])
const refsOpened = ref(0)
const transcriptEl = ref<HTMLElement | null>(null)

const output = computed(() => MEETING_OUTPUTS.find((o) => o.id === outputId.value) ?? null)
const lines = computed<NoteLine[]>(() => {
	if (outputId.value === 'summary') return MEETING_SUMMARY
	if (outputId.value === 'decisions') return MEETING_DECISIONS
	if (outputId.value === 'risks') return MEETING_RISKS
	return []
})

function choose(id: MeetingOutput) {
	outputId.value = id
	tried.value = new Set(tried.value).add(id)
	highlighted.value = []
}

const timeOf = (id: string) => TRANSCRIPT.find((t) => t.id === id)?.time ?? ''

async function showRefs(refs: string[]) {
	highlighted.value = refs
	refsOpened.value += 1
	await nextTick()
	transcriptEl.value
		?.querySelector<HTMLElement>(`[data-line="${refs[0]}"]`)
		?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
}

const emailText = MEETING_EMAIL.map((l) => l.replace(/\*\*/g, '')).join('\n\n')

const goals = computed(() => [
	{ label: 'En az dört çıktı türünü deneyin', done: tried.value.size >= 4 },
	{ label: '“Takip e-postası” çıktısını inceleyin', done: tried.value.has('email') },
	{ label: 'Bir zaman etiketine tıklayıp transkriptle karşılaştırın', done: refsOpened.value > 0 },
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, { correct: true, score: 1, answer: [...tried.value] })
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice
			text="Simülasyon: Toplantı, kişiler ve transkript kurgusaldır. Gerçek Teams’te toplantı özetleri lisansa, yönetici ayarlarına ve toplantı koşullarına bağlıdır."
		/>
		<div class="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
			<AppFrame visual="teams" :title="MEETING.title" :subtitle="MEETING.date">
				<div
					class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-ink-100 px-4 py-2.5 text-[12px] text-ink-500"
				>
					<span class="flex items-center gap-1.5"
						><CalendarDays :size="13" aria-hidden="true" /> {{ MEETING.date }}</span
					>
					<span class="flex items-center gap-1.5"
						><Users :size="13" aria-hidden="true" />
						{{ MEETING.participants.length }} katılımcı</span
					>
				</div>
				<ol
					ref="transcriptEl"
					class="max-h-[520px] space-y-1 overflow-y-auto p-3 scrollbar-thin"
					role="list"
					aria-label="Transkript"
				>
					<li
						v-for="line in TRANSCRIPT"
						:key="line.id"
						:data-line="line.id"
						:class="[
							'flex gap-3 rounded-xl px-2.5 py-2 transition-colors',
							highlighted.includes(line.id) ? 'bg-[#eceefc] ring-1 ring-app-teams/40' : '',
						]"
					>
						<span
							class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3e5fa] text-[11px] font-bold text-app-teams"
							aria-hidden="true"
							>{{ line.initials }}</span
						>
						<div class="min-w-0">
							<p class="text-[12.5px]">
								<span class="font-semibold text-ink-900">{{ line.speaker }}</span>
								<span class="text-ink-500"> · {{ line.role }} · </span>
								<time class="font-mono text-ink-500">{{ line.time }}</time>
							</p>
							<p class="text-[14px] leading-relaxed text-ink-700">{{ line.text }}</p>
						</div>
					</li>
				</ol>
			</AppFrame>

			<section
				class="card overflow-hidden xl:sticky xl:top-20 xl:self-start"
				aria-labelledby="notes-title"
			>
				<header class="border-b border-ink-100 px-4 py-3">
					<h3 id="notes-title" class="flex items-center gap-2 text-[15px] font-semibold">
						<NotebookPen :size="16" class="text-app-teams" aria-hidden="true" /> Toplantı notları
					</h3>
					<div
						class="mt-2.5 flex flex-wrap gap-1.5"
						role="group"
						aria-label="Copilot’tan istenecek çıktı"
					>
						<button
							v-for="o in MEETING_OUTPUTS"
							:key="o.id"
							type="button"
							:aria-pressed="outputId === o.id"
							:class="[
								'rounded-full border px-3 py-1.5 text-[13px] font-semibold transition',
								outputId === o.id
									? 'border-app-teams bg-app-teams text-white'
									: tried.has(o.id)
									? 'border-[#c9ccf3] bg-[#eceefc] text-app-teams'
									: 'border-ink-200 bg-white text-ink-800 hover:border-[#c9ccf3]',
							]"
							@click="choose(o.id)"
						>
							{{ o.label }}
						</button>
					</div>
				</header>

				<div
					v-if="!output"
					class="flex flex-col items-center gap-2 px-6 py-14 text-center text-[13.5px] text-ink-500"
				>
					<CopilotMark :size="30" class="opacity-80" />
					Copilot’tan hangi çıktıyı istemek istediğinizi seçin. Notlardaki zaman etiketlerine
					tıklayarak bilginin transkriptte nerede geçtiğini görebilirsiniz.
				</div>

				<div v-else :key="output.id" class="animate-fade-in space-y-3 p-4" aria-live="polite">
					<p class="rounded-lg bg-iris-50 px-3 py-2 text-[12.5px] leading-relaxed text-iris-800">
						<span class="font-semibold">Prompt:</span> “{{ output.prompt }}”
					</p>

					<ul v-if="lines.length" class="space-y-2.5" role="list">
						<li
							v-for="(l, i) in lines"
							:key="i"
							class="rounded-xl border border-ink-200 bg-white px-3.5 py-2.5"
						>
							<p class="text-[14px] leading-relaxed text-ink-800"><RichText :text="l.text" /></p>
							<div class="mt-1.5 flex flex-wrap items-center gap-1.5">
								<span v-if="l.note" class="text-[12px] text-ink-500">{{ l.note }} ·</span>
								<button
									v-for="r in l.refs ?? []"
									:key="r"
									type="button"
									:class="[
										'rounded-md px-1.5 py-px font-mono text-[11px] font-semibold transition',
										highlighted.includes(r)
											? 'bg-app-teams text-white'
											: 'bg-[#eceefc] text-app-teams hover:bg-[#dfe1fa]',
									]"
									:aria-label="`Transkriptte ${timeOf(r)} satırını göster`"
									@click="showRefs(l.refs!)"
								>
									{{ timeOf(r) }}
								</button>
							</div>
						</li>
					</ul>

					<div v-else-if="outputId === 'actions'" class="-mx-1 overflow-x-auto scrollbar-thin">
						<table class="w-full min-w-[440px] border-collapse text-[13px]">
							<thead>
								<tr class="border-b border-ink-200">
									<th
										v-for="c in MEETING_ACTIONS.columns"
										:key="c"
										scope="col"
										class="px-2 py-1.5 text-start font-semibold text-ink-800"
									>
										{{ c }}
									</th>
									<th scope="col" class="px-2 py-1.5 text-start font-semibold text-ink-800">
										Kaynak
									</th>
								</tr>
							</thead>
							<tbody>
								<tr
									v-for="(row, ri) in MEETING_ACTIONS.rows"
									:key="ri"
									class="border-b border-ink-100 align-top last:border-0"
								>
									<td
										v-for="(cell, ci) in row.cells"
										:key="ci"
										:class="[
											'px-2 py-1.5',
											cell === 'Belirtilmedi'
												? 'font-semibold text-warning-700'
												: ci === 0
												? 'font-medium text-ink-800'
												: 'text-ink-700',
										]"
									>
										{{ cell }}
									</td>
									<td class="px-2 py-1.5">
										<button
											v-for="r in row.refs"
											:key="r"
											type="button"
											:class="[
												'rounded-md px-1.5 py-px font-mono text-[11px] font-semibold',
												highlighted.includes(r)
													? 'bg-app-teams text-white'
													: 'bg-[#eceefc] text-app-teams hover:bg-[#dfe1fa]',
											]"
											:aria-label="`Transkriptte ${timeOf(r)} satırını göster`"
											@click="showRefs(row.refs)"
										>
											{{ timeOf(r) }}
										</button>
									</td>
								</tr>
							</tbody>
						</table>
						<p class="mt-2 text-[12.5px] text-ink-500">
							“Belirtilmedi” yazan alanlar transkriptte geçmiyor; toplantı sahibi bunları
							netleştirmeli.
						</p>
					</div>

					<div v-else-if="outputId === 'email'">
						<div
							class="space-y-2 rounded-xl border border-dashed border-ink-300 bg-white px-4 py-3.5 text-[13.5px] leading-relaxed text-ink-700"
						>
							<DraftText v-for="(p, i) in MEETING_EMAIL" :key="i" as="p" :text="p" />
						</div>
						<div class="mt-2 flex flex-wrap items-center gap-2">
							<CopyButton :text="emailText" label="Taslağı kopyala" size="sm" />
							<span class="text-[12px] text-ink-500">Bu laboratuvar e-posta göndermez.</span>
						</div>
					</div>
				</div>
			</section>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Toplantı notlarını transkriptle karşılaştırarak doğrulama alışkanlığını
				uyguladınız.</template
			>
		</TaskGoal>
	</div>
</template>
