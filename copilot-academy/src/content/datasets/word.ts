// Module 4 samples: drafts for the drafting lab and a deliberately messy
// business note with five pre-written Copilot transformations.

// ---------------------------------------------------------------- drafting

export type DraftTone = 'samimi' | 'profesyonel'
export type DraftLength = 'kisa' | 'ayrintili'

export interface DraftType {
	id: string
	label: string
	file: string
	task: string
	source: { title: string; facts: string[] }
	/** The source as the object of “kullan” (accusative), e.g. “Ekteki bakım planını”. */
	sourceRef: string
	structure: Record<DraftLength, string>
	drafts: Record<DraftTone, { title: string; core: string[]; detail: string[]; closing: string[] }>
}

export const DRAFT_TYPES: DraftType[] = [
	{
		id: 'duyuru',
		label: 'Ekip duyurusu',
		file: 'Hibrit_Calisma_Duyurusu.docx',
		task: 'Ekibime 1 Eylül’de başlayacak hibrit çalışma düzenini duyuran bir metin taslağı oluştur',
		sourceRef: 'Ekteki çalışma politikasını',
		source: {
			title: 'Ekteki çalışma politikası',
			facts: [
				'Başlangıç: 1 Eylül',
				'Ofis: salı, çarşamba, perşembe',
				'Uzaktan: pazartesi ve cuma',
				'Çekirdek saat: 10.00–16.00',
			],
		},
		structure: {
			kisa: 'Tek paragraf ve kısa bir kapanış yaz.',
			ayrintili: 'Ofis ve uzaktan çalışma günlerini ayrı başlıklarla açıkla.',
		},
		drafts: {
			samimi: {
				title: 'Yeni hibrit çalışma düzenimiz 1 Eylül’de başlıyor',
				core: [
					'Merhaba ekip,',
					'Uzun süredir konuştuğumuz hibrit çalışma düzeni 1 Eylül itibarıyla başlıyor. Haftada üç gün ofiste, iki gün uzaktan çalışacağız.',
				],
				detail: [
					'**Ofis günleri:** Salı, çarşamba ve perşembe. Ekip toplantılarımızı bu günlerde yüz yüze yapacağız.',
					'**Uzaktan çalışma günleri:** Pazartesi ve cuma. Bu günlerde de çekirdek çalışma saatlerimiz 10.00–16.00 arası olacak.',
				],
				closing: [
					'Aklınıza takılan her şeyi [isim] ile konuşabilirsiniz. Yeni düzenin hepimize iyi geleceğine inanıyorum!',
				],
			},
			profesyonel: {
				title: 'Hibrit Çalışma Düzeni Hakkında Bilgilendirme',
				core: [
					'Değerli ekip arkadaşlarımız,',
					'1 Eylül tarihinden itibaren hibrit çalışma düzenine geçilecektir. Bu düzende haftada üç gün ofiste, iki gün uzaktan çalışılacaktır.',
				],
				detail: [
					'**Ofis günleri:** Salı, çarşamba ve perşembe günleri ofiste çalışılacaktır.',
					'**Uzaktan çalışma günleri:** Pazartesi ve cuma günleri uzaktan çalışılacak; çekirdek çalışma saatleri 10.00–16.00 olacaktır. Ayrıntılar [politika belgesinin adı] belgesinde yer almaktadır.',
				],
				closing: ['Sorularınız için [birim veya kişi] ile iletişime geçebilirsiniz.'],
			},
		},
	},
	{
		id: 'oneri',
		label: 'Proje önerisi',
		file: 'Depo_Sistemi_Onerisi.docx',
		task: 'Depo yönetim sisteminin yenilenmesi için yönetime sunulacak bir proje önerisi taslağı oluştur',
		sourceRef: 'Ekteki ihtiyaç analizi notlarını',
		source: {
			title: 'Ekteki ihtiyaç analizi notları',
			facts: [
				'Sayım farkları: ayda ~40 saat düzeltme',
				'Mevcut sistem mobil cihazları desteklemiyor',
				'Tahmini bütçe: 1,2 milyon ₺',
				'Tahmini süre: 6 ay',
			],
		},
		structure: {
			kisa: 'Amaç, mevcut durum ve talep olmak üzere kısa tut.',
			ayrintili: 'Amaç, mevcut durum, çözüm, bütçe ve beklenen fayda başlıklarını kullan.',
		},
		drafts: {
			samimi: {
				title: 'Depo sistemimizi yenileyelim mi?',
				core: [
					'Depoda her ay yaklaşık 40 saatimizi sayım farklarını düzeltmeye harcıyoruz. Üstelik mevcut sistem mobil cihazlarla çalışmıyor.',
				],
				detail: [
					'**Önerimiz:** Mobil el terminalleriyle çalışan yeni bir sisteme geçmek. Tahmini bütçe 1,2 milyon ₺, süre yaklaşık 6 ay.',
					'**Ne kazanırız?** Bunu netleştirmek için [hedef metrik] üzerinde birlikte çalışabiliriz.',
				],
				closing: ['İlk adım olarak kısa bir fizibilite çalışması için onayınızı rica ediyoruz.'],
			},
			profesyonel: {
				title: 'Proje Önerisi: Depo Yönetim Sisteminin Yenilenmesi',
				core: [
					'**Amaç:** Depo süreçlerindeki hata ve manuel düzeltme ihtiyacını azaltmak.',
					'**Mevcut durum:** Sayım farkları ayda ortalama 40 saatlik düzeltme işi yaratmaktadır; mevcut sistem mobil cihazları desteklememektedir.',
				],
				detail: [
					'**Önerilen çözüm:** Mobil el terminallerini destekleyen yeni bir depo yönetim sistemine geçiş.',
					'**Bütçe ve süre:** Tahmini bütçe 1,2 milyon ₺, tahmini süre 6 aydır.',
					'**Beklenen fayda:** [Ölçülebilir hedef, ör. düzeltme süresinde hedeflenen azalma]',
				],
				closing: ['**Talep:** Ön fizibilite çalışması için onay.'],
			},
		},
	},
	{
		id: 'mektup',
		label: 'Müşteri bilgilendirmesi',
		file: 'Bakim_Bilgilendirme.docx',
		task: 'Müşterilere planlı bakım çalışmasını bildiren bir bilgilendirme metni taslağı oluştur',
		sourceRef: 'Ekteki bakım planını',
		source: {
			title: 'Ekteki bakım planı',
			facts: [
				'Tarih: 18 Mayıs Cumartesi',
				'Saat: 23.00–02.00',
				'Etkilenen: web sitesindeki online ödeme ekranı',
				'Mobil uygulama çalışmaya devam edecek',
			],
		},
		structure: {
			kisa: 'Yalnızca tarih, saat ve kapanış olsun.',
			ayrintili: 'Etkilenen hizmeti ve alternatif kanalı da açıkla.',
		},
		drafts: {
			samimi: {
				title: 'Kısa bir bakım molası veriyoruz',
				core: [
					'Merhaba,',
					'Size daha iyi hizmet verebilmek için 18 Mayıs Cumartesi gecesi 23.00–02.00 arasında kısa bir bakım yapacağız.',
				],
				detail: [
					'Bu sürede web sitemizdeki online ödeme ekranı çalışmayacak; ama ödemelerinizi mobil uygulamamızdan her zamanki gibi yapabilirsiniz.',
				],
				closing: [
					'Bir sorunuz olursa [iletişim kanalı] üzerinden bize yazmanız yeterli. Anlayışınız için teşekkürler!',
				],
			},
			profesyonel: {
				title: 'Planlı Bakım Çalışması Hakkında',
				core: [
					'Sayın Müşterimiz,',
					'Hizmet kalitemizi artırmak amacıyla 18 Mayıs Cumartesi 23.00–02.00 saatleri arasında planlı bir bakım çalışması gerçekleştirilecektir.',
				],
				detail: [
					'Bu süre içinde web sitemizdeki online ödeme ekranı kullanılamayacaktır. Mobil uygulamamız üzerinden ödeme işlemleriniz kesintisiz devam edecektir.',
				],
				closing: [
					'Anlayışınız için teşekkür eder, sorularınız için [iletişim kanalı] üzerinden bize ulaşabileceğinizi hatırlatırız.',
				],
			},
		},
	},
]

