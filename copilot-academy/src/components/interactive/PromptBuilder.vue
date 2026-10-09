<script setup lang="ts">
import { computed, nextTick, reactive, ref, useId } from 'vue'
import {
	ArrowRight,
	Eraser,
	FileInput,
	Highlighter,
	Lightbulb,
	ShieldCheck,
	Sparkles,
} from 'lucide-vue-next'
import {
	FIELD_PART,
	FIELD_SUGGESTIONS,
	PART_META,
	PART_ORDER,
	PROMPT_EXAMPLES,
	buildPrompt,
	buildSegments,
	coveredParts,
	emptyFields,
	promptHints,
	promptQuality,
	type FieldKey,
	type PromptFields,
} from '@/lib/promptBuilder'
import { useProgress } from '@/stores/progress'
import CopyButton from '@/components/ui/CopyButton.vue'
import { PART_STYLE } from '@/components/ui/promptParts'
import TaskGoal from './TaskGoal.vue'

const props = defineProps<{ taskId?: string; scenario?: string }>()
const progress = useProgress()
const uid = useId()

// Field values stay in memory only: learners may type work details here.
const fields = reactive<PromptFields>(emptyFields())
const highlight = ref(true)
const copied = ref(false)
const loadedExample = ref<string | null>(null)

interface FieldDef {
	key: FieldKey
	label: string
	placeholder: string
	multiline?: boolean
	wide?: boolean
}

const FIELDS: FieldDef[] = [
	{
		key: 'task',
		label: 'Görev',
		placeholder: 'ör. yeni proje aracına geçişi duyuran bir e-posta taslağı yaz',
		multiline: true,
		wide: true,
	},
	{
		key: 'context',
		label: 'Bağlam',
		placeholder: 'ör. geçiş 1 Haziran’da başlıyor; eski araç ay sonunda kapanacak',
		multiline: true,
		wide: true,
	},
	{ key: 'audience', label: 'Hedef kitle', placeholder: 'ör. teknik olmayan proje ekipleri' },
	{ key: 'source', label: 'Kullanılacak kaynak', placeholder: 'ör. ekteki geçiş planı belgesi' },
	{ key: 'format', label: 'Çıktı formatı', placeholder: 'ör. kısa giriş, üç adım, destek bilgisi' },
	{ key: 'tone', label: 'Ton', placeholder: 'ör. samimi ve anlaşılır' },
	{
		key: 'constraints',
		label: 'Ek kısıtlar',
		placeholder: 'ör. 150 kelimeyi geçmesin; jargon kullanma',
		multiline: true,
		wide: true,
	},
]

const segments = computed(() => buildSegments(fields))
const prompt = computed(() => buildPrompt(fields))
const covered = computed(() => coveredParts(fields))
const quality = computed(() => promptQuality(fields))
const hints = computed(() => promptHints(fields))
const words = computed(() => (prompt.value ? prompt.value.split(/\s+/).length : 0))
const isEmpty = computed(() => !prompt.value)

const inputId = (key: FieldKey) => `${uid}-${key}`

function loadExample(id: string) {
	const example = PROMPT_EXAMPLES.find((e) => e.id === id)
	if (!example) return
	Object.assign(fields, example.fields)
	loadedExample.value = example.title
}

function clearFields() {
	Object.assign(fields, emptyFields())
	loadedExample.value = null
	copied.value = false
}

function applySuggestion(key: FieldKey, value: string) {
	fields[key] = value
}

async function focusField(key: FieldKey) {
	await nextTick()
	const el = document.getElementById(inputId(key))
	el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
	el?.focus({ preventScroll: true })
}

const QUALITY_TONE = {
	empty: 'text-ink-500',
	weak: 'text-danger-600',
	fair: 'text-warning-700',
	good: 'text-brand-700',
	strong: 'text-success-700',
}

const goals = computed(() => [
	{
		label: 'Görevi en az üç kelimeyle yazın',
		done: fields.task.trim().split(/\s+/).filter(Boolean).length >= 3,
	},
	{ label: 'En az dört bileşeni kapsayın', done: covered.value.size >= 4 },
])

function complete() {
	if (!props.taskId) return
	progress.recordTask(props.taskId, {
		correct: covered.value.size === 5,
		score: covered.value.size / 5,
		// Only which parts were covered is kept, never the typed text.
		answer: { parts: [...covered.value], copied: copied.value },
	})
}
</script>

