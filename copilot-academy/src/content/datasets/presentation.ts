// Module 7: a short fictional business report and the five-slide drafts the
// studio "generates" from it in three styles. Every figure on a slide comes
// from the report.
export const PPT_REPORT = {
	file: 'Iade_Sureci_Raporu_Q1.docx',
	title: 'İade Süreci Değerlendirme Raporu · 1. Çeyrek',
	sections: [
		{
			heading: 'Amaç',
			text: 'Online siparişlerdeki iade sürecinin müşteri deneyimine ve maliyetlere etkisini değerlendirmek ve iyileştirme önerileri sunmak.',
		},
		{
			heading: 'Mevcut durum',
			text: 'Ocak–Mart döneminde 48.000 siparişin 4.300’ü iade edildi (%9). Bir iade talebinin sonuçlanması ortalama 9 gün sürüyor. İadelerin %60’ı beden veya ölçü uyumsuzluğu nedeniyle yapılıyor.',
		},
		{
			heading: 'Bulgular',
			text: 'İade sürecini “zor” bulan müşterilerin tekrar satın alma oranı %22, “kolay” bulanlarınki %41. Çeyrekteki iade kargo maliyeti 1,9 milyon ₺. Ürün sayfasında ölçü tablosu bulunan kategorilerde iade oranı %6.',
		},
		{
			heading: 'Riskler ve fırsatlar',
			text: 'Yaz sezonunda sipariş hacminin %35 artması bekleniyor; mevcut süreç bu yükü kaldırmayabilir. Ölçü tablosunun bütün giyim kategorilerine yayılması ve anlaşmalı iade noktalarının artırılması fırsat olarak görülüyor.',
		},
		{
			heading: 'Öneriler',
			text: '1) Mayıs sonuna kadar bütün giyim kategorilerine ölçü tablosu eklenmesi. 2) Depo içi önceliklendirmeyle iade süresinin 5 güne indirilmesi. 3) Anlaşmalı iade noktalarının 3 yeni şehre genişletilmesi. Sonraki adım: Haziran’da pilot sonuçlarının yönetimle paylaşılması.',
		},
	],
}

export type SlideVisual =
	| 'kpi'
	| 'bars'
	| 'line'
	| 'split'
	| 'timeline'
	| 'table'
	| 'icons'
	| 'steps'

export interface Slide {
	section: string
	title: string
	bullets: string[]
	visual: { kind: SlideVisual; text: string }
	notes: string
}

export type DeckStyle = 'yonetici' | 'veri' | 'egitim'

export const DECK_STYLES: { id: DeckStyle; label: string; audience: string; prompt: string }[] = [
	{
		id: 'yonetici',
		label: 'Yönetici sunumu',
		audience: 'Yönetim ekibi · kısa ve karar odaklı',
		prompt:
			'Ekteki iade süreci raporundan yönetim ekibi için 5 slaytlık, karar odaklı bir sunum taslağı oluştur. Başlıklar mesaj taşısın, her slaytta en fazla üç madde olsun ve konuşmacı notu ekle. Raporda olmayan bilgi ekleme.',
	},
	{
		id: 'veri',
		label: 'Veri odaklı sunum',
		audience: 'Analiz ve operasyon ekipleri · rakam ağırlıklı',
		prompt:
			'Ekteki iade süreci raporundan 5 slaytlık, veri odaklı bir sunum taslağı oluştur. Her slaytta rapordaki rakamları öne çıkar ve uygun grafik türünü öner. Tahmin yapma; raporda olmayan hedefleri “belirtilmedi” olarak göster.',
	},
	{
		id: 'egitim',
		label: 'Eğitim sunumu',
		audience: 'Depo ve müşteri hizmetleri ekipleri · adım adım',
		prompt:
			'Ekteki iade süreci raporundan depo ve müşteri hizmetleri ekipleri için 5 slaytlık bir eğitim sunumu taslağı oluştur. Sade bir dil kullan, ekiplerin ne yapması gerektiğini anlat ve konuşmacı notu ekle.',
	},
]

export const SECTION_LABELS = [
	'Amaç ve genel bakış',
	'Mevcut durum',
	'Önemli bulgular',
	'Riskler ve fırsatlar',
	'Öneriler ve sonraki adımlar',
]

