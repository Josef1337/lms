<script setup lang="ts">
// The learner flags the lines of an AI output that the source does not
// support. Checking compares the flagged set with the flawed lines.
import { computed, ref } from 'vue'
import { Flag, RotateCcw } from 'lucide-vue-next'
import type { SpotTaskBlock } from '@/types/content'
import { useProgress } from '@/stores/progress'
import AppFrame from '@/components/ui/AppFrame.vue'
import BrandText from '@/components/ui/BrandText.vue'
import RichText from '@/components/ui/RichText.vue'
import FeedbackNote from './FeedbackNote.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ block: SpotTaskBlock }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)
const flagged = ref<string[]>(Array.isArray(stored?.answer) ? (stored.answer as string[]) : [])
const checked = ref(!!stored)

const flawedIds = computed(() => props.block.lines.filter((l) => l.flawed).map((l) => l.id))
const found = computed(() => flagged.value.filter((id) => flawedIds.value.includes(id)).length)
const falseFlags = computed(
	() => flagged.value.filter((id) => !flawedIds.value.includes(id)).length
)
const isCorrect = computed(() => found.value === flawedIds.value.length && falseFlags.value === 0)

function toggle(id: string) {
	if (checked.value) return
	flagged.value = flagged.value.includes(id)
		? flagged.value.filter((x) => x !== id)
		: [...flagged.value, id]
}

function check() {
	checked.value = true
	progress.recordTask(props.block.id, {
		correct: isCorrect.value,
		score: Math.max(0, (found.value - falseFlags.value) / flawedIds.value.length),
		answer: [...flagged.value],
	})
}

function retry() {
	checked.value = false
	flagged.value = []
}

function lineClass(id: string, flawed?: boolean) {
	const on = flagged.value.includes(id)
	if (!checked.value)
		return on
			? 'border-danger-600/60 bg-danger-50 ring-1 ring-danger-600/40'
			: 'border-transparent hover:border-ink-200 hover:bg-ink-50'
	if (flawed)
		return on ? 'border-success-600/50 bg-success-50' : 'border-warning-600/50 bg-warning-50'
	return on ? 'border-danger-600/40 bg-danger-50' : 'border-transparent'
}
</script>

<template>
	<TaskCard
		data-task="spot"
		:prompt="block.prompt"
		:done="progress.isTaskDone(block.id)"
		:correct="progress.taskResult(block.id)?.correct"
	>
		<div :class="['grid gap-4', block.reference && 'lg:grid-cols-2']">
			<section v-if="block.reference" class="rounded-xl border border-ink-200 bg-ink-50/70 p-4">
				<p class="eyebrow mb-2"><BrandText :text="block.reference.title" /></p>
				<ul class="space-y-1.5 text-[13px] leading-relaxed text-ink-700">
					<li v-for="(line, i) in block.reference.lines" :key="i"><RichText :text="line" /></li>
				</ul>
			</section>
			<AppFrame
				:visual="block.output.surface ?? 'copilot'"
				:title="block.output.title"
				subtitle="Copilot tarafından üretilmiş örnek çıktı"
			>
				<ul class="space-y-1 p-2.5" role="list">
					<li v-for="line in block.lines" :key="line.id">
						<button
							type="button"
							:aria-pressed="flagged.includes(line.id)"
							:class="[
								'flex w-full items-start gap-2.5 rounded-lg border px-2.5 py-2 text-start text-[14px] leading-relaxed text-ink-800 transition',
								lineClass(line.id, line.flawed),
							]"
							@click="toggle(line.id)"
						>
							<Flag
								:size="15"
								:class="[
									'mt-1 shrink-0',
									flagged.includes(line.id) ? 'fill-danger-600 text-danger-600' : 'text-ink-300',
								]"
								aria-hidden="true"
							/>
							<span class="min-w-0">
								<RichText :text="line.text" />
								<RichText
									v-if="checked && (line.flawed || flagged.includes(line.id))"
									as="span"
									:text="line.reason"
									:class="[
										'mt-1 block text-[12.5px]',
										line.flawed ? 'text-warning-700' : 'text-ink-500',
									]"
								/>
							</span>
						</button>
					</li>
				</ul>
			</AppFrame>
		</div>
		<div v-if="checked" class="mt-4">
			<FeedbackNote
				:tone="isCorrect ? 'correct' : found ? 'partial' : 'incorrect'"
				:title="`Sorunlu ${flawedIds.length} satırdan ${found} tanesini buldunuz${
					falseFlags ? ` · ${falseFlags} gereksiz işaret` : ''
				}`"
				:body="block.explanation"
			/>
		</div>
		<template #footer>
			<button
				v-if="!checked"
				type="button"
				class="btn btn-primary"
				:disabled="!flagged.length"
				@click="check"
			>
				Kontrol et
			</button>
			<button v-else type="button" class="btn btn-secondary" @click="retry">
				<RotateCcw :size="15" aria-hidden="true" /> Tekrar dene
			</button>
			<span class="text-[13px] text-ink-600">{{ flagged.length }} satır işaretlendi</span>
		</template>
	</TaskCard>
</template>
