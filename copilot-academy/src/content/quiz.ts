import type { QuizQuestion } from '@/lib/quizScoring'

// Final assessment (module 11). Every question names the module to revisit
// when it is missed, and the skill it measures.
export const QUIZ_QUESTIONS: QuizQuestion[] = [
	{
		id: 'q01',
		skill: 'basics',
		moduleId: 'copilot-giris',
		prompt: 'Microsoft 365 Copilot’ı klasik aramadan ayıran temel özellik hangisidir?',
		options: [
			{ id: 'a', text: 'Yalnızca dosya adlarını listelemesi' },
			{ id: 'b', text: 'Talebinizi anlayıp yeni içerik üretebilmesi: özet, taslak, analiz' },
			{ id: 'c', text: 'Her zaman hatasız sonuç vermesi' },
			{ id: 'd', text: 'İnternet bağlantısı olmadan çalışması' },
		],
		correct: 'b',
		explanation:
			'Arama mevcut içeriği bulur; Copilot ise talimatınıza göre yeni içerik üretir. Ürettiği içerik hatalı olabileceği için doğrulama gerekir.',
	},
	{
		id: 'q02',
		skill: 'basics',
		moduleId: 'copilot-giris',
		prompt: 'Copilot Chat ile uygulama içi Copilot hakkında hangisi doğrudur?',
		options: [
			{ id: 'a', text: 'İkisi tamamen aynı işi görür; aralarında fark yoktur.' },
			{
				id: 'b',
				text: 'Uygulama içi Copilot açık belgenin bağlamıyla çalışır; Copilot Chat birden fazla kaynağı birleştiren sorular için daha uygundur.',
			},
			{ id: 'c', text: 'Copilot Chat yalnızca Excel içinde kullanılabilir.' },
			{ id: 'd', text: 'Uygulama içi Copilot yalnızca yöneticilere açıktır.' },
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
			{ id: 'a', text: '“Bir sunum yap.”' },
			{ id: 'b', text: '“Harika bir sunum hazırla, çok iyi olsun.”' },
			{
				id: 'c',
				text: '“Ekteki pazar araştırması raporuna dayanarak yönetim kurulu için 6 slaytlık bir sunum taslağı hazırla; her slaytta tek bir ana mesaj ve konuşmacı notu olsun.”',
			},
			{ id: 'd', text: '“Sunumu hızlıca hazırla ve gönder.”' },
		],
		correct: 'c',
		explanation:
			'Güçlü prompt; amaç (sunum taslağı), kaynak (pazar araştırması raporu), hedef kitle (yönetim kurulu) ve beklentiyi (6 slayt, tek mesaj, konuşmacı notu) içerir.',
	},
	{
		id: 'q04',
		skill: 'prompting',
		moduleId: 'prompt-atolyesi',
		prompt: '“Ekteki Mayıs bütçe tablosunu kullan.” ifadesi prompt’un hangi bileşenidir?',
		options: [
			{ id: 'a', text: 'Amaç' },
			{ id: 'b', text: 'Bağlam' },
			{ id: 'c', text: 'Kaynak' },
			{ id: 'd', text: 'Kısıtlar' },
		],
		correct: 'c',
		explanation:
			'Kaynak bileşeni, Copilot’ın dayanması gereken dosya, belge veya bilgiyi belirtir.',
	},
	{
		id: 'q05',
		skill: 'prompting',
		moduleId: 'copilot-chat',
		prompt:
			'Uzun bir proje güncellemesini yönetici özeti, riskler ve aksiyonlara dönüştürmek istiyorsunuz. Copilot Chat’te en etkili yaklaşım hangisi?',
		options: [
			{ id: 'a', text: 'Tek cümlelik bir prompt yazıp ilk yanıtı olduğu gibi kullanmak' },
			{
				id: 'b',
				text: 'Önce özeti istemek, sonra riskleri ve aksiyonları ayrı takip prompt’larıyla çıkarmak ve her adımı kontrol etmek',
			},
			{ id: 'c', text: 'Metni parçalara bölüp her parçayı farklı bir araca göndermek' },
			{ id: 'd', text: 'Copilot’tan proje hakkında tahmin yürütmesini istemek' },
		],
		correct: 'b',
		explanation:
			'Karmaşık işleri adımlara bölmek ve takip sorularıyla ilerlemek, her ara sonucu kontrol etmenize ve yönü düzeltmenize olanak tanır.',
	},
	{
		id: 'q06',
		skill: 'apps',
		moduleId: 'word',
		prompt:
			'Word’de teknik bir belgeyi, teknik olmayan yöneticiler için uyarlamanız gerekiyor. Hangi prompt en uygundur?',
		options: [
			{ id: 'a', text: '“Bunu düzelt.”' },
			{
				id: 'b',
				text: '“Bu belgeyi teknik olmayan yöneticiler için sade bir dille yeniden yaz; kısaltmaları açıkla ve bir sayfayı geçme.”',
			},
			{ id: 'c', text: '“Daha uzun yaz.”' },
			{ id: 'd', text: '“Bunu İngilizceye çevir.”' },
		],
		correct: 'b',
		explanation:
			'Hedef kitle, dil düzeyi ve uzunluk belirtildiğinde yeniden yazma amaca uygun olur.',
	},
	{
		id: 'q07',
		skill: 'apps',
		moduleId: 'outlook',
		prompt:
			'40 mesajlık bir e-posta zincirine sonradan dahil oldunuz ve durumu hızla anlamanız gerekiyor. En uygun yaklaşım hangisi?',
		options: [
			{
				id: 'a',
				text: 'Outlook’ta Copilot ile zinciri özetlemek, ardından kararları ve açık soruları kontrol etmek',
			},
			{ id: 'b', text: 'Excel’de Copilot ile yeni bir tablo oluşturmak' },
			{ id: 'c', text: 'Zinciri silip herkesten yeni bir e-posta istemek' },
			{ id: 'd', text: 'Bütün mesajları kopyalayıp PowerPoint’e yapıştırmak' },
		],
		correct: 'a',
		explanation:
			'E-posta zincirini özetlemek tam olarak Outlook’taki Copilot deneyiminin amacıdır. Özetteki kararları ve tarihleri yine de mesajlarla karşılaştırın.',
	},
	{
		id: 'q08',
		skill: 'data',
		moduleId: 'excel',
		prompt:
			'Excel’de Copilot’a “Hangi bölgeler hedefin altında kaldı?” diye sordunuz. Yanıtı kullanmadan önce ne yapmalısınız?',
		options: [
			{ id: 'a', text: 'Kontrol etmeye gerek yok; Copilot’ın her yanıtı doğrudur.' },
			{ id: 'b', text: 'Sonucu tablodaki değerlerle, bir filtreyle veya bir formülle doğrulamak' },
			{ id: 'c', text: 'Yanıtı doğrudan yönetim sunumuna koymak' },
			{ id: 'd', text: 'Aynı soruyu farklı kelimelerle defalarca sormak' },
		],
		correct: 'b',
		explanation:
			'Copilot’ın analizi bir başlangıç noktasıdır. Karar alınacak sonuçları filtre, pivot veya formülle doğrulamak en güvenli yoldur.',
	},
	{
		id: 'q09',
		skill: 'apps',
		moduleId: 'powerpoint',
		prompt:
			'PowerPoint’te bir rapordan sunum taslağı oluşturduktan sonra en önemli adım hangisidir?',
		options: [
			{ id: 'a', text: 'Taslağı hiç değiştirmeden sunmak' },
			{
				id: 'b',
				text: 'Hikâye akışını, mesaj netliğini ve rakamları gözden geçirip hedef kitleye göre düzenlemek',
			},
			{ id: 'c', text: 'Slayt sayısını iki katına çıkarmak' },
			{ id: 'd', text: 'Bütün slaytlara aynı görseli eklemek' },
		],
		correct: 'b',
		explanation:
			'Copilot iyi bir ilk taslak sunar; hikâyeyi hedef kitleye göre kurmak ve rakamları doğrulamak sunucunun işidir.',
	},
	{
		id: 'q10',
		skill: 'meetings',
		moduleId: 'teams',
		prompt:
			'Copilot’ın hazırladığı toplantı özetinde, toplantıda hiç konuşulmamış bir karar yer alıyor. Ne yapmalısınız?',
		options: [
			{ id: 'a', text: 'Karar mantıklı göründüğü için özette bırakmak' },
			{
				id: 'b',
				text: 'Özeti transkriptle karşılaştırıp kararı çıkarmak veya düzeltmek; gerekirse katılımcılara sormak',
			},
			{ id: 'c', text: 'Özeti doğrudan bütün şirkete göndermek' },
			{ id: 'd', text: 'Toplantıyı baştan yapmak' },
		],
		correct: 'b',
		explanation:
			'Özet, transkriptte veya toplantıda olmayan bir bilgiyi içeremez. Uyuşmazlığı düzeltmek ve gerekirse teyit almak gerekir.',
	},
	{
		id: 'q11',
		skill: 'meetings',
		moduleId: 'teams',
		prompt:
			'Toplantı transkriptinde bir aksiyonun sorumlusu belirtilmemiş. Takip e-postasında ne yazmak en doğrudur?',
		options: [
			{ id: 'a', text: 'En kıdemli katılımcının adını yazmak' },
			{ id: 'b', text: 'Aksiyonu e-postadan çıkarmak' },
			{ id: 'c', text: '“Sorumlu: Belirtilmedi” yazıp netleştirilmesini istemek' },
			{ id: 'd', text: 'Kendi adınızı yazmak' },
		],
		correct: 'c',
		explanation:
			'Transkriptte olmayan bir sorumlu atamak uydurma bilgi olur. Eksikliği görünür kılmak doğru yaklaşımdır.',
	},
	{
		id: 'q12',
		skill: 'apps',
		moduleId: 'senaryolar',
		prompt: 'Yönetim toplantısına hazırlanıyorsunuz. Hangi iş akışı en mantıklıdır?',
		options: [
			{
				id: 'a',
				text: 'Raporu Word’de özetlemek → önemli KPI’ları çıkarmak → Outlook’ta yönetici e-postası hazırlamak → PowerPoint’te sunum akışı oluşturmak',
			},
			{ id: 'b', text: 'Önce sunumu oluşturmak, raporu sonra okumak' },
			{ id: 'c', text: 'Yalnızca bir e-posta göndermek ve sunumu atlamak' },
			{ id: 'd', text: 'Excel’de rastgele grafikler oluşturmak' },
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
			{ id: 'a', text: 'Dosyayı herhangi bir yapay zekâ aracına yüklemek' },
			{
				id: 'b',
				text: 'Kurumun veri sınıflandırma ve yapay zekâ kullanım politikalarını kontrol etmek; yalnızca onaylı araçları ve gerekli en az veriyi kullanmak',
			},
			{ id: 'c', text: 'Dosyayı kişisel e-posta adresinize göndermek' },
			{ id: 'd', text: 'Dosyayı geniş bir ekip kanalında paylaşmak' },
		],
		correct: 'b',
		explanation:
			'Hassas veriler kurum politikalarına uygun biçimde, onaylı araçlarla ve yalnızca gerektiği kadar kullanılmalıdır.',
	},
	{
		id: 'q14',
		skill: 'safety',
		moduleId: 'guvenli-kullanim',
		prompt:
			'Copilot, erişmemeniz gereken bir İK dosyasından bilgi içeren bir yanıt verdi. Bu neye işaret eder ve ne yapmalısınız?',
		options: [
			{ id: 'a', text: 'Copilot kuralları çiğniyor; bilgiyi kullanabilirsiniz.' },
			{
				id: 'b',
				text: 'Dosya izinleri gereğinden geniş olabilir; bilgiyi kullanmadan durumu BT veya güvenlik ekibine bildirmelisiniz.',
			},
			{ id: 'c', text: 'Dosyayı indirip saklamalısınız.' },
			{ id: 'd', text: 'Bilgiyi ekiple paylaşmalısınız.' },
		],
		correct: 'b',
		explanation:
			'Copilot, kullanıcının erişim izni olan içerikle çalışacak şekilde tasarlanmıştır. Erişmemeniz gereken bir içeriği görmeniz, izinlerin gözden geçirilmesi gerektiğini gösterebilir.',
	},
	{
		id: 'q15',
		skill: 'verify',
		moduleId: 'guvenli-kullanim',
		prompt: 'Copilot’ın ürettiği bir metnin doğruluğunu kontrol etmenin en iyi yolu hangisidir?',
		options: [
			{ id: 'a', text: 'Metnin akıcı olup olmadığına bakmak' },
			{ id: 'b', text: 'Copilot’a “Emin misin?” diye sorup cevabı yeterli saymak' },
			{ id: 'c', text: 'Rakam, isim, tarih ve alıntıları kaynak belgelerle karşılaştırmak' },
			{ id: 'd', text: 'Metni daha uzun yazdırmak' },
		],
		correct: 'c',
		explanation:
			'Akıcılık veya Copilot’ın kendinden emin dili doğruluğun kanıtı değildir. Kaynakla karşılaştırma en güvenilir yöntemdir.',
	},
]