export const DECKS: Record<DeckStyle, Slide[]> = {
	yonetici: [
		{
			section: SECTION_LABELS[0],
			title: 'İade sürecini hızlandırarak tekrar satın almayı artırabiliriz',
			bullets: [
				'Çeyrekte siparişlerin %9’u iade edildi',
				'İade deneyimi müşteri sadakatini doğrudan etkiliyor',
				'Bugün üç öneri için onay istiyoruz',
			],
			visual: { kind: 'kpi', text: 'Tek büyük rakam: %9 iade oranı' },
			notes:
				'Bu sunumda iade sürecinin neden önemli olduğunu ve onay beklediğimiz üç öneriyi paylaşacağım. Ana mesajım şu: iade sürecini kolaylaştırmak, müşterinin tekrar alışveriş yapma ihtimalini artırıyor.',
		},
		{
			section: SECTION_LABELS[1],
			title: 'Bir iade ortalama 9 günde sonuçlanıyor',
			bullets: [
				'48.000 siparişin 4.300’ü iade edildi',
				'İadelerin %60’ı beden veya ölçü uyumsuzluğundan',
				'Çeyreklik iade kargo maliyeti: 1,9 milyon ₺',
			],
			visual: { kind: 'kpi', text: 'Üç gösterge kartı: iade oranı, süre, maliyet' },
			notes:
				'Rakamlar Ocak–Mart dönemine ait. Dikkat çekmek istediğim nokta, iadelerin büyük çoğunluğunun ölçü uyumsuzluğundan kaynaklanması; bu, önlenebilir bir neden.',
		},
		{
			section: SECTION_LABELS[2],
			title: 'Kolay iade, tekrar satın almayı neredeyse ikiye katlıyor',
			bullets: [
				'İadeyi “kolay” bulanlarda tekrar satın alma: %41',
				'“Zor” bulanlarda: %22',
				'Ölçü tablosu olan kategorilerde iade oranı: %6',
			],
			visual: { kind: 'bars', text: 'İki çubuklu karşılaştırma: %41 ve %22' },
			notes:
				'%41 ile %22 arasındaki fark, bu konunun yalnızca maliyet değil gelir konusu olduğunu gösteriyor. Ölçü tablosu olan kategorilerdeki %6’lık oran, çözümün bir kısmının elimizde olduğunu gösteriyor.',
		},
		{
			section: SECTION_LABELS[3],
			title: 'Yaz sezonundan önce harekete geçmezsek süreç tıkanabilir',
			bullets: [
				'Risk: Yazın sipariş hacminin %35 artması bekleniyor',
				'Fırsat: Ölçü tablosunu bütün giyim kategorilerine yaymak',
				'Fırsat: Anlaşmalı iade noktalarını artırmak',
			],
			visual: { kind: 'split', text: 'İki sütun: solda risk, sağda fırsatlar' },
			notes:
				'Zamanlama önemli: yaz sezonundaki artış mevcut süreci zorlayacak. Fırsatların ikisi de raporda önerilen, uygulanabilir adımlar.',
		},
		{
			section: SECTION_LABELS[4],
			title: 'Üç öneri için onayınızı istiyoruz',
			bullets: [
				'Mayıs sonuna kadar bütün giyim kategorilerine ölçü tablosu',
				'Depo içi önceliklendirmeyle iade süresini 5 güne indirmek',
				'Anlaşmalı iade noktalarını 3 yeni şehre genişletmek',
			],
			visual: {
				kind: 'timeline',
				text: 'Zaman çizelgesi: Mayıs uygulama → Haziran pilot sonuçları',
			},
			notes:
				'Haziran’da pilot sonuçlarını sizinle paylaşacağız. Bugün ihtiyacımız olan, bu üç adım için onay ve ilgili ekiplerin görevlendirilmesi.',
		},
	],
	veri: [
		{
			section: SECTION_LABELS[0],
			title: 'İade süreci: 1. çeyrek verileri',
			bullets: [
				'Dönem: Ocak–Mart',
				'Kapsam: 48.000 online sipariş',
				'Amaç: iade sürecinin müşteri ve maliyet etkisini ölçmek',
			],
			visual: { kind: 'kpi', text: 'Kapak: dönem ve kapsam rakamları' },
			notes:
				'Bu sunumdaki bütün rakamlar 1. çeyrek iade raporundan alınmıştır. Önce mevcut durumu, ardından bulguları ve önerileri ölçülebilir göstergelerle paylaşacağım.',
		},
		{
			section: SECTION_LABELS[1],
			title: 'İade oranı %9; ortalama sonuçlanma süresi 9 gün',
			bullets: [
				'4.300 iade / 48.000 sipariş',
				'Ortalama sonuçlanma süresi: 9 gün',
				'Ana neden: beden veya ölçü uyumsuzluğu (%60)',
			],
			visual: {
				kind: 'kpi',
				text: 'Tek değer vurgusu: %60 ölçü uyumsuzluğu (diğer nedenler raporda ayrıntılı değil)',
			},
			notes:
				'İade nedenlerinin geri kalan %40’ının dağılımı raporda verilmemiş. Bu nedenle bu slaytta yalnızca ana nedeni gösteriyoruz.',
		},
		{
			section: SECTION_LABELS[2],
			title: 'Tekrar satın alma: kolay iadede %41, zor iadede %22',
			bullets: [
				'Fark: 19 puan',
				'Ölçü tablosu olan kategorilerde iade oranı: %6',
				'Genel iade oranı: %9',
			],
			visual: { kind: 'bars', text: 'Yan yana çubuklar: kolay ve zor iade deneyimi' },
			notes:
				'Bu iki grup arasındaki 19 puanlık fark raporun en güçlü bulgusu. Ancak bu bir ilişki; tek başına neden-sonuç kanıtı değildir.',
		},
		{
			section: SECTION_LABELS[3],
			title: 'İade kargo maliyeti 1,9 milyon ₺; yazın hacim %35 artabilir',
			bullets: [
				'Çeyreklik iade kargo maliyeti: 1,9 milyon ₺',
				'Beklenen yaz sezonu sipariş artışı: %35',
				'Maliyet projeksiyonu: raporda belirtilmedi',
			],
			visual: { kind: 'line', text: 'Çizgi: mevcut sipariş hacmi ve beklenen artış' },
			notes:
				'Burada kendi tahminimizi yapmıyoruz; yalnızca raporda belirtilen %35’lik beklentiyi gösteriyoruz. Maliyet projeksiyonu için finans ekibinden veri istenmeli.',
		},
		{
			section: SECTION_LABELS[4],
			title: 'Öneriler ve izlenecek göstergeler',
			bullets: [
				'Ölçü tablosu → iade oranı (hedef: belirtilmedi)',
				'Depo önceliklendirme → iade süresi: 9 günden 5 güne',
				'Yeni iade noktaları → 3 yeni şehir',
			],
			visual: { kind: 'table', text: 'Tablo: öneri, gösterge, hedef' },
			notes:
				'Her öneriyi ölçülebilir bir göstergeye bağladık. Raporda hedefi olmayan göstergeyi açıkça “belirtilmedi” olarak bıraktık.',
		},
	],
	egitim: [
		{
			section: SECTION_LABELS[0],
			title: 'Yeni iade sürecine hoş geldiniz',
			bullets: [
				'Neden değişiyoruz?',
				'Sizin için ne değişecek?',
				'Sorularınız için kime ulaşabilirsiniz?',
			],
			visual: { kind: 'icons', text: 'Üç ikon: neden, ne, kim' },
			notes:
				'Bu kısa eğitimde iade sürecindeki değişiklikleri adım adım konuşacağız. Sonunda soru-cevap için zaman ayıracağız.',
		},
		{
			section: SECTION_LABELS[1],
			title: 'Bugün bir iade nasıl ilerliyor?',
			bullets: [
				'Müşteri iade talebi oluşturuyor',
				'Ürün depoya ulaşıyor ve kontrol ediliyor',
				'İade ortalama 9 günde sonuçlanıyor',
			],
			visual: { kind: 'steps', text: 'Üç adımlı süreç akışı' },
			notes:
				'Mevcut süreci hepiniz biliyorsunuz; amacımız darboğazın nerede olduğunu birlikte görmek.',
		},
		{
			section: SECTION_LABELS[2],
			title: 'Müşteriler neden iade ediyor?',
			bullets: [
				'İadelerin %60’ı beden veya ölçü uyumsuzluğundan',
				'Ölçü tablosu olan kategorilerde iade oranı %6 (genel ortalama %9)',
				'İadesi kolay olan müşteri daha sık geri geliyor (%41)',
			],
			visual: {
				kind: 'bars',
				text: 'Basit karşılaştırma: ölçü tablosu olan kategoriler (%6) ve genel ortalama (%9)',
			},
			notes:
				'Müşteri hizmetleri ekibimizin en sık duyduğu konu ölçü. Bu veri, sahadaki gözlemlerinizi destekliyor.',
		},
		{
			section: SECTION_LABELS[3],
			title: 'Sizin için ne değişiyor?',
			bullets: [
				'Depo: iadeler öncelikli kontrol edilecek (hedef 5 gün)',
				'Müşteri hizmetleri: müşteriyi ölçü tablosuna yönlendirin',
				'Yeni anlaşmalı iade noktaları: 3 yeni şehir',
			],
			visual: { kind: 'split', text: 'İki sütun: depo ekibi ve müşteri hizmetleri' },
			notes:
				'Her ekip için değişen tek bir ana davranış var. Ayrıntılı iş talimatları ayrıca paylaşılacak: [doküman adı].',
		},
		{
			section: SECTION_LABELS[4],
			title: 'Sonraki adımlar ve sorular',
			bullets: [
				'Mayıs sonu: ölçü tabloları yayında',
				'Haziran: pilot sonuçları paylaşılacak',
				'Sorularınız için: [iletişim kişisi]',
			],
			visual: { kind: 'timeline', text: 'Zaman çizelgesi: Mayıs ve Haziran' },
			notes:
				'Pilot süresince geri bildirimleriniz çok değerli. Gördüğünüz sorunları [iletişim kanalı] üzerinden iletebilirsiniz.',
		},
	],
}
