import type { QuizQuestion } from '@/lib/quizScoring'

// Final assessment (module 11). Every question names the module to revisit
// when it is missed, and the skill it measures.
//
// Wrong options are mistakes people really make, written at about the same
// length as the right one, so neither length nor wording (“kontrol”,
// “doğrula”) gives the answer away; src/tests/quizContent.test.ts keeps it so.
//
// Option ids are the keys saved answers are stored under, so an option keeps
// its id when it moves or is reworded: saved attempts and drafts still score
// the same. That is why ids are not always in a–d order below. The listed
// order spreads the right answer over A–D; learners see a per-attempt
// shuffle of it (QuizPage).
export const QUIZ_QUESTIONS: QuizQuestion[] = [
	{
		id: 'q01',
		skill: 'basics',
		moduleId: 'copilot-giris',
		prompt: 'Microsoft 365 Copilot’ı klasik aramadan ayıran temel özellik hangisidir?',
		options: [
			{ id: 'a', text: 'Kurumdaki bütün dosyalara, erişim izniniz olmasa da ulaşabilmesi' },
			{
				id: 'c',
				text: 'Yanıtlarını kendisi doğruladığı için sonucu ayrıca kontrol etmenize gerek bırakmaması',
			},
			{ id: 'd', text: 'Mevcut belgeleri daha hızlı bulup en alakalı olanları üstte listelemesi' },
			{ id: 'b', text: 'Talebinizi anlayıp yeni içerik üretebilmesi: özet, taslak veya analiz' },
		],
		correct: 'b',
		explanation:
			'Arama mevcut içeriği bulup listeler; Copilot ise talimatınıza göre yeni içerik üretir. Ürettiği içerik hatalı olabileceği için doğrulama gerekir.',
	},
	{
		id: 'q02',
		skill: 'basics',
		moduleId: 'copilot-giris',
		prompt: 'Copilot Chat ile uygulama içi Copilot hakkında hangisi doğrudur?',
		options: [
			{
				id: 'b',
				text: 'Uygulama içi Copilot açık belgeyle çalışır; birden fazla kaynağı birleştiren sorular için Copilot Chat daha uygundur.',
			},
			{
				id: 'a',
				text: 'İkisi aynı Copilot olduğu için hangisini kullandığınız fark etmez; ikisi de yalnızca o an açık olan belgeyi kaynak alır.',
			},
			{
				id: 'c',
				text: 'Copilot Chat her lisansta iş verilerinize erişir; uygulama içi Copilot ise yalnızca web’deki genel bilgilerle yanıt verir.',
			},
			{
				id: 'd',
				text: 'Birden fazla kaynağı birleştirmek için uygulama içi Copilot, tek bir belgeyi özetlemek içinse Copilot Chat daha uygundur.',
			},
		],
		correct: 'b',
		explanation:
			'İş tek bir belgedeyse uygulama içi Copilot, çok kaynaklı sentez veya serbest sorular için Copilot Chat daha uygundur. Kullanılabilirlik lisansa ve yapılandırmaya bağlıdır.',
	},
	{
		id: 'q03',
		skill: 'prompting',
		moduleId: 'prompt-atolyesi',
		prompt: 'Aşağıdaki prompt’lardan hangisi en güçlüdür?',
		options: [
			{
				id: 'a',
				text: '“Yönetim kurulu için çok etkileyici, profesyonel ve akılda kalıcı bir sunum hazırla; mümkün olduğunca ayrıntılı olsun ve hiçbir önemli noktayı atlama.”',
			},
			{
				id: 'c',
				text: '“Ekteki pazar araştırması raporuna göre yönetim kurulu için 6 slaytlık bir sunum taslağı hazırla; her slaytta tek ana mesaj ve konuşmacı notu olsun.”',
			},
			{
				id: 'b',
				text: '“Pazar araştırması hakkında yönetim kuruluna bir sunum hazırla; sektördeki son eğilimleri, rakipleri ve fırsatları da ekle, slayt sayısını sen belirle.”',
			},
			{
				id: 'd',
				text: '“Ekteki pazar araştırması raporunu oku ve önemli bulduğun her şeyi slaytlara aktar; kaç slayt olacağına ve sunumun kime hitap edeceğine sen karar ver.”',
			},
		],
		correct: 'c',
		explanation:
			'Güçlü prompt; amaç (sunum taslağı), kaynak (pazar araştırması raporu), hedef kitle (yönetim kurulu) ve beklentiyi (6 slayt, tek mesaj, konuşmacı notu) içerir. Sıfatlar, “sen karar ver” demek ya da kaynak göstermeden yalnızca konuyu yazmak bu bilgilerin yerini tutmaz.',
	},
	{
		id: 'q04',
		skill: 'prompting',
		moduleId: 'prompt-atolyesi',
		prompt: '“Ekteki Mayıs bütçe tablosunu kullan.” ifadesi prompt’un hangi bileşenidir?',
		options: [
			{ id: 'a', text: 'Beklenti' },
			{ id: 'b', text: 'Bağlam' },
			{ id: 'c', text: 'Kaynak' },
			{ id: 'd', text: 'Kısıtlar' },
		],
		correct: 'c',
		explanation:
			'Kaynak bileşeni, Copilot’ın dayanması gereken dosya, belge veya bilgiyi belirtir. Bağlam durumu ve okuyucuyu, beklenti çıktının biçimini, kısıtlar ise ton ve uzunluk gibi sınırları tarif eder.',
	},
	{
		id: 'q05',
		skill: 'prompting',
		moduleId: 'copilot-chat',
		prompt:
			'Uzun bir proje güncellemesini yönetici özeti, riskler ve aksiyonlara dönüştürmek istiyorsunuz. Copilot Chat’te en etkili yaklaşım hangisi?',
		options: [
			{
				id: 'a',
				text: 'Özeti, riskleri ve aksiyonları tek bir uzun prompt’ta birlikte istemek ve çıkan metni sonunda bir kez kontrol etmek',
			},
			{
				id: 'c',
				text: 'Her adım için yeni bir sohbet açıp güncellemeyi baştan yapıştırmak; böylece önceki yanıtların sonucu etkilemesini önlemek',
			},
			{
				id: 'b',
				text: 'Önce yönetici özetini istemek, sonra riskleri ve aksiyonları ayrı takip prompt’larıyla çıkarıp her adımı kontrol etmek',
			},
			{
				id: 'd',
				text: 'Güncellemeyi ekleyip yalnızca “Bunu özetle” yazmak ve risklerle aksiyonların özette kendiliğinden yer alacağını varsaymak',
			},
		],
		correct: 'b',
		explanation:
			'Karmaşık işleri adımlara bölmek ve takip sorularıyla ilerlemek, her ara sonucu kontrol etmenize ve yönü düzeltmenize olanak tanır. Konu aynı kaldıkça aynı sohbette ilerlemek bağlamı korur.',
	},
	{
		id: 'q06',
		skill: 'apps',
		moduleId: 'word',
		prompt:
			'Word’de teknik bir belgeyi, teknik olmayan yöneticiler için uyarlamanız gerekiyor. Hangi prompt en uygundur?',
		options: [
			{
				id: 'a',
				text: '“Bu belgeyi daha profesyonel ve anlaşılır hâle getir; gereksiz kısımları çıkar ama önemli teknik ayrıntıların hepsini koru.”',
			},
			{
				id: 'c',
				text: '“Bu belgeyi özetle; en önemli teknik terimleri, kısaltmaları ve sistem bileşenlerini de madde madde listele.”',
			},
			{
				id: 'd',
				text: '“Belgedeki teknik terimlerin hepsini kaldır ve metni olabildiğince kısalt; bir paragrafı geçmesin, ayrıntıya girme.”',
			},
			{
				id: 'b',
				text: '“Bu belgeyi teknik olmayan yöneticiler için sade bir dille yeniden yaz; kısaltmaları açıkla ve bir sayfayı geçme.”',
			},
		],
		correct: 'b',
		explanation:
			'Hedef kitle, dil düzeyi ve uzunluk belirtildiğinde yeniden yazma amaca uygun olur. Teknik ayrıntıların hepsini korumak da hepsini silmek de yöneticinin ihtiyacını karşılamaz; kısaltmaları açıklamak içeriği kaybetmeden anlaşılır kılar.',
	},
	{
		id: 'q07',
		skill: 'apps',
		moduleId: 'outlook',
		prompt:
			'40 mesajlık bir e-posta zincirine sonradan dahil oldunuz ve durumu hızla anlamanız gerekiyor. En uygun yaklaşım hangisi?',
		options: [
			{
				id: 'b',
				text: 'Outlook’ta Copilot ile zinciri özetletmek ve özetteki kararları olduğu gibi ekibe iletmek',
			},
			{
				id: 'a',
				text: 'Outlook’ta Copilot ile zinciri özetletmek, sonra kararları ve açık soruları mesajlarda kontrol etmek',
			},
			{
				id: 'c',
				text: 'Yalnızca son birkaç mesajı okuyup tarihleri kontrol etmek; zincirdeki güncel durum zaten en son yanıtlarda yazar',
			},
			{
				id: 'd',
				text: 'Zinciri başlatan kişiden, bütün süreci sizin için ayrı bir e-postayla baştan anlatmasını istemek',
			},
		],
		correct: 'a',
		explanation:
			'E-posta zincirini özetlemek tam olarak Outlook’taki Copilot deneyiminin amacıdır. Özetteki kararları ve tarihleri yine de mesajlarla karşılaştırın. Yalnızca son mesajlara bakmak, daha önce alınmış kararları atlamanıza yol açabilir.',
	},
	{
		id: 'q08',
		skill: 'data',
		moduleId: 'excel',
		prompt:
			'Excel’de Copilot’a “Hangi bölgeler hedefin altında kaldı?” diye sordunuz. Yanıtı kullanmadan önce ne yapmalısınız?',
		options: [
			{
				id: 'b',
				text: 'Sonucu tablodaki değerlerle, bir filtreyle veya basit bir formülle kendiniz doğrulamak',
			},
			{
				id: 'a',
				text: 'Copilot’a aynı soruyu tekrar sorup iki yanıt aynıysa sonucu doğrulanmış saymak',
			},
			{
				id: 'c',
				text: 'Copilot’ın oluşturduğu grafiğe bakıp sonuç makul görünüyorsa yanıtı kullanmak',
			},
			{
				id: 'd',
				text: 'Copilot’tan yanıtın hangi sütunlara dayandığını açıklamasını istemek ve açıklamayı yeterli bulmak',
			},
		],
		correct: 'b',
		explanation:
			'Copilot’ın analizi bir başlangıç noktasıdır. Karar alınacak sonuçları filtre, pivot veya formülle doğrulamak en güvenli yoldur. Aynı yanıtın tekrar gelmesi ya da makul görünmesi doğruluğun kanıtı değildir.',
	},
	{
		id: 'q09',
		skill: 'apps',
		moduleId: 'powerpoint',
		prompt:
			'PowerPoint’te bir rapordan sunum taslağı oluşturduktan sonra en önemli adım hangisidir?',
		options: [
			{
				id: 'a',
				text: 'Tasarım önerilerinden birini seçip slaytları görsel olarak tutarlı ve dikkat çekici hâle getirmek',
			},
			{
				id: 'c',
				text: 'Copilot raporun kendisini kullandığı için rakamları atlayıp yalnızca yazım hatalarını kontrol etmek',
			},
			{
				id: 'b',
				text: 'Hikâye akışını, mesaj netliğini ve rakamları gözden geçirip hedef kitleye göre düzenlemek',
			},
			{
				id: 'd',
				text: 'Raporda kalan her ayrıntının sunuma girmesi için Copilot’tan slayt sayısını artırmasını istemek',
			},
		],
		correct: 'b',
		explanation:
			'Copilot iyi bir ilk taslak sunar; hikâyeyi hedef kitleye göre kurmak ve rakamları doğrulamak sunucunun işidir. Rakamlar rapordan alınsa da yanlış aktarılmış olabilir; görsel düzen ise mesaj netleştikten sonra gelir.',
	},
	{
		id: 'q10',
		skill: 'meetings',
		moduleId: 'teams',
		prompt:
			'Copilot’ın hazırladığı toplantı özetinde, toplantıda hiç konuşulmamış bir karar yer alıyor. Ne yapmalısınız?',
		options: [
			{
				id: 'a',
				text: 'Karar mantıklı ve ekibin genel yönüyle uyumlu göründüğü için özette olduğu gibi bırakmak',
			},
			{
				id: 'c',
				text: 'Copilot’tan özeti yeniden oluşturmasını istemek ve karar ikinci özette de varsa doğru kabul etmek',
			},
			{
				id: 'd',
				text: 'Kararı özette bırakıp yanına “teyit edilecek” notu ekleyerek özeti hemen bütün katılımcılara göndermek',
			},
			{
				id: 'b',
				text: 'Özeti transkriptle karşılaştırıp kararı çıkarmak veya düzeltmek; gerekirse katılımcılara sormak',
			},
		],
		correct: 'b',
		explanation:
			'Özet, transkriptte veya toplantıda olmayan bir bilgiyi içermemelidir. Uyuşmazlığı düzeltmek ve gerekirse teyit almak gerekir. Kararın yeniden oluşturulan özette de çıkması kanıt sayılmaz; notla bile olsa dağıtılan bir karar yanlış bilgiyi yayar.',
	},
	{
		id: 'q11',
		skill: 'meetings',
		moduleId: 'teams',
		prompt:
			'Toplantı transkriptinde bir aksiyonun sorumlusu belirtilmemiş. Takip e-postasında ne yazmak en doğrudur?',
		options: [
			{ id: 'c', text: '“Sorumlu: Belirtilmedi” yazıp sorumlunun netleştirilmesini istemek' },
			{ id: 'a', text: 'Konuyu toplantıda en çok konuşan kişiyi sorumlu olarak yazmak' },
			{ id: 'b', text: 'Copilot özette bir sorumlu önerdiyse o kişiyi yazıp e-postayı göndermek' },
			{ id: 'd', text: 'Aksiyonu, sorumlusu netleşene kadar takip e-postasına hiç eklememek' },
		],
		correct: 'c',
		explanation:
			'Transkriptte olmayan bir sorumlu atamak uydurma bilgi olur. Eksikliği görünür kılmak doğru yaklaşımdır; aksiyonu e-postadan çıkarmak ise işin unutulmasına yol açabilir.',
	},
	{
		id: 'q12',
		skill: 'apps',
		moduleId: 'senaryolar',
		prompt: 'Yönetim toplantısına hazırlanıyorsunuz. Hangi iş akışı en mantıklıdır?',
		options: [
			{
				id: 'b',
				text: 'PowerPoint’te sunumu hazırlamak → Outlook’ta yönetici e-postasını yazmak → raporu Word’de özetleyip KPI’ları en sona eklemek',
			},
			{
				id: 'a',
				text: 'Raporu Word’de özetlemek → önemli KPI’ları çıkarmak → Outlook’ta yönetici e-postası hazırlamak → PowerPoint’te sunum akışı oluşturmak',
			},
			{
				id: 'c',
				text: 'Raporu Word’de özetlemek → özeti doğrudan yönetici e-postası olarak göndermek → sunumu toplantı sırasında Copilot’la oluşturmak',
			},
			{
				id: 'd',
				text: 'Excel’de bütün verilerden grafikler üretmek → grafikleri PowerPoint’e taşımak → raporu ve e-postayı toplantıdan sonra hazırlamak',
			},
		],
		correct: 'a',
		explanation:
			'Önce içeriği anlamak (özet, KPI), sonra iletişimi ve sunumu hazırlamak; her adımda önceki çıktıyı kontrol ederek ilerlemek gerekir.',
	},
	{
		id: 'q13',
		skill: 'safety',
		moduleId: 'guvenli-kullanim',
		prompt:
			'Bir müşterinin kimlik numarası ve sağlık bilgilerini içeren dosyayı özetletmek istiyorsunuz. Doğru yaklaşım hangisi?',
		options: [
			{
				id: 'a',
				text: 'Kimlik numarasını silip dosyanın geri kalanını, hızlı olduğu için kişisel hesabınızla kullandığınız ücretsiz bir yapay zekâ aracına yüklemek',
			},
			{
				id: 'c',
				text: 'Dosya kurum içinde olduğu için Copilot’a doğrudan vermek; kurumsal bir araçta politika kontrolüne gerek olmadığını varsaymak',
			},
			{
				id: 'b',
				text: 'Kurumun veri sınıflandırma ve yapay zekâ politikalarını kontrol etmek; yalnızca onaylı araçları ve gereken en az veriyi kullanmak',
			},
			{
				id: 'd',
				text: 'Özetin doğruluğunu kontrol edebilmeleri için dosyayı, hassas bilgileriyle birlikte ekip kanalında meslektaşlarınızla paylaşmak',
			},
		],
		correct: 'b',
		explanation:
			'Hassas veriler kurum politikalarına uygun biçimde, onaylı araçlarla ve yalnızca gerektiği kadar kullanılmalıdır. Kurumsal bir araç kullanmak, politikaları kontrol etme gereğini ortadan kaldırmaz.',
	},
	{
		id: 'q14',
		skill: 'safety',
		moduleId: 'guvenli-kullanim',
		prompt:
			'Copilot, erişmemeniz gereken bir İK dosyasından bilgi içeren bir yanıt verdi. Bu neye işaret eder ve ne yapmalısınız?',
		options: [
			{
				id: 'b',
				text: 'Dosya izinleri gereğinden geniş olabilir; bilgiyi kullanmadan durumu BT veya güvenlik ekibine bildirmelisiniz.',
			},
			{
				id: 'a',
				text: 'Copilot bu bilgiyi gösterdiyse onu görmeye yetkilisinizdir; bilgiyi işiniz için gerektiği kadar kullanabilirsiniz.',
			},
			{
				id: 'c',
				text: 'Copilot’ta geçici bir hata olmuştur; yanıtı silip konuyu kimseye bildirmeden çalışmaya devam etmelisiniz.',
			},
			{
				id: 'd',
				text: 'Bilginin doğru olup olmadığını dosyayı açarak kontrol etmeli, ardından durumu yöneticinize iletmelisiniz.',
			},
		],
		correct: 'b',
		explanation:
			'Microsoft’un açıklamalarına göre Copilot, kullanıcının erişim izni olan içerikle çalışacak şekilde tasarlanmıştır. Erişmemeniz gereken bir içeriği görmeniz, izinlerin gözden geçirilmesi gerektiğini gösterebilir. Bilgiyi kullanmak, iletmek veya dosyayı açıp incelemek sorunu büyütür.',
	},
	{
		id: 'q15',
		skill: 'verify',
		moduleId: 'guvenli-kullanim',
		prompt: 'Copilot’ın ürettiği bir metnin doğruluğunu kontrol etmenin en iyi yolu hangisidir?',
		options: [
			{
				id: 'a',
				text: 'Metindeki kaynak bağlantılarının yer aldığını görüp bağlantıları açmadan metne güvenmek',
			},
			{
				id: 'c',
				text: 'Rakam, isim, tarih ve alıntıları tek tek kaynak belgelerdeki asıl hâlleriyle karşılaştırmak',
			},
			{
				id: 'b',
				text: 'Copilot’a “Emin misin?” diye sorup yanıtını onaylarsa metni doğrulanmış saymak',
			},
			{
				id: 'd',
				text: 'Metni internetteki benzer yazılarla karşılaştırıp genel olarak örtüşüyorsa doğru kabul etmek',
			},
		],
		correct: 'c',
		explanation:
			'Akıcılık, Copilot’ın kendinden emin dili veya metinde kaynak bağlantısı bulunması doğruluğun kanıtı değildir. Kaynakla karşılaştırma en güvenilir yöntemdir; metnin başka yazılarla örtüşmesi de tek başına yeterli değildir.',
	},
]
