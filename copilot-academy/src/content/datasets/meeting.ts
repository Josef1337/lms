// Module 8: a fictional project meeting transcript and the notes derived
// from it. Every output line points back to the transcript lines it rests
// on; anything the meeting did not settle is written as “Belirtilmedi”.
export interface TranscriptLine {
	id: string
	speaker: string
	role: string
	initials: string
	time: string
	text: string
}

export const MEETING = {
	title: 'Mobil Uygulama v2.0 · Haftalık proje toplantısı',
	date: '12 Haziran · 10.00–10.20',
	participants: [
		'Elif Arslan (proje yöneticisi)',
		'Kerem Şahin (ürün sahibi)',
		'Zeynep Koç (test lideri)',
		'Onur Çelik (geliştirme)',
		'Deniz Yurt (finans)',
	],
}

export const TRANSCRIPT: TranscriptLine[] = [
	{
		id: 't1',
		speaker: 'Elif Arslan',
		role: 'Proje yöneticisi',
		initials: 'EA',
		time: '00:01',
		text: 'Herkese günaydın. Gündemimizde üç konu var: test durumu, müşteri demosu ve lisans maliyeti.',
	},
	{
		id: 't2',
		speaker: 'Zeynep Koç',
		role: 'Test lideri',
		initials: 'ZK',
		time: '00:02',
		text: 'Regresyon testlerinin %80’i tamamlandı. Ödeme ekranında iki kritik hata var; ikisi de geliştirmede.',
	},
	{
		id: 't3',
		speaker: 'Onur Çelik',
		role: 'Geliştirme',
		initials: 'OÇ',
		time: '00:04',
		text: 'Kritik hatalardan birini bugün kapatıyoruz. Diğeri için bankanın API dokümanını bekliyoruz; ne zaman geleceği belli değil.',
	},
	{
		id: 't4',
		speaker: 'Elif Arslan',
		role: 'Proje yöneticisi',
		initials: 'EA',
		time: '00:06',
		text: 'Bu durumda yayın tarihini 1 Temmuz olarak korumak riskli olabilir. Zeynep, test ortamındaki erişim sorunu çözüldü mü?',
	},
	{
		id: 't5',
		speaker: 'Zeynep Koç',
		role: 'Test lideri',
		initials: 'ZK',
		time: '00:07',
		text: 'Hâlâ iki test uzmanının erişimi yok. Perşembeye kadar çözülmezse testler bir hafta kayar.',
	},
	{
		id: 't6',
		speaker: 'Onur Çelik',
		role: 'Geliştirme',
		initials: 'OÇ',
		time: '00:08',
		text: 'Erişim talebini ben açarım, perşembeye kadar da takip ederim.',
	},
	{
		id: 't7',
		speaker: 'Kerem Şahin',
		role: 'Ürün sahibi',
		initials: 'KŞ',
		time: '00:10',
		text: 'Müşteri demosu 20 Haziran’da. Demo senaryosunu ben hazırlayacağım. Bir de prova yapalım ama tarihini henüz bilmiyorum.',
	},
	{
		id: 't8',
		speaker: 'Elif Arslan',
		role: 'Proje yöneticisi',
		initials: 'EA',
		time: '00:12',
		text: 'Tamam. Karar olarak şunu not alalım: Demo, ödeme ekranı olmadan, yalnızca profil ve bildirim özellikleriyle yapılacak.',
	},
	{
		id: 't9',
		speaker: 'Kerem Şahin',
		role: 'Ürün sahibi',
		initials: 'KŞ',
		time: '00:13',
		text: 'Katılıyorum, ödeme ekranını demoya almayalım.',
	},
	{
		id: 't10',
		speaker: 'Deniz Yurt',
		role: 'Finans',
		initials: 'DY',
		time: '00:15',
		text: 'Lisans maliyeti konusunda tedarikçiden güncel teklif gelmedi. Teklif gelmeden bütçe onayı veremeyiz.',
	},
	{
		id: 't11',
		speaker: 'Elif Arslan',
		role: 'Proje yöneticisi',
		initials: 'EA',
		time: '00:17',
		text: 'Teklifi kimin takip edeceğini ayrıca netleştirelim. Son olarak: yayın tarihi kararını bir sonraki toplantıda, banka dokümanı geldikten sonra verelim.',
	},
	{
		id: 't12',
		speaker: 'Elif Arslan',
		role: 'Proje yöneticisi',
		initials: 'EA',
		time: '00:18',
		text: 'Teşekkürler, herkese iyi çalışmalar.',
	},
]

export interface NoteLine {
	text: string
	refs?: string[]
	note?: string
}

export type MeetingOutput = 'summary' | 'decisions' | 'actions' | 'risks' | 'email'

