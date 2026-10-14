import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChoiceTask from '@/components/tasks/ChoiceTask.vue'
import ClassifyTask from '@/components/tasks/ClassifyTask.vue'
import QuestionSet from '@/components/tasks/QuestionSet.vue'
import TaskCard from '@/components/tasks/TaskCard.vue'
import PromptBuilder from '@/components/interactive/PromptBuilder.vue'
import { PROMPT_EXAMPLES, buildPrompt } from '@/lib/promptBuilder'
import { seededShuffle } from '@/lib/shuffle'
import { useProgress } from '@/stores/progress'
import type { ChoiceTaskBlock, ClassifyTaskBlock, QuestionsBlock } from '@/types/content'

const choice: ChoiceTaskBlock = {
	type: 'choice',
	id: 'test-choice',
	prompt: 'Hangisi?',
	options: [
		{ id: 'a', text: 'Yanlış', feedback: 'Hayır' },
		{ id: 'b', text: 'Doğru', correct: true, feedback: 'Evet' },
	],
	explanation: 'Açıklama',
}

const questions: QuestionsBlock = {
	type: 'questions',
	id: 'test-questions',
	questions: [
		{
			id: 'q1',
			prompt: 'Birinci soru',
			options: [
				{ id: 'a', text: 'Bir-A' },
				{ id: 'b', text: 'Bir-B' },
				{ id: 'c', text: 'Bir-C' },
			],
			correct: 'b',
			explanation: 'Birinci açıklama',
		},
		{
			id: 'q2',
			prompt: 'İkinci soru',
			options: [
				{ id: 'a', text: 'İki-A' },
				{ id: 'b', text: 'İki-B' },
				{ id: 'c', text: 'İki-C' },
			],
			correct: 'a',
			explanation: 'İkinci açıklama',
		},
	],
}

/** The option button whose text starts with `text`, wherever the shuffle put it. */
const option = (wrapper: VueWrapper, text: string) =>
	wrapper.findAll('[role="radio"], [role="checkbox"]').find((b) => b.text().startsWith(text))!
const button = (wrapper: VueWrapper, text: string) =>
	wrapper.findAll('button').find((b) => b.text().includes(text))

const classify: ClassifyTaskBlock = {
	type: 'classify',
	id: 'test-classify',
	prompt: 'Sınıflandırın',
	categories: [
		{ id: 'x', label: 'X', description: '', tone: 'good' },
		{ id: 'y', label: 'Y', description: '', tone: 'stop' },
	],
	items: [
		{ id: 'i1', text: 'Bir', category: 'x', feedback: 'f1' },
		{ id: 'i2', text: 'İki', category: 'y', feedback: 'f2' },
	],
}