export const TONE_LABEL: Record<DraftTone, string> = {
	samimi: 'Samimi',
	profesyonel: 'Profesyonel',
}
export const LENGTH_LABEL: Record<DraftLength, string> = { kisa: 'Kısa', ayrintili: 'Ayrıntılı' }

// ---------------------------------------------------------------- rewriting

export const MESSY_FILE = 'Tedarik_Durumu_notlar.docx'

export const MESSY_TEXT = [
	'selam herkese, geçen hafta toplantıda konuştuğumuz konu hakkında yazıyorum. tedarikçiden gelen malzemeler yine geç geldi, bu üçüncü kez oluyo ve üretim hattı iki gün durdu.',
	'bence artık başka tedarikçiye bakmamız lazım ama satınalma ne der bilmiyorum. ayrıca depoda da yer kalmadı, geçen ay fazla sipariş verilmiş galiba. kalite ekibi de bi rapor hazırlayacaktı o da gelmedi daha.',
	'maliyet de arttı bu arada yaklaşık %12 civarı. cuma gününe kadar bi karar vermemiz lazım yoksa yeni siparişleri de etkileyecek. ne düşünüyosunuz?',
]

export interface Rewrite {
	id: string
	label: string
	prompt: string
	paragraphs?: string[]
	bullets?: string[]
	table?: { columns: string[]; rows: string[][] }
	changes: string[]
}

