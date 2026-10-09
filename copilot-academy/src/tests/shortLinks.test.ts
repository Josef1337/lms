import { describe, expect, it, vi } from 'vitest'
import { LESSON_REFS, MODULES } from '@/content'
import { resolveShortLink } from '@/lib/shortLinks'
import { router } from '@/router'

describe('short links', () => {
	it('opens a module or a lesson by its id', () => {
		expect(resolveShortLink('/excel')).toBe('/modul/excel')
		expect(resolveShortLink('word-2')).toBe('/modul/word/ders/word-2')
	})

	it('resolves every module and lesson id', () => {
		for (const m of MODULES) expect(resolveShortLink(`/${m.id}`)).toBe(`/modul/${m.id}`)
		for (const r of LESSON_REFS)
			expect(resolveShortLink(`/${r.lesson.id}`)).toBe(`/modul/${r.module.id}/ders/${r.lesson.id}`)
	})

	it('ignores empty, unknown, nested and unsafe paths', () => {
		for (const path of ['', '/', '/nope', '/modul/excel', '/excel/extra', '/ex cel', '/excel?x=1'])
			expect(resolveShortLink(path)).toBeNull()
	})

	it('redirects a short hash through the router and keeps unknown paths on the not-found page', async () => {
		// jsdom has no scrolling; the router's scrollBehavior calls it on every navigation.
		vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
		await router.push('/excel')
		expect(router.currentRoute.value.fullPath).toBe('/modul/excel')
		await router.push('/teams-2')
		expect(router.currentRoute.value.name).toBe('lesson')
		await router.push('/bilinmeyen-sayfa')
		expect(router.currentRoute.value.name).toBe('not-found')
	})
})
