// Module 5 samples: a fictional e-mail thread with Copilot outputs derived
// from it, and a reply written in several tones. No message is ever sent.

export interface Mail {
	id: string
	from: string
	role: string
	initials: string
	time: string
	body: string
}

export const THREAD_SUBJECT = 'Q3 bayi toplantısı · mekân ve tarih'

export const THREAD: Mail[] = [
	{
		id: 'm1',
		from: 'Selin Kaya',
		role: 'Pazarlama',
		initials: 'SK',
		time: '3 Haziran 09:12',
		body: 'Merhaba, Q3 bayi toplantısı için iki mekân seçeneğimiz var: İstanbul’daki Marmara Kongre Merkezi ve İzmir’deki Ege Fuar Alanı. Tarih olarak 12 veya 19 Eylül’ü öneriyoruz. Katılımcı sayısı yaklaşık 150 bayi. Görüşlerinizi bekliyorum.',
	},
	{
		id: 'm2',
		from: 'Burak Demir',
		role: 'Satış',
		initials: 'BD',
		time: '3 Haziran 11:40',
		body: 'Bayilerin çoğu Marmara bölgesinde; İstanbul ulaşım açısından daha mantıklı. 12 Eylül bazı bayilerin sezon kapanışına denk geliyor, 19 Eylül daha uygun.',
	},
	{
		id: 'm3',
		from: 'Can Öztürk',
		role: 'Finans',
		initials: 'CÖ',
		time: '4 Haziran 10:05',
		body: 'Bütçe üst sınırımız 850 bin ₺. İstanbul teklifi 780 bin ₺, İzmir teklifi 690 bin ₺. İstanbul’u seçersek konaklamayı bir geceyle sınırlamamız gerekir.',
	},
	{
		id: 'm4',
		from: 'Ayşe Yılmaz',
		role: 'Etkinlik koordinasyonu',
		initials: 'AY',
		time: '4 Haziran 15:22',
		body: 'Marmara Kongre Merkezi 19 Eylül için opsiyon verdi; opsiyon 14 Haziran’a kadar geçerli. Kesin rezervasyon için kapora ödemesi gerekiyor. Katering firmasından menü teklifini henüz almadık.',
	},
	{
		id: 'm5',
		from: 'Selin Kaya',
		role: 'Pazarlama',
		initials: 'SK',
		time: '5 Haziran 09:47',
		body: 'Özetle: İstanbul ve 19 Eylül’de uzlaşıyoruz gibi görünüyor. Burak, bayi davetiyelerinin metnini sen hazırlayabilir misin? Ayrıca açılış konuşmasını kimin yapacağını henüz konuşmadık.',
	},
	{
		id: 'm6',
		from: 'Burak Demir',
		role: 'Satış',
		initials: 'BD',
		time: '5 Haziran 13:15',
		body: 'Davetiye metnini 12 Haziran’a kadar hazırlarım. Konaklama bir gece olursa uzak bölgelerden gelen bazı bayiler katılmakta zorlanabilir; bunu da değerlendirelim.',
	},
	{
		id: 'm7',
		from: 'Can Öztürk',
		role: 'Finans',
		initials: 'CÖ',
		time: '6 Haziran 08:30',
		body: 'Kapora ödemesini başlatabilmem için proje sahibi olarak senin yazılı onayına ihtiyacım var. Opsiyonun 14 Haziran’da bittiğini hatırlatırım.',
	},
]

export type OutlookAction = 'ozet' | 'aksiyon' | 'yanit'
export type OutlookSection = 'summary' | 'decisions' | 'actions' | 'draft'

export const OUTLOOK_ACTIONS: {
	id: OutlookAction
	label: string
	prompt: string
	order: OutlookSection[]
}[] = [
	{
		id: 'ozet',
		label: 'Özetle',
		prompt: 'Bu e-posta zincirini özetle; alınan kararları ve açık soruları ayrı ayrı belirt.',
		order: ['summary', 'decisions', 'actions', 'draft'],
	},
	{
		id: 'aksiyon',
		label: 'Aksiyonları çıkar',
		prompt:
			'Bu zincirdeki bekleyen aksiyonları sorumlu ve son tarihleriyle listele. Belirtilmemişse “Belirtilmedi” yaz.',
		order: ['actions', 'summary', 'decisions', 'draft'],
	},
	{
		id: 'yanit',
		label: 'Yanıt hazırla',
		prompt:
			'Can’a ve ekibe; mekânı ve tarihi onaylayan, sonraki adımları ve açık konuları belirten kısa ve profesyonel bir yanıt taslağı hazırla.',
		order: ['draft', 'summary', 'decisions', 'actions'],
	},
]

