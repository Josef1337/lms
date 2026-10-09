// Module 3 chat simulation. A fictional project update, and for each turn
// three prompts of different quality with the answer each would plausibly
// get. Best answers only restate what the update says.
export const PROJECT_UPDATE_TITLE = 'Proje Atlas · 6. hafta durum güncellemesi'

export const PROJECT_UPDATE = [
	'Müşteri portalı yenileme projesinde tasarım aşaması tamamlandı ve geliştirme ekibi 3 Haziran’da ikinci sprinte başladı. Sprintte planlanan 24 iş kaleminin 15’i tamamlandı.',
	'Ödeme entegrasyonu, banka tarafındaki test ortamının hazır olmaması nedeniyle iki haftadır bekliyor; banka yeni ortamı 20 Haziran’da açacağını bildirdi.',
	'Mobil uygulama ekranlarında kullanıcı testleri yapıldı. Katılımcıların %72’si yeni akışı eskisinden daha kolay buldu; ancak şifre sıfırlama adımı yine en çok zorlanılan adım oldu.',
	'Bütçenin %58’i harcandı; plan bu aşamada %55 öngörüyordu. Altyapı ekibinden bir kıdemli geliştirici başka bir projeye kaydırıldı; yerine birinin atanıp atanmayacağı henüz netleşmedi.',
	'Güvenlik ekibi sızma testini 1 Temmuz’a planladı; test sonuçları canlıya geçiş kararını etkileyebilir. Hedeflenen canlıya geçiş tarihi 15 Temmuz.',
	'Elif Hanım ödeme entegrasyonunun takibini, Murat Bey kullanıcı testlerindeki bulguların tasarıma yansıtılmasını üstlendi. Şifre sıfırlama akışının yeniden tasarlanması ve kaynak açığının yönetime iletilmesi gerekiyor.',
]

export type PromptQualityLevel = 'best' | 'ok' | 'weak'

export interface SimResponse {
	text?: string
	bullets?: string[]
	table?: { columns: string[]; rows: string[][] }
}

export interface SimOption {
	id: string
	prompt: string
	quality: PromptQualityLevel
	response: SimResponse
	coaching: string
}

export interface SimTurn {
	id: string
	title: string
	question: string
	options: SimOption[]
}