export const REWRITES: Rewrite[] = [
	{
		id: 'profesyonel',
		label: 'Daha profesyonel yap',
		prompt:
			'Bu metni ekip arkadaşlarıma gönderilecek profesyonel ve nazik bir iş yazısına dönüştür. Bilgileri ve belirsizlikleri olduğu gibi koru.',
		paragraphs: [
			'Merhaba,',
			'Geçen haftaki toplantıda ele aldığımız tedarik konusuyla ilgili bilgi vermek istiyorum. Tedarikçimizden gelen malzemeler üçüncü kez gecikti ve bu gecikme nedeniyle üretim hattı iki gün durdu. Alternatif tedarikçileri değerlendirmemiz gerektiğini düşünüyorum; bu konuda satın alma ekibinin görüşünü almamız önemli.',
			'Bunun yanı sıra depoda yer kalmadı; geçen ay ihtiyaçtan fazla sipariş verilmiş olabilir. Kalite ekibinin hazırlayacağı rapor henüz iletilmedi. Maliyetlerde de yaklaşık %12’lik bir artış görülüyor.',
			'Yeni siparişlerin etkilenmemesi için cuma gününe kadar karar vermemiz gerekiyor. Görüşlerinizi paylaşmanızı rica ederim.',
		],
		changes: [
			'Günlük dil ve yazım hataları (“oluyo”, “bi”) düzeltildi.',
			'Konu girişi, gerekçe ve kapanış olan bir yapı kuruldu.',
			'“Galiba” ifadesindeki belirsizlik “olabilir” ile korundu; kesin bilgiye dönüştürülmedi.',
		],
	},
	{
		id: 'yonetici',
		label: 'Yönetici özeti oluştur',
		prompt:
			'Bu metinden karar vericiler için en fazla üç cümlelik bir yönetici özeti çıkar. Karar gereken konuyu ve son tarihi öne çıkar.',
		paragraphs: [
			'**Yönetici özeti:** Ana tedarikçideki üçüncü gecikme üretimi iki gün durdurdu; maliyetler yaklaşık %12 arttı ve depo kapasitesi doldu. Alternatif tedarikçi değerlendirmesi için satın alma ekibinin görüşü ve bekleyen kalite raporu gerekiyor. Yeni siparişlerin etkilenmemesi için **cuma gününe kadar karar** alınmalı.',
		],
		changes: [
			'Ayrıntılar karar verici için üç cümleye indirildi.',
			'Etki (üretim, maliyet, depo), gereken girdiler ve son tarih öne çıkarıldı.',
			'Kişisel görüş (“bence”) çıkarıldı; ihtiyaç nesnel olarak ifade edildi.',
		],
	},
	{
		id: 'kisa',
		label: 'Daha kısa yaz',
		prompt: 'Bu metni anlamını değiştirmeden yarı uzunluğa indir.',
		paragraphs: [
			'Merhaba, tedarikçideki üçüncü gecikme üretimi iki gün durdurdu; maliyetler yaklaşık %12 arttı ve depoda yer kalmadı. Alternatif tedarikçi için satın almanın görüşüne ve kalite raporuna ihtiyacımız var. Cuma gününe kadar karar vermeliyiz; görüşlerinizi bekliyorum.',
		],
		changes: [
			'Metin yaklaşık yarıya indi; bütün temel bilgiler korundu.',
			'Tekrar eden ve dolgu ifadeler çıkarıldı.',
			'Okuyucudan beklenen eylem (görüş paylaşmak) korundu.',
		],
	},
	{
		id: 'maddeler',
		label: 'Maddeler hâlinde düzenle',
		prompt: 'Bu metindeki bilgileri kısa ve taranabilir maddeler hâlinde düzenle.',
		bullets: [
			'Tedarikçiden gelen malzemeler üçüncü kez gecikti; üretim hattı iki gün durdu.',
			'Alternatif tedarikçi değerlendirilmeli; satın alma ekibinin görüşü alınmalı.',
			'Depoda yer kalmadı; geçen ay ihtiyaçtan fazla sipariş verilmiş olabilir.',
			'Kalite ekibinin raporu henüz gelmedi.',
			'Maliyetler yaklaşık %12 arttı.',
			'Karar için son tarih: cuma.',
		],
		changes: [
			'Her bilgi ayrı bir maddeye taşındı; metin taranabilir hâle geldi.',
			'Son tarih ayrı bir madde olarak görünür kılındı.',
			'Belirsiz ifade (“olabilir”) korundu.',
		],
	},
	{
		id: 'eylem',
		label: 'Eylem planına dönüştür',
		prompt:
			'Bu metindeki yapılması gereken işleri aksiyon, sorumlu ve son tarih sütunlarıyla tablo hâline getir. Metinde sorumlu veya tarih yoksa “Belirtilmedi” yaz.',
		table: {
			columns: ['Aksiyon', 'Sorumlu', 'Son tarih'],
			rows: [
				[
					'Alternatif tedarikçi konusunda satın alma ekibinin görüşünü almak',
					'Belirtilmedi',
					'Cuma öncesi',
				],
				['Kalite raporunun durumunu kalite ekibine sormak', 'Belirtilmedi', 'Cuma öncesi'],
				['Geçen ayki sipariş miktarlarını kontrol etmek', 'Belirtilmedi', 'Belirtilmedi'],
				[
					'Yaklaşık %12’lik maliyet artışının kaynağını netleştirmek',
					'Belirtilmedi',
					'Belirtilmedi',
				],
				['Tedarikçi kararını vermek', 'Belirtilmedi', 'Cuma'],
			],
		},
		changes: [
			'Metindeki örtük işler açık aksiyonlara dönüştürüldü.',
			'Metinde sorumlu olmadığı için hiçbir kişi uydurulmadı; “Belirtilmedi” yazıldı.',
			'Sorumluları ve eksik tarihleri ekip olarak sizin belirlemeniz gerekiyor.',
		],
	},
]