export const THREAD_SUMMARY =
	'Ekip, Q3 bayi toplantısının 19 Eylül’de İstanbul’daki Marmara Kongre Merkezi’nde yapılması konusunda uzlaşmış görünüyor. Mekânın opsiyonu 14 Haziran’a kadar geçerli; kesin rezervasyon için sizin yazılı onayınız ve kapora ödemesi gerekiyor. Bütçe üst sınırı 850 bin ₺, İstanbul teklifi 780 bin ₺.'

export const THREAD_DECISIONS = [
	{
		text: 'Mekân olarak İstanbul (Marmara Kongre Merkezi) tercih ediliyor.',
		note: 'Ekip uzlaşısı; resmî onay henüz verilmedi.',
		source: 'Selin Kaya · 5 Haziran 09:47',
	},
	{
		text: 'Tarih olarak 19 Eylül tercih ediliyor.',
		note: '12 Eylül bazı bayilerin sezon kapanışına denk geliyor.',
		source: 'Burak Demir · 3 Haziran 11:40',
	},
	{
		text: 'Davetiye metnini Burak Demir hazırlayacak.',
		note: 'Burak 12 Haziran’ı taahhüt etti.',
		source: 'Burak Demir · 5 Haziran 13:15',
	},
]

export const THREAD_ACTIONS = {
	columns: ['Aksiyon', 'Sorumlu', 'Son tarih'],
	rows: [
		['Kapora için yazılı onay vermek', 'Siz', '14 Haziran (opsiyon bitişi)'],
		['Davetiye metnini hazırlamak', 'Burak Demir', '12 Haziran'],
		['Kapora ödemesi sürecini başlatmak', 'Can Öztürk', 'Onayınızdan sonra'],
		['Katering menü teklifini almak', 'Belirtilmedi', 'Belirtilmedi'],
		['Açılış konuşmasını kimin yapacağını belirlemek', 'Belirtilmedi', 'Belirtilmedi'],
	],
}

export const THREAD_QUESTIONS = [
	'Konaklama tek geceyle sınırlanırsa uzak bölgelerden gelen bayilerin katılımı nasıl desteklenecek?',
	'Açılış konuşmasını kim yapacak?',
	'Katering maliyeti, 850 bin ₺ olan üst sınırın içinde kalacak mı? (Teklif henüz yok.)',
]

export const THREAD_DRAFT = [
	'Merhaba Can, merhaba ekip,',
	'Değerlendirmeleriniz için teşekkürler. Q3 bayi toplantısının 19 Eylül’de İstanbul’daki Marmara Kongre Merkezi’nde yapılmasını onaylıyorum. Can, kapora ödemesi için süreci başlatabilirsin; opsiyonun 14 Haziran’da sona erdiğini hatırlatırım.',
	'Burak, davetiye metnini 12 Haziran’a kadar paylaşman çok iyi olur. Konaklamanın tek geceyle sınırlanması konusunu uzak bölgelerden gelecek bayiler açısından [önerinizi ekleyin] ile birlikte değerlendirelim.',
	'Açık kalan iki konu var: katering menü teklifi ve açılış konuşmasını kimin yapacağı. [Sorumlu kişiyi belirtin] bu konuları takip edebilir mi?',
	'Teşekkürler,\n[Adınız]',
]

// ---------------------------------------------------------------- tone lab

export const TONE_SCENARIO = {
	to: 'Mert Aydın · Satın Alma Müdürü (müşteri)',
	subject: 'Siparişinizin teslim tarihi hakkında',
	facts: [
		{ id: 'siparis', label: '240 adet ofis sandalyesi' },
		{ id: 'tarih', label: 'Yeni teslim tarihi: 28 Haziran' },
		{ id: 'onceki', label: 'Önceki tarih: 21 Haziran' },
		{ id: 'neden', label: 'Neden: tedarikçideki kumaş gecikmesi' },
		{ id: 'telafi', label: 'Telafi: kargo ücretsiz' },
	],
}

export interface ToneVariant {
	id: string
	label: string
	risky?: boolean
	prompt: string
	paragraphs: string[]
	/** Facts from TONE_SCENARIO present in the draft. */
	facts: string[]
	notes: string[]
	issues?: string[]
}