export const CHAT_TURNS: SimTurn[] = [
	{
		id: 'ozet',
		title: 'Yönetici özeti',
		question: 'Önce ne isteyeceksiniz? Bir prompt seçin.',
		options: [
			{
				id: 'duzelt',
				prompt: 'Bunu düzelt.',
				quality: 'weak',
				response: {
					text: 'Neyi düzeltmemi istediğinizi netleştirebilir misiniz? Dil bilgisini mi kontrol edeyim, metni mi kısaltayım, yoksa bir özete mi dönüştüreyim?',
				},
				coaching:
					'Belirsiz bir istek ek bir tur demektir. Copilot bazen soru sormak yerine tahmin yürütür; bu da beklemediğiniz bir sonuç almanıza yol açabilir.',
			},
			{
				id: 'ozetle',
				prompt: 'Bu metni özetle.',
				quality: 'ok',
				response: {
					text: 'Proje genel olarak ilerliyor. Bazı gecikmeler ve riskler bulunuyor. Kullanıcı testleri olumlu sonuç verdi. Bütçe ve kaynak konularının takip edilmesi gerekiyor.',
				},
				coaching:
					'Doğru ama yönetici için yeterince somut değil: rakam, tarih ve karar gerektiren konular kaybolmuş. Hedef kitleyi ve biçimi belirtmek sonucu güçlendirir.',
			},
			{
				id: 'yonetici',
				prompt:
					'Bu proje güncellemesini yöneticim için 5 maddelik bir özete dönüştür. Her maddede varsa rakam veya tarih olsun; metinde olmayan bilgi ekleme.',
				quality: 'best',
				response: {
					bullets: [
						'Tasarım tamamlandı; ikinci sprintte planlanan 24 iş kaleminin 15’i bitti.',
						'Ödeme entegrasyonu, bankanın test ortamı nedeniyle iki haftadır bekliyor; ortamın 20 Haziran’da açılması bekleniyor.',
						'Kullanıcı testlerinde katılımcıların %72’si yeni akışı daha kolay buldu; şifre sıfırlama adımı hâlâ sorunlu.',
						'Bütçenin %58’i harcandı (plan: %55); bir kıdemli geliştiricinin ayrılmasıyla kaynak açığı oluştu.',
						'Canlıya geçiş hedefi 15 Temmuz; 1 Temmuz’daki sızma testinin sonuçları bu tarihi etkileyebilir.',
					],
				},
				coaching:
					'Hedef kitle, biçim ve doğrulama kuralı belli. Her madde metindeki bir bilgiye dayanıyor; rakamları kaynak metinle karşılaştırarak kolayca kontrol edebilirsiniz.',
			},
		],
	},
	{
		id: 'riskler',
		title: 'Riskler',
		question: 'Özet hazır. Sıradaki adım: riskleri çıkarmak. Hangi prompt’u kullanırsınız?',
		options: [
			{
				id: 'tahmin',
				prompt: 'Projede başka neler ters gidebilir, tahmin et.',
				quality: 'weak',
				response: {
					bullets: [
						'Ekip motivasyonu düşebilir.',
						'Rakipler benzer bir portalı daha önce yayınlayabilir.',
						'Sunucu maliyetleri beklenenden yüksek çıkabilir.',
					],
				},
				coaching:
					'Bu maddelerin hiçbiri metinde yok; Copilot tahmin üretti. Tahminler beyin fırtınası için faydalı olabilir, ancak bir durum raporuna kaynakmış gibi girmemelidir.',
			},
			{
				id: 'neler',
				prompt: 'Riskler neler?',
				quality: 'ok',
				response: {
					bullets: ['Ödeme entegrasyonu gecikmesi', 'Bütçe', 'Kaynak açığı', 'Sızma testi'],
				},
				coaching:
					'Doğru başlıklar, ama etkileri ve metindeki dayanakları yok. Yönetici bu listeyle karar veremez.',
			},
			{
				id: 'tablo',
				prompt:
					'Metinde geçen riskleri, olası etkileri ve metindeki dayanaklarıyla birlikte tablo olarak listele. Metinde olmayan risk ekleme.',
				quality: 'best',
				response: {
					table: {
						columns: ['Risk', 'Olası etki', 'Metindeki dayanak'],
						rows: [
							[
								'Ödeme entegrasyonu gecikmesi',
								'Sprint ve canlıya geçiş takvimi kayabilir',
								'“Banka yeni ortamı 20 Haziran’da açacağını bildirdi.”',
							],
							[
								'Bütçe sapması',
								'Harcama planın 3 puan üzerinde',
								'“Bütçenin %58’i harcandı; plan %55 öngörüyordu.”',
							],
							[
								'Kaynak açığı',
								'Altyapı işleri yavaşlayabilir',
								'“Yerine birinin atanıp atanmayacağı netleşmedi.”',
							],
							[
								'Sızma testi sonuçları',
								'Canlıya geçiş kararı etkilenebilir',
								'“Test sonuçları canlıya geçiş kararını etkileyebilir.”',
							],
							[
								'Şifre sıfırlama akışı',
								'Kullanıcı deneyimi zayıf kalabilir',
								'“En çok zorlanılan adım oldu.”',
							],
						],
					},
				},
				coaching:
					'Tablo biçimi, etkiler ve dayanaklar istendiği için her risk kontrol edilebilir. “Metinde olmayan risk ekleme” kısıtı, tahminleri dışarıda tutar.',
			},
		],
	},
	{
		id: 'aksiyonlar',
		title: 'Aksiyon maddeleri',
		question: 'Şimdi aksiyon maddelerini çıkaralım. Hangi prompt doğru sonucu verir?',
		options: [
			{
				id: 'dagit',
				prompt: 'Herkese görev dağıt.',
				quality: 'weak',
				response: {
					bullets: [
						'Şifre sıfırlama akışı: Murat Bey · 10 Haziran',
						'Kaynak açığının iletilmesi: Elif Hanım · 7 Haziran',
						'Sızma testi hazırlığı: Elif Hanım · 25 Haziran',
					],
				},
				coaching:
					'Copilot metinde olmayan sorumlular ve tarihler atadı. Görev dağıtımı bir yönetim kararıdır; insanlar tarafından yapılmalıdır.',
			},
			{
				id: 'yapilacak',
				prompt: 'Yapılacakları yaz.',
				quality: 'ok',
				response: {
					bullets: [
						'Ödeme entegrasyonunu takip et',
						'Kullanıcı testi bulgularını tasarıma yansıt',
						'Şifre sıfırlama akışını yeniden tasarla',
						'Kaynak açığını yönetime ilet',
					],
				},
				coaching: 'Eksiksiz bir liste, ama sorumlu ve tarih bilgisi yok. Takip etmek zorlaşır.',
			},
			{
				id: 'sorumlu',
				prompt:
					'Aksiyon maddelerini sorumlu ve tarihleriyle tablo olarak listele. Metinde sorumlu veya tarih yoksa “Belirtilmedi” yaz.',
				quality: 'best',
				response: {
					table: {
						columns: ['Aksiyon', 'Sorumlu', 'Tarih'],
						rows: [
							['Ödeme entegrasyonunun takibi', 'Elif Hanım', 'Banka ortamı: 20 Haziran'],
							['Kullanıcı testi bulgularının tasarıma yansıtılması', 'Murat Bey', 'Belirtilmedi'],
							['Şifre sıfırlama akışının yeniden tasarlanması', 'Belirtilmedi', 'Belirtilmedi'],
							['Kaynak açığının yönetime iletilmesi', 'Belirtilmedi', 'Belirtilmedi'],
							['Sızma testi', 'Güvenlik ekibi', '1 Temmuz'],
						],
					},
				},
				coaching:
					'“Belirtilmedi” ifadesi eksikleri görünür kılıyor. Sorumlusu olmayan iki aksiyon, ekiple netleştirilmesi gereken konular olarak öne çıkıyor.',
			},
		],
	},
	{
		id: 'dogrulama',
		title: 'Göndermeden önce',
		question: 'Özet, riskler ve aksiyonlar hazır. Yöneticinizle paylaşmadan önce ne yaparsınız?',
		options: [
			{
				id: 'gonder',
				prompt: 'Hemen paylaşırım; Copilot hazırladı.',
				quality: 'weak',
				response: { text: 'Bu simülasyon hiçbir yere gönderim yapmaz.' },
				coaching:
					'Doğrulanmamış bir özeti paylaşmak risklidir. Ayrıca iki aksiyonun sorumlusu belirsiz; bunlar netleşmeden paylaşılan metin yanlış beklentiler yaratabilir.',
			},
			{
				id: 'emin',
				prompt: 'Copilot’a “Emin misin?” diye sorarım.',
				quality: 'ok',
				response: { text: 'Evet, özet ve tablolar paylaştığınız metne dayanıyor.' },
				coaching:
					'Copilot’ın kendinden emin bir yanıt vermesi doğrulama değildir. Rakamları ve tarihleri kaynak metinle sizin karşılaştırmanız gerekir.',
			},
			{
				id: 'kontrol',
				prompt:
					'Rakam ve tarihleri kaynak metinle karşılaştırır, sorumlusu belirtilmeyen aksiyonları ekiple netleştiririm.',
				quality: 'best',
				response: {
					text: 'Kontrol listesi: 24/15 iş kalemi ✓ · 20 Haziran ✓ · %72 ✓ · %58 / %55 ✓ · 1 ve 15 Temmuz ✓ · Sorumlusu belirsiz 2 aksiyon → ekip toplantısında netleştirilecek.',
				},
				coaching:
					'Doğru yaklaşım. Copilot işin büyük kısmını hızlandırdı; doğrulama ve sorumluluk ataması sizde kaldı.',
			},
		],
	},
]
