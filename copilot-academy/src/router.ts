import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'
import { getLessonRef, getModule } from '@/content'
import AppShell from '@/components/layout/AppShell.vue'
import { resolveShortLink } from '@/lib/shortLinks'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'welcome',
		component: () => import('@/pages/WelcomePage.vue'),
		meta: { title: 'Copilot Academy' },
	},
	{
		path: '/',
		component: AppShell,
		children: [
			{
				path: 'panel',
				name: 'dashboard',
				component: () => import('@/pages/DashboardPage.vue'),
				meta: { title: 'Genel Bakış' },
			},
			{
				path: 'modul/:moduleId',
				name: 'module',
				component: () => import('@/pages/ModulePage.vue'),
				beforeEnter: (to) => (getModule(String(to.params.moduleId)) ? true : { name: 'not-found' }),
			},
			{
				path: 'modul/:moduleId/ders/:lessonId',
				name: 'lesson',
				component: () => import('@/pages/LessonPage.vue'),
				beforeEnter: (to) => {
					const ref = getLessonRef(String(to.params.lessonId))
					return ref && ref.module.id === to.params.moduleId ? true : { name: 'not-found' }
				},
			},
			{
				path: 'bilgi-testi',
				name: 'quiz',
				component: () => import('@/pages/QuizPage.vue'),
				meta: { title: 'Final Bilgi Testi' },
			},
			{
				path: 'basarilarim',
				name: 'achievements',
				component: () => import('@/pages/AchievementsPage.vue'),
				meta: { title: 'Başarılarım' },
			},
			{
				path: 'bulunamadi',
				name: 'not-found',
				component: () => import('@/pages/NotFoundPage.vue'),
				meta: { title: 'Sayfa bulunamadı' },
			},
			{
				path: ':pathMatch(.*)*',
				// Empty params: an object redirect would otherwise carry pathMatch over.
				redirect: (to) => resolveShortLink(to.path) ?? { name: 'not-found', params: {} },
			},
		],
	},
]

export const router = createRouter({
	history: createWebHashHistory(),
	routes,
	scrollBehavior(_to, _from, saved) {
		return saved ?? { top: 0 }
	},
})

router.afterEach((to) => {
	let title = typeof to.meta.title === 'string' ? to.meta.title : ''
	if (to.name === 'module') title = getModule(String(to.params.moduleId))?.title ?? ''
	if (to.name === 'lesson') title = getLessonRef(String(to.params.lessonId))?.lesson.title ?? ''
	document.title =
		title && title !== 'Copilot Academy' ? `${title} · Copilot Academy` : 'Copilot Academy'
})