export const TONE_VARIANTS: ToneVariant[] = [
	{
		id: 'resmi',
		label: 'Resmî',
		prompt:
			'Müşteriye teslimat gecikmesini bildiren resmî bir e-posta taslağı yaz. Yalnızca verilen bilgileri kullan.',
		paragraphs: [
			'Sayın Mert Aydın,',
			'240 adet ofis sandalyesinden oluşan siparişinizin teslim tarihinin, tedarikçimizdeki kumaş gecikmesi nedeniyle 21 Haziran’dan 28 Haziran’a ertelendiğini bildirmek isteriz.',
			'Yaşanan aksaklık nedeniyle kargo ücreti tarafımızca karşılanacaktır. Anlayışınız için teşekkür eder, sorularınız için her zaman ulaşabileceğinizi belirtiriz.',
			'Saygılarımızla,\n[Adınız]',
		],
		facts: ['siparis', 'tarih', 'onceki', 'neden', 'telafi'],
		notes: [
			'Hitap ve kapanış resmî kalıplarda.',
			'Edilgen ve kurumsal bir dil kullanıldı.',
			'Bütün bilgiler korunmuş.',
		],
	},
	{
		id: 'samimi',
		label: 'Samimi',
		prompt:
			'Aynı bilgiyi, müşteriyle iyi bir ilişkimiz olduğunu düşünerek samimi ama profesyonel bir tonda yaz.',
		paragraphs: [
			'Merhaba Mert Bey,',
			'Siparişinizdeki 240 sandalyeyle ilgili küçük bir güncellememiz var: tedarikçimizdeki kumaş gecikmesi nedeniyle teslimatı 21 yerine 28 Haziran’da yapabileceğiz.',
			'Bu bekleyişi biraz olsun telafi etmek için kargo ücretini biz karşılıyoruz. Aklınıza takılan bir şey olursa bana doğrudan yazabilirsiniz.',
			'Sevgiler,\n[Adınız]',
		],
		facts: ['siparis', 'tarih', 'onceki', 'neden', 'telafi'],
		notes: [
			'Daha sıcak bir hitap ve günlük ifadeler.',
			'Kişisel iletişim teklifi eklendi.',
			'Bilgiler değişmedi.',
		],
	},
	{
		id: 'kisa',
		label: 'Kısa ve net',
		prompt: 'Aynı bilgiyi en fazla üç cümlede, net bir şekilde yaz.',
		paragraphs: [
			'Merhaba Mert Bey,',
			'Tedarikçimizdeki kumaş gecikmesi nedeniyle 240 sandalyelik siparişiniz 21 Haziran yerine 28 Haziran’da teslim edilecek. Kargo ücreti bizden. Sorularınız için buradayım.',
			'[Adınız]',
		],
		facts: ['siparis', 'tarih', 'onceki', 'neden', 'telafi'],
		notes: [
			'Üç cümleye indirildi.',
			'Önce sonuç (yeni tarih), sonra telafi verildi.',
			'Bilgiler korunmuş.',
		],
	},
	{
		id: 'empatik',
		label: 'Özür dileyen ve çözüm odaklı',
		prompt:
			'Aynı bilgiyi, yaşanan aksaklık için içtenlikle özür dileyen ve çözüme odaklanan bir tonda yaz.',
		paragraphs: [
			'Merhaba Mert Bey,',
			'240 sandalyelik siparişinizin teslim tarihinde bir değişiklik olduğunu bildirmek zorundayız ve bunun için özür dileriz. Tedarikçimizdeki kumaş gecikmesi nedeniyle teslimatı 21 Haziran yerine 28 Haziran’da yapabileceğiz.',
			'Planlarınızı etkilediğinin farkındayız; bu nedenle kargo ücretini biz karşılayacağız. Teslimat sürecini yakından takip edip gelişmeleri sizinle paylaşacağım.',
			'Saygılarımla,\n[Adınız]',
		],
		facts: ['siparis', 'tarih', 'onceki', 'neden', 'telafi'],
		notes: [
			'Özür ve anlayış ifadeleri eklendi.',
			'Takip sözü verildi: bunu gerçekten yapabileceğinizden emin olun.',
			'Bilgiler korunmuş.',
		],
	},
	{
		id: 'iddiali',
		label: 'Fazla iddialı (riskli)',
		risky: true,
		prompt: 'Müşteriyi kesinlikle kaybetmemek için onu ikna eden, güven veren bir e-posta yaz.',
		paragraphs: [
			'Sayın Mert Bey,',
			'Siparişinizin teslimatı 28 Haziran’a kaydı. Bu tür bir gecikmenin bir daha asla yaşanmayacağını garanti ediyoruz.',
			'Ayrıca bir sonraki siparişinizde %15 indirim tanımlayacağız.',
			'Saygılarımızla,\n[Adınız]',
		],
		facts: ['tarih'],
		notes: ['Ton ikna etmeye odaklandı.'],
		issues: [
			'“Bir daha asla yaşanmayacağını garanti ediyoruz” verilmemiş ve tutulması belirsiz bir taahhüt.',
			'%15 indirim kaynakta yok; şirket adına yetkisiz bir teklif.',
			'Sipariş içeriği, önceki tarih, gecikmenin nedeni ve kargo telafisi kaybolmuş.',
		],
	},
]
