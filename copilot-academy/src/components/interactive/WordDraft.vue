<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue'
import { FileText, ListChecks, Sparkles } from 'lucide-vue-next'
import {
	DRAFT_TYPES,
	LENGTH_LABEL,
	TONE_LABEL,
	type DraftLength,
	type DraftTone,
} from '@/content/datasets/word'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import DraftText from '@/components/ui/DraftText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'
import SegmentedControl from './SegmentedControl.vue'
import TaskGoal from './TaskGoal.vue'
import CopilotMark from '@/components/ui/CopilotMark.vue'

const props = defineProps<{ taskId?: string }>()
const progress = useProgress()

const typeId = ref(DRAFT_TYPES[0].id)
const tone = ref<DraftTone>('profesyonel')
const length = ref<DraftLength>('ayrintili')
const generated = ref<{ typeId: string; tone: DraftTone; length: DraftLength } | null>(null)
const generating = ref(false)
const seen = ref<Set<string>>(new Set())
let timer: ReturnType<typeof setTimeout> | undefined

const type = computed(() => DRAFT_TYPES.find((t) => t.id === typeId.value)!)
const prompt = computed(
	() =>
		`${type.value.task}. Ton ${TONE_LABEL[tone.value].toLocaleLowerCase('tr-TR')} olsun. ${
			type.value.sourceRef
		} kullan. ${type.value.structure[length.value]}`
)
const outdated = computed(
	() =>
		!!generated.value &&
		(generated.value.typeId !== typeId.value ||
			generated.value.tone !== tone.value ||
			generated.value.length !== length.value)
)
const draft = computed(() => {
	if (!generated.value) return null
	const t = DRAFT_TYPES.find((d) => d.id === generated.value!.typeId)!
	const d = t.drafts[generated.value.tone]
	return {
		file: t.file,
		title: d.title,
		paragraphs: [
			...d.core,
			...(generated.value.length === 'ayrintili' ? d.detail : []),
			...d.closing,
		],
	}
})

function generate() {
	generating.value = true
	clearTimeout(timer)
	timer = setTimeout(() => {
		generated.value = { typeId: typeId.value, tone: tone.value, length: length.value }
		seen.value = new Set(seen.value).add(`${typeId.value}|${tone.value}|${length.value}`)
		generating.value = false
	}, 550)
}

onBeforeUnmount(() => clearTimeout(timer))

const tones = computed(() => new Set([...seen.value].map((k) => k.split('|')[1])))
const goals = computed(() => [
	{ label: 'En az iki farklı ayarla taslak oluşturun', done: seen.value.size >= 2 },
	{ label: 'Samimi ve profesyonel tonu karşılaştırın', done: tones.value.size >= 2 },
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, {
		correct: true,
		score: 1,
		answer: { drafts: seen.value.size },
	})
}
</script>