<template>
	<div class="space-y-4">
		<div
			v-if="scenario"
			class="flex gap-3 rounded-2xl border border-warning-100 bg-gradient-to-r from-warning-50 to-white px-4 py-3.5"
		>
			<span
				class="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-warning-100 text-warning-700"
				aria-hidden="true"
			>
				<FileInput :size="15" />
			</span>
			<div class="text-[14px] leading-relaxed text-ink-700">
				<p class="text-[11px] font-bold uppercase tracking-[0.08em] text-warning-700">Senaryo</p>
				{{ scenario }}
			</div>
		</div>

		<div class="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
			<!-- Form -->
			<section class="card overflow-hidden" aria-labelledby="pb-form-title">
				<header class="flex flex-wrap items-center gap-2 border-b border-ink-100 px-4 py-3 sm:px-5">
					<h3 id="pb-form-title" class="me-auto flex items-center gap-2 text-[15px] font-semibold">
						<Sparkles :size="16" class="text-iris-600" aria-hidden="true" />
						Prompt Builder
					</h3>
					<div
						class="flex flex-wrap items-center gap-1.5"
						role="group"
						aria-label="Örnek prompt yükle"
					>
						<span class="text-xs font-medium text-ink-500">Örnek yükle:</span>
						<button
							v-for="ex in PROMPT_EXAMPLES"
							:key="ex.id"
							type="button"
							class="rounded-full border border-ink-200 bg-white px-2.5 py-1 text-[12px] font-semibold text-ink-700 transition hover:border-iris-300 hover:bg-iris-50 hover:text-iris-800"
							@click="loadExample(ex.id)"
						>
							{{ ex.title }}
						</button>
					</div>
					<button
						type="button"
						class="btn btn-ghost btn-sm"
						:disabled="isEmpty"
						@click="clearFields"
					>
						<Eraser :size="15" aria-hidden="true" /> Alanları temizle
					</button>
				</header>

				<p
					v-if="loadedExample"
					class="border-b border-iris-100 bg-iris-50/60 px-5 py-2 text-[12.5px] text-iris-800"
					role="status"
				>
					“{{ loadedExample }}” örneği yüklendi. Alanları değiştirerek kendi işinize uyarlayın.
				</p>

				<div class="grid gap-4 p-4 sm:grid-cols-2 sm:p-5">
					<div v-for="f in FIELDS" :key="f.key" :class="f.wide && 'sm:col-span-2'">
						<label :for="inputId(f.key)" class="field-label">
							<span
								:class="['h-2 w-2 rounded-full', PART_STYLE[FIELD_PART[f.key]].dot]"
								aria-hidden="true"
							/>
							{{ f.label }}
							<span
								:class="[
									'chip px-2 py-0 text-[10.5px] ring-1 ring-inset',
									PART_STYLE[FIELD_PART[f.key]].chip,
								]"
							>
								{{ PART_META[FIELD_PART[f.key]].label }}
							</span>
						</label>
						<textarea
							v-if="f.multiline"
							:id="inputId(f.key)"
							v-model="fields[f.key]"
							rows="2"
							class="field-input resize-y"
							:placeholder="f.placeholder"
							maxlength="400"
						/>
						<input
							v-else
							:id="inputId(f.key)"
							v-model="fields[f.key]"
							type="text"
							class="field-input"
							:placeholder="f.placeholder"
							maxlength="200"
							autocomplete="off"
						/>
						<div
							v-if="FIELD_SUGGESTIONS[f.key]"
							class="mt-1.5 flex flex-wrap gap-1"
							:aria-label="`${f.label} önerileri`"
							role="group"
						>
							<button
								v-for="s in FIELD_SUGGESTIONS[f.key]"
								:key="s"
								type="button"
								:class="[
									'rounded-md px-2 py-0.5 text-[12px] transition',
									fields[f.key] === s
										? 'bg-ink-900 text-white'
										: 'bg-ink-100 text-ink-600 hover:bg-ink-200 hover:text-ink-900',
								]"
								@click="applySuggestion(f.key, s)"
							>
								{{ s }}
							</button>
						</div>
					</div>

					<label
						class="flex cursor-pointer items-start gap-3 rounded-xl border border-ink-200 bg-ink-50/60 px-3.5 py-3 sm:col-span-2"
					>
						<input
							v-model="fields.verify"
							type="checkbox"
							class="mt-1 h-4 w-4 shrink-0 rounded border-ink-300 accent-brand-600"
						/>
						<span>
							<span class="flex items-center gap-1.5 text-sm font-semibold text-ink-900">
								<ShieldCheck :size="15" class="text-success-700" aria-hidden="true" /> Doğrulama
								talimatı ekle
							</span>
							<span class="mt-0.5 block text-[13px] text-ink-600">
								“Kaynakta bulunmayan bilgileri varsayma; emin olmadığın noktaları belirt.” Riski
								azaltır ama kontrolün yerini tutmaz.
							</span>
						</span>
					</label>
				</div>
			</section>

			<!-- Preview -->
			<div class="space-y-4 xl:sticky xl:top-20 xl:self-start">
				<section class="card overflow-hidden" aria-labelledby="pb-preview-title">
					<header
						class="flex flex-wrap items-center gap-3 border-b border-ink-100 px-4 py-3 sm:px-5"
					>
						<h3 id="pb-preview-title" class="me-auto text-[15px] font-semibold">
							Oluşturulan prompt
						</h3>
						<button
							type="button"
							:aria-pressed="highlight"
							:class="['btn btn-sm', highlight ? 'btn-secondary' : 'btn-ghost']"
							@click="highlight = !highlight"
						>
							<Highlighter :size="15" aria-hidden="true" /> Bileşenleri vurgula
						</button>
					</header>

					<div class="border-b border-ink-100 px-4 py-3 sm:px-5">
						<div class="flex items-center justify-between text-[13px]">
							<span class="font-medium text-ink-600">Kapsanan bileşenler</span>
							<span :class="['font-semibold', QUALITY_TONE[quality.level]]">
								{{ quality.covered }}/{{ quality.total }} · {{ quality.label }}
							</span>
						</div>
						<ul class="mt-2 grid grid-cols-5 gap-1" role="list" aria-label="Bileşen kapsamı">
							<li v-for="part in PART_ORDER" :key="part" class="space-y-1">
								<span
									:class="[
										'block h-1.5 rounded-full transition',
										covered.has(part) ? PART_STYLE[part].dot : 'bg-ink-100',
									]"
									aria-hidden="true"
								/>
								<span
									:class="[
										'block truncate text-[11px] font-medium',
										covered.has(part) ? 'text-ink-800' : 'text-ink-400',
									]"
								>
									{{ PART_META[part].label }}
									<span class="sr-only">{{ covered.has(part) ? 'var' : 'eksik' }}</span>
								</span>
							</li>
						</ul>
					</div>

					<div class="min-h-[168px] px-4 py-4 sm:px-5" aria-live="polite">
						<p
							v-if="isEmpty"
							class="flex h-full flex-col items-center justify-center gap-2 py-6 text-center text-[13.5px] text-ink-500"
						>
							<Sparkles :size="22" class="text-iris-400" aria-hidden="true" />
							Prompt’unuz burada oluşacak. Görev alanından başlayın veya bir örnek yükleyin.
						</p>
						<p v-else class="text-[15px] leading-[2] text-ink-800">
							<template v-for="(seg, i) in segments" :key="i">
								<mark
									v-if="highlight"
									:class="[
										'rounded px-1 py-0.5 underline decoration-2 underline-offset-4 [box-decoration-break:clone]',
										PART_STYLE[seg.part].mark,
									]"
									>{{ seg.text }}</mark
								>
								<span v-else>{{ seg.text }}</span
								>{{ i < segments.length - 1 ? ' ' : '' }}
							</template>
						</p>
					</div>

					<footer
						class="flex flex-wrap items-center gap-3 border-t border-ink-100 bg-ink-50/60 px-4 py-3 sm:px-5"
					>
						<CopyButton
							:text="prompt"
							label="Prompt’u kopyala"
							variant="primary"
							@copied="copied = true"
						/>
						<span class="text-[12.5px] text-ink-500">{{ words }} kelime</span>
					</footer>
				</section>

				<section class="card p-4 sm:p-5" aria-labelledby="pb-hints-title">
					<h3 id="pb-hints-title" class="flex items-center gap-2 text-[15px] font-semibold">
						<Lightbulb :size="16" class="text-warning-600" aria-hidden="true" />
						{{ hints.length ? 'İpuçları' : 'Harika, temel bileşenler tamam' }}
					</h3>
					<ul v-if="hints.length" class="mt-3 space-y-2.5" role="list">
						<li
							v-for="h in hints.slice(0, 3)"
							:key="h.field"
							class="flex gap-3 rounded-xl bg-ink-50 px-3 py-2.5"
						>
							<span
								:class="['mt-1.5 h-2 w-2 shrink-0 rounded-full', PART_STYLE[h.part].dot]"
								aria-hidden="true"
							/>
							<div class="min-w-0 flex-1 text-[13.5px] leading-relaxed text-ink-700">
								{{ h.message }}
								<button
									type="button"
									class="ms-1 inline-flex items-center gap-0.5 font-semibold text-brand-700 hover:text-brand-800"
									@click="focusField(h.field)"
								>
									Alana git <ArrowRight :size="13" class="rtl:-scale-x-100" aria-hidden="true" />
								</button>
							</div>
						</li>
					</ul>
					<p v-else class="mt-2 text-[13.5px] leading-relaxed text-ink-600">
						Prompt’unuz amaç, bağlam, kaynak, beklenti ve kısıtları içeriyor. Kopyalayıp Copilot’ta
						deneyin; gelen çıktıyı kaynağınızla karşılaştırmayı unutmayın.
					</p>
				</section>
			</div>
		</div>

		<TaskGoal v-if="taskId" :task-id="taskId" :goals="goals" @complete="complete">
			<template #done>
				Prompt’unuz
				{{
					progress.taskResult(taskId)?.score === 1 ? 'beş bileşenin hepsini' : 'en az dört bileşeni'
				}}
				kapsıyor. Bir sonraki adımda öğrendiklerinizi pekiştireceksiniz.
			</template>
		</TaskGoal>
	</div>
</template>
