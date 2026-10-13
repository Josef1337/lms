// Copilot home-screen tour: what each area of the Microsoft 365 Copilot app
// does. Texts follow the supplied tour, with menu names as they appear on the
// screen. Coordinates are pixels of the 1972×1066 screenshot
// (src/assets/tour/copilot-home.png); the component turns them into
// percentages, so the numbered badges stay on their spot at every width.
// The account photo and name in the screenshot are replaced with a neutral
// avatar; nothing else in the image was moved.

export const TOUR_IMAGE_SIZE = { width: 1972, height: 1066 } as const

export interface TourStop {
	/** Badge label: 1–9 for the core stops, A–D for the extra areas. */
	id: string
	kind: 'core' | 'extra'
	title: string
	where: string
	/** Highlighted area: [x0, y0, x1, y1]. */
	box: [number, number, number, number]
	/** Badge centre: [x, y]. */
	badge: [number, number]
	what: string
	when: string
	how: string[]
	prompt?: string
	expect: string
	note?: string
	/** Small task to try in the learner's own Copilot app. */
	tryIt: string
}

export const TOUR_STOPS: TourStop[] = [
	{
		id: '1',
		kind: 'core',
		title: 'Yeşil kalkan',
		where: 'Sağ üst köşe',
		box: [1858, 48, 1898, 86],
		badge: [1878, 112],
		what: 'Kurumsal hesabınızla giriş yaptığınızı ve kurumsal veri korumasının açık olduğunu gösterir.',
		when: 'Copilot’a şirket dokümanı yüklemeden veya hassas bir konu yazmadan önce bakın.',
		how: [
			'Sağ üstteki kalkan simgesini bulun.',
			'Fareyle üzerine gelin ve açıklamayı okuyun.',
			'Kalkan yoksa çıkış yapıp kurumsal hesabınızla tekrar girin.',
		],
		expect: 'Kurumsal veri korumasının etkin olduğunu söyleyen kısa bir açıklama.',
		note: 'Kişisel Microsoft hesabıyla açılan Copilot’a şirket dokümanı yüklemeyin.',
		tryIt: 'Kalkanın üzerine gelip açıklamayı okuyun.',
	},
	{
		id: '2',
		kind: 'core',
		title: 'Work IQ',
		where: 'Üst bar, sol',
		box: [270, 49, 348, 86],
		badge: [309, 112],
		what: 'Copilot’ın cevap verirken iş bağlamınızı (erişiminiz olan dosyalar, kişiler, kurum bilgisi) kullandığını gösterir.',
		when: 'Şirket içi bir konu sorduğunuzda bu kapsamın açık olduğundan emin olun. Genel bir konuyu araştırırken web kaynakları öne çıkar.',
		how: [
			'Work IQ düğmesine tıklayın.',
			'Açılan seçeneklerde Copilot’ın hangi kaynakları kullandığını görün.',
			'Sorunuza göre kapsamı ayarlayın.',
		],
		prompt:
			'Erişimim olan dosyalarda 2027 bütçe planlamasıyla ilgili en güncel doküman hangisi? Kısaca neyi kapsıyor?',
		expect: 'Cevapta, kullandığı dosyalara giden numaralı kaynak bağlantıları.',
		note: 'Copilot yalnızca sizin zaten erişebildiğiniz dosyaları görür. Seçenek adları sürüme göre değişebilir.',
		tryIt: 'Work IQ’ya tıklayıp seçeneklere bakın.',
	},
	{
		id: '3',
		kind: 'core',
		title: 'Yanıt modu',
		where: 'Üst bar, “Detaylı akıl yürütme”',
		box: [354, 49, 510, 86],
		badge: [432, 112],
		what: 'Copilot’ın cevap vermeden önce ne kadar derin düşüneceğini seçer.',
		when: 'Strateji, karşılaştırma ve analiz sorularında detaylı mod. Kısa özet, çeviri ve yazışma için hızlı mod yeterli.',
		how: [
			'“Detaylı akıl yürütme” yazısının yanındaki oka tıklayın.',
			'Listeden ihtiyacınıza uygun modu seçin.',
			'Sorunuzu yazın.',
		],
		prompt:
			'Bu yatırım önerisinin en zayıf 3 varsayımı ne? Adım adım değerlendir ve her biri için eksik kanıtı belirt.',
		expect: 'Detaylı modda cevap biraz daha geç gelir, daha yapılandırılmış ve gerekçeli olur.',
		tryIt: 'Menüyü açıp hangi seçeneklerin olduğuna bakın.',
	},
	{
		id: '4',
		kind: 'core',
		title: 'Mesaj kutusu',
		where: 'Ekranın ortası: +, mikrofon, sesli sohbet',
		box: [694, 560, 1544, 626],
		badge: [664, 593],
		what: 'Sorunuzu yazdığınız yer. + ile dosya eklenir, mikrofonla sesle yazdırılır, en sağdaki düğme sesli sohbeti açar.',
		when: 'Her iş burada başlar. Bir dokümanla çalışacaksanız önce + ile ekleyin, sonra sorunuzu yazın.',
		how: [
			'+ simgesine tıklayın ve dosyayı bilgisayarınızdan veya OneDrive’dan seçin.',
			'Sorunuzu yazın ya da mikrofona tıklayıp söyleyin.',
			'Enter ile gönderin; cevabın ardından aynı kutudan devam edin.',
		],
		prompt:
			'Bu raporu yoğun bir EXCO üyesi için 5 maddede özetle; her maddede bir rakam ve bir sonuç olsun. Sonuna benden beklenen kararı ekle.',
		expect:
			'Birkaç saniye içinde madde madde bir özet. Cevabın altında kopyalama ve yeniden oluşturma seçenekleri.',
		note: 'Word, PDF, Excel ve PowerPoint dosyaları eklenebilir. Çok büyük dosyalarda cevap gecikebilir.',
		tryIt: 'Paylaşılmasında sakınca olmayan bir iş dokümanını + ile ekleyip özetini isteyin.',
	},
	{
		id: '5',
		kind: 'core',
		title: 'Öneri düğmeleri',
		where: 'Mesaj kutusunun altı',
		box: [736, 655, 1384, 702],
		badge: [706, 679],
		what: 'Hazır başlangıç promptları. Tek tıkla bir görevi başlatır.',
		when: 'Ne soracağınızı bilmediğinizde veya Copilot’ın neler yapabildiğini görmek istediğinizde.',
		how: [
			'Bir düğmeye tıklayın.',
			'Kutuya gelen hazır metni kendi konunuza göre düzenleyin.',
			'Gönderin.',
		],
		expect: 'Mesaj kutusuna, düzenleyebileceğiniz hazır bir prompt gelir.',
		note: 'Gelen Kutusu Değerlendirmesi ve Toplantı Hazırlığı e-posta ve takviminize dayanır. Kurumunuzun e-postası ve takvimi Microsoft 365’te (Exchange Online) değilse bu düğmeler beklenen sonucu vermez.',
		tryIt: 'Dosya İçgörüleri düğmesine tıklayıp gelen metne bakın.',
	},
	{
		id: '6',
		kind: 'core',
		title: 'Yeni sohbet · Ara',
		where: 'Sol menü, üst',
		box: [6, 50, 248, 118],
		badge: [224, 84],
		what: 'Yeni sohbet temiz bir sayfa açar. Ara, önceki sohbetlerinizi anahtar kelimeyle bulur.',
		when: 'Konu değiştirdiğiniz her seferde yeni sohbet açın. Geçen hafta konuştuğunuz bir konuya dönmek için Ara’yı kullanın.',
		how: [
			'Yeni sohbet’e tıklayın.',
			'Eski bir sohbet için Ara’ya tıklayıp bir kelime yazın.',
			'Sonuçlardan sohbeti açıp kaldığınız yerden devam edin.',
		],
		expect: 'Yeni sohbette boş bir ekran; aramada eşleşen sohbetlerin listesi.',
		tryIt: 'Yeni bir sohbet açın.',
	},
	{
		id: '7',
		kind: 'core',
		title: 'Kitaplık · Not Defterleri',
		where: 'Sol menü',
		box: [6, 122, 248, 186],
		badge: [224, 154],
		what: 'Kitaplık, Copilot’la ürettiğiniz içerikleri bir arada tutar. Not Defterleri, bir konunun dosya ve notlarını toplar; Copilot o kaynaklar üzerinden çalışır.',
		when: 'Kurul hazırlığı, bütçe dönemi veya bir proje gibi haftalarca süren konularda not defteri açın.',
		how: [
			'Not Defterleri’ne tıklayın ve yeni bir not defteri oluşturun.',
			'Ad verin, ör. “EXCO Q4 Kurul Hazırlığı”.',
			'İlgili dosyaları ekleyin ve not defteri içinde soru sorun.',
		],
		prompt: 'Bu dokümanlar arasında çelişen bilgi veya rakam var mı? Varsa tablo hâlinde göster.',
		expect: 'Copilot’ın yalnızca not defterindeki kaynaklara dayanan, kaynak gösteren cevabı.',
		tryIt: 'Kendi konunuz için bir not defteri açıp bir dosya ekleyin.',
	},
	{
		id: '8',
		kind: 'core',
		title: 'Researcher · Analyst',
		where: 'Sol menü, Sabitlenmiş',
		box: [6, 236, 248, 302],
		badge: [224, 269],
		what: 'Researcher, onlarca kaynağı tarayıp kaynak gösteren bir araştırma raporu yazar. Analyst, Excel veya CSV verisini analiz edip içgörü ve grafik üretir.',
		when: 'Derin ve kaynaklı bir araştırma gerektiğinde Researcher; veriden sonuç çıkarmanız gerektiğinde Analyst.',
		how: [
			'Sol menüden Researcher veya Analyst’e tıklayın.',
			'Researcher için sorunuzu yazın; netleştirme soruları sorarsa cevaplayın. Analyst için + ile veri dosyanızı ekleyin.',
			'Sonucu bekleyin; Researcher birkaç dakika sürebilir, bu sırada başka işe geçebilirsiniz.',
		],
		prompt:
			'Sektörümüzdeki ilk 5 oyuncunun son 12 ayda yapay zekâ alanında açıkladığı yatırımları kaynaklarıyla araştır; bizim için 3 fırsat ve 3 tehdit çıkar.',
		expect:
			'Researcher: başlıklı, kaynak bağlantılı bir rapor. Analyst: tablo, grafik ve hesaplama adımları.',
		note: 'Web’den gelen bilgiler güncel olmayabilir; önemli bir iddiayı kaynak bağlantısını açarak kontrol edin.',
		tryIt: 'Researcher’ı açıp kendi sektörünüzle ilgili bir soru başlatın.',
	},
	{
		id: '9',
		kind: 'core',
		title: 'Aracılar · Yeni aracı',
		where: 'Sol menü, Aracılar',
		box: [6, 422, 248, 626],
		badge: [224, 438],
		what: 'Şirketinize özel hazırlanmış ajanlar, ör. Global Policy Portal Agent veya Planner Agent. Yeni aracı ile yeni bir ajan oluşturulur.',
		when: 'Şirket politikası, iç süreç veya belirli bir sistemle ilgili sorularda genel sohbet yerine ilgili ajanı açın.',
		how: [
			'Aracılar listesinden ilgili ajana tıklayın.',
			'Ajanın açılış ekranındaki açıklamayı okuyun.',
			'Sorunuzu yazın.',
		],
		prompt: 'Yurt dışı seyahat politikasında onay süreci nasıl işliyor?',
		expect: 'Yalnızca o ajanın bağlı olduğu kaynaklara dayanan bir cevap.',
		note: 'Yeni bir ajan ihtiyacınız varsa önce BT ekibiyle konuşun.',
		tryIt: 'Global Policy Portal Agent’a bir politika sorusu sorun.',
	},
	{
		id: 'A',
		kind: 'extra',
		title: 'Sabitlenmiş ajanlar',
		where: 'Sol menü, Researcher ve Analyst’in altı',
		box: [6, 306, 248, 370],
		badge: [248, 338],
		what: 'En sık kullandığınız ajanlar listenin üstünde kalsın diye sabitlenir.',
		when: 'Bir ajanı haftada birkaç kez kullanıyorsanız sabitleyin.',
		how: [
			'Ajanın adının üzerine gelin.',
			'Yanında beliren menüden sabitleme seçeneğini kullanın.',
			'Aynı yoldan sabitlemeyi kaldırabilirsiniz.',
		],
		expect: 'Ajan, Sabitlenmiş başlığının altına taşınır.',
		note: 'Menü seçeneklerinin adı sürüme göre değişebilir.',
		tryIt: 'Sık kullanacağınız bir ajanı sabitleyin.',
	},
	{
		id: 'B',
		kind: 'extra',
		title: 'Diğer aracılar',
		where: 'Sol menü, Aracılar listesinin sonu',
		box: [6, 630, 248, 660],
		badge: [216, 645],
		what: 'Kurumunuzda kullanabileceğiniz diğer ajanları listeler.',
		when: 'Aradığınız iş için hazır bir ajan olup olmadığını görmek istediğinizde.',
		how: [
			'Diğer aracılar’a tıklayın.',
			'Listeye göz atın veya arayın.',
			'İhtiyacınıza uyan ajanı açın.',
		],
		expect: 'Erişebildiğiniz ajanların listesi.',
		tryIt: 'Listeye göz atıp işinize yarayabilecek bir ajan bulun.',
	},
	{
		id: 'C',
		kind: 'extra',
		title: 'Sohbetler',
		where: 'Sol menü, alt kısım',
		box: [6, 680, 248, 704],
		badge: [216, 692],
		what: 'Önceki sohbetleriniz burada listelenir.',
		when: 'Dün başladığınız bir çalışmaya kaldığınız yerden devam etmek için.',
		how: [
			'Sohbetler başlığının altındaki listeye bakın.',
			'Bir sohbete tıklayıp açın.',
			'Aynı sohbette sorularınıza devam edin.',
		],
		expect: 'Sohbet, önceki cevaplarla birlikte açılır.',
		note: 'Bu ekran görüntüsünde liste boş; kullandıkça dolar.',
		tryIt: 'Az önce açtığınız sohbeti listede bulun.',
	},
	{
		id: 'D',
		kind: 'extra',
		title: 'Profil ve ayarlar',
		where: 'Sol alt köşe',
		box: [6, 1012, 262, 1062],
		badge: [290, 1037],
		what: 'Hangi hesapla ve hangi lisansla giriş yaptığınızı gösterir. Dişli simgesi uygulama ayarlarını açar.',
		when: 'Doğru hesapta olduğunuzu kontrol etmek veya dil gibi tercihleri değiştirmek istediğinizde.',
		how: [
			'Sol altta adınızı ve lisans adını kontrol edin (burada M365 Copilot).',
			'Ayarlar için dişli simgesine tıklayın.',
			'Değiştirmek istediğiniz tercihi bulun.',
		],
		expect: 'Ayarlar penceresi.',
		note: 'Ayar başlıkları sürüme göre değişebilir.',
		tryIt: 'Lisans adınızın M365 Copilot olduğunu kontrol edin.',
	},
]