describe('task components', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
	})

	it('ChoiceTask checks the selection and stores the result', async () => {
		const wrapper = mount(ChoiceTask, { props: { block: choice } })
		const check = () => button(wrapper, 'Kontrol et')!
		expect(check().attributes('disabled')).toBeDefined()
		await option(wrapper, 'Doğru').trigger('click')
		await check().trigger('click')
		expect(wrapper.text()).toContain('Evet')
		expect(useProgress().taskResult('test-choice')).toMatchObject({ correct: true, answer: ['b'] })
		expect(wrapper.text()).toContain('Tamamlandı')
	})

	it('ChoiceTask keeps a pick neutral until it is checked', async () => {
		const wrapper = mount(ChoiceTask, { props: { block: choice } })
		await option(wrapper, 'Yanlış').trigger('click')
		const picked = option(wrapper, 'Yanlış')
		expect(picked.attributes('aria-checked')).toBe('true')
		expect(picked.attributes('data-state')).toBe('selected')
		expect(picked.classes()).toContain('option-card-selected')
		expect(picked.html()).not.toMatch(/danger|brand/)
		expect(useProgress().taskResult('test-choice')).toBeUndefined()
		// A pick can still change before the check.
		await option(wrapper, 'Doğru').trigger('click')
		expect(option(wrapper, 'Doğru').attributes('data-state')).toBe('selected')
		expect(option(wrapper, 'Yanlış').attributes('data-state')).toBe('idle')
	})

	it('ChoiceTask marks a wrong answer red with an X and reads “Yanıtlandı”', async () => {
		const wrapper = mount(ChoiceTask, { props: { block: choice } })
		await option(wrapper, 'Yanlış').trigger('click')
		await button(wrapper, 'Kontrol et')!.trigger('click')
		const wrong = option(wrapper, 'Yanlış')
		expect(wrong.attributes('data-state')).toBe('wrong')
		expect(wrong.classes()).toContain('option-card-wrong')
		expect(wrong.find('.lucide-x').exists()).toBe(true)
		expect(wrong.find('.lucide-check').exists()).toBe(false)
		expect(wrong.text()).toContain('Yanlış seçim.')
		const right = option(wrapper, 'Doğru')
		expect(right.attributes('data-state')).toBe('missed')
		expect(right.find('.lucide-check').exists()).toBe(true)
		expect(wrapper.text()).toContain('Yanıtlandı')
		expect(wrapper.text()).not.toContain('Tamamlandı')
		expect(useProgress().taskResult('test-choice')).toMatchObject({ correct: false })
	})

	it('ChoiceTask moves the focus to the feedback, then back to the options', async () => {
		const wrapper = mount(ChoiceTask, { props: { block: choice }, attachTo: document.body })
		await option(wrapper, 'Yanlış').trigger('click')
		await button(wrapper, 'Kontrol et')!.trigger('click')
		await flushPromises()
		expect(document.activeElement?.textContent).toContain('Tam olarak değil')
		await button(wrapper, 'Tekrar dene')!.trigger('click')
		await flushPromises()
		const options = wrapper.findAll('[role="radio"]')
		expect(document.activeElement).toBe(options[0].element)
		expect(options.every((o) => o.attributes('data-state') === 'idle')).toBe(true)
		wrapper.unmount()
	})

	it('ChoiceTask shows its options in a fixed shuffled order', () => {
		const block: ChoiceTaskBlock = {
			...choice,
			options: ['a', 'b', 'c', 'd', 'e'].map((id) => ({ id, text: `Seçenek ${id}`, feedback: '' })),
		}
		const order = (w: VueWrapper) => w.findAll('[role="radio"]').map((b) => b.text())
		const shown = order(mount(ChoiceTask, { props: { block } }))
		expect(shown).toEqual(seededShuffle(block.options, block.id).map((o) => o.text))
		expect(order(mount(ChoiceTask, { props: { block } }))).toEqual(shown)
	})

	it('QuestionSet checks each question only after “Kontrol et”', async () => {
		const wrapper = mount(QuestionSet, { props: { block: questions }, attachTo: document.body })
		const checks = () => wrapper.findAll('button').filter((b) => b.text() === 'Kontrol et')
		expect(checks()).toHaveLength(2)
		expect(checks().every((b) => b.attributes('disabled') !== undefined)).toBe(true)

		// A tap only selects, neutrally, and can still be changed.
		await option(wrapper, 'Bir-A').trigger('click')
		expect(option(wrapper, 'Bir-A').attributes('data-state')).toBe('selected')
		expect(wrapper.text()).not.toContain('Birinci açıklama')
		await option(wrapper, 'Bir-C').trigger('click')
		expect(option(wrapper, 'Bir-A').attributes('data-state')).toBe('idle')
		expect(option(wrapper, 'Bir-C').attributes('aria-checked')).toBe('true')

		await checks()[0].trigger('click')
		await flushPromises()
		expect(option(wrapper, 'Bir-C').attributes('data-state')).toBe('wrong')
		expect(option(wrapper, 'Bir-C').find('.lucide-x').exists()).toBe(true)
		expect(option(wrapper, 'Bir-B').attributes('data-state')).toBe('missed')
		expect(document.activeElement?.textContent).toContain('Birinci açıklama')
		// The checked answer is final: another tap changes nothing.
		await option(wrapper, 'Bir-B').trigger('click')
		expect(option(wrapper, 'Bir-C').attributes('aria-checked')).toBe('true')
		expect(useProgress().taskResult('test-questions')).toBeUndefined()

		await option(wrapper, 'İki-A').trigger('click')
		await checks()[0].trigger('click')
		expect(option(wrapper, 'İki-A').attributes('data-state')).toBe('correct')
		expect(useProgress().taskResult('test-questions')).toMatchObject({
			correct: false,
			score: 0.5,
			answer: { q1: 'c', q2: 'a' },
		})
		expect(wrapper.text()).toMatch(/2\/2 yanıtlandı\s+· 1 doğru/)
		expect(wrapper.text()).toContain('Yanıtlandı')
		wrapper.unmount()
	})

	it('QuestionSet can be solved again from the start', async () => {
		useProgress().recordTask('test-questions', {
			correct: false,
			score: 0.5,
			answer: { q1: 'c', q2: 'a' },
		})
		const wrapper = mount(QuestionSet, { props: { block: questions }, attachTo: document.body })
		expect(option(wrapper, 'Bir-C').attributes('data-state')).toBe('wrong')
		await button(wrapper, 'Soruları tekrar çöz')!.trigger('click')
		await flushPromises()
		expect(wrapper.text()).toContain('0/2 yanıtlandı')
		expect(document.activeElement).toBe(wrapper.findAll('[role="radio"]')[0].element)

		const checks = () => wrapper.findAll('button').filter((b) => b.text() === 'Kontrol et')
		await option(wrapper, 'Bir-B').trigger('click')
		await checks()[0].trigger('click')
		await option(wrapper, 'İki-A').trigger('click')
		await checks()[0].trigger('click')
		expect(useProgress().taskResult('test-questions')).toMatchObject({ correct: true, score: 1 })
		expect(wrapper.text()).toContain('Tamamlandı')
		expect(button(wrapper, 'Soruları tekrar çöz')).toBeUndefined()
		wrapper.unmount()
	})

	it('TaskCard says “Tamamlandı” unless the stored result is wrong', () => {
		const chip = (props: Record<string, unknown>) => mount(TaskCard, { props }).text()
		expect(chip({ done: true })).toContain('Tamamlandı')
		expect(chip({ done: true, correct: true })).toContain('Tamamlandı')
		expect(chip({ done: true, correct: false })).toContain('Yanıtlandı')
		expect(chip({ done: false, correct: false })).not.toMatch(/Tamamlandı|Yanıtlandı/)
	})

	it('ClassifyTask gives feedback per item and scores first picks', async () => {
		const wrapper = mount(ClassifyTask, { props: { block: classify } })
		const groups = wrapper.findAll('[role="radiogroup"]')
		await groups[0].findAll('button')[1].trigger('click') // wrong first pick
		expect(wrapper.text()).toContain('Daha uygun kategori: X')
		await groups[0].findAll('button')[0].trigger('click') // corrected
		await groups[1].findAll('button')[1].trigger('click')
		const result = useProgress().taskResult('test-classify')
		expect(result?.score).toBe(0.5)
		expect(result?.correct).toBe(false)
	})
})

