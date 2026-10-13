import type { Module } from '@/types/content'

const intro: Module = {
	id: 'copilot-giris',
	number: 1,
	title: 'Microsoft 365 Copilot’a Giriş',
	navLabel: 'Copilot’a Giriş',
	tagline: 'Copilot nedir, ne yapar ve nerede durur?',
	description:
		'Üretken yapay zekânın temel mantığını, Copilot’ın arama ve otomasyondan farkını, Microsoft 365 uygulamalarıyla ilişkisini ve insan kontrolünün neden vazgeçilmez olduğunu öğrenin.',
	visual: 'copilot',
	skills: ['basics', 'verify'],
	objectives: [
		'Microsoft 365 Copilot’ı ve üretken yapay zekâyı kendi cümlelerinizle tanımlamak',
		'Copilot’ı klasik arama ve klasik otomasyondan ayırt etmek',
		'Copilot Chat ile uygulama içi Copilot deneyimlerini karşılaştırmak',
		'Copilot’ın sınırlarını ve insan kontrolü gereken durumları tanımak',
	],
	availability:
		'Microsoft 365 Copilot’ın hangi uygulamalarda ve hangi özelliklerle kullanılabildiği; lisans türüne, uygulama sürümüne, yönetici ayarlarına ve kurumunuzun yapılandırmasına göre değişebilir. Arayüz turundaki ekran görüntüsü dışında, bu eğitimdeki ekranlar gerçek ürünü değil örnek arayüzleri gösterir.',
	lessons: [
		{
			id: 'giris-1',
			title: 'Copilot ve üretken yapay zekâ',
			summary:
				'Üretken yapay zekânın ne olduğunu ve Copilot’ın arama ile otomasyondan farkını keşfedin.',
			minutes: 10,
			objectives: [
				'Üretken yapay zekâyı tanımlamak',
				'Microsoft 365 Copilot’ın ne olduğunu açıklamak',
				'Copilot’ı arama ve otomasyondan ayırt etmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Üretken yapay zekâ ve Copilot',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Microsoft 365 Copilot; Word, Excel, PowerPoint, Outlook ve Teams gibi uygulamalarla birlikte çalışan, yapay zekâ destekli bir asistandır. Ne istediğinizi günlük dille yazarsınız; Copilot taslak hazırlar, özetler, analiz eder ve önerilerde bulunur.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'brain',
									title: 'Üretken yapay zekâ',
									body: 'Çok büyük metin kümeleriyle eğitilmiş dil modelleri, verdiğiniz talimata göre **yeni içerik üretir**: metin, özet, tablo, fikir.',
									detail:
										'Model, metni bir sonraki en olası kelimeyi tahmin ederek oluşturur. Bu yüzden akıcı ve ikna edici yazar; ancak akıcılık doğruluğun garantisi değildir. Bunu “olasılığa dayalı üretim” olarak aklınızda tutun.',
								},
								{
									icon: 'sparkles',
									title: 'Microsoft 365 Copilot',
									body: 'Dil modelini, çalıştığınız uygulamanın bağlamıyla ve lisansınız ile izinleriniz dahilindeki **iş verilerinizle** birleştirir.',
									detail:
										'Kurumsal kullanımda Copilot; e-postalar, belgeler, toplantılar ve sohbetler gibi Microsoft 365 içeriğinden yararlanabilir. Microsoft’un açıklamalarına göre Copilot, kullanıcının erişim izni olan içerikle çalışacak şekilde tasarlanmıştır. Hangi verilere erişebileceğini kurumunuzun yapılandırması belirler.',
								},
								{
									icon: 'message',
									title: 'Prompt (istem)',
									body: 'Copilot’a verdiğiniz talimattır. Talimat ne kadar net olursa çıktı o kadar işe yarar.',
									detail:
										'Microsoft’un Türkçe arayüzlerinde “istem” kelimesi de kullanılır. Bu eğitimde, iş hayatında yaygın olan “prompt” terimini tercih ediyoruz.',
								},
								{
									icon: 'userCheck',
									title: 'İnsan kontrolü',
									body: 'Copilot bir yardımcıdır. Kararı veren, içeriği onaylayan ve sorumluluğu taşıyan **sizsiniz**.',
								},
							],
						},
						{
							type: 'keyPoint',
							body: 'Copilot bir **yardımcı pilottur**: rotayı ve son kararı siz belirlersiniz; Copilot işin ilk taslağını ve zaman alan kısmını hızlandırır.',
						},
					],
					aside: [
						{
							tone: 'explain',
							title: '“Copilot” adı neden?',
							body: 'İngilizcede “copilot”, yardımcı pilot demektir. Uçağı birlikte yönetirler, ancak sorumluluk kaptandadır. Bu ad, yapay zekânın kullanıcının yerine değil yanında çalıştığını vurgular.',
						},
						{
							tone: 'tip',
							title: 'Kendi işinizi düşünün',
							body: 'Bu hafta tekrar eden üç işinizi not edin: e-posta yanıtlamak, toplantı notu tutmak, rapor özetlemek… Eğitim boyunca bunları Copilot ile nasıl hızlandırabileceğinizi göreceksiniz.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Arama, otomasyon ve Copilot',
					blocks: [
						{
							type: 'text',
							body: 'Üç araç da işinizi kolaylaştırır ama farklı sorunları çözer. Aynı ihtiyaç üzerinden karşılaştıralım: **“Geçen çeyreğin satış sonuçlarını yönetime anlatmam gerekiyor.”**',
						},
						{
							type: 'comparison',
							columns: [
								{ title: 'Klasik arama', icon: 'search' },
								{ title: 'Klasik otomasyon', icon: 'zap' },
								{ title: 'Microsoft 365 Copilot', icon: 'sparkles', highlight: true },
							],
							rows: [
								{
									label: 'Ne yapar?',
									values: [
										'Anahtar kelimeyle eşleşen dosya ve sayfaları listeler.',
										'Önceden tanımlanmış kurala göre aynı işi tekrarlar.',
										'Talebinizi anlayıp yeni içerik üretir: özet, taslak, analiz.',
									],
								},
								{
									label: 'Örnek',
									values: [
										'“Satış Q3” araması 14 dosya getirir; okumak ve yorumlamak size kalır.',
										'“Her ayın ilk günü satış raporunu ekibe gönder” kuralı çalışır.',
										'“Q3 satış raporunu üç maddede özetle ve yönetim için bir e-posta taslağı hazırla.”',
									],
								},
								{
									label: 'Güçlü yanı',
									values: [
										'Kaynağı doğrudan gösterir.',
										'Öngörülebilir ve tutarlıdır.',
										'Esnektir; dili anlar, bağlama göre uyarlanır.',
									],
								},
								{
									label: 'Dikkat',
									values: [
										'Sentez yapmaz, yorumlamaz.',
										'Kural dışı durumları yönetemez.',
										'Yanlış veya eksik sonuç üretebilir; **doğrulama gerekir.**',
									],
								},
							],
						},
						{
							type: 'callout',
							tone: 'tip',
							body: 'Bunlar birbirinin rakibi değildir. Copilot bazı durumlarda arama sonuçlarını ve belgeleri kaynak olarak kullanır. Tekrar eden, kurala dayalı işler için ise otomasyon araçları hâlâ en doğru seçimdir.',
						},
					],
					aside: [
						{
							tone: 'example',
							title: 'Gündelik bir benzetme',
							body: 'Arama size kütüphanedeki doğru rafı gösterir. Otomasyon her sabah aynı gazeteyi kapınıza bırakır. Copilot ise okuduğu kaynaklardan sizin için özet çıkaran bir asistana benzer; özetin doğruluğunu kontrol etmek yine size düşer.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Copilot ile neler yapılabilir?',
					blocks: [
						{
							type: 'text',
							body: 'Copilot’ın iş hayatındaki katkısı genellikle dört başlıkta toplanır. Her başlığı açarak örnek kullanımı ve örnek prompt’u inceleyin.',
						},
						{
							type: 'disclosure',
							items: [
								{
									title: 'Oluşturmak: ilk taslağı hızla çıkarmak',
									body: [
										'Boş sayfa yerine üzerinde çalışabileceğiniz bir taslakla başlarsınız: e-posta, rapor, sunum akışı, duyuru.',
										'**Örnek prompt:** “Yeni esnek çalışma düzenini çalışanlara duyuran, samimi ve kısa bir e-posta taslağı yaz.”',
									],
								},
								{
									title: 'Özetlemek: uzun içerikten öz çıkarmak',
									body: [
										'Uzun bir belge, e-posta zinciri veya toplantı birkaç maddeye iner; kararlar ve açık konular öne çıkar.',
										'**Örnek prompt:** “Bu belgedeki en önemli beş bulguyu ve önerilen aksiyonları madde madde listele.”',
									],
								},
								{
									title: 'Analiz etmek: veriden anlam çıkarmak',
									body: [
										'Tablolardaki eğilimleri, sapmaları ve karşılaştırmaları sorgulayabilir; formül ve grafik önerisi alabilirsiniz.',
										'**Örnek prompt:** “Bölgelere göre hedef ve gerçekleşen satışları karşılaştır, hedefin altında kalanları göster.”',
									],
								},
								{
									title: 'Dönüştürmek: içeriği yeniden şekillendirmek',
									body: [
										'Bir metni kısaltabilir, daha resmî ya da farklı bir hedef kitleye uygun hâle getirebilir; bir raporu sunum akışına dönüştürebilirsiniz.',
										'**Örnek prompt:** “Bu teknik açıklamayı, teknik olmayan yöneticiler için sade bir dille yeniden yaz.”',
									],
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Bu yeteneklerin hangi uygulamalarda ve hangi biçimde sunulduğu; lisansınıza, uygulama sürümüne ve yönetici ayarlarına göre farklılık gösterebilir.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Nereden başlamalı?',
							body: 'İlk denemeler için düşük riskli işler seçin: kendi toplantı notlarınızı özetlemek, bir e-postanın tonunu iyileştirmek veya bir sunum için başlık fikri almak gibi.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Doğru aracı seçin',
					blocks: [
						{
							type: 'choice',
							id: 'giris-1-arac-1',
							prompt:
								'Bir meslektaşınız soruyor: **“Geçen yıl hazırladığımız tedarikçi sözleşmesinin son hâli hangi klasörde, bulamıyorum.”** Bu ihtiyaç için en uygun yaklaşım hangisi?',
							options: [
								{
									id: 'a',
									text: 'Copilot’tan yeni bir tedarikçi sözleşmesi taslağı oluşturmasını istemek',
									feedback:
										'Yeni bir taslak, aranan mevcut belgenin yerini tutmaz; üstelik yanlış sürümle çalışma riski doğar.',
								},
								{
									id: 'b',
									text: 'Arama yapmak veya Copilot’a belgenin yerini sormak; ardından bulunan belgenin doğru ve güncel sürüm olduğunu kontrol etmek',
									correct: true,
									feedback:
										'İhtiyaç, mevcut bir belgeyi bulmak. Copilot (lisansınız ve izinleriniz dahilinde) dosyayı bulmanıza yardım edebilir; doğru sürüm olduğunu ise siz doğrularsınız.',
								},
								{
									id: 'c',
									text: 'Sözleşmeleri her ay otomatik olarak arşive taşıyan bir kural kurmak',
									feedback:
										'Otomasyon gelecekteki düzeni sağlayabilir, ancak bugünkü soruyu yanıtlamaz.',
								},
							],
							explanation:
								'İhtiyacın türünü belirlemek doğru aracı seçmenin ilk adımıdır: **bulmak** için arama, **tekrarlamak** için otomasyon, **üretmek, özetlemek ve dönüştürmek** için Copilot.',
						},
						{
							type: 'choice',
							id: 'giris-1-arac-2',
							prompt:
								'Peki bu ihtiyaç? **“40 sayfalık denetim raporunu yarın sabah yönetime iki dakikada anlatmam gerekiyor.”**',
							options: [
								{
									id: 'a',
									text: 'Rapordaki anahtar kelimeleri tek tek aratmak',
									feedback:
										'Arama bilgiyi bulur ama sizin yerinize sentez yapmaz; iki dakikalık anlatım için yine bütün raporu okumanız gerekir.',
								},
								{
									id: 'b',
									text: 'Copilot’tan ana bulguları ve riskleri özetlemesini istemek, kritik rakamları rapordan kontrol etmek',
									correct: true,
									feedback:
										'Özetleme, Copilot’ın en güçlü olduğu işlerden biridir. Yönetime sunacağınız rakamları kaynak belgeyle karşılaştırmayı unutmayın.',
								},
								{
									id: 'c',
									text: 'Raporu her hafta otomatik olarak yöneticiye ileten bir akış kurmak',
									feedback:
										'Raporu iletmek, onu anlatmak değildir. Yönetimin ihtiyacı kısa ve doğru bir özettir.',
								},
							],
							explanation:
								'Uzun içeriği kısa ve hedef kitleye uygun hâle getirmek tipik bir Copilot işidir. Hız kazanırsınız; doğruluğu kontrol etme sorumluluğu sizde kalır.',
						},
					],
					aside: [
						{
							tone: 'explain',
							title: '“Kontrol et” nasıl çalışır?',
							body: 'Seçiminizi yapın ve “Kontrol et” düğmesine basın. Her seçeneğin neden doğru ya da yanlış olduğunu gösteren geri bildirim alırsınız. İsterseniz tekrar deneyebilirsiniz.',
						},
					],
				},
				{
					id: 'pekistir',
					phase: 'reinforce',
					title: 'Kavramları pekiştirin',
					blocks: [
						{
							type: 'questions',
							id: 'giris-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Üretken yapay zekâ için en doğru tanım hangisidir?',
									options: [
										{ id: 'a', text: 'Veritabanındaki hazır cevapları getiren bir arama sistemi' },
										{
											id: 'b',
											text: 'Verilen talimata göre yeni metin, özet veya içerik üretebilen yapay zekâ modelleri',
										},
										{ id: 'c', text: 'Kurala göre aynı işlemi tekrarlayan otomasyon yazılımı' },
									],
									correct: 'b',
									explanation:
										'Üretken yapay zekâ, talimata göre yeni içerik üretir. Arama mevcut içeriği bulur; otomasyon kuralı tekrarlar.',
								},
								{
									id: 'q2',
									prompt:
										'Copilot’ın ürettiği bir metin çok akıcı ve ikna edici görünüyor. Bu ne anlama gelir?',
									options: [
										{ id: 'a', text: 'İçerdiği bilgilerin doğru olduğu kesindir.' },
										{
											id: 'b',
											text: 'Akıcılık doğruluğu garanti etmez; önemli bilgileri kaynağıyla kontrol etmek gerekir.',
										},
										{ id: 'c', text: 'Metin hiçbir değişiklik yapılmadan paylaşılabilir.' },
									],
									correct: 'b',
									explanation:
										'Dil modelleri olasılığa dayalı üretim yapar; ikna edici ama hatalı cümleler kurabilir. Önemli rakam, isim ve tarihleri her zaman doğrulayın.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Üretken yapay zekâ, talimatınıza göre **yeni içerik üretir**; akıcılığı doğruluğunun kanıtı değildir.',
				'Microsoft 365 Copilot, dil modelini uygulama bağlamı ve izinleriniz dahilindeki iş verileriyle birleştirir.',
				'Bulmak için arama, tekrarlamak için otomasyon; **üretmek, özetlemek, analiz etmek ve dönüştürmek** için Copilot.',
				'Son karar ve sorumluluk her zaman sizdedir.',
			],
		},
		{
			id: 'giris-2',
			title: 'Copilot nerede çalışır, nerede durur?',
			summary:
				'Copilot ekranını tanıyın, Copilot Chat ile uygulama içi deneyimleri ayırt edin; sınırları ve insan kontrolünü öğrenin.',
			minutes: 20,
			objectives: [
				'Copilot’ın Microsoft 365 uygulamalarıyla ilişkisini açıklamak',
				'Copilot Chat ile uygulama içi Copilot’ı karşılaştırmak',
				'Copilot uygulamasının ana ekranındaki temel alanları tanımak',
				'Uzun bir raporu Copilot ile anlamanın adımlarını uygulamak',
				'İnsan kontrolü gerektiren işleri ayırt etmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'İki giriş kapısı: Copilot Chat ve uygulama içi Copilot',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Copilot’a iki ana yoldan ulaşırsınız. Hangisini seçeceğiniz, işin nerede yapıldığına ve hangi bağlama ihtiyaç duyduğunuza bağlıdır.',
						},
						{
							type: 'comparison',
							columns: [
								{ title: 'Copilot Chat', icon: 'messages' },
								{ title: 'Uygulama içi Copilot', icon: 'layers' },
							],
							rows: [
								{
									label: 'Nerede?',
									values: [
										'Ayrı bir sohbet deneyimi: Microsoft 365 Copilot uygulaması, web tarayıcısı veya Teams.',
										'Çalıştığınız uygulamanın içinde: Word, Excel, PowerPoint, Outlook, Teams.',
									],
								},
								{
									label: 'Bağlam',
									values: [
										'Sorunuz, eklediğiniz dosyalar ve yapılandırmaya bağlı olarak web veya iş verileri.',
										'O anda açık olan belge, e-posta, tablo, sunum veya toplantı.',
									],
								},
								{
									label: 'En uygun işler',
									values: [
										'Araştırma, fikir üretme, birden fazla kaynağı birleştirme, çok adımlı sorular.',
										'Açık belgeyi özetleme, yeniden yazma, tabloyu analiz etme, sunum taslağı oluşturma.',
									],
								},
								{
									label: 'Örnek',
									values: [
										'“Bu üç dosyaya göre projenin durumunu karşılaştır.”',
										'Word’de: “Bu belgenin yönetici özetini çıkar.”',
									],
								},
							],
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'file',
									title: 'Word',
									body: 'Taslak oluşturma, özetleme, yeniden yazma ve ton ayarlama.',
								},
								{
									icon: 'mail',
									title: 'Outlook',
									body: 'E-posta zincirini özetleme, yanıt taslağı hazırlama, ton önerisi.',
								},
								{
									icon: 'table',
									title: 'Excel',
									body: 'Veriyi sorgulama, eğilim bulma, formül ve grafik önerisi.',
								},
								{
									icon: 'presentation',
									title: 'PowerPoint',
									body: 'Belgeden sunum taslağı, slayt düzeni ve konuşmacı notları.',
								},
								{
									icon: 'users',
									title: 'Teams',
									body: 'Toplantı özeti, kararlar, aksiyon maddeleri ve açık sorular.',
								},
								{
									icon: 'messages',
									title: 'Copilot Chat',
									body: 'Soru-cevap, beyin fırtınası ve birden fazla kaynaktan sentez.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Copilot Chat’in yalnızca web verileriyle mi, yoksa iş verilerinizle (e-posta, dosya, toplantı) de mi yanıt üreteceği lisansınıza ve kurumunuzun ayarlarına bağlıdır. Arayüzdeki adlar ve menüler zaman içinde değişebilir.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Hızlı seçim kuralı',
							body: [
								'İş **tek bir belgenin içindeyse**: o uygulamadaki Copilot.',
								'İş **birden fazla kaynağı** birleştirmeyi veya serbest düşünmeyi gerektiriyorsa: Copilot Chat.',
							],
						},
					],
				},
				{
					id: 'arayuz-turu',
					phase: 'explore',
					title: 'Copilot ekranını tanıyın: arayüz turu',
					wide: true,
					blocks: [
						{ type: 'interactive', component: 'copilotTour', taskId: 'giris-2-arayuz-turu' },
					],
					aside: [
						{
							tone: 'tip',
							title: 'Önce kalkana bakın',
							body: 'Şirket dokümanı yüklemeden veya hassas bir konu yazmadan önce sağ üstteki yeşil kalkanı (durak 1) kontrol etmeyi alışkanlık hâline getirin.',
						},
						{
							tone: 'note',
							title: 'Ekranınız farklıysa',
							body: 'Kurumunuzun sabitlediği ajanlar, menü adları ve öneri düğmeleri bu görüntüden farklı olabilir. Bulamadığınız bir alan olursa eğitmeninize veya BT ekibinize sorun.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Gerçek hayattan bir örnek: 15 sayfalık rapor',
					blocks: [
						{
							type: 'text',
							body: 'Senaryo: **“Yarınki yönetim toplantısı için 15 sayfalık bir raporu hızlıca anlamam gerekiyor.”** Copilot’ın bu işte nasıl yardımcı olabileceğini adım adım izleyin.',
						},
						{
							type: 'reveal',
							surface: 'word',
							steps: [
								{
									title: 'Önce genel resmi görün',
									body: 'Raporu açın ve kısa bir özet isteyin. Amaç, 15 sayfayı okumadan önce raporun neyi anlattığını kavramak.',
									prompt: 'Bu raporu 5 maddede özetle. Her madde en fazla iki cümle olsun.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Müşteri kayıp oranı çeyrek sonunda %8’den %11’e yükseldi.',
											'Kayıpların büyük kısmı, sözleşmesi yenileme dönemine giren KOBİ müşterilerinden geliyor.',
											'Destek taleplerine ilk yanıt süresi 6 saatten 14 saate çıktı.',
											'Kaybedilen müşterilerin yarısı rakiplerin yıllık ödeme indirimlerini gerekçe gösterdi.',
											'Rapor; destek ekibinin güçlendirilmesini, indirim seçeneğini ve proaktif yenileme aramalarını öneriyor.',
										],
									},
								},
								{
									title: 'Önemli bulguları ayıklayın',
									body: 'Yönetim için kritik olan konuları, rakamlarıyla ve kaynak sayfalarıyla ayrı bir liste hâlinde isteyin.',
									prompt:
										'Yönetimin karar vermesi gereken konuları, ilgili rakamlar ve sayfa numaralarıyla listele.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'**Destek kapasitesi:** İlk yanıt süresi 14 saat, hedef 8 saat (s. 6). Ekibe iki uzman eklenmesi öneriliyor (s. 13).',
											'**Fiyatlandırma:** Rakipler yıllık ödemede %15’e varan indirim sunuyor (s. 9).',
											'**Yenileme kampanyası:** KOBİ yenileme oranı %71; kampanya bütçesi onay bekliyor (s. 11).',
										],
									},
								},
								{
									title: 'Takip sorularıyla derinleşin',
									body: 'Toplantıda sorulabilecek noktaları sorun. Copilot aynı belge bağlamında yanıt verir.',
									prompt: 'Destek yanıt süresinin neden arttığı raporda açıklanıyor mu?',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Rapor artışı iki nedene bağlıyor: yeni sürümden sonra destek talebi hacminin %35 artması ve iki kıdemli uzmanın ekipten ayrılması (s. 7).',
											'Raporda bu iki etkenin ayrı ayrı ne kadar etkili olduğuna dair bir veri bulunmuyor.',
										],
									},
								},
								{
									title: 'Doğrulayın ve sahiplenin',
									body: 'Toplantıda kullanacağınız rakamları rapordaki sayfalarından kontrol edin. Copilot’ın “raporda veri yok” dediği noktaları not alın: bunlar toplantıda sorulabilecek iyi sorulardır.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							body: 'Bu örnekteki rapor ve rakamlar kurgusaldır. Gerçek bir raporda Copilot’ın verdiği sayfa numaralarını ve rakamları mutlaka kaynağında doğrulayın.',
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Neden adım adım?',
							body: 'Tek bir büyük prompt yerine sırayla ilerlemek; her yanıtı kontrol etmenize, yönü değiştirmenize ve konuyu derinleştirmenize olanak tanır. Bu tekniği Copilot Chat modülünde ayrıntılı çalışacaksınız.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Raporla kendiniz çalışın',
					blocks: [
						{
							type: 'text',
							body: 'Aynı raporla şimdi siz çalışın. Bir prompt seçin, Copilot’ın örnek yanıtını okuyun ve yanıttaki **sayfa etiketlerine** tıklayarak bilginin raporda gerçekten yazıp yazmadığını kontrol edin.',
						},
						{ type: 'interactive', component: 'reportExplorer', taskId: 'giris-2-rapor' },
					],
					aside: [
						{
							tone: 'tip',
							title: 'Kaynağa gitme alışkanlığı',
							body: 'Bazı Copilot deneyimleri yanıtta kaynak gösterebilir. Kaynak gösterilmesi, bilginin doğru yorumlandığı anlamına gelmez; kritik bilgide kaynağı açıp okuyun.',
						},
					],
				},
				{
					id: 'sinirlar',
					phase: 'learn',
					title: 'Sınırlar ve insan kontrolü',
					blocks: [
						{
							type: 'text',
							body: 'Copilot güçlü bir yardımcıdır, ancak her şeyi bilmez ve her işi tek başına yapmamalıdır. Bu sınırları bilmek, onu güvenle kullanmanın ön koşuludur.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'scan',
									title: 'Yanlış veya eksik yanıt verebilir',
									body: 'Akıcı bir dille hatalı rakam, var olmayan bir kaynak ya da eksik bir özet üretebilir.',
									detail:
										'Bu duruma genellikle “halüsinasyon” denir. Önemli bilgileri her zaman kaynağıyla karşılaştırın.',
								},
								{
									icon: 'database',
									title: 'Erişebildiği bilgiyle sınırlıdır',
									body: 'Kendisine sağlanmayan veya erişim izniniz olmayan bilgiyi bilemez; güncel olmayan kaynaklara dayanabilir.',
								},
								{
									icon: 'scale',
									title: 'Karar verici değildir',
									body: 'İşe alım, performans değerlendirmesi, hukuki veya finansal taahhüt gibi kararlar insan değerlendirmesi gerektirir.',
								},
								{
									icon: 'lock',
									title: 'Hassas bilgi dikkat ister',
									body: 'Kişisel veriler, gizli belgeler ve müşteri bilgileri kurum politikalarına uygun biçimde ele alınmalıdır.',
								},
							],
						},
						{
							type: 'keyPoint',
							label: 'Altın kural',
							body: 'Copilot’ın ürettiği her içeriği **kendi adınızla paylaşacağınız bir taslak** gibi değerlendirin: okuyun, kontrol edin, düzeltin, sonra paylaşın.',
						},
					],
					aside: [
						{
							tone: 'note',
							title: 'Bu eğitimin yaklaşımı',
							body: 'Eğitim boyunca karşılaşacağınız “Kontrol et” adımları, gerçek işte de uygulamanız gereken doğrulama alışkanlığını temsil eder.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Görevleri sınıflandırın',
					blocks: [
						{
							type: 'classify',
							id: 'giris-2-siniflandir',
							prompt:
								'Aşağıdaki iş görevlerini üç gruptan birine yerleştirin. Her seçimden sonra açıklamayı okuyun.',
							categories: [
								{
									id: 'copilot',
									label: 'Copilot yapabilir',
									description: 'Copilot iyi bir ilk sonuç üretir; kısa bir göz atma yeterli.',
									tone: 'good',
								},
								{
									id: 'human',
									label: 'İnsan kontrolü gerekir',
									description: 'Copilot hızlandırır, ama çıktı dikkatle doğrulanmalı.',
									tone: 'warn',
								},
								{
									id: 'stop',
									label: 'Tek başına yapmamalı',
									description: 'Karar ve sorumluluk insanda kalmalı; Copilot yalnızca destekler.',
									tone: 'stop',
								},
							],
							items: [
								{
									id: 'notlar',
									text: 'Kendi toplantı notlarınızdan kısa bir özet çıkarmak',
									category: 'copilot',
									feedback:
										'Düşük riskli ve kaynağını sizin bildiğiniz bir iş. Copilot hızlıca iyi bir özet çıkarır; bir kez okumanız yeterlidir.',
								},
								{
									id: 'butce',
									text: 'Yönetime sunulacak bütçe raporundaki rakamları özetlemek',
									category: 'human',
									feedback:
										'Copilot özeti hızlandırır, ancak rakamlar karar almaya temel olacak. Her sayıyı kaynak tabloyla karşılaştırın.',
								},
								{
									id: 'terfi',
									text: 'Bir çalışanın performans notunu ve terfi kararını belirlemek',
									category: 'stop',
									feedback:
										'Kişiler hakkında sonuç doğuran kararlar insan değerlendirmesi gerektirir. Copilot yalnızca geri bildirimleri düzenlemenize yardımcı olabilir.',
								},
								{
									id: 'fikir',
									text: 'Bir sunum için başlık ve slayt akışı fikirleri üretmek',
									category: 'copilot',
									feedback:
										'Fikir üretmek Copilot’ın güçlü olduğu bir alan. Beğenmediğiniz önerileri eler, iyi olanları geliştirirsiniz.',
								},
								{
									id: 'sozlesme',
									text: 'Müşteriye gönderilecek sözleşme maddelerinin hukuki uygunluğunu onaylamak',
									category: 'stop',
									feedback:
										'Hukuki onay uzman sorumluluğundadır. Copilot bir maddeyi sadeleştirmeye yardım edebilir ama uygunluğuna karar veremez.',
								},
								{
									id: 'talepler',
									text: 'Uzun bir e-posta zincirindeki müşteri taleplerini listelemek',
									category: 'human',
									feedback:
										'Copilot listeyi hızla çıkarır; yanıtlamadan önce önemli bir talebin atlanmadığını kontrol etmelisiniz.',
								},
								{
									id: 'ton',
									text: 'Bir e-postanın dilini daha nazik ve profesyonel hâle getirmek',
									category: 'copilot',
									feedback:
										'Ton iyileştirme hızlı ve düşük riskli bir iştir. Göndermeden önce anlamın değişmediğinden emin olun.',
								},
							],
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Sınıflandırırken kendinize sorun',
							body: [
								'Bu çıktı bir **karar** doğuruyor mu?',
								'Bir **kişiyi, müşteriyi veya şirketi** bağlıyor mu?',
								'Yanlış olursa **etkisi** ne kadar büyük?',
							],
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
							id: 'giris-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Açık olan bir Word belgesinin kısa bir özetini çıkarmak istiyorsunuz. En pratik seçim hangisi?',
									options: [
										{ id: 'a', text: 'Word içindeki Copilot' },
										{ id: 'b', text: 'Belgeyi yazdırıp elle özetlemek' },
										{ id: 'c', text: 'Klasik bir otomasyon kuralı' },
									],
									correct: 'a',
									explanation:
										'İş tek bir belgenin içindeyse, o uygulamadaki Copilot belgenin bağlamını doğrudan kullanır.',
								},
								{
									id: 'q2',
									prompt:
										'Üç farklı proje dosyasını karşılaştırıp ortak riskleri bulmak istiyorsunuz. Hangisi daha uygundur?',
									options: [
										{
											id: 'a',
											text: 'Dosyaları ekleyerek veya belirterek Copilot Chat’i kullanmak',
										},
										{ id: 'b', text: 'Yalnızca Excel içindeki Copilot’ı kullanmak' },
										{ id: 'c', text: 'Dosya adlarıyla arama yapmak' },
									],
									correct: 'a',
									explanation:
										'Birden fazla kaynağı birleştiren sentez işleri için Copilot Chat daha uygundur. Dosya ekleme ve iş verilerine erişim lisansa ve yapılandırmaya bağlıdır.',
								},
								{
									id: 'q3',
									prompt:
										'Copilot bir analizde raporda bulunmayan bir rakam kullanmış. Ne yapmalısınız?',
									options: [
										{ id: 'a', text: 'Rakam mantıklı göründüğü için kullanmak' },
										{
											id: 'b',
											text: 'Rakamı kaynağa göre doğrulamak; kaynakta yoksa çıkarmak veya düzeltmek',
										},
										{ id: 'c', text: 'Copilot’ı kullanmayı tamamen bırakmak' },
									],
									correct: 'b',
									explanation:
										'Yanlış veya uydurma bilgi ihtimali her zaman vardır. Çözüm Copilot’ı bırakmak değil, çıktıyı doğrulama alışkanlığıdır.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Copilot’a **Copilot Chat** ve **uygulama içi** deneyimler üzerinden ulaşırsınız; seçim işin bağlamına bağlıdır.',
				'Tek belgedeki işler için uygulama içi Copilot, çok kaynaklı sentez için Copilot Chat daha uygundur.',
				'Copilot uygulamasında en sık kullanacağınız alanlar **mesaj kutusu, Work IQ, yanıt modu ve yeşil kalkandır**; şirket verisiyle çalışmadan önce kalkanı kontrol edin.',
				'Uzun bir raporu anlamak için **özet → önemli bulgular → takip soruları → doğrulama** sırasını izleyin.',
				'Kişileri, müşterileri veya şirketi bağlayan kararlar **insan değerlendirmesi** gerektirir.',
			],
		},
	],
}

export default intro