<template>
	<div class="space-y-4">
		<SimNotice
			text="Simülasyon: Taslaklar önceden hazırlanmıştır; gerçek bir Word dosyası oluşturulmaz veya kaydedilmez."
		/>
		<div class="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
			<section class="card p-4 sm:p-5" aria-labelledby="draft-settings">
				<h3 id="draft-settings" class="flex items-center gap-2 text-[15px] font-semibold">
					<CopilotMark :size="18" /> Copilot ile taslak oluştur
				</h3>
				<div class="mt-4 space-y-4">
					<SegmentedControl
						v-model="typeId"
						label="Belge türü"
						:options="DRAFT_TYPES.map((t) => ({ value: t.id, label: t.label }))"
					/>
					<div class="flex flex-wrap gap-4">
						<SegmentedControl
							v-model="tone"
							label="Ton"
							:options="[
								{ value: 'samimi', label: TONE_LABEL.samimi },
								{ value: 'profesyonel', label: TONE_LABEL.profesyonel },
							]"
						/>
						<SegmentedControl
							v-model="length"
							label="Uzunluk"
							:options="[
								{ value: 'kisa', label: LENGTH_LABEL.kisa },
								{ value: 'ayrintili', label: LENGTH_LABEL.ayrintili },
							]"
						/>
					</div>
					<div class="rounded-xl border border-brand-200 bg-brand-50/60 p-3.5">
						<p class="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-700">
							Oluşan prompt
						</p>
						<p class="mt-1 text-[14px] leading-relaxed text-brand-950">“{{ prompt }}”</p>
					</div>
					<div class="rounded-xl border border-ink-200 bg-ink-50/70 p-3.5">
						<p
							class="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink-500"
						>
							<FileText :size="13" aria-hidden="true" /> Kaynak:
							{{ type.source.title.toLocaleLowerCase('tr-TR') }}
						</p>
						<ul class="mt-1.5 flex flex-wrap gap-1.5" role="list">
							<li
								v-for="f in type.source.facts"
								:key="f"
								class="rounded-md bg-white px-2 py-1 text-[12.5px] text-ink-700 ring-1 ring-ink-200"
							>
								{{ f }}
							</li>
						</ul>
					</div>
					<button
						type="button"
						class="btn btn-primary w-full sm:w-auto"
						:disabled="generating"
						@click="generate"
					>
						<Sparkles :size="16" aria-hidden="true" />
						{{
							generating
								? 'Copilot taslak hazırlıyor…'
								: generated
								? 'Taslağı yeniden oluştur'
								: 'Taslak oluştur'
						}}
					</button>
				</div>
			</section>

			<AppFrame
				visual="word"
				:title="draft?.file ?? 'Yeni belge.docx'"
				subtitle="Copilot taslağı"
				:tools="['Giriş', 'Ekle', 'Düzen', 'Gözden Geçir', 'Copilot']"
			>
				<div class="bg-ink-100/70 p-3 sm:p-5">
					<article
						class="mx-auto min-h-[340px] max-w-[620px] rounded-md bg-white px-6 py-7 shadow-raised sm:px-9"
						aria-live="polite"
					>
						<div v-if="generating" class="space-y-3" aria-label="Taslak hazırlanıyor">
							<div class="h-5 w-2/3 animate-pulse rounded bg-ink-100" />
							<div class="h-3 w-full animate-pulse rounded bg-ink-100" />
							<div class="h-3 w-11/12 animate-pulse rounded bg-ink-100" />
							<div class="h-3 w-4/5 animate-pulse rounded bg-ink-100" />
						</div>
						<template v-else-if="draft">
							<p
								v-if="outdated"
								class="mb-4 rounded-lg bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700"
							>
								Ayarları değiştirdiniz. Yeni ayarlarla görmek için “Taslağı yeniden oluştur”a basın.
							</p>
							<h4 class="font-display text-[20px] font-bold leading-snug text-ink-900">
								{{ draft.title }}
							</h4>
							<div class="mt-3 space-y-2.5 text-[14.5px] leading-relaxed text-ink-700">
								<DraftText v-for="(p, i) in draft.paragraphs" :key="i" as="p" :text="p" />
							</div>
						</template>
						<div
							v-else
							class="flex h-[290px] flex-col items-center justify-center gap-2 text-center text-[13.5px] text-ink-500"
						>
							<CopilotMark :size="30" class="opacity-80" />
							Ayarları seçin ve “Taslak oluştur” düğmesine basın.
						</div>
					</article>
				</div>
				<div v-if="draft && !generating" class="border-t border-ink-100 px-4 py-3">
					<p class="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink-700">
						<ListChecks :size="14" aria-hidden="true" /> Taslağı değerlendirin
					</p>
					<ul class="mt-1.5 grid gap-1 text-[12.5px] text-ink-600 sm:grid-cols-3" role="list">
						<li>• Bilgiler kaynakla uyumlu mu?</li>
						<li>
							• <mark class="rounded bg-amber-100 px-1 text-amber-900">[sarı alanları]</mark> siz
							doldurun.
						</li>
						<li>• Ton okuyucuya uygun mu?</li>
					</ul>
				</div>
			</AppFrame>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done
				>Ayarların taslağı nasıl değiştirdiğini gördünüz. Yer tutucuları doldurmak ve bilgileri
				doğrulamak her zaman sizin işiniz.</template
			>
		</TaskGoal>
	</div>
</template>
