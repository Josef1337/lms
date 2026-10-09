import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import ChoiceTask from '@/components/tasks/ChoiceTask.vue'
import ClassifyTask from '@/components/tasks/ClassifyTask.vue'
import PromptBuilder from '@/components/interactive/PromptBuilder.vue'
import { PROMPT_EXAMPLES, buildPrompt } from '@/lib/promptBuilder'
import { useProgress } from '@/stores/progress'
import type { ChoiceTaskBlock, ClassifyTaskBlock } from '@/types/content'

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
		const check = () => wrapper.findAll('button').find((b) => b.text().includes('Kontrol et'))!
		expect(check().attributes('disabled')).toBeDefined()
		await wrapper.findAll('[role="radio"]')[1].trigger('click')
		await check().trigger('click')
		expect(wrapper.text()).toContain('Evet')
		expect(useProgress().taskResult('test-choice')).toMatchObject({ correct: true, answer: ['b'] })
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
