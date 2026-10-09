import type { Module } from '@/types/content'

const excel: Module = {
	id: 'excel',
	number: 6,
	title: 'Microsoft Excel ile Copilot',
	navLabel: 'Excel',
	tagline: 'Tablodan içgörüye, içgörüden karara',
	description:
		'Tablo verilerini anlamlandırmayı, eğilimleri ve anormallikleri araştırmayı, formül önerilerini değerlendirmeyi, verileri kategorilere ayırmayı, grafik ve analiz fikirleri geliştirmeyi ve bulguları iş kararlarına dönüştürmeyi öğrenin.',
	visual: 'excel',
	skills: ['data', 'verify', 'prompting'],
	objectives: [
		'Tablo verisi hakkında net ve doğru sorular sormak',
		'Eğilimleri, sapmaları ve anormallikleri ayırt etmek',
		'Formül ve grafik önerilerini okuyup doğrulamak',
		'Bulguları yönetici için iş kararlarına dönüştürmek',
	],
	availability:
		'Excel’deki Copilot özellikleri; Excel sürümüne, lisansınıza, yönetici ayarlarına ve çalışma kitabının yapısına bağlı olabilir. Örneğin verinin tablo olarak biçimlendirilmesi veya dosyanın OneDrive ya da SharePoint’te kayıtlı olması gerekebilir. Bu modüldeki laboratuvar hesaplamaları örnek veriden uygulama içinde yapar; gerçek bir Copilot analizi değildir.',
	lessons: [
		{
			id: 'excel-1',
			title: 'Veriyi anlamlandırmak',
			summary:
				'Doğru soruları sorun; eğilim, sapma ve anormalliği ayırt edin, formül önerilerini okuyun.',
			minutes: 15,
			objectives: [
				'Copilot’a veri hakkında net sorular sormak',
				'Eğilim, sapma ve anormallik kavramlarını ayırt etmek',
				'Formül önerilerini okuyup doğrulamak',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Excel’de Copilot’a ne sorulur?',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Excel’de Copilot’a tablonuz hakkında günlük dille soru sorabilirsiniz: “Hangi bölge hedefin altında?”, “Aylara göre satış nasıl değişti?” gibi. Copilot; formül, sıralama, filtre, grafik veya özet önerileriyle yanıt verebilir.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'table',
									title: 'Veriyi anlamlandırma',
									body: 'Sütunların ne anlattığını, toplamları ve dağılımı özetler.',
								},
								{
									icon: 'trend',
									title: 'Eğilim bulma',
									body: 'Zaman içindeki artış ve azalışları gösterir: aylık, çeyreklik.',
								},
								{
									icon: 'scan',
									title: 'Anormallik araştırma',
									body: 'Diğerlerinden belirgin biçimde farklı değerleri işaretler; nedenini siz araştırırsınız.',
								},
								{
									icon: 'zap',
									title: 'Formül önerisi',
									body: 'Hesaplanmış sütun veya formül önerir; örneğin hedef gerçekleşme oranı.',
								},
								{
									icon: 'filter',
									title: 'Kategorilere ayırma',
									body: 'Değerleri gruplara ayırır; örneğin “hedefin üstünde / altında”.',
								},
								{
									icon: 'chart',
									title: 'Grafik ve analiz fikri',
									body: 'Sorunuza uygun grafik türü ve ek analizler önerir.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Excel’deki Copilot özellikleri sürüme, lisansa, yönetici ayarlarına ve çalışma kitabının yapısına bağlı olabilir. Örneğin verinin tablo olarak biçimlendirilmesi veya dosyanın bulutta kayıtlı olması gerekebilir.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Veriyi hazırlayın',
							body: [
								'Başlık satırı net olsun (Ay, Ürün, Bölge…).',
								'Birleştirilmiş hücre ve boş satır kullanmayın.',
								'Mümkünse veriyi tablo olarak biçimlendirin.',
							],
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Eğilim, sapma ve anormallik',
					blocks: [
						{
							type: 'text',
							body: 'Laboratuvarda kullanacağınız örnek satış verisinde (Ocak–Nisan, üç bölge, üç ürün) bu üç kavramın birer örneği var.',
						},
						{
							type: 'comparison',
							columns: [
								{ title: 'Eğilim', icon: 'trend' },
								{ title: 'Sapma', icon: 'target' },
								{ title: 'Anormallik', icon: 'scan' },
							],
							rows: [
								{
									label: 'Tanım',
									values: [
										'Zaman içinde süren yön: artış veya azalış.',
										'Bir değerin hedeften veya beklenenden farkı.',
										'Diğer değerlerden belirgin biçimde ayrışan, açıklama gerektiren değer.',
									],
								},
								{
									label: 'Örnek veride',
									values: [
										'Siber Güvenlik satışları Ocak’tan Nisan’a %18,5 arttı.',
										'İç Anadolu dört aylık toplamda hedefin %10,5 altında.',
										'Şubat · İç Anadolu · Siber Güvenlik: hedefin yalnızca %62’si gerçekleşti.',
									],
								},
								{
									label: 'Doğru soru',
									values: [
										'“Aylara göre hangi ürün en çok büyüdü?”',
										'“Hangi bölge ve ürünler hedefin altında, ne kadar?”',
										'“Hedefinden %30’dan fazla sapan kayıtlar hangileri?”',
									],
								},
								{
									label: 'Dikkat',
									values: [
										'Dört aylık veri uzun vadeli bir eğilim için sınırlıdır.',
										'Hedefin kendisi gerçekçi mi?',
										'Veri giriş hatası mı, gerçek bir değişim mi? Kaynağı kontrol edin.',
									],
								},
							],
						},
						{
							type: 'keyPoint',
							body: 'Copilot bir anormalliği **bulabilir**, ama nedenini **bilemez**. Nedeni öğrenmek için veri sahibine veya ilgili ekibe sorarsınız.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Formül önerilerini okuyun',
					blocks: [
						{
							type: 'text',
							body: 'Copilot’ın formül önerilerini adım adım inceleyin. Sütunlar: **A** Ay, **B** Ürün, **C** Bölge, **D** Satış hedefi, **E** Gerçekleşen satış, **F** Müşteri sayısı.',
						},
						{
							type: 'reveal',
							surface: 'excel',
							steps: [
								{
									title: 'Hesaplanmış sütun',
									body: 'Her satırın hedefe göre durumunu görmek için bir oran sütunu ekleyin.',
									prompt: 'Hedef gerçekleşme oranını gösteren bir sütun ekle.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: [
											'G2 için önerilen formül: **=E2/D2** (gerçekleşen satışı hedefe böler).',
											'Hücreyi yüzde biçiminde gösterin: 1,038 → %104.',
											'İngilizce Excel’de de formül aynıdır: =E2/D2',
										],
									},
								},
								{
									title: 'Koşullu etiket',
									body: 'Satırları “hedef aşıldı / hedef altı” olarak kategorilere ayırın.',
									prompt:
										'Hedefi aşan satırlara “Hedef aşıldı”, diğerlerine “Hedef altı” yazan bir sütun öner.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: [
											'H2 için önerilen formül: **=EĞER(E2>=D2;"Hedef aşıldı";"Hedef altı")**',
											'İngilizce Excel’de: =IF(E2>=D2,"Hedef aşıldı","Hedef altı")',
											'Türkçe Excel’de bağımsız değişkenler noktalı virgülle ayrılır.',
										],
									},
								},
								{
									title: 'Koşullu toplam',
									body: 'Bir bölgenin toplamını koşula bağlı olarak hesaplayın.',
									prompt: 'Ege bölgesinin toplam gerçekleşen satışını hesapla.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: [
											'Önerilen formül: **=ÇOKETOPLA(E:E;C:C;"Ege")**',
											'İngilizce Excel’de: =SUMIFS(E:E,C:C,"Ege")',
											'Örnek veriye göre sonuç: 3.340 bin ₺',
										],
									},
								},
								{
									title: 'Doğrulayın',
									body: 'Formülü birkaç satırda elle kontrol edin: ilk satırda 540 / 520 = 1,038 → %104. Toplamları bir filtre veya pivot tabloyla karşılaştırın.',
								},
							],
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Türkçe ve İngilizce Excel',
							body: 'Excel’in dil ayarı formül adlarını ve ayırıcıyı değiştirir: EĞER ↔ IF, ÇOKETOPLA ↔ SUMIFS, ETOPLA ↔ SUMIF. Türkçede “;”, İngilizcede “,” kullanılır.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Öneriyi değerlendirin',
					blocks: [
						{
							type: 'choice',
							id: 'excel-1-formul',
							prompt:
								'Copilot, “Marmara bölgesindeki Bulut Yedekleme satışlarının toplamı” için üç formül önerdi. Hangisi doğrudur?',
							options: [
								{
									id: 'a',
									text: '**=TOPLA(E:E)**',
									feedback: 'Bütün satırları toplar; bölge ve ürün koşulu yok.',
								},
								{
									id: 'b',
									text: '**=ÇOKETOPLA(E:E;C:C;"Marmara";B:B;"Bulut Yedekleme")**',
									correct: true,
									feedback:
										'Gerçekleşen satış sütununu (E) bölge (C) ve ürün (B) koşullarıyla toplar. Örnek veride sonuç 2.160 bin ₺.',
								},
								{
									id: 'c',
									text: '**=ETOPLA(D:D;C:C;"Marmara")**',
									feedback: 'D sütunu hedeftir, gerçekleşen değil; ürün koşulu da yok.',
								},
							],
							explanation:
								'Bir formül önerisini kabul etmeden önce **hangi sütunu topladığını** ve **hangi koşulları** kullandığını okuyun.',
						},
						{
							type: 'choice',
							id: 'excel-1-anormallik',
							prompt:
								'Copilot, Mart · Ege · Veri Analitiği kaydının hedefin %145’i olduğunu ve sıra dışı göründüğünü söyledi. En doğru sonraki adım hangisi?',
							options: [
								{
									id: 'a',
									text: 'Bu bölgeye hemen ek prim tanımlamak',
									feedback:
										'Neden bilinmeden karar vermek erken; tek seferlik bir sipariş veya veri hatası olabilir.',
								},
								{
									id: 'b',
									text: 'Kaydın kaynağını kontrol etmek ve satış ekibine bu artışın nedenini sormak',
									correct: true,
									feedback:
										'Anormallik bir soru işaretidir: önce verinin doğruluğunu, sonra nedenini öğrenin.',
								},
								{
									id: 'c',
									text: 'Kaydı aykırı olduğu için tablodan silmek',
									feedback: 'Veriyi silmek bilgiyi yok eder; kayıt doğru da olabilir.',
								},
							],
							explanation: 'Copilot anormalliği bulur; **açıklamayı ve kararı** siz verirsiniz.',
						},
					],
				},
				{
					id: 'pekistir',
					phase: 'reinforce',
					title: 'Pekiştirin',
					blocks: [
						{
							type: 'questions',
							id: 'excel-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Excel’de Copilot’tan daha iyi sonuç almak için veriyle ilgili hangisi önerilir?',
									options: [
										{ id: 'a', text: 'Birleştirilmiş hücreler ve boş satırlar kullanmak' },
										{ id: 'b', text: 'Net başlıkları olan, düzenli bir tablo yapısı kullanmak' },
										{ id: 'c', text: 'Bütün veriyi tek bir hücreye yazmak' },
									],
									correct: 'b',
									explanation:
										'Düzenli ve başlıklı bir tablo, Copilot’ın sütunları doğru anlamasını kolaylaştırır.',
								},
								{
									id: 'q2',
									prompt: '“Eğilim” ile “anormallik” arasındaki fark nedir?',
									options: [
										{ id: 'a', text: 'İkisi aynı şeydir.' },
										{
											id: 'b',
											text: 'Eğilim zaman içindeki genel yöndür; anormallik diğerlerinden belirgin biçimde ayrışan tekil bir değerdir.',
										},
										{ id: 'c', text: 'Anormallik her zaman bir veri hatasıdır.' },
									],
									correct: 'b',
									explanation:
										'Anormallik bir hata da olabilir, gerçek bir değişim de; doğrulanması gerekir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Copilot’a tablonuz hakkında **günlük dille, net sorular** sorun.',
				'Eğilim, sapma ve anormallik farklı sorulardır; her biri farklı bir karara destek olur.',
				'Formül önerisini kabul etmeden önce **sütunları ve koşulları** okuyun, birkaç satırda doğrulayın.',
				'Copilot anormalliği bulabilir; **nedenini** siz araştırırsınız.',
			],
		},
		{
			id: 'excel-2',
			title: 'Excel laboratuvarı: analizden karara',
			summary:
				'36 satırlık satış verisinde beş analiz türünü çalıştırın ve bulguları karara dönüştürün.',
			minutes: 20,
			objectives: [
				'Örnek satış verisinde beş analiz türünü uygulamak',
				'Grafik ve tabloyu birlikte okumak',
				'Bulguları yönetici için iş kararlarına dönüştürmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Beş analiz, beş farklı soru',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Laboratuvarda aynı veriye beş farklı soru soracaksınız. Her analiz türü, farklı bir karara destek olur.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'target',
									title: 'Hedefi aşan bölgeler',
									body: 'Hangi bölge hedefini tutturdu? Kaynak dağıtımı ve takdir kararları için.',
								},
								{
									icon: 'trend',
									title: 'En çok satan ürünler',
									body: 'Gelirin nereden geldiği ve hangi ürünün büyüdüğü. Portföy kararları için.',
								},
								{
									icon: 'chart',
									title: 'Aylık performans değişimi',
									body: 'Zaman içindeki iniş çıkışlar. Mevsimsellik ve erken uyarı için.',
								},
								{
									icon: 'flag',
									title: 'Hedefin altında kalan alanlar',
									body: 'Açığın nerede ve ne büyüklükte olduğu. Eylem planı için.',
								},
								{
									icon: 'sparkles',
									title: 'Yönetici için üç bulgu',
									body: 'Bütün tablonun karar vericiye özeti.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'tip',
							body: 'Grafiği tek başına okumayın: her sonucun altındaki tabloyu ve “Nasıl doğrularsınız?” kutusundaki formülü de inceleyin.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Excel laboratuvarı',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Aşağıda üç bölge ve üç ürün için dört aylık satış verisi var. Bir analiz türü seçin: sonuç, grafik ve kısa açıklama tablonun yanında (küçük ekranlarda altında) görünür, ilgili satırlar tabloda vurgulanır. Sütun başlıklarına tıklayarak sıralayabilir, ay filtresiyle tabloyu daraltabilirsiniz.',
						},
						{ type: 'interactive', component: 'excelLab', taskId: 'excel-2-lab' },
					],
					aside: [
						{
							tone: 'explain',
							title: 'Grafikleri okumak',
							body: 'Mavi çubuklar ve çizgi gerçekleşen satışı, koyu işaretler ve kesikli çizgi hedefi gösterir. Değerlerin tamamı tablolarda da yer alır.',
						},
						{
							tone: 'tip',
							title: 'Tabloyla karşılaştırın',
							body: 'Bir sonucu doğrulamak için ay filtresini kullanın veya sütunu sıralayın; alt satırdaki toplamlar filtreye göre güncellenir.',
						},
						{
							tone: 'note',
							title: 'Simülasyon',
							body: 'Bu analizler uygulama içinde hesaplanır. Gerçek Copilot aynı soruya farklı biçimde yanıt verebilir; sonuçları yine kaynağa göre doğrulamanız gerekir.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Bulgudan karara',
					blocks: [
						{
							type: 'text',
							body: 'Bir analiz ancak bir karara veya eyleme dönüştüğünde değer üretir. Bulguyu karara dönüştürürken üç soru sorun:',
						},
						{
							type: 'list',
							style: 'number',
							items: [
								'**Ne oldu?** Bulguyu tek cümleyle ve rakamla ifade edin.',
								'**Neden önemli?** Hedefe, bütçeye veya müşteriye etkisi ne?',
								'**Ne yapmalıyız?** Somut bir sonraki adım ve sorumlu önerin.',
							],
						},
						{
							type: 'beforeAfter',
							before: { label: 'Bulgu', text: 'İç Anadolu hedefin %10,5 altında kaldı.' },
							after: {
								label: 'Karara dönüşmüş hâli',
								text: 'İç Anadolu hedefin %10,5 altında kaldı (295 bin ₺ açık); açığın çoğu Siber Güvenlik ve Veri Analitiği’nden geliyor. **Öneri:** Bölge satış müdürüyle bu iki ürün için ay sonuna kadar bir eylem planı hazırlanması.',
							},
							notes: [
								'Açığın büyüklüğü rakamla verildi.',
								'Kaynağı (hangi ürünler) belirtildi.',
								'Somut bir sonraki adım ve sahibi önerildi.',
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							title: 'Veride olmayanı eklemeyin',
							body: 'Örnek veride kâr marjı, fiyat veya kampanya bilgisi yok. Bu yüzden “İç Anadolu’da fiyatlar yüksek” gibi bir neden veriye dayanmaz; ancak varsayım olarak işaretlenerek yazılabilir.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Yönetici notu için doğru ifadeleri seçin',
					blocks: [
						{
							type: 'choice',
							id: 'excel-2-not',
							multiple: true,
							prompt: 'Yönetici notunuza örnek veriye **dayanan** hangi ifadeleri koyabilirsiniz?',
							options: [
								{
									id: 'a',
									text: 'Ege bölgesi toplamda hedefin %9,5 üzerinde.',
									correct: true,
									feedback: 'Veriden hesaplanabilir: 3.340 / 3.050.',
								},
								{
									id: 'b',
									text: 'İç Anadolu’daki düşüşün nedeni rakiplerin fiyat indirimidir.',
									feedback: 'Veride rakip veya fiyat bilgisi yok; bu bir varsayım.',
								},
								{
									id: 'c',
									text: 'Veri Analitiği hedefin %4,7 altında; 12 kaydın 10’unda hedef tutturulamadı.',
									correct: true,
									feedback: 'Veriden hesaplanabilir: 2.550 / 2.675 ve satır sayımı.',
								},
								{
									id: 'd',
									text: 'Siber Güvenlik satışları gelecek çeyrekte de %18 büyüyecek.',
									feedback:
										'Geçmiş veri geleceği garanti etmez; bu bir tahmin ve öyle belirtilmeli.',
								},
								{
									id: 'e',
									text: 'Şubat · İç Anadolu · Siber Güvenlik kaydı sıra dışı düşük; doğrulanması gerekiyor.',
									correct: true,
									feedback:
										'Veride görülen bir anormallik, doğru biçimde “doğrulanmalı” olarak ifade edilmiş.',
								},
							],
							explanation:
								'Yönetici notunda **veriden hesaplanan bulgu**, **varsayım** ve **tahmin** birbirinden ayrılmalıdır.',
						},
						{
							type: 'choice',
							id: 'excel-2-grafik',
							prompt:
								'Aylara göre toplam satışın nasıl değiştiğini yönetime göstermek istiyorsunuz. Hangi grafik en uygundur?',
							options: [
								{
									id: 'a',
									text: 'Pasta grafik',
									feedback:
										'Pasta, parçaların bütüne oranını gösterir; zaman içindeki değişimi göstermez.',
								},
								{
									id: 'b',
									text: 'Çizgi grafik (aylar yatay eksende)',
									correct: true,
									feedback: 'Zaman içindeki değişim için en okunaklı biçim.',
								},
								{
									id: 'c',
									text: 'Her ay için ayrı bir tablo',
									feedback: 'Karşılaştırmayı zorlaştırır.',
								},
							],
							explanation:
								'Soru **zamanla değişim** ise çizgi, **kategoriler arası karşılaştırma** ise çubuk grafik genellikle en iyi seçimdir.',
						},
					],
				},
				{
					id: 'pekistir',
					phase: 'reinforce',
					title: 'Pekiştirin',
					blocks: [
						{
							type: 'questions',
							id: 'excel-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Bir analizde “İç Anadolu hedefin %10,5 altında” yazıyor. Bunu nasıl doğrularsınız?',
									options: [
										{ id: 'a', text: 'Copilot’a aynı soruyu tekrar sorarak' },
										{
											id: 'b',
											text: 'Bölgeye göre hedef ve gerçekleşen toplamlarını hesaplayıp oranı kontrol ederek',
										},
										{ id: 'c', text: 'Grafiğe bakıp tahmin ederek' },
									],
									correct: 'b',
									explanation:
										'2.515 / 2.810 = 0,895 → hedefin %10,5 altında. Filtre veya ÇOKETOPLA ile kolayca kontrol edilebilir.',
								},
								{
									id: 'q2',
									prompt: 'Hangisi bir bulguyu iş kararına dönüştürür?',
									options: [
										{ id: 'a', text: '“Satışlar değişti.”' },
										{
											id: 'b',
											text: '“İç Anadolu’da 295 bin ₺ açık var; bölge müdürüyle iki ürün için ay sonuna kadar eylem planı hazırlanmalı.”',
										},
										{ id: 'c', text: '“Veri ilginç görünüyor.”' },
									],
									correct: 'b',
									explanation:
										'Rakam, kaynak ve somut bir sonraki adım içeren bulgu karara dönüşmüştür.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Her analiz türü farklı bir soruyu yanıtlar: **hedef, ürün, zaman, sapma ve özet**.',
				'Grafiği tabloyla birlikte okuyun; rakamları kaynakta doğrulayın.',
				'Bulguyu karara dönüştürün: **ne oldu, neden önemli, ne yapmalıyız?**',
				'Veriden hesaplananı, varsayımı ve tahmini birbirinden ayırın.',
			],
		},
	],
}

export default excel
