import type { Lesson, Module, SkillKey } from '@/types/content'
import type { IconName } from '@/components/ui/icons'
import intro from './modules/01-intro'
import prompting from './modules/02-prompting'
import chat from './modules/03-chat'
import word from './modules/04-word'
import outlook from './modules/05-outlook'
import excel from './modules/06-excel'
import powerpoint from './modules/07-powerpoint'
import teams from './modules/08-teams'
import scenarios from './modules/09-scenarios'
import responsible from './modules/10-responsible'
import { QUIZ_QUESTIONS } from './quiz'

/** Lesson modules 1–10, in curriculum order. */
export const MODULES: Module[] = [
	intro,
	prompting,
	chat,
	word,
	outlook,
	excel,
	powerpoint,
	teams,
	scenarios,
	responsible,
]

export const QUIZ = {
	id: 'bilgi-testi',
	number: 11,
	title: 'Final Bilgi Testi',
	navLabel: 'Bilgi Testi',
	minutes: 15,
	description: `${QUIZ_QUESTIONS.length} soruluk değerlendirme: temel kavramlar, prompt kalitesi, doğru uygulama seçimi, iş senaryoları, doğrulama ve güvenli kullanım.`,
} as const

export const GRADUATION = {
	id: 'basarilarim',
	number: 12,
	title: 'Mezuniyet ve Başarılarım',
	navLabel: 'Başarılarım',
	minutes: 5,
	description:
		'Tamamlanma oranınız, rozetleriniz, güçlü ve gelişime açık alanlarınız ile eğitim tamamlama özetiniz.',
} as const

export interface LessonRef {
	module: Module
	lesson: Lesson
	/** Position in the whole curriculum, 0-based. */
	index: number
}

export const LESSON_REFS: LessonRef[] = MODULES.flatMap((module) =>
	module.lessons.map((lesson) => ({ module, lesson, index: 0 }))
).map((ref, index) => ({ ...ref, index }))

const byLessonId = new Map(LESSON_REFS.map((ref) => [ref.lesson.id, ref]))
const byModuleId = new Map(MODULES.map((m) => [m.id, m]))

export const getModule = (id: string) => byModuleId.get(id)
export const getLessonRef = (lessonId: string) => byLessonId.get(lessonId)

export const nextLessonRef = (lessonId: string): LessonRef | undefined => {
	const ref = byLessonId.get(lessonId)
	return ref ? LESSON_REFS[ref.index + 1] : undefined
}

export const previousLessonRef = (lessonId: string): LessonRef | undefined => {
	const ref = byLessonId.get(lessonId)
	return ref && ref.index > 0 ? LESSON_REFS[ref.index - 1] : undefined
}

export const moduleMinutes = (module: Module) =>
	module.lessons.reduce((sum, lesson) => sum + lesson.minutes, 0)

export const TOTAL_LESSONS = LESSON_REFS.length
export const TOTAL_MODULES = MODULES.length + 2
export const TOTAL_MINUTES =
	MODULES.reduce((sum, m) => sum + moduleMinutes(m), 0) + QUIZ.minutes + GRADUATION.minutes
export const INTERACTIVE_COUNT = LESSON_REFS.reduce(
	(sum, { lesson }) =>
		sum +
		lesson.steps.reduce(
			(n, step) => n + step.blocks.filter((b) => b.type === 'interactive').length,
			0
		),
	0
)

export const SKILLS: Record<SkillKey, { label: string; description: string; icon: IconName }> = {
	basics: {
		label: 'Copilot’ı doğru konumlandırma',
		description: 'Copilot’ın ne olduğunu, nerede çalıştığını ve sınırlarını bilmek.',
		icon: 'compass',
	},
	prompting: {
		label: 'Etkili prompt yazma',
		description: 'Amaç, bağlam, kaynak, beklenti ve kısıtlarla net talepler oluşturmak.',
		icon: 'wand',
	},
	apps: {
		label: 'Doğru uygulamayı seçme',
		description: 'Word, Outlook, PowerPoint ve Copilot Chat’i işe göre kullanmak.',
		icon: 'layers',
	},
	data: {
		label: 'Veriden içgörü çıkarma',
		description: 'Excel verisinde eğilim, sapma ve fırsatları sorgulamak.',
		icon: 'chart',
	},
	meetings: {
		label: 'Toplantı ve iletişim yönetimi',
		description: 'Toplantı ve e-posta trafiğini kararlara ve aksiyonlara dönüştürmek.',
		icon: 'users',
	},
	verify: {
		label: 'Çıktıyı doğrulama',
		description: 'Yapay zekâ çıktısını kaynağa göre kontrol edip iyileştirmek.',
		icon: 'scan',
	},
	safety: {
		label: 'Güvenli ve sorumlu kullanım',
		description: 'Hassas bilgiyi korumak, izinlere ve kurum politikalarına uymak.',
		icon: 'shield',
	},
}