export const MEETING_OUTPUTS: { id: MeetingOutput; label: string; prompt: string }[] = [
	{
		id: 'summary',
		label: 'Toplantı özeti',
		prompt: 'Bu toplantıyı katılamayanlar için kısa bir paragrafla özetle.',
	},
	{
		id: 'decisions',
		label: 'Kararlar',
		prompt: 'Bu toplantıda alınan kararları ve ertelenen kararları ayrı ayrı listele.',
	},
	{
		id: 'actions',
		label: 'Aksiyonlar ve sorumlular',
		prompt:
			'Aksiyon maddelerini sorumlu ve tarihleriyle listele. Transkriptte yoksa “Belirtilmedi” yaz.',
	},
	{
		id: 'risks',
		label: 'Riskler',
		prompt: 'Toplantıda dile getirilen riskleri ve kimin dile getirdiğini listele.',
	},
	{
		id: 'email',
		label: 'Takip e-postası',
		prompt:
			'Katılımcılara gönderilecek kısa bir takip e-postası taslağı hazırla: kararlar, aksiyonlar ve netleştirilecek konular.',
	},
]

export const MEETING_SUMMARY: NoteLine[] = [
	{
		text: 'Ekip test durumunu, müşteri demosunu ve lisans maliyetini görüştü. Regresyon testlerinin %80’i tamamlandı; ödeme ekranındaki iki kritik hatadan biri bugün kapatılacak, diğeri bankanın API dokümanını bekliyor.',
		refs: ['t2', 't3'],
	},
	{ text: '20 Haziran’daki müşteri demosu ödeme ekranı olmadan yapılacak.', refs: ['t7', 't8'] },
	{ text: 'Yayın tarihi (1 Temmuz) ve lisans bütçesi kararları ertelendi.', refs: ['t10', 't11'] },
]

export const MEETING_DECISIONS: NoteLine[] = [
	{
		text: '**Karar:** Müşteri demosu, ödeme ekranı olmadan; yalnızca profil ve bildirim özellikleriyle yapılacak.',
		refs: ['t8', 't9'],
	},
	{
		text: '**Ertelendi:** Yayın tarihi kararı, banka dokümanı geldikten sonra bir sonraki toplantıda verilecek.',
		refs: ['t11'],
	},
	{
		text: '**Ertelendi:** Lisans bütçesi onayı, tedarikçinin güncel teklifi gelene kadar bekleyecek.',
		refs: ['t10'],
	},
	{
		text: '1 Temmuz yayın tarihi değiştirilmedi; yalnızca riskli olabileceği belirtildi.',
		refs: ['t4'],
		note: 'Netleştirme',
	},
]

export const MEETING_ACTIONS = {
	columns: ['Aksiyon', 'Sorumlu', 'Tarih'],
	rows: [
		{
			cells: [
				'Kritik hatalardan birinin kapatılması',
				'Onur Çelik / geliştirme ekibi',
				'Bugün (12 Haziran)',
			],
			refs: ['t3'],
		},
		{
			cells: ['Test ortamı erişim talebinin açılması ve takibi', 'Onur Çelik', 'Perşembe'],
			refs: ['t6'],
		},
		{ cells: ['Demo senaryosunun hazırlanması', 'Kerem Şahin', 'Belirtilmedi'], refs: ['t7'] },
		{ cells: ['Demo provası', 'Belirtilmedi', 'Belirtilmedi'], refs: ['t7'] },
		{
			cells: ['Lisans teklifinin tedarikçiden takibi', 'Belirtilmedi', 'Belirtilmedi'],
			refs: ['t11'],
		},
	],
}

export const MEETING_RISKS: NoteLine[] = [
	{
		text: 'İkinci kritik hata bankanın API dokümanına bağlı; dokümanın ne zaman geleceği belli değil.',
		refs: ['t3'],
		note: 'Onur Çelik',
	},
	{
		text: 'Test ortamı erişimi perşembeye kadar çözülmezse testler bir hafta kayabilir.',
		refs: ['t5'],
		note: 'Zeynep Koç',
	},
	{ text: '1 Temmuz yayın tarihi risk altında.', refs: ['t4'], note: 'Elif Arslan' },
	{ text: 'Lisans teklifi gelmeden bütçe onayı verilemiyor.', refs: ['t10'], note: 'Deniz Yurt' },
]

export const MEETING_EMAIL = [
	'**Konu:** Mobil Uygulama v2.0 · 12 Haziran toplantı notları',
	'Merhaba ekip,',
	'Bugünkü toplantının özetini ve sonraki adımları aşağıda paylaşıyorum.',
	'**Kararlar:** 20 Haziran’daki müşteri demosu ödeme ekranı olmadan, profil ve bildirim özellikleriyle yapılacak. Yayın tarihi kararı, banka dokümanı geldikten sonra bir sonraki toplantıda verilecek.',
	'**Aksiyonlar:** Onur – test ortamı erişim talebi (perşembe). Kerem – demo senaryosu (tarih belirtilmedi). Geliştirme ekibi – kritik hatalardan birinin kapatılması (bugün).',
	'**Netleştirilecekler:** Demo provasının tarihi ve lisans teklifini kimin takip edeceği.',
	'Eksik veya hatalı bir nokta görürseniz lütfen yazın.',
	'[Adınız]',
]
