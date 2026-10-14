// The course's counts and the completion summary: every screen gives the same
// module count, lesson flow and duration, and the printed summary cannot be
// mistaken for a certificate.
import { beforeEach, describe, expect, it } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { defineComponent, type Component } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import {
	GRADUATION,
	LESSON_REFS,
	MODULES,
	TOTAL_LESSONS,
	TOTAL_MINUTES,
	TOTAL_MODULES,
} from '@/content'
import { getBadge } from '@/content/badges'
import { PHASES } from '@/components/lesson/phases'
import { formatDate, formatMinutes } from '@/lib/format'
import { STORAGE_KEY, emptyProgress, useProgress, type ProgressData } from '@/stores/progress'
import type { RevealBlock } from '@/types/content'
import RevealSteps from '@/components/blocks/RevealSteps.vue'
import AchievementsPage from '@/pages/AchievementsPage.vue'
import ModulePage from '@/pages/ModulePage.vue'
import WelcomePage from '@/pages/WelcomePage.vue'

const Blank = defineComponent({ render: () => null })

async function mountPage(page: Component, path = '/') {
	const router = createRouter({
		history: createMemoryHistory(),
		routes: [
			{ path: '/', name: 'welcome', component: Blank },
			{ path: '/panel', name: 'dashboard', component: Blank },
			{ path: '/modul/:moduleId', name: 'module', component: Blank },
			{ path: '/modul/:moduleId/ders/:lessonId', name: 'lesson', component: Blank },
			{ path: '/bilgi-testi', name: 'quiz', component: Blank },
			{ path: '/basarilarim', name: 'achievements', component: Blank },
		],
	})
	router.push(path)
	await router.isReady()
	const wrapper = mount(page, { global: { plugins: [router] } })
	await flushPromises()
	return wrapper
}