describe('PromptBuilder', () => {
	beforeEach(() => {
		localStorage.clear()
		setActivePinia(createPinia())
	})

	it('loads an example, copies the built prompt and completes the task', async () => {
		const writeText = vi.fn().mockResolvedValue(undefined)
		Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
		Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true })

		const wrapper = mount(PromptBuilder, { props: { taskId: 'pb-task' } })
		const example = PROMPT_EXAMPLES[0]
		await wrapper
			.findAll('button')
			.find((b) => b.text() === example.title)!
			.trigger('click')
		expect(wrapper.text()).toContain('5/5')

		await wrapper
			.findAll('button')
			.find((b) => b.text().includes('Prompt’u kopyala'))!
			.trigger('click')
		await flushPromises()
		expect(writeText).toHaveBeenCalledWith(buildPrompt(example.fields))
		expect(wrapper.text()).toContain('Kopyalandı')

		await wrapper
			.findAll('button')
			.find((b) => b.text().includes('Görevi Tamamla'))!
			.trigger('click')
		expect(useProgress().taskResult('pb-task')).toMatchObject({ correct: true, score: 1 })
		// Only coverage is stored, never the typed text.
		expect(JSON.stringify(useProgress().taskResult('pb-task'))).not.toContain(example.fields.task)

		await wrapper
			.findAll('button')
			.find((b) => b.text().includes('Alanları temizle'))!
			.trigger('click')
		expect(wrapper.text()).toContain('Prompt’unuz burada oluşacak')
	})
})
