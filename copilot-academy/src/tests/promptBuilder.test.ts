import { describe, expect, it } from 'vitest'
import {
	PROMPT_EXAMPLES,
	buildPrompt,
	buildSegments,
	coveredParts,
	emptyFields,
	promptHints,
	promptQuality,
} from '@/lib/promptBuilder'

describe('promptBuilder', () => {
	it('builds nothing from empty fields', () => {
		const fields = emptyFields()
		expect(buildPrompt(fields)).toBe('')
		expect(promptQuality(fields).level).toBe('empty')
		expect(promptHints(fields)[0].field).toBe('task')
	})

	it('turns each field into a sentence tagged with its part', () => {
		const fields = {
			...emptyFields(),
			task: 'rapor hazırla.',
			source: 'ekteki tablo',
			format: 'üç başlık',
		}
		const segments = buildSegments(fields)
		expect(segments.map((s) => s.part)).toEqual(['goal', 'source', 'expectation'])
		expect(buildPrompt(fields)).toBe(
			'Rapor hazırla. Kaynak olarak şunu kullan: ekteki tablo. Çıktıyı şu biçimde sun: üç başlık.'
		)
	})

	it('capitalises Turkish dotted i correctly and trims stray punctuation', () => {
		const fields = { ...emptyFields(), task: '  istanbul ofisi için duyuru yaz,,  ' }
		expect(buildPrompt(fields)).toBe('İstanbul ofisi için duyuru yaz.')
	})

	it('covers all five parts for the bundled examples', () => {
		for (const example of PROMPT_EXAMPLES) {
			expect(coveredParts(example.fields).size).toBe(5)
			expect(promptQuality(example.fields).level).toBe('strong')
			expect(promptHints(example.fields)).toHaveLength(0)
		}
	})

	it('flags a task that is too short', () => {
		const hints = promptHints({ ...emptyFields(), task: 'rapor' })
		expect(hints[0].message).toMatch(/çok kısa/)
	})

	it('adds the verification sentence only when asked', () => {
		const base = { ...emptyFields(), task: 'özet çıkar' }
		expect(buildPrompt(base)).not.toMatch(/varsayma/)
		expect(buildPrompt({ ...base, verify: true })).toMatch(/Kaynakta bulunmayan bilgileri varsayma/)
	})
})