/** Saves progress before the store is created, as a returning learner's browser would. */
function seed(edit: (data: ProgressData) => void) {
	const data = emptyProgress()
	data.startedAt = '2026-03-01T08:00:00.000Z'
	edit(data)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const completeAllLessons = (data: ProgressData, at: (index: number) => string) => {
	for (const ref of LESSON_REFS)
		data.lessons[ref.lesson.id] = {
			step: 0,
			furthest: ref.lesson.steps.length,
			startedAt: '2026-03-01T08:00:00.000Z',
			completedAt: at(ref.index),
		}
}

const attempt = (at: string, passed: boolean) => ({
	id: at,
	at,
	answers: {},
	correct: passed ? 14 : 9,
	total: 15,
	ratio: passed ? 14 / 15 : 9 / 15,
	passed,
})

beforeEach(() => {
	localStorage.clear()
	setActivePinia(createPinia())
})

describe('course counts', () => {
	it('counts the ten lesson modules only, and one total time', () => {
		expect(TOTAL_MODULES).toBe(MODULES.length)
		expect(TOTAL_MODULES).toBe(10)
		// The welcome page's total and a fresh dashboard's remaining time agree.
		expect(useProgress().remainingMinutes).toBe(TOTAL_MINUTES)
	})

	it('welcome page: 10 modules, one duration and a lesson flow with no fixed step count', async () => {
		const wrapper = await mountPage(WelcomePage)
		const text = wrapper.text()

		expect(wrapper.find('dl dd').text()).toBe(String(MODULES.length))
		expect(text).toContain(`${TOTAL_LESSONS} ders, final testi ve tamamlama özeti`)
		expect(text).toContain(`${MODULES.length} modülde sıfırdan uygulamaya`)
		expect(text).toContain(`toplam ${formatMinutes(TOTAL_MINUTES)}`)
		expect(text).not.toMatch(/mezun/i)
		expect(text).not.toMatch(/Modül 1[12]\b/)
		expect(text).not.toContain('yedi adım')

		const hint = wrapper.find('#start-hint')
		expect(hint.text()).toBe(
			`İlk ders yaklaşık ${LESSON_REFS[0].lesson.minutes} dk · toplam yaklaşık ${Math.round(
				TOTAL_MINUTES / 60
			)} saat · istediğiniz zaman ara verebilirsiniz.`
		)
		const start = wrapper.findAll('button').find((b) => b.text().includes('Eğitime Başla'))!
		expect(start.attributes('aria-describedby')).toBe('start-hint')

		// The loop names the stepper's phases; "Kontrol et" sits inside Uygula.
		const loop = wrapper.find('#nasil')
		expect(loop.find('#loop-title').text()).not.toMatch(/\d/)
		const items = loop.findAll('ul')[0].findAll('li')
		expect(items.map((li) => li.find('p').text())).toEqual(
			['learn', 'see', 'explore', 'practice', 'reinforce', 'continue'].map(
				(p) => PHASES[p as keyof typeof PHASES].label
			)
		)
		expect(items[3].text()).toContain('“Kontrol et”')
	})

	it('welcome page: a returning learner sees the dashboard’s remaining time', async () => {
		seed((data) => {
			completeAllLessons(data, () => '2026-03-02T10:00:00.000Z')
			delete data.lessons[LESSON_REFS[LESSON_REFS.length - 1].lesson.id]
		})
		const wrapper = await mountPage(WelcomePage)
		const remaining = useProgress().remainingMinutes
		expect(remaining).toBeGreaterThan(0)
		expect(wrapper.find('#start-hint').text()).toBe(
			`Kalan süre yaklaşık ${formatMinutes(remaining)} · istediğiniz zaman ara verebilirsiniz.`
		)
	})

	it('module page: “Modül N / 10” and the same flow without “Kontrol et” as a step', async () => {
		const module = MODULES[1]
		const wrapper = await mountPage(ModulePage, `/modul/${module.id}`)
		expect(wrapper.find('.eyebrow').text()).toBe(`Modül ${module.number} / ${MODULES.length}`)

		const flow = wrapper.findAll('aside section').find((s) => s.text().includes('Derslerin akışı'))!
		const labels = flow.findAll('li').map((li) => li.text())
		expect(labels).toEqual(['Öğren', 'Gör', 'Keşfet', 'Uygula', 'Pekiştir', 'Devam et'])
		expect(flow.text()).toContain('ayrı bir aşama değil')
	})
})

describe('RevealSteps', () => {
	const block: RevealBlock = {
		type: 'reveal',
		steps: ['Bir', 'İki', 'Üç', 'Dört'].map((title) => ({ title, body: `${title} açıklaması` })),
	}

	it('counts its own parts on the button and keeps focus on restart', async () => {
		const wrapper = mount(RevealSteps, { props: { block }, attachTo: document.body })
		const more = () => wrapper.findAll('button').find((b) => b.text().startsWith('Devamını göster'))

		expect(more()!.find('[aria-hidden="true"]').text()).toBe('(1/4)')
		expect(wrapper.text()).not.toContain('adım')
		for (let i = 0; i < 3; i++) await more()!.trigger('click')
		await flushPromises()

		expect(more()).toBeUndefined()
		expect(wrapper.text()).toContain('Tümü gösterildi (4/4)')
		const restart = wrapper.findAll('button').find((b) => b.text().includes('Baştan izle'))!
		;(restart.element as HTMLElement).focus()
		await restart.trigger('click')
		await flushPromises()

		expect(more()!.find('[aria-hidden="true"]').text()).toBe('(1/4)')
		expect(document.activeElement).toBe(more()!.element)
		wrapper.unmount()
	})
})

describe('completion summary', () => {
	it('is plainly not a certificate', async () => {
		const wrapper = await mountPage(AchievementsPage, '/basarilarim')
		expect(wrapper.find('h1').text()).toBe(GRADUATION.title)
		expect(wrapper.text()).not.toMatch(/mezun/i)
		expect(wrapper.find('.eyebrow').text()).not.toMatch(/Modül/)

		const summary = wrapper.find('.print-area')
		// No product logo on the printout.
		expect(summary.find('img').exists()).toBe(false)
		// The disclaimer comes right after the title, at body size.
		const disclaimer = summary.find('#summary-disclaimer')
		expect(summary.find('#summary-title').element.parentElement!.nextElementSibling).toBe(
			disclaimer.element
		)
		expect(disclaimer.text()).toBe(
			'Kendi kendine tamamlanan eğitim simülasyonu özeti; sertifika veya resmî kayıt değildir.'
		)
		expect(summary.attributes('aria-describedby')).toBe('summary-disclaimer')
		expect(summary.text()).toContain(
			'Bu tarayıcıda kaydedilen ilerlemeye dayanır, doğrulanmamıştır.'
		)
		expect(summary.text()).toContain(`Yazdırma tarihi${formatDate(new Date().toISOString())}`)
		expect(summary.text()).toContain('Tamamlanma tarihiHenüz tamamlanmadı')
	})

	it('dates a finished course by the later of the last lesson and the first pass', async () => {
		seed((data) => {
			completeAllLessons(data, (i) =>
				i === 5 ? '2026-03-05T10:00:00.000Z' : '2026-03-02T10:00:00.000Z'
			)
			data.quiz.attempts = [
				attempt('2026-03-03T10:00:00.000Z', false),
				attempt('2026-03-04T10:00:00.000Z', true),
				attempt('2026-03-09T10:00:00.000Z', true),
			]
			data.badges['akademi-mezunu'] = '2026-03-05T10:00:00.000Z'
		})
		const wrapper = await mountPage(AchievementsPage, '/basarilarim')
		const summary = wrapper.find('.print-area')
		expect(summary.text()).toContain(`Tamamlanma tarihi${formatDate('2026-03-05T10:00:00.000Z')}`)
		expect(summary.text()).toContain(`${MODULES.length} modül ve final testi tamamlandı`)
		expect(summary.text()).toContain('Eğitimi Tamamladı')
	})

	it('uses the first passing test when it came after the last lesson', async () => {
		seed((data) => {
			completeAllLessons(data, () => '2026-03-02T10:00:00.000Z')
			data.quiz.attempts = [attempt('2026-03-07T10:00:00.000Z', true)]
		})
		const wrapper = await mountPage(AchievementsPage, '/basarilarim')
		expect(wrapper.find('.print-area').text()).toContain(
			`Tamamlanma tarihi${formatDate('2026-03-07T10:00:00.000Z')}`
		)
	})

	it('labels an interim summary with the latest saved progress, not as finished', async () => {
		seed((data) => {
			data.lessons[LESSON_REFS[0].lesson.id] = {
				step: 0,
				furthest: 1,
				startedAt: '2026-03-01T08:00:00.000Z',
				completedAt: '2026-03-01T09:00:00.000Z',
			}
			data.quiz.attempts = [attempt('2026-03-06T10:00:00.000Z', false)]
		})
		const wrapper = await mountPage(AchievementsPage, '/basarilarim')
		const text = wrapper.find('.print-area').text()
		expect(text).toContain(`Son kaydedilen ilerleme${formatDate('2026-03-06T10:00:00.000Z')}`)
		expect(text).toContain('Ara özet · eğitim devam ediyor')
		expect(text).not.toContain('Tamamlanma tarihi')
	})

	it('keeps the badge id that saved progress refers to', () => {
		expect(getBadge('akademi-mezunu')?.title).toBe('Eğitimi Tamamladı')
	})
})
