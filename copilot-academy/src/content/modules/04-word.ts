import type { Module } from '@/types/content'

const word: Module = {
	id: 'word',
	number: 4,
	title: 'Microsoft Word ile Copilot',
	navLabel: 'Word',
	tagline: 'Boş sayfadan cilalı belgeye',
	description:
		'Word’de Copilot ile sıfırdan taslak oluşturmayı, mevcut belgeyi özetlemeyi, metni yeniden yazmayı, profesyonel bir ton yakalamayı, içeriği hedef kitleye uyarlamayı ve uzun belgelerden ana noktaları çıkarmayı uygulayın.',
	visual: 'word',
	skills: ['apps', 'prompting', 'verify'],
	objectives: [
		'Copilot ile sıfırdan bir taslak oluşturmak',
		'Mevcut bir belgeyi özetlemek ve ana noktaları çıkarmak',
		'Metni yeniden yazmak, tonu ve hedef kitleyi ayarlamak',
		'Taslağı adım adım iyileştirmek ve doğrulamak',
	],
	availability:
		'Word’deki Copilot özellikleri (taslak oluşturma, özetleme, yeniden yazma, Copilot bölmesi) uygulama sürümüne (masaüstü, web, mobil), lisansınıza ve yönetici ayarlarına göre farklılık gösterebilir. Bazı özellikler belgenin OneDrive veya SharePoint’te kayıtlı olmasını gerektirebilir.',
	lessons: [
		{
			id: 'word-1',
			title: 'Taslak oluşturma ve özetleme',
			summary:
				'Boş sayfadan taslak oluşturun, uzun belgelerden ana noktaları ve eksikleri çıkarın.',
			minutes: 15,
			objectives: [
				'Copilot ile sıfırdan bir taslak oluşturmak',
				'Uzun bir belgeyi özetlemek',
				'Ana noktaları ve eksik bilgileri çıkarmak',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Word’de Copilot ne yapar?',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Word’de Copilot iki temel durumda yardımcı olur: **boş bir sayfayla** başladığınızda ilk taslağı oluşturmak ve **var olan bir belge** üzerinde çalışırken özetlemek, yeniden yazmak veya sorularınızı yanıtlamak.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'pen',
									title: 'Taslak oluşturma',
									body: 'Amacı, hedef kitleyi ve yapıyı anlatın; Copilot ilk taslağı yazar. Varsa referans dosyaları belirtin.',
								},
								{
									icon: 'fileSearch',
									title: 'Özetleme',
									body: 'Uzun bir belgenin ana noktalarını, kararlarını ve açık konularını kısa bir listeye indirir.',
								},
								{
									icon: 'wand',
									title: 'Yeniden yazma',
									body: 'Seçtiğiniz metni daha kısa, daha resmî veya farklı bir hedef kitleye uygun hâle getirir.',
								},
								{
									icon: 'message',
									title: 'Belgeye soru sorma',
									body: '“Bu belgede teslim tarihi geçiyor mu?” gibi sorularla belge içinde bilgi bulursunuz.',
								},
								{
									icon: 'layers',
									title: 'Yapı önerileri',
									body: 'Metni maddelere, tabloya veya başlıklara dönüştürmeye yardımcı olabilir.',
								},
								{
									icon: 'userCheck',
									title: 'Son kontrol sizde',
									body: 'Copilot’ın eklediği bilgileri, özellikle rakam ve tarihleri, kaynağıyla karşılaştırın.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Word’deki Copilot özellikleri uygulama sürümüne, lisansınıza ve yönetici ayarlarına göre farklılık gösterebilir. Arayüzdeki düğme ve menü adları zaman içinde değişebilir.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'İyi bir taslak prompt’u',
							body: [
								'**Ne:** “Proje kapanış raporu taslağı”',
								'**Kimin için:** “Yönetim ekibi”',
								'**Neye dayanarak:** “Ekteki proje planı ve son durum raporu”',
								'**Nasıl:** “Beş başlık, en fazla iki sayfa”',
							],
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Uzun bir belgeden ana noktaları çıkarmak',
					blocks: [
						{
							type: 'text',
							body: 'Senaryo: İK ekibi 12 sayfalık yeni bir **uzaktan çalışma politikası taslağı** paylaştı ve görüşünüzü istiyor. Copilot ile belgeyi adım adım nasıl ele alabileceğinizi izleyin.',
						},
						{
							type: 'reveal',
							surface: 'word',
							steps: [
								{
									title: 'Özet isteyin',
									body: 'Önce belgenin ne söylediğini kısa bir özetle görün.',
									prompt: 'Bu politika taslağını çalışanlar için 5 maddede özetle.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Çalışanlar haftada en fazla iki gün uzaktan çalışabilir.',
											'Uzaktan çalışma günleri yöneticiyle birlikte aylık olarak planlanır.',
											'Çekirdek çalışma saatleri 10.00–16.00 arasıdır.',
											'Uzaktan çalışırken şirketin onaylı cihazları ve VPN kullanılmalıdır.',
											'Politika 1 Ocak’ta yürürlüğe girer ve altı ay sonra gözden geçirilir.',
										],
									},
								},
								{
									title: 'Değişiklikleri sorun',
									body: 'Ne değiştiğini bilmek, ekibinize ne anlatacağınızı belirler.',
									prompt:
										'Mevcut uygulamaya göre neler değişiyor? Yalnızca bu belgede açıkça yazanları listele.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Uzaktan çalışma günleri artık aylık plana bağlanıyor (Bölüm 2).',
											'Onaylı cihaz ve VPN kullanımı zorunlu hâle geliyor (Bölüm 5).',
											'Belgede önceki uygulamaya ait gün sayısı belirtilmediği için gün sayısındaki değişim karşılaştırılamıyor.',
										],
									},
								},
								{
									title: 'Eksikleri bulun',
									body: 'İyi bir geri bildirim, belgede yanıtı olmayan soruları da içerir.',
									prompt:
										'Çalışanların sorabileceği ama bu belgede yanıtı olmayan soruları listele.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Ev ofis ekipmanı masraflarının nasıl karşılanacağı belirtilmemiş.',
											'Farklı bir şehirden veya yurt dışından uzaktan çalışma kuralları yer almıyor.',
											'Yarı zamanlı çalışanlar için ayrı bir düzenleme geçmiyor.',
										],
									},
								},
								{
									title: 'Kontrol edin ve geri bildirim verin',
									body: 'Maddeleri belgedeki ilgili bölümlerle karşılaştırın. “Eksik” olarak belirtilen noktaları, kendi gözleminizle birlikte İK ekibine iletin.',
								},
							],
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Eksik bulmak, özet kadar değerlidir',
							body: 'Özet belgenin söylediğini gösterir. “Yanıtı olmayan sorular” ise söylemediğini gösterir. İkisi birlikte, belgeye verebileceğiniz en faydalı geri bildirimi oluşturur.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Copilot ile taslak oluşturun',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Belge türünü, tonu ve uzunluğu seçin. Ayarlar değiştikçe prompt’un nasıl değiştiğine ve taslağa nasıl yansıdığına bakın. Sarı işaretli alanlar, Copilot’ın bilmediği ve sizin doldurmanız gereken bilgilerdir.',
						},
						{ type: 'interactive', component: 'wordDraft', taskId: 'word-1-taslak-lab' },
					],
					aside: [
						{
							tone: 'explain',
							title: 'Yer tutucular neden önemli?',
							body: 'Copilot, bilmediği bir bilgiyi uydurmak yerine boş bırakabilir. Bu alanları doldurmadan belgeyi paylaşmayın.',
						},
						{
							tone: 'tip',
							title: 'Kaynakla karşılaştırın',
							body: 'Taslaktaki tarih, saat ve rakamları “Kaynak” kutusundaki bilgilerle karşılaştırın. Gerçek işte de aynı kontrolü yapın.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Doğru prompt’u ve doğru kontrolü seçin',
					blocks: [
						{
							type: 'choice',
							id: 'word-1-taslak',
							context:
								'Pazartesi başlayacak yeni bir stajyer için ilk haftayı anlatan bir karşılama belgesi hazırlamanız gerekiyor. Elinizde İK’nın oryantasyon takvimi var.',
							prompt: 'Copilot’tan taslak isterken en iyi prompt hangisi?',
							options: [
								{
									id: 'a',
									text: '“Stajyer için bir belge yaz.”',
									feedback: 'Amaç belli, ama içerik, kaynak ve yapı belirsiz.',
								},
								{
									id: 'b',
									text: '“Pazartesi başlayacak stajyerimiz için ilk haftayı anlatan sıcak bir karşılama belgesi taslağı oluştur. Ekteki oryantasyon takvimini kullan; her gün için kısa bir başlık ve 2–3 madde yaz, sonunda soru sorabileceği kişileri listele.”',
									correct: true,
									feedback:
										'Hedef kitle, ton, kaynak ve yapı tanımlı. Düzenleme ihtiyacı en aza iner.',
								},
								{
									id: 'c',
									text: '“İK takvimini kopyala ve belgeye yapıştır.”',
									feedback:
										'Bu bir taslak değil; stajyer için anlaşılır bir karşılama metni oluşmaz.',
								},
							],
							explanation:
								'Taslak prompt’unda **kaynağı** (oryantasyon takvimi) ve **yapıyı** (gün gün başlıklar) belirtmek düzenleme süresini kısaltır.',
						},
						{
							type: 'choice',
							id: 'word-1-ozet-kontrol',
							multiple: true,
							prompt:
								'Copilot’ın 30 sayfalık bir sözleşme özetini kullanmadan önce neler yapmalısınız?',
							options: [
								{
									id: 'a',
									text: 'Özetteki tarih, tutar ve yükümlülükleri sözleşmenin ilgili maddeleriyle karşılaştırmak',
									correct: true,
									feedback: 'Özetteki her kritik bilgi kaynağında doğrulanmalıdır.',
								},
								{
									id: 'b',
									text: 'Hukuki yorum gerektiren konuları hukuk ekibine danışmak',
									correct: true,
									feedback: 'Yorum ve onay uzman sorumluluğundadır.',
								},
								{
									id: 'c',
									text: 'Özet kısa olduğu için sözleşmenin yerine kullanmak',
									feedback: 'Özet sözleşmenin yerini tutmaz; bağlayıcı olan sözleşme metnidir.',
								},
								{
									id: 'd',
									text: 'Özette yer almayan ama sizin için kritik olan maddeleri ayrıca sormak',
									correct: true,
									feedback:
										'Özet her şeyi kapsamayabilir; önemli konuları hedefli sorularla kontrol edin.',
								},
							],
							explanation:
								'Özet hızlı anlamanızı sağlar; bağlayıcı kararlar için kaynak metin ve uzman görüşü esastır.',
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
							id: 'word-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Copilot’ın oluşturduğu taslakta köşeli parantez içinde “[tarih]” gibi alanlar var. Bu ne anlama gelir?',
									options: [
										{ id: 'a', text: 'Bir hata vardır; taslak kullanılamaz.' },
										{
											id: 'b',
											text: 'Copilot’ın bilmediği bilgiler için yer bırakılmıştır; bu alanları siz doldurmalısınız.',
										},
										{ id: 'c', text: 'Belge daha sonra otomatik olarak tamamlanacaktır.' },
									],
									correct: 'b',
									explanation:
										'Bilinmeyen bilgiyi uydurmak yerine yer bırakmak iyi bir işarettir. Paylaşmadan önce bütün alanları doldurun.',
								},
								{
									id: 'q2',
									prompt:
										'Uzun bir belgede “bu belgede yanıtı olmayan soruları listele” prompt’u neden faydalıdır?',
									options: [
										{ id: 'a', text: 'Belgeyi kısaltır.' },
										{
											id: 'b',
											text: 'Eksik bilgileri ve netleştirilmesi gereken konuları görünür kılar.',
										},
										{ id: 'c', text: 'Belgenin tonunu değiştirir.' },
									],
									correct: 'b',
									explanation:
										'Belgenin söylemediklerini bulmak, verebileceğiniz en değerli geri bildirimlerden biridir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Taslak prompt’unda **amaç, hedef kitle, kaynak ve yapıyı** belirtmek düzenleme süresini kısaltır.',
				'Uzun belgelerde **özet → değişiklikler → eksikler** sırasıyla ilerleyin.',
				'Taslaktaki yer tutucuları siz doldurun; rakam ve tarihleri kaynakla doğrulayın.',
				'Özet, bağlayıcı belgenin yerini tutmaz.',
			],
		},
		{
			id: 'word-2',
			title: 'Yeniden yazma, ton ve hedef kitle',
			summary: 'Dağınık bir metni dönüştürün, özgün ve iyileştirilmiş metni karşılaştırın.',
			minutes: 15,
			objectives: [
				'Dağınık bir metni profesyonel hâle getirmek',
				'Aynı içeriği farklı hedef kitlelere uyarlamak',
				'Yeniden yazmada anlamın korunduğunu kontrol etmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Yeniden yazmanın altı yolu',
					blocks: [
						{
							type: 'text',
							body: 'Elinizde içerik var ama dili, uzunluğu veya yapısı amaca uygun değil mi? Copilot ile yeniden yazarken **neyin değişmesini** istediğinizi söylemeniz yeterli.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'badge',
									title: 'Daha profesyonel yap',
									body: 'Günlük, dağınık bir dili iş yazışmasına uygun hâle getirir.',
									detail:
										'Prompt: “Bu metni profesyonel ve nazik bir dille yeniden yaz; bilgileri ve anlamı değiştirme.”',
								},
								{
									icon: 'target',
									title: 'Yönetici özeti oluştur',
									body: 'Uzun metni karar vericiler için birkaç cümleye indirir.',
									detail:
										'Prompt: “En fazla üç cümlelik bir yönetici özeti çıkar; karar gereken konuyu ve son tarihi öne çıkar.”',
								},
								{
									icon: 'zap',
									title: 'Daha kısa yaz',
									body: 'Aynı mesajı daha az kelimeyle verir.',
									detail: 'Prompt: “Bu metni anlamını değiştirmeden yarı uzunluğa indir.”',
								},
								{
									icon: 'listChecks',
									title: 'Maddeler hâlinde düzenle',
									body: 'Okunabilirliği artırır, metni taranabilir hâle getirir.',
								},
								{
									icon: 'route',
									title: 'Eylem planına dönüştür',
									body: 'Metindeki işleri sorumlu ve tarih alanlarıyla listeler.',
								},
								{
									icon: 'users',
									title: 'Hedef kitleye uyarla',
									body: 'Teknik bir metni teknik olmayanlar için sadeleştirir veya tersini yapar.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							title: 'Anlamın korunduğunu kontrol edin',
							body: 'Yeniden yazılan metinde rakamlar, tarihler ve taahhütler değişmemelidir. Copilot bir ifadeyi yumuşatırken anlamı da değiştirebilir.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Aynı içerik, iki hedef kitle',
					blocks: [
						{
							type: 'text',
							body: 'Bir BT duyurusu teknik ekip için yazılmış. Copilot’tan bu metni bütün çalışanlar için uyarlamasını istediğinizde nelerin değiştiğine bakın.',
						},
						{
							type: 'beforeAfter',
							before: {
								label: 'Teknik ekip için',
								text: 'VPN istemcisi 3.2 sürümüne geçiyor. MFA zorunlu olacak; eski istemci 15 Ekim’de devre dışı kalacak. Split tunneling politikası değişmiyor.',
							},
							after: {
								label: 'Bütün çalışanlar için',
								text: '15 Ekim’den itibaren uzaktan bağlanırken yeni VPN uygulamasını kullanacağız. Giriş yaparken telefonunuza gelen onayla kimliğinizi doğrulamanız gerekecek. Kurulum adımları için [kılavuz bağlantısı] sayfasına bakabilirsiniz.',
							},
							notes: [
								'Teknik terimler okuyucunun diliyle anlatıldı veya çıkarıldı.',
								'Tarih ve zorunluluk aynen korundu.',
								'Okuyucunun ne yapması gerektiği eklendi.',
							],
						},
						{
							type: 'callout',
							tone: 'tip',
							title: 'Kullanılan prompt',
							body: '“Bu duyuruyu teknik bilgisi olmayan çalışanlar için sade bir dille yeniden yaz; tarihi ve zorunlulukları koru, okuyucunun ne yapması gerektiğini ekle.”',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Dağınık bir metni dönüştürün',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Aşağıda bir çalışanın aceleyle yazdığı dağınık bir iş notu var. Copilot bölmesinden bir dönüşüm seçin, sonucu inceleyin ve **Karşılaştır** görünümünde özgün metinle yan yana koyun.',
						},
						{ type: 'interactive', component: 'wordRewriter', taskId: 'word-2-donusum' },
					],
					aside: [
						{
							tone: 'tip',
							title: 'Belirsizlik korunmalı',
							body: 'Özgün metinde “galiba” denen bir bilgi, iyileştirilmiş metinde kesin bir bilgiye dönüşmemeli. “Daha profesyonel yap” sonucunda bunun nasıl korunduğuna bakın.',
						},
						{
							tone: 'explain',
							title: 'Eylem planı ve “Belirtilmedi”',
							body: 'Metinde sorumlu olmadığı için Copilot kimseye görev atamadı. Görev dağılımını ekip olarak siz yaparsınız.',
						},
						{
							tone: 'note',
							title: 'Kelime sayısı',
							body: 'Görünüm düğmelerinin yanında özgün ve yeni metnin kelime sayılarını görebilirsiniz.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Hedef kitleye uygun dönüşüm ve anlam kontrolü',
					blocks: [
						{
							type: 'choice',
							id: 'word-2-hedef',
							context:
								'Elinizde yeni bir güvenlik yazılımının kurulumunu anlatan teknik bir metin var. Bu metni **tüm çalışanlara** duyuracaksınız.',
							prompt: 'Hangi dönüşüm prompt’u en uygundur?',
							options: [
								{
									id: 'a',
									text: '“Daha profesyonel yap.”',
									feedback: 'Metin zaten profesyonel; asıl sorun teknik dil ve uzunluk.',
								},
								{
									id: 'b',
									text: '“Bu metni teknik bilgisi olmayan çalışanlar için sade bir dille yeniden yaz. Ne değişiyor, ne yapmaları gerekiyor ve kime soru sorabilecekleri olmak üzere üç kısa bölüm olsun.”',
									correct: true,
									feedback: 'Hedef kitle ve yapı açık; okuyucunun ihtiyacına odaklanıyor.',
								},
								{
									id: 'c',
									text: '“Daha uzun ve detaylı yaz.”',
									feedback: 'Daha fazla teknik ayrıntı, çalışanlar için mesajı zorlaştırır.',
								},
							],
							explanation:
								'Doğru dönüşüm, okuyucunun **ne bilmesi ve ne yapması gerektiğine** göre seçilir.',
						},
						{
							type: 'spot',
							id: 'word-2-anlam',
							prompt:
								'Copilot, özgün metni “daha nazik” hâle getirdi. Anlamı değişen satırları işaretleyin.',
							reference: {
								title: 'Özgün metin',
								lines: [
									'Rapor en geç 14 Mart Cuma günü teslim edilmelidir.',
									'Geç teslim edilen raporlar bu çeyreğin değerlendirmesine alınmayacaktır.',
									'Sorularınızı finans ekibine iletebilirsiniz.',
								],
							},
							output: { title: 'Yeniden yazılmış metin', surface: 'word' },
							lines: [
								{
									id: 'l1',
									text: 'Raporunuzu 14 Mart Cuma gününe kadar paylaşmanızı rica ederiz.',
									reason: 'Anlam korunmuş; yalnızca dil yumuşatılmış.',
								},
								{
									id: 'l2',
									text: 'Mümkünse zamanında teslim etmeye çalışmanızı öneririz.',
									flawed: true,
									reason:
										'“En geç” zorunluluğu “mümkünse” önerisine dönüşmüş; teslim tarihinin bağlayıcılığı kaybolmuş.',
								},
								{
									id: 'l3',
									text: 'Geç gelen raporları da değerlendirmeye almaya çalışacağız.',
									flawed: true,
									reason:
										'Özgün metinde geç raporların değerlendirmeye alınmayacağı yazıyor; bu satır tam tersini söylüyor.',
								},
								{
									id: 'l4',
									text: 'Sorularınız için finans ekibimiz size memnuniyetle yardımcı olacaktır.',
									reason: 'Anlam korunmuş.',
								},
							],
							explanation:
								'Ton değiştirirken **kurallar, tarihler ve taahhütler** aynı kalmalıdır. Yumuşatma, bağlayıcı bir ifadeyi farkında olmadan seçimliğe çevirebilir.',
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
							id: 'word-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Bir metni yeniden yazdırdıktan sonra ilk kontrol etmeniz gereken nedir?',
									options: [
										{ id: 'a', text: 'Kelime sayısı' },
										{
											id: 'b',
											text: 'Rakam, tarih ve taahhütlerin özgün metinle aynı kalıp kalmadığı',
										},
										{ id: 'c', text: 'Yazı tipi ve renkler' },
									],
									correct: 'b',
									explanation: 'Dil değişebilir; bilgi ve taahhüt değişmemelidir.',
								},
								{
									id: 'q2',
									prompt:
										'Aynı proje güncellemesini hem ekibinize hem yönetime sunacaksınız. En doğru yaklaşım hangisi?',
									options: [
										{ id: 'a', text: 'Tek bir metni iki gruba da göndermek' },
										{
											id: 'b',
											text: 'İçeriği her hedef kitle için ayrı uyarlamak: yönetim için kısa ve karar odaklı, ekip için ayrıntılı ve görev odaklı',
										},
										{ id: 'c', text: 'Yönetim için daha uzun ve teknik yazmak' },
									],
									correct: 'b',
									explanation:
										'Farklı okuyucuların farklı ihtiyaçları vardır; Copilot ile aynı içerikten iki uyarlama hızla hazırlanabilir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Yeniden yazarken **neyin değişmesini** istediğinizi söyleyin: ton, uzunluk, yapı veya hedef kitle.',
				'Aynı içerik farklı okuyucular için farklı biçimde sunulmalıdır.',
				'Ton değiştirirken **rakam, tarih ve taahhütler** korunmalıdır.',
				'Özgün ve yeni metni yan yana karşılaştırarak kontrol edin.',
			],
		},
	],
}

export default word
