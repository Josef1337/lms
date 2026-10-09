// Module 9: three end-to-end scenarios. Each step asks for the right app and
// the right prompt; outputs reuse the fictional report (module 1), sales
// data (module 6) and meeting (module 8), so the figures stay consistent.
import type { Visual } from '@/types/content'

export interface ScenarioOption {
	id: string
	app: Visual
	appLabel: string
	prompt: string
	correct?: boolean
	feedback: string
}

export interface ScenarioStep {
	id: string
	title: string
	options: ScenarioOption[]
	output: { title: string; app: Visual; lines: string[] }
}

export interface Scenario {
	id: string
	title: string
	role: string
	context: string
	goal: string
	steps: ScenarioStep[]
	wrapUp: string[]
}

export const SCENARIOS: Scenario[] = [
	{
		id: 'yonetim',
		title: 'Yönetim toplantısına hazırlanma',
		role: 'Müşteri deneyimi yöneticisi',
		context:
			'Yarın sabah yönetim toplantısı var. Elinizde 15 sayfalık “Müşteri Deneyimi Raporu · 3. Çeyrek” var. Toplantıdan önce raporu anlamanız, önemli göstergeleri belirlemeniz, yöneticinize kısa bir e-posta yazmanız ve 5 dakikalık bir sunum akışı hazırlamanız gerekiyor.',
		goal: 'Raporu anla → göstergeleri belirle → yöneticiyi bilgilendir → sunumu hazırla',
		steps: [
			{
				id: 'ozet',
				title: 'Uzun raporu özetleyin',
				options: [
					{
						id: 'word',
						app: 'word',
						appLabel: 'Word’de, rapor açıkken Copilot',
						prompt:
							'Bu raporu yönetim için 5 maddede özetle; her maddede ilgili sayfa numarasını belirt.',
						correct: true,
						feedback:
							'Tek bir belgede çalışıyorsunuz; Word’deki Copilot belgenin bağlamını doğrudan kullanır. Sayfa numarası istemek doğrulamayı kolaylaştırır.',
					},
					{
						id: 'excel',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt: 'Raporu analiz et.',
						feedback:
							'Rapor bir metin belgesi; Excel’deki Copilot tablo verileri için tasarlanmıştır. Ayrıca prompt neyin istendiğini söylemiyor.',
					},
					{
						id: 'chat',
						app: 'chat',
						appLabel: 'Copilot Chat',
						prompt: 'Müşteri deneyimi hakkında bilgi ver.',
						feedback:
							'Copilot Chat kullanılabilir, ama bu prompt rapora dayanmıyor ve genel bilgi üretir. Kaynağı belirtmeden yapılan özet, raporun özeti olmaz.',
					},
				],
				output: {
					title: 'Rapor özeti',
					app: 'word',
					lines: [
						'Müşteri kaybı %8’den %11’e yükseldi (s. 2).',
						'Kayıpların %64’ü yenileme dönemindeki KOBİ müşterilerinden (s. 2).',
						'İlk yanıt süresi 14 saat; hedef 8 saat (s. 6).',
						'Kaybedilen müşterilerin yarısı rakip indirimlerini gerekçe gösterdi (s. 9).',
						'Öneriler: destek ekibine iki uzman, yıllık ödeme indirimi, proaktif yenileme aramaları (s. 13).',
					],
				},
			},
			{
				id: 'kpi',
				title: 'Önemli göstergeleri (KPI) belirleyin',
				options: [
					{
						id: 'uydur',
						app: 'word',
						appLabel: 'Word’de Copilot',
						prompt:
							'Raporda olmasa da sektör ortalamalarıyla karşılaştırarak göstergelere hedef belirle.',
						feedback:
							'Raporda sektör ortalaması yok. Kaynakta olmayan hedefler istemek, uydurma bilgi riskini artırır.',
					},
					{
						id: 'tablo',
						app: 'word',
						appLabel: 'Word’de aynı Copilot oturumu',
						prompt:
							'Bu raporda yönetimin izlemesi gereken göstergeleri mevcut değer ve hedefle birlikte tablo olarak listele; hedef yoksa “Belirtilmedi” yaz.',
						correct: true,
						feedback:
							'Aynı belge bağlamında ilerliyorsunuz; “Belirtilmedi” kuralı hedeflerin uydurulmasını önler.',
					},
					{
						id: 'ppt',
						app: 'powerpoint',
						appLabel: 'PowerPoint’te Copilot',
						prompt: 'KPI slaytı oluştur.',
						feedback:
							'Önce hangi göstergelerin önemli olduğunu belirlemelisiniz; sunum sonraki adım.',
					},
				],
				output: {
					title: 'Gösterge tablosu',
					app: 'word',
					lines: [
						'**Müşteri kayıp oranı:** %11 · hedef: Belirtilmedi',
						'**İlk yanıt süresi:** 14 saat · hedef: 8 saat',
						'**Müşteri memnuniyeti:** 3,9 / 5 · hedef: Belirtilmedi',
						'**KOBİ yenileme oranı:** %71 · hedef: Belirtilmedi',
					],
				},
			},
			{
				id: 'eposta',
				title: 'Yönetici e-postası hazırlayın',
				options: [
					{
						id: 'ikna',
						app: 'outlook',
						appLabel: 'Outlook’ta Copilot',
						prompt: 'Yöneticime raporla ilgili bir e-posta yaz, ikna edici olsun.',
						feedback:
							'Ne anlatılacağı ve uzunluk belirsiz; “ikna edici olsun” isteği abartılı ifadelere yol açabilir.',
					},
					{
						id: 'teams',
						app: 'teams',
						appLabel: 'Teams’te Copilot',
						prompt: 'Toplantı özeti çıkar.',
						feedback: 'Toplantı henüz yapılmadı; özetlenecek bir toplantı yok.',
					},
					{
						id: 'net',
						app: 'outlook',
						appLabel: 'Outlook’ta Copilot ile taslak',
						prompt:
							'Yöneticime, yarınki toplantıdan önce raporun üç ana bulgusunu ve karar gerektiren konuyu anlatan, 120 kelimeyi geçmeyen bir e-posta taslağı yaz. Ton net ve profesyonel olsun.',
						correct: true,
						feedback:
							'E-posta Outlook’ta hazırlanır; hedef kitle, uzunluk ve ana mesaj belli. Göndermeden önce rakamları özetle karşılaştırırsınız.',
					},
				],
				output: {
					title: 'E-posta taslağı (gönderilmedi)',
					app: 'outlook',
					lines: [
						'Merhaba [yönetici adı],',
						'Yarınki toplantıdan önce 3. çeyrek müşteri deneyimi raporunun öne çıkanlarını paylaşmak istedim:',
						'Müşteri kaybı %8’den %11’e yükseldi; kayıpların çoğu yenileme dönemindeki KOBİ’lerden.',
						'İlk yanıt süresi 14 saate çıktı (hedef 8 saat).',
						'Kaybedilen müşterilerin yarısı rakip indirimlerini gerekçe gösterdi.',
						'**Karar gereken konu:** Yenileme kampanyası bütçesinin onayı.',
					],
				},
			},
			{
				id: 'sunum',
				title: 'Sunum akışını oluşturun',
				options: [
					{
						id: 'karar',
						app: 'powerpoint',
						appLabel: 'PowerPoint’te Copilot',
						prompt:
							'Bu rapordan yönetim için 5 slaytlık, karar odaklı bir sunum taslağı oluştur: amaç, durum, bulgular, riskler, öneri. Başlıklar mesaj taşısın.',
						correct: true,
						feedback:
							'Hedef kitle, slayt sayısı ve akış belirtilmiş; 5 dakikalık bir sunuma uygun.',
					},
					{
						id: 'hepsi',
						app: 'powerpoint',
						appLabel: 'PowerPoint’te Copilot',
						prompt: 'Raporun bütün sayfalarını slayta dönüştür.',
						feedback:
							'15 sayfalık rapordan 15’ten fazla slayt çıkar; yönetim için 5 dakikalık bir sunum olmaz.',
					},
					{
						id: 'grafik',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt: 'Grafik oluştur.',
						feedback: 'Grafik bir sunumun parçası olabilir, ama sunum akışı oluşturmaz.',
					},
				],
				output: {
					title: 'Sunum akışı',
					app: 'powerpoint',
					lines: [
						'1. Müşteri kaybı bir çeyrekte %8’den %11’e çıktı',
						'2. Destek yanıt süresi 14 saat; hedef 8 saat',
						'3. Risk: yenileme dönemindeki KOBİ müşterileri',
						'4. Öneri: destek ekibine iki uzman ve proaktif yenileme aramaları',
						'5. Karar: yenileme kampanyası bütçesinin onayı',
					],
				},
			},
		],
		wrapUp: [
			'Önce **anladınız** (özet, göstergeler), sonra **iletişim kurdunuz** (e-posta, sunum).',
			'Her adımda bir önceki çıktıyı bir sonrakinin girdisi olarak kullandınız.',
			'Doğru uygulama, işin yapıldığı yerdir: belge için Word, e-posta için Outlook, sunum için PowerPoint.',
		],
	},
	{
		id: 'satis',
		title: 'Satış performansını değerlendirme',
		role: 'Bölge satış müdürü',
		context:
			'Elinizde Ocak–Nisan satış tablosu var (Excel laboratuvarındaki veri). Yönetim, hangi bölge ve ürünlere odaklanılması gerektiğine dair kısa bir öneri notu istiyor.',
		goal: 'Veriyi incele → eğilimleri bul → riskleri ve fırsatları çıkar → öneri notu yaz',
		steps: [
			{
				id: 'incele',
				title: 'Excel verilerini inceleyin',
				options: [
					{
						id: 'genel',
						app: 'chat',
						appLabel: 'Copilot Chat',
						prompt: 'Türkiye’de B2B yazılım satışları nasıl gidiyor?',
						feedback:
							'Bu soru sizin verinizle ilgili değil; genel ve doğrulanması zor bilgiler üretir.',
					},
					{
						id: 'yapi',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt:
							'Bu tabloyu özetle: hangi sütunlar var, toplam hedef ve gerçekleşen satış ne kadar?',
						correct: true,
						feedback:
							'Analize başlamadan önce verinin yapısını ve toplamları görmek, sonraki adımların temelini oluşturur.',
					},
					{
						id: 'cozum',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt: 'Satışları artırmak için ne yapmalıyız?',
						feedback: 'Veriyi tanımadan çözüm istemek, veriye dayanmayan öneriler üretir.',
					},
				],
				output: {
					title: 'Veri özeti',
					app: 'excel',
					lines: [
						'36 satır: 4 ay × 3 bölge × 3 ürün.',
						'Sütunlar: Ay, Ürün, Bölge, Satış hedefi, Gerçekleşen satış, Müşteri sayısı.',
						'Toplam hedef 11.065 bin ₺, gerçekleşen 11.180 bin ₺ (hedefin %101’i).',
					],
				},
			},
			{
				id: 'egilim',
				title: 'Eğilimleri belirleyin',
				options: [
					{
						id: 'tahmin',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt: 'Gelecek yılın satışlarını tahmin et.',
						feedback:
							'Dört aylık veri, gelecek yıl için sağlıklı bir tahmin üretmez. Tahmin isteniyorsa varsayımlar açıkça belirtilmelidir.',
					},
					{
						id: 'kirilim',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt:
							'Aylara ve ürünlere göre satış değişimini göster; en çok büyüyen ve hedefin altında kalan ürünleri belirt.',
						correct: true,
						feedback: 'Zaman ve ürün kırılımı, eğilimi doğrudan gösterir.',
					},
					{
						id: 'slayt',
						app: 'powerpoint',
						appLabel: 'PowerPoint’te Copilot',
						prompt: 'Eğilim slaytı oluştur.',
						feedback: 'Önce eğilimi analiz etmelisiniz; slayt sonraki bir adım.',
					},
				],
				output: {
					title: 'Eğilimler',
					app: 'excel',
					lines: [
						'Siber Güvenlik Ocak’tan Nisan’a %18,5 büyüdü.',
						'Şubat’ta toplam satış %4,7 azaldı; Mart’ta %16 arttı.',
						'Veri Analitiği dört aylık toplamda hedefin %4,7 altında.',
					],
				},
			},
			{
				id: 'risk',
				title: 'Riskleri ve fırsatları çıkarın',
				options: [
					{
						id: 'acik',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt:
							'Hedefin altında kalan bölge-ürün kombinasyonlarını açık tutarıyla listele; hedefinden %30’dan fazla sapan kayıtları ayrıca belirt.',
						correct: true,
						feedback:
							'Riskler (açıklar) ve doğrulanması gereken sıra dışı kayıtlar birlikte görünür.',
					},
					{
						id: 'neden',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt: 'İç Anadolu neden kötü?',
						feedback:
							'Veride neden bilgisi yok; Copilot yalnızca tahmin üretebilir. Önce “ne kadar ve nerede?” sorusunu sorun.',
					},
					{
						id: 'rakip',
						app: 'chat',
						appLabel: 'Copilot Chat',
						prompt: 'Rakiplerimiz ne yapıyor?',
						feedback:
							'Rakip bilgisi veride yok; bu adımın amacı kendi verinizdeki risk ve fırsatları görmek.',
					},
				],
				output: {
					title: 'Riskler ve fırsatlar',
					app: 'excel',
					lines: [
						'**Risk:** İç Anadolu · Siber Güvenlik 155 bin ₺ açıkta (gerçekleşme %84,8).',
						'**Risk:** İç Anadolu · Veri Analitiği ve Marmara · Veri Analitiği 100’er bin ₺ açıkta.',
						'**Fırsat:** Ege · Siber Güvenlik hedefin %15 üzerinde.',
						'**Doğrulanmalı:** Şubat · İç Anadolu · Siber Güvenlik (%62) ve Mart · Ege · Veri Analitiği (%145).',
					],
				},
			},
			{
				id: 'not',
				title: 'Yönetici için öneri notu oluşturun',
				options: [
					{
						id: 'elestiri',
						app: 'word',
						appLabel: 'Word’de Copilot',
						prompt: 'İç Anadolu ekibinin performansını eleştiren bir not yaz.',
						feedback:
							'Not kişileri değil veriyi ve önerileri ele almalı. Performans değerlendirmesi bir insan kararıdır ve veriden fazlasını gerektirir.',
					},
					{
						id: 'oneri',
						app: 'word',
						appLabel: 'Word’de Copilot',
						prompt:
							'Bu bulgulara dayanarak yönetim için yarım sayfalık bir öneri notu yaz: üç bulgu, iki öneri ve doğrulanması gereken kayıtlar. Veride olmayan neden ekleme.',
						correct: true,
						feedback: 'Not Word’de hazırlanır; bulgu, öneri ve doğrulama ayrımı korunur.',
					},
					{
						id: 'herkese',
						app: 'outlook',
						appLabel: 'Outlook’ta Copilot',
						prompt: 'Bütün satış ekibine sonuçları gönder.',
						feedback:
							'Not henüz hazır değil, doğrulanması gereken kayıtlar var ve hedef kitle yönetim.',
					},
				],
				output: {
					title: 'Öneri notu',
					app: 'word',
					lines: [
						'**Bulgular:** Ege (%109,5) ve Marmara (%102,3) hedefi aştı; İç Anadolu %89,5’te kaldı. Siber Güvenlik %18,5 büyüdü. Veri Analitiği hedefin %4,7 altında.',
						'**Öneri 1:** İç Anadolu için Siber Güvenlik ve Veri Analitiği odaklı bir eylem planı.',
						'**Öneri 2:** Ege’deki Siber Güvenlik yaklaşımının diğer bölgelerle paylaşılması.',
						'**Doğrulanmalı:** Şubat · İç Anadolu ve Mart · Ege kayıtları.',
						'**Not:** Veride fiyat, marj ve kampanya bilgisi olmadığı için nedenler yorumlanmamıştır.',
					],
				},
			},
		],
		wrapUp: [
			'Veriyi önce **tanıdınız**, sonra **sorguladınız**, en son **yorumladınız**.',
			'Hesaplanan bulguyu, varsayımı ve doğrulanması gereken kaydı ayırdınız.',
			'Kişileri değil veriyi değerlendiren, karar odaklı bir not hazırladınız.',
		],
	},
	{
		id: 'toplanti',
		title: 'Proje toplantısı sonrası',
		role: 'Proje yöneticisi',
		context:
			'Mobil Uygulama v2.0’ın haftalık proje toplantısı az önce bitti ve transkript hazır (Teams laboratuvarındaki toplantı). Ekibe takip e-postası gönderecek ve bir sonraki toplantının gündemini hazırlayacaksınız.',
		goal: 'Toplantıyı özetle → kararları ve aksiyonları çıkar → takip e-postası hazırla → gündem oluştur',
		steps: [
			{
				id: 'ozet',
				title: 'Toplantı transkriptini özetleyin',
				options: [
					{
						id: 'teams',
						app: 'teams',
						appLabel: 'Teams’te toplantının Copilot’u',
						prompt:
							'Bu toplantıyı katılamayanlar için kısa bir paragrafla özetle; ertelenen kararları da belirt.',
						correct: true,
						feedback:
							'Toplantı içeriği Teams’te. Ertelenen kararları istemek önemli bir ayrımı korur.',
					},
					{
						id: 'hafiza',
						app: 'word',
						appLabel: 'Word’de Copilot',
						prompt: 'Toplantıyı hatırladığım kadarıyla yazayım, sen düzelt.',
						feedback: 'Transkript varken hafızaya dayanmak bilgi kaybına yol açar.',
					},
					{
						id: 'hakli',
						app: 'teams',
						appLabel: 'Teams’te Copilot',
						prompt: 'Toplantıda kim haklıydı?',
						feedback: 'Yargılayıcı ve amaçsız bir soru; özet için uygun değil.',
					},
				],
				output: {
					title: 'Toplantı özeti',
					app: 'teams',
					lines: [
						'Regresyon testlerinin %80’i tamamlandı; ödeme ekranındaki iki kritik hatadan biri bugün kapatılacak, diğeri bankanın API dokümanını bekliyor.',
						'20 Haziran’daki müşteri demosu ödeme ekranı olmadan yapılacak.',
						'Yayın tarihi (1 Temmuz) ve lisans bütçesi kararları ertelendi.',
					],
				},
			},
			{
				id: 'aksiyon',
				title: 'Kararları ve aksiyonları çıkarın',
				options: [
					{
						id: 'ata',
						app: 'teams',
						appLabel: 'Teams’te Copilot',
						prompt: 'Herkese bir görev ata.',
						feedback:
							'Görev ataması insan kararıdır; Copilot transkriptte olmayan sorumlular üretebilir.',
					},
					{
						id: 'excel',
						app: 'excel',
						appLabel: 'Excel’de Copilot',
						prompt: 'Aksiyon tablosu oluştur.',
						feedback:
							'Aksiyonlar toplantı içeriğinden çıkar. Önce Teams’te çıkarın; isterseniz sonra bir tabloya taşıyabilirsiniz.',
					},
					{
						id: 'liste',
						app: 'teams',
						appLabel: 'Teams’te Copilot',
						prompt:
							'Kararları ve aksiyon maddelerini sorumlu ve tarihleriyle listele; transkriptte yoksa “Belirtilmedi” yaz.',
						correct: true,
						feedback:
							'Kararlar ve aksiyonlar ayrılıyor; eksik bilgi “Belirtilmedi” ile görünür kalıyor.',
					},
				],
				output: {
					title: 'Kararlar ve aksiyonlar',
					app: 'teams',
					lines: [
						'**Karar:** Demo ödeme ekranı olmadan yapılacak.',
						'**Ertelendi:** Yayın tarihi ve lisans bütçesi.',
						'Onur – erişim talebi (perşembe) · Kerem – demo senaryosu (Belirtilmedi)',
						'Demo provası (Belirtilmedi) · Lisans teklifi takibi (Belirtilmedi)',
					],
				},
			},
			{
				id: 'eposta',
				title: 'Takip e-postası hazırlayın',
				options: [
					{
						id: 'takip',
						app: 'outlook',
						appLabel: 'Outlook’ta Copilot ile taslak',
						prompt:
							'Toplantı notlarına dayanarak katılımcılara kısa bir takip e-postası taslağı hazırla: kararlar, aksiyonlar ve netleştirilecek konular.',
						correct: true,
						feedback:
							'Kısa, yapılandırılmış ve katılımcılara yönelik bir takip. Göndermeden önce sorumluları kontrol edersiniz.',
					},
					{
						id: 'musteri',
						app: 'outlook',
						appLabel: 'Outlook’ta Copilot',
						prompt: 'Müşteriye toplantı notlarını gönder.',
						feedback:
							'Bu bir iç proje toplantısıydı; notlarda müşteriye uygun olmayan bilgiler var.',
					},
					{
						id: 'sunum',
						app: 'powerpoint',
						appLabel: 'PowerPoint’te Copilot',
						prompt: 'Toplantıyı sunuma dönüştür.',
						feedback: 'Takip için sunum gerekmez; kısa bir e-posta yeterli.',
					},
				],
				output: {
					title: 'Takip e-postası (gönderilmedi)',
					app: 'outlook',
					lines: [
						'**Kararlar:** Demo (20 Haziran) ödeme ekranı olmadan; yayın tarihi kararı bir sonraki toplantıda.',
						'**Aksiyonlar:** Onur – erişim talebi (perşembe); Kerem – demo senaryosu (tarih belirtilmedi).',
						'**Netleştirilecekler:** Demo provasının tarihi ve lisans teklifini kimin takip edeceği.',
					],
				},
			},
			{
				id: 'gundem',
				title: 'Sonraki toplantı için gündem oluşturun',
				options: [
					{
						id: 'genel',
						app: 'chat',
						appLabel: 'Copilot Chat',
						prompt: 'Bir toplantı gündemi yaz.',
						feedback: 'Hangi açık konulara dayanacağı belirtilmediği için genel bir gündem çıkar.',
					},
					{
						id: 'acik',
						app: 'chat',
						appLabel: 'Copilot Chat (toplantı notlarıyla)',
						prompt:
							'Toplantı notlarındaki açık konulara göre bir sonraki toplantı için 30 dakikalık bir gündem öner; karar gerektiren maddeleri işaretle.',
						correct: true,
						feedback: 'Gündem, açık konulara ve kararlara dayanıyor; süre sınırı da belli.',
					},
					{
						id: 'iptal',
						app: 'teams',
						appLabel: 'Teams’te Copilot',
						prompt: 'Bir sonraki toplantıyı iptal et.',
						feedback:
							'Açık konular varken toplantıyı iptal etmek kararları geciktirir; ayrıca bu, Copilot’tan istenecek bir iş değil.',
					},
				],
				output: {
					title: 'Gündem önerisi',
					app: 'chat',
					lines: [
						'1. Lisans teklifi ve takip sorumlusu · 10 dk · **karar**',
						'2. Yayın tarihi: banka dokümanının durumu · 10 dk · **karar**',
						'3. Demo provası tarihi ve geri bildirim · 10 dk',
					],
				},
			},
		],
		wrapUp: [
			'Toplantı içeriğini **kaynağında** (Teams) özetlediniz.',
			'Kararları, ertelenen konuları ve eksik bilgileri ayırdınız.',
			'Takip ve gündemle toplantının sonuçlarını **eyleme** dönüştürdünüz.',
		],
	},
]

export const getScenario = (id: string) => SCENARIOS.find((s) => s.id === id)
