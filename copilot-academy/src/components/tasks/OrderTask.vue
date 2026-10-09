<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDown, ArrowUp, CircleCheck, CircleX, RotateCcw } from 'lucide-vue-next'
import type { OrderTaskBlock } from '@/types/content'
import { useProgress } from '@/stores/progress'
import RichText from '@/components/ui/RichText.vue'
import FeedbackNote from './FeedbackNote.vue'
import TaskCard from './TaskCard.vue'

const props = defineProps<{ block: OrderTaskBlock }>()
const progress = useProgress()

const stored = progress.taskResult(props.block.id)
const order = ref<string[]>(
	Array.isArray(stored?.answer) ? (stored.answer as string[]) : [...props.block.initial]
)
const checked = ref(!!stored)
const announcement = ref('')

const items = computed(() => order.value.map((id) => props.block.items.find((i) => i.id === id)!))
const correctOrder = computed(() => props.block.items.map((i) => i.id))
const inPlace = computed(() => order.value.filter((id, i) => correctOrder.value[i] === id).length)
const isCorrect = computed(() => inPlace.value === order.value.length)

function move(index: number, delta: number) {
	const target = index + delta
	if (checked.value || target < 0 || target >= order.value.length) return
	const next = [...order.value]
	;[next[index], next[target]] = [next[target], next[index]]
	order.value = next
	const item = props.block.items.find((i) => i.id === next[target])
	announcement.value = `${item?.hint ?? 'Öğe'} ${target + 1}. sıraya taşındı.`
}

function check() {
	checked.value = true
	progress.recordTask(props.block.id, {
		correct: isCorrect.value,
		score: inPlace.value / order.value.length,
		answer: [...order.value],
	})
}

function retry() {
	checked.value = false
}
</script>

<template>
	<TaskCard data-task="order" :prompt="block.prompt" :done="progress.isTaskDone(block.id)">
		<p class="mb-3 text-xs font-medium text-ink-500">
			Okları kullanarak öğeleri doğru sıraya getirin.
		</p>
		<ol class="space-y-2" role="list">
			<li
				v-for="(item, i) in items"
				:key="item.id"
				:class="[
					'flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition',
					checked
						? correctOrder[i] === item.id
							? 'border-success-600/50 bg-success-50'
							: 'border-danger-600/40 bg-danger-50'
						: 'border-ink-200',
				]"
			>
				<span
					class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ink-100 text-[13px] font-bold text-ink-600"
					>{{ i + 1 }}</span
				>
				<RichText :text="item.text" class="min-w-0 flex-1 text-[14px] text-ink-800" />
				<template v-if="checked">
					<CircleCheck
						v-if="correctOrder[i] === item.id"
						:size="18"
						class="shrink-0 text-success-700"
						aria-label="Doğru sırada"
					/>
					<CircleX v-else :size="18" class="shrink-0 text-danger-600" aria-label="Yanlış sırada" />
				</template>
				<div v-else class="flex shrink-0 gap-1">
					<button
						type="button"
						class="btn btn-ghost btn-sm px-2"
						:disabled="i === 0"
						:aria-label="`${i + 1}. öğeyi yukarı taşı`"
						@click="move(i, -1)"
					>
						<ArrowUp :size="16" aria-hidden="true" />
					</button>
					<button
						type="button"
						class="btn btn-ghost btn-sm px-2"
						:disabled="i === items.length - 1"
						:aria-label="`${i + 1}. öğeyi aşağı taşı`"
						@click="move(i, 1)"
					>
						<ArrowDown :size="16" aria-hidden="true" />
					</button>
				</div>
			</li>
		</ol>
		<p class="sr-only" aria-live="polite">{{ announcement }}</p>
		<div v-if="checked" class="mt-4">
			<FeedbackNote
				:tone="isCorrect ? 'correct' : 'partial'"
				:title="isCorrect ? 'Sıralama doğru' : `${inPlace}/${items.length} öğe doğru yerde`"
				:body="block.explanation"
			>
				<ol v-if="!isCorrect" class="mt-2 list-decimal space-y-0.5 ps-5 text-[13px] text-ink-600">
					<li v-for="i in block.items" :key="i.id"><RichText :text="i.text" /></li>
				</ol>
			</FeedbackNote>
		</div>
		<template #footer>
			<button v-if="!checked" type="button" class="btn btn-primary" @click="check">
				Kontrol et
			</button>
			<button v-else type="button" class="btn btn-secondary" @click="retry">
				<RotateCcw :size="15" aria-hidden="true" /> Yeniden düzenle
			</button>
		</template>
	</TaskCard>
</template>
