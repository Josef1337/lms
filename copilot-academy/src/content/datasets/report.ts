// Fictional 15-page customer experience report used in module 1. The
// "Copilot" answers below only state what the excerpts say, and cite them.
export interface ReportPage {
	page: number
	title: string
	excerpt?: string
}

export const REPORT_TITLE = 'Müşteri Deneyimi Raporu · 3. Çeyrek'

export const REPORT_PAGES: ReportPage[] = [
	{
		page: 1,
		title: 'Kapak',
		excerpt: 'Müşteri Deneyimi Raporu, 3. Çeyrek. Hazırlayan: Müşteri Başarısı Ekibi.',
	},
	{
		page: 2,
		title: 'Yönetici özeti',
		excerpt:
			'Çeyrek sonunda müşteri kayıp oranı %8’den %11’e yükseldi. Kayıpların %64’ü, sözleşmesi yenileme dönemine giren KOBİ müşterilerinden geldi.',
	},
	{ page: 3, title: 'Yöntem ve veri kaynakları' },
	{
		page: 4,
		title: 'Müşteri memnuniyeti',
		excerpt:
			'Müşteri memnuniyeti puanı (5 üzerinden) 4,3’ten 3,9’a geriledi. Düşüşün en belirgin olduğu konu destek hızı.',
	},
	{ page: 5, title: 'Segment kırılımı' },
	{
		page: 6,
		title: 'Destek performansı',
		excerpt:
			'Destek taleplerine ilk yanıt süresi ortalaması 6 saatten 14 saate çıktı. Şirket hedefi 8 saattir.',
	},
	{
		page: 7,
		title: 'Gecikmenin nedenleri',
		excerpt:
			'Yeni sürümün yayımlanmasının ardından destek talebi hacmi %35 arttı. Aynı dönemde iki kıdemli destek uzmanı ekipten ayrıldı.',
	},
	{ page: 8, title: 'Kanal analizi' },
	{
		page: 9,
		title: 'Rekabet görünümü',
		excerpt:
			'Görüşülen kayıp müşterilerin yarısı, rakiplerin yıllık ödemede sunduğu %15’e varan indirimi ayrılma gerekçesi olarak belirtti.',
	},
	{ page: 10, title: 'Müşteri görüşmelerinden alıntılar' },
	{
		page: 11,
		title: 'Yenileme süreci',
		excerpt:
			'KOBİ segmentinde sözleşme yenileme oranı %71. Yenileme kampanyası için bütçe onayı bekleniyor.',
	},
	{ page: 12, title: 'Riskler' },
	{
		page: 13,
		title: 'Öneriler',
		excerpt:
			'Öneriler: 1) Destek ekibine iki uzman eklenmesi. 2) Yıllık ödeme indirimi seçeneğinin değerlendirilmesi. 3) Yenileme tarihinden 60 gün önce proaktif arama programı başlatılması.',
	},
	{ page: 14, title: 'Uygulama takvimi' },
	{ page: 15, title: 'Ekler' },
]

export interface ReportAnswerLine {
	text: string
	cite?: number
	/** Marks a line that says the report does not contain something. */
	gap?: boolean
}

export interface ReportPrompt {
	id: string
	label: string
	prompt: string
	lines: ReportAnswerLine[]
	lesson: string
}

export const REPORT_PROMPTS: ReportPrompt[] = [
	{
		id: 'ozet',
		label: 'Özetle',
		prompt: 'Bu raporu 5 maddede özetle.',
		lines: [
			{ text: 'Müşteri kayıp oranı çeyrek sonunda %8’den %11’e yükseldi.', cite: 2 },
			{ text: 'Kayıpların %64’ü yenileme dönemindeki KOBİ müşterilerinden geliyor.', cite: 2 },
			{
				text: 'Müşteri memnuniyeti 4,3’ten 3,9’a geriledi; en belirgin düşüş destek hızında.',
				cite: 4,
			},
			{ text: 'İlk yanıt süresi 6 saatten 14 saate çıktı; hedef 8 saat.', cite: 6 },
			{
				text: 'Rapor; destek ekibinin güçlendirilmesini, yıllık ödeme indirimini ve proaktif yenileme aramalarını öneriyor.',
				cite: 13,
			},
		],
		lesson:
			'Özet, raporun tamamını okumadan önce yön bulmanızı sağlar. Rakamları kaynak sayfalarından kontrol etmeyi unutmayın.',
	},
	{
		id: 'kararlar',
		label: 'Karar gerektiren konular',
		prompt: 'Yönetimin karar vermesi gereken konuları listele.',
		lines: [
			{ text: '**Destek kapasitesi:** Ekibe iki uzman eklenmesi öneriliyor.', cite: 13 },
			{
				text: '**Fiyatlandırma:** Rakiplerin %15’e varan yıllık ödeme indirimine karşı bir yanıt gerekiyor.',
				cite: 9,
			},
			{ text: '**Yenileme kampanyası:** Kampanya bütçesi onay bekliyor.', cite: 11 },
		],
		lesson:
			'İhtiyacınızı netleştirdiğinizde (“karar gerektiren konular”), yanıt da toplantıya doğrudan taşınabilecek bir biçime gelir.',
	},
	{
		id: 'neden',
		label: 'Takip sorusu',
		prompt: 'Destek yanıt süresi neden arttı?',
		lines: [
			{ text: 'Yeni sürümün ardından destek talebi hacmi %35 arttı.', cite: 7 },
			{ text: 'Aynı dönemde iki kıdemli destek uzmanı ekipten ayrıldı.', cite: 7 },
			{
				text: 'Raporda bu iki etkenin ayrı ayrı ne kadar etkili olduğuna dair bir veri yok.',
				gap: true,
			},
		],
		lesson:
			'Takip sorusu, aynı bağlamda derinleşmenizi sağlar. “Veri yok” bilgisi de değerlidir: toplantıda sorulacak soruyu gösterir.',
	},
	{
		id: 'butce',
		label: 'Raporda olmayan bilgi',
		prompt: 'Raporda 4. çeyrek için bütçe tahmini var mı?',
		lines: [
			{ text: 'Raporda 4. çeyreğe ait bir bütçe tahmini bulunmuyor.', gap: true },
			{
				text: 'Yalnızca yenileme kampanyası için “bütçe onayı bekleniyor” ifadesi geçiyor.',
				cite: 11,
			},
			{ text: 'Bir tahmine ihtiyacınız varsa güncel veriyi finans ekibinden istemeniz gerekir.' },
		],
		lesson:
			'İyi bir yanıt, eksik bilgiyi uydurmak yerine belirtir. Ancak bunun her zaman olacağının garantisi yoktur; bu yüzden kaynağı kontrol edersiniz.',
	},
]
