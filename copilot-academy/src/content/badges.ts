import type { IconName } from '@/components/ui/icons'
import type { Visual } from '@/types/content'

export interface BadgeContext {
	completedLessons: number
	totalLessons: number
	isModuleComplete: (moduleId: string) => boolean
	allModulesComplete: boolean
	/** Best final quiz ratio so far, or null before the first attempt. */
	bestQuizRatio: number | null
	overallPercent: number
}

export interface BadgeDef {
	id: string
	title: string
	description: string
	/** How to earn it, shown while locked. */
	hint: string
	icon: IconName
	visual: Visual
	earned: (ctx: BadgeContext) => boolean
}

const moduleBadge = (
	id: string,
	moduleId: string,
	title: string,
	description: string,
	icon: IconName,
	visual: Visual,
	moduleName: string
): BadgeDef => ({
	id,
	title,
	description,
	hint: `${moduleName} modülünü tamamlayın.`,
	icon,
	visual,
	earned: (ctx) => ctx.isModuleComplete(moduleId),
})

export const BADGES: BadgeDef[] = [
	{
		id: 'ilk-adim',
		title: 'İlk Adım',
		description: 'İlk dersinizi tamamladınız.',
		hint: 'Herhangi bir dersi tamamlayın.',
		icon: 'rocket',
		visual: 'copilot',
		earned: (ctx) => ctx.completedLessons >= 1,
	},
	moduleBadge(
		'copilot-kasifi',
		'copilot-giris',
		'Copilot Kâşifi',
		'Copilot’ın ne olduğunu ve sınırlarını öğrendiniz.',
		'compass',
		'copilot',
		'Copilot’a Giriş'
	),
	moduleBadge(
		'prompt-mimari',
		'prompt-atolyesi',
		'Prompt Mimarı',
		'Amaç, bağlam, kaynak, beklenti ve kısıtlarla prompt kurabiliyorsunuz.',
		'wand',
		'prompt',
		'Prompt Yazma Atölyesi'
	),
	moduleBadge(
		'sohbet-stratejisti',
		'copilot-chat',
		'Sohbet Stratejisti',
		'Karmaşık işleri adımlara bölüp takip sorularıyla ilerletiyorsunuz.',
		'messages',
		'chat',
		'Copilot Chat'
	),
	moduleBadge(
		'belge-ustasi',
		'word',
		'Belge Ustası',
		'Word’de taslak oluşturma, özetleme ve yeniden yazmayı uyguladınız.',
		'file',
		'word',
		'Word'
	),
	moduleBadge(
		'gelen-kutusu-pilotu',
		'outlook',
		'Gelen Kutusu Pilotu',
		'E-posta zincirlerini özetleyip bağlamı koruyan yanıtlar hazırladınız.',
		'inbox',
		'outlook',
		'Outlook'
	),
	moduleBadge(
		'veri-kasifi',
		'excel',
		'Veri Kâşifi',
		'Tablodaki eğilimleri ve sapmaları iş kararlarına dönüştürdünüz.',
		'chart',
		'excel',
		'Excel'
	),
	moduleBadge(
		'hikaye-anlaticisi',
		'powerpoint',
		'Hikâye Anlatıcısı',
		'Bir rapordan hedef kitleye uygun sunum akışı kurdunuz.',
		'presentation',
		'powerpoint',
		'PowerPoint'
	),
	moduleBadge(
		'toplanti-kaptani',
		'teams',
		'Toplantı Kaptanı',
		'Toplantıları kararlara, aksiyonlara ve takip mesajlarına dönüştürdünüz.',
		'users',
		'teams',
		'Teams'
	),
	moduleBadge(
		'uctan-uca-uzman',
		'senaryolar',
		'Uçtan Uca Uzman',
		'Birden fazla uygulamayı tek bir iş akışında birleştirdiniz.',
		'workflow',
		'scenario',
		'Uygulamalı Senaryolar'
	),
	moduleBadge(
		'sorumlu-kullanici',
		'guvenli-kullanim',
		'Sorumlu Kullanıcı',
		'Çıktıları doğrulama ve hassas bilgiyi koruma alışkanlığı kazandınız.',
		'shield',
		'shield',
		'Güvenli ve Sorumlu Kullanım'
	),
	{
		id: 'yolun-yarisi',
		title: 'Yolun Yarısı',
		description: 'Eğitimin yarısını tamamladınız.',
		hint: 'Toplam ilerlemenizi %50’ye ulaştırın.',
		icon: 'flag',
		visual: 'prompt',
		earned: (ctx) => ctx.overallPercent >= 50,
	},
	{
		id: 'final-basarisi',
		title: 'Final Başarısı',
		description: 'Final bilgi testini %80 veya üzeri puanla geçtiniz.',
		hint: 'Final bilgi testinde en az %80 alın.',
		icon: 'badge',
		visual: 'quiz',
		earned: (ctx) => ctx.bestQuizRatio !== null && ctx.bestQuizRatio >= 0.8,
	},
	{
		id: 'kusursuz-skor',
		title: 'Kusursuz Skor',
		description: 'Final bilgi testindeki bütün soruları doğru yanıtladınız.',
		hint: 'Final bilgi testinde %100 alın.',
		icon: 'star',
		visual: 'quiz',
		earned: (ctx) => ctx.bestQuizRatio === 1,
	},
	{
		// The id predates the title and stays: saved progress refers to it.
		id: 'akademi-mezunu',
		title: 'Eğitimi Tamamladı',
		description: 'Bütün modülleri tamamladınız ve final testini geçtiniz.',
		hint: 'Tüm dersleri tamamlayın ve final testini geçin.',
		icon: 'graduation',
		visual: 'trophy',
		earned: (ctx) =>
			ctx.allModulesComplete && ctx.bestQuizRatio !== null && ctx.bestQuizRatio >= 0.8,
	},
]

export const getBadge = (id: string) => BADGES.find((b) => b.id === id)
