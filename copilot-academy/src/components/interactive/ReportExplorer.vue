<script setup lang="ts">
import { computed, ref } from 'vue'
import { CircleCheck, FileSearch, SearchX } from 'lucide-vue-next'
import { REPORT_PAGES, REPORT_PROMPTS, REPORT_TITLE } from '@/content/datasets/report'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import RichText from '@/components/ui/RichText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import TaskGoal from './TaskGoal.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const asked = ref<Set<string>>(new Set())
const opened = ref<Set<number>>(new Set())
const activeId = ref<string | null>(null)
const activePage = ref<number | null>(null)

const active = computed(() => REPORT_PROMPTS.find((p) => p.id === activeId.value) ?? null)
const page = computed(() => REPORT_PAGES.find((p) => p.page === activePage.value) ?? null)

function ask(id: string) {
	activeId.value = id
	asked.value = new Set(asked.value).add(id)
}

function openPage(n: number) {
	activePage.value = n
	opened.value = new Set(opened.value).add(n)
}

const goals = computed(() => [
	{ label: 'En az iki farklı prompt deneyin', done: asked.value.size >= 2 },
	{
		label: 'En az bir sayfa etiketine tıklayıp kaynağı kontrol edin',
		done: opened.value.size >= 1,
	},
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, {
		correct: true,
		score: 1,
		answer: { asked: [...asked.value], opened: [...opened.value] },
	})
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice />
		<div class="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
			<AppFrame visual="word" :title="`${REPORT_TITLE}.docx`" subtitle="15 sayfa · örnek belge">
				<div class="p-4">
					<p class="mb-2 text-xs font-medium text-ink-500">Sayfalar</p>
					<ol class="grid grid-cols-5 gap-1.5" role="list">
						<li v-for="p in REPORT_PAGES" :key="p.page">
							<button
								type="button"
								:aria-pressed="activePage === p.page"
								:title="p.title"
								:class="[
									'flex aspect-[3/4] w-full flex-col items-center justify-between rounded-md border px-1 py-1.5 text-[10px] transition',
									activePage === p.page
										? 'border-app-word bg-[#185abd]/[.06] text-app-word ring-2 ring-app-word/30'
										: opened.has(p.page)
										? 'border-success-600/40 bg-success-50/60 text-ink-600'
										: 'border-ink-200 bg-white text-ink-500 hover:border-ink-300',
								]"
								@click="openPage(p.page)"
							>
								<span class="flex w-full flex-col gap-[3px]" aria-hidden="true">
									<span class="h-[3px] w-3/4 rounded bg-current opacity-30" />
									<span class="h-[3px] w-full rounded bg-current opacity-15" />
									<span class="h-[3px] w-5/6 rounded bg-current opacity-15" />
								</span>
								<span class="font-semibold">{{ p.page }}</span>
								<span class="sr-only">. sayfa: {{ p.title }}</span>
							</button>
						</li>
					</ol>
					<div
						class="mt-4 min-h-[112px] rounded-xl border border-ink-200 bg-ink-50/70 p-3.5"
						aria-live="polite"
					>
						<template v-if="page">
							<p class="text-[11px] font-semibold uppercase tracking-wide text-ink-500">
								Sayfa {{ page.page }} · {{ page.title }}
							</p>
							<p v-if="page.excerpt" class="mt-1.5 text-[14px] leading-relaxed text-ink-800">
								“{{ page.excerpt }}”
							</p>
							<p v-else class="mt-1.5 text-[13px] text-ink-500">
								Bu sayfanın içeriği örnekte gösterilmiyor.
							</p>
						</template>
						<p v-else class="flex items-start gap-2 text-[13px] text-ink-500">
							<FileSearch :size="16" class="mt-0.5 shrink-0" aria-hidden="true" />
							Copilot yanıtındaki bir sayfa etiketine veya yukarıdaki bir sayfaya tıklayarak
							içeriğini burada görün.
						</p>
					</div>
				</div>
			</AppFrame>

			<AppFrame visual="copilot" title="Copilot" subtitle="Belge bağlamında sohbet">
				<div class="space-y-4 p-4">
					<div>
						<p class="mb-2 text-xs font-medium text-ink-500">Bir prompt seçin</p>
						<div class="flex flex-wrap gap-2">
							<button
								v-for="p in REPORT_PROMPTS"
								:key="p.id"
								type="button"
								:aria-pressed="activeId === p.id"
								:class="[
									'rounded-full border px-3 py-1.5 text-[13px] font-semibold transition',
									activeId === p.id
										? 'border-brand-600 bg-brand-600 text-white'
										: asked.has(p.id)
										? 'border-brand-200 bg-brand-50 text-brand-800'
										: 'border-ink-200 bg-white text-ink-700 hover:border-brand-300',
								]"
								@click="ask(p.id)"
							>
								{{ p.label }}
							</button>
						</div>
					</div>

					<div v-if="active" :key="active.id" class="animate-fade-up space-y-3" aria-live="polite">
						<div class="flex justify-end">
							<p
								class="max-w-[90%] rounded-2xl rounded-ee-md bg-brand-600 px-4 py-2.5 text-[14px] text-white"
							>
								{{ active.prompt }}
							</p>
						</div>
						<div
							class="rounded-2xl rounded-ss-md border border-ink-200 bg-white px-4 py-3 shadow-card"
						>
							<p class="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-iris-700">
								Copilot · örnek yanıt
							</p>
							<ul class="space-y-2 text-[14px] leading-relaxed text-ink-700" role="list">
								<li v-for="(line, i) in active.lines" :key="i" class="flex gap-2">
									<SearchX
										v-if="line.gap"
										:size="16"
										class="mt-[3px] shrink-0 text-warning-600"
										aria-label="Raporda bulunmayan bilgi"
									/>
									<span
										v-else
										class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-iris-500"
										aria-hidden="true"
									/>
									<span>
										<RichText :text="line.text" />
										<button
											v-if="line.cite"
											type="button"
											:class="[
												'ms-1.5 inline-flex items-center rounded-md px-1.5 py-px align-baseline text-[11px] font-bold transition',
												activePage === line.cite
													? 'bg-app-word text-white'
													: 'bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-200 hover:bg-brand-100',
											]"
											:aria-label="`Kaynağı aç: sayfa ${line.cite}`"
											@click="openPage(line.cite)"
										>
											s. {{ line.cite }}
										</button>
									</span>
								</li>
							</ul>
						</div>
						<p
							class="rounded-lg bg-lagoon-50 px-3.5 py-2.5 text-[13px] leading-relaxed text-lagoon-900"
						>
							<strong class="font-semibold">Ne öğrendik?</strong> {{ active.lesson }}
						</p>
					</div>
					<p
						v-else
						class="rounded-xl border border-dashed border-ink-300 px-4 py-6 text-center text-[13px] text-ink-500"
					>
						Yanıtı görmek için yukarıdan bir prompt seçin.
					</p>
				</div>
			</AppFrame>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done>
				<CircleCheck :size="16" class="text-success-700" aria-hidden="true" />
				Kaynağa giderek doğrulama yaptınız. Bu alışkanlık, Copilot’ı güvenle kullanmanın temelidir.
			</template>
		</TaskGoal>
	</div>
</template>
