import type { Module } from '@/types/content'

const outlook: Module = {
	id: 'outlook',
	number: 5,
	title: 'Microsoft Outlook ile Copilot',
	navLabel: 'Outlook',
	tagline: 'Gelen kutusunu kararlara dönüştürün',
	description:
		'Uzun e-posta zincirlerini özetlemeyi, gelen mesajlardan kararları, aksiyon maddelerini ve açık soruları çıkarmayı, bağlamı koruyan yanıt taslakları hazırlamayı ve tonu duruma göre ayarlamayı öğrenin.',
	visual: 'outlook',
	skills: ['apps', 'meetings', 'verify'],
	objectives: [
		'Uzun bir e-posta zincirini özetlemek',
		'Mesajlardan kararları, aksiyonları ve açık soruları çıkarmak',
		'Bağlamı koruyan bir yanıt taslağı hazırlamak',
		'Tonu kişiye ve duruma göre ayarlarken bilgileri korumak',
	],
	availability:
		'Outlook’taki Copilot özellikleri (zincir özetleme, taslak oluşturma, ton ve netlik önerileri) Outlook sürümüne (yeni Outlook, web, mobil, klasik masaüstü), lisansınıza ve yönetici ayarlarına göre farklılık gösterebilir. Copilot taslak hazırlar; e-postayı göndermek her zaman sizin kararınızdır.',
	lessons: [
		{
			id: 'outlook-1',
			title: 'E-posta zincirlerini özetleme ve aksiyonlar',
			summary: 'Uzun bir zinciri özetleyin; kararları, aksiyonları ve açık soruları ayırın.',
			minutes: 16,
			objectives: [
				'Uzun bir zinciri özetlemek',
				'Kararları, bekleyen aksiyonları ve açık soruları ayırmak',
				'Özetin doğruluğunu iletilerle kontrol etmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Gelen kutusunda Copilot',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Uzun e-posta zincirleri, kimin neye karar verdiğini ve sırada ne olduğunu kaybetmenin en kolay yoludur. Outlook’taki Copilot zinciri özetleyebilir, yanıt taslağı hazırlayabilir ve tonla ilgili öneriler sunabilir.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'inbox',
									title: 'Zinciri özetleme',
									body: 'Onlarca iletiyi kısa bir özete indirir: ne konuşuldu, ne karar verildi?',
								},
								{
									icon: 'listChecks',
									title: 'Aksiyon çıkarma',
									body: 'İletilerdeki talepleri ve görevleri kim, ne, ne zaman olarak listeler.',
								},
								{
									icon: 'pen',
									title: 'Yanıt taslağı',
									body: 'Zincirin bağlamını kullanarak yanıtınızın ilk taslağını hazırlar.',
								},
								{
									icon: 'message',
									title: 'Ton ve netlik',
									body: 'Taslağınızın tonu ve netliği hakkında öneriler sunabilir.',
								},
								{
									icon: 'search',
									title: 'Açık soruları bulma',
									body: 'Yanıtlanmamış soruları ve netleşmemiş konuları görünür kılar.',
								},
								{
									icon: 'hand',
									title: 'Gönderme kararı sizde',
									body: 'Copilot taslak hazırlar; alıcıları, içeriği ve zamanı siz onaylarsınız.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Özellik adları ve konumları Outlook sürümüne göre değişebilir. Kurumunuzda hangi Copilot özelliklerinin açık olduğunu BT ekibinizden öğrenebilirsiniz.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Özet bir başlangıçtır',
							body: 'Özet, zinciri okumanın yerini tutmaz; ama hangi iletiyi dikkatle okumanız gerektiğini gösterir.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Karar mı, öneri mi?',
					blocks: [
						{
							type: 'text',
							body: 'Bir zincir özetinde en sık yapılan hata, **önerileri veya eğilimleri kesin karar** gibi okumaktır. Copilot’tan kararların hangi iletide geçtiğini göstermesini isteyerek bu riski azaltabilirsiniz.',
						},
						{
							type: 'chat',
							surface: 'outlook',
							title: 'Outlook · Copilot',
							messages: [
								{
									role: 'user',
									text: 'Bu zincirde kesinleşmiş kararlar neler? Her kararın hangi iletide geçtiğini belirt.',
								},
								{
									role: 'copilot',
									heading: 'Kararlar ve kaynak iletiler',
									bullets: [
										'**Tarih: 19 Eylül** — Burak Demir, 3 Haziran 11:40 (“19 Eylül daha uygun”); Selin Kaya, 5 Haziran 09:47 (uzlaşı).',
										'**Mekân: İstanbul** — Selin Kaya, 5 Haziran 09:47 (“uzlaşıyoruz gibi görünüyor”).',
										'**Davetiye metni: Burak Demir** — Burak Demir, 5 Haziran 13:15.',
									],
									note: 'Mekân ve tarih için ekip uzlaşısı var; ancak resmî onay ve kapora ödemesi henüz bekleniyor.',
								},
							],
						},
						{
							type: 'list',
							style: 'check',
							title: 'Bir zincir özetini okurken sorun',
							items: [
								'Kararı **kim**, **hangi iletide** verdi?',
								'Bu bir karar mı, yoksa öneri veya eğilim mi?',
								'Tarih ve tutarlar iletilerdekiyle aynı mı?',
								'Sizden beklenen bir eylem var mı?',
							],
						},
					],
					aside: [
						{
							tone: 'example',
							title: '“Uzlaşıyoruz gibi görünüyor”',
							body: 'Bu ifade bir karar değil, bir eğilimdir. İyi bir özet bu farkı korur; kötü bir özet onu “karar verildi”ye dönüştürür.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'E-posta zinciri laboratuvarı',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Aşağıda yedi iletilik bir zincir var. İsterseniz iletileri açıp okuyun; ardından Copilot eylemlerini tek tek deneyin. Sonuç panelinde **kısa özet, önemli kararlar, bekleyen aksiyonlar ve önerilen yanıt taslağı** yer alır; seçtiğiniz eylem en üstte vurgulanır.',
						},
						{ type: 'interactive', component: 'outlookLab', taskId: 'outlook-1-lab' },
					],
					aside: [
						{
							tone: 'explain',
							title: '“Siz” satırı',
							body: 'Aksiyon tablosunda “Siz” yazan satır, zincirde sizden açıkça beklenen işi gösterir: kapora için yazılı onay.',
						},
						{
							tone: 'tip',
							title: 'Açık sorular',
							body: 'Kararlar bölümünün altındaki açık sorular, yanıtınızda değinmeniz gereken konulardır.',
						},
						{
							tone: 'note',
							title: 'Gönderim yok',
							body: 'Bu laboratuvar hiçbir e-posta göndermez. “Taslağı kopyala” yalnızca metni panonuza kopyalar.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Özetteki hataları bulun',
					blocks: [
						{
							type: 'spot',
							id: 'outlook-1-ozet-hata',
							prompt:
								'Copilot aynı zincir için kısa bir özet üretti. Zincirdeki bilgilerle uyuşmayan satırları işaretleyin.',
							reference: {
								title: 'Zincirdeki bilgiler',
								lines: [
									'Selin: Mekân için İstanbul ve İzmir seçenekleri var.',
									'Burak: 19 Eylül daha uygun.',
									'Can: Bütçe üst sınırı 850 bin ₺; İstanbul teklifi 780 bin ₺.',
									'Ayşe: Opsiyon 14 Haziran’a kadar geçerli; katering teklifi henüz alınmadı.',
									'Burak: Davetiye metnini 12 Haziran’a kadar hazırlayacak.',
								],
							},
							output: { title: 'Zincir özeti', surface: 'outlook' },
							lines: [
								{
									id: 'l1',
									text: 'Toplantı için İstanbul ve 19 Eylül tercih ediliyor.',
									reason: 'Zincirle uyumlu.',
								},
								{
									id: 'l2',
									text: 'Mekân rezervasyonu tamamlandı ve kapora ödendi.',
									flawed: true,
									reason:
										'Zincirde yalnızca opsiyon var; kesin rezervasyon için onay ve kapora bekleniyor.',
								},
								{
									id: 'l3',
									text: 'Bütçe üst sınırı 850 bin ₺; İstanbul teklifi bu sınırın altında.',
									reason: 'Zincirle uyumlu.',
								},
								{
									id: 'l4',
									text: 'Davetiye metni 12 Haziran’a kadar hazırlanacak.',
									reason: 'Zincirle uyumlu.',
								},
								{
									id: 'l5',
									text: 'Katering menüsü 20 Haziran’da kesinleşecek.',
									flawed: true,
									reason: 'Zincirde böyle bir tarih yok; menü teklifi henüz alınmadı.',
								},
							],
							explanation:
								'Özetler en çok **durum** (opsiyon mu, kesin rezervasyon mu?) ve **tarih** konusunda yanılır. Bir özeti paylaşmadan önce bu iki bilgiyi iletilerle karşılaştırın.',
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
							id: 'outlook-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Uzun bir zinciri özetletirken hangi prompt daha faydalıdır?',
									options: [
										{ id: 'a', text: '“Bunu özetle.”' },
										{
											id: 'b',
											text: '“Bu zinciri özetle; kararları, bekleyen aksiyonları ve açık soruları ayrı ayrı listele.”',
										},
										{ id: 'c', text: '“Kim haklı?”' },
									],
									correct: 'b',
									explanation:
										'Özeti bölümlere ayırmak, karar ve eylemleri kaybetmeden zinciri anlamanızı sağlar.',
								},
								{
									id: 'q2',
									prompt:
										'Özette “karar verildi” yazıyor, ancak iletide “uzlaşıyoruz gibi görünüyor” ifadesi geçiyor. Ne yaparsınız?',
									options: [
										{ id: 'a', text: 'Özete güvenir, kararı kesin kabul ederim.' },
										{
											id: 'b',
											text: 'Bunun henüz bir eğilim olduğunu not eder, gerekirse kesin onayı teyit ederim.',
										},
										{ id: 'c', text: 'Zinciri silerim.' },
									],
									correct: 'b',
									explanation:
										'Eğilim ile karar arasındaki fark, özellikle bütçe ve taahhüt gerektiren konularda önemlidir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Uzun zincirlerde **özet → kararlar → aksiyonlar → açık sorular** sırasıyla ilerleyin.',
				'Kararı öneri veya eğilimden ayırın; özet bu farkı silebilir.',
				'Copilot’tan kararların **hangi iletide** geçtiğini göstermesini isteyin.',
				'Özetteki durum ve tarih bilgilerini iletilerle karşılaştırın.',
			],
		},
		{
			id: 'outlook-2',
			title: 'Yanıt yazma, ton ve bağlam',
			summary:
				'Bağlamı koruyan yanıt taslakları isteyin, tonu ayarlayın, göndermeden önce kontrol edin.',
			minutes: 14,
			objectives: [
				'Bağlamı koruyan bir yanıt taslağı istemek',
				'Tonu kişiye ve duruma göre ayarlamak',
				'Taslağı göndermeden önce taahhütler ve alıcılar açısından kontrol etmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Bağlamı koruyan yanıt',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'İyi bir yanıt; zincirde ne konuşulduğunu, sizden ne beklendiğini ve bir sonraki adımı bilir. Copilot’tan yanıt taslağı isterken bunları prompt’unuzda belirtin.',
						},
						{
							type: 'list',
							style: 'number',
							items: [
								'**Kime ve neden:** “Can’a, kapora onayı için”',
								'**Ana mesaj:** “Mekânı ve tarihi onaylıyorum”',
								'**Sonraki adımlar:** “Davetiye 12 Haziran’da; açık konular katering ve açılış konuşması”',
								'**Ton ve uzunluk:** “Kısa, net ve teşekkür eden”',
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							body: 'Copilot, zincirde olmayan bir taahhüdü (ör. “bütçeyi artırabiliriz”) taslağa ekleyebilir. Göndermeden önce her cümlenin doğru olduğundan ve size ait olduğundan emin olun.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Alıcıları kontrol edin',
							body: 'Yanıt taslağı iç bilgi içeriyorsa (bütçe, iç notlar), dış alıcıların bulunduğu bir zincirde bu bilgileri çıkarın.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Dört unsurlu bir yanıt isteği',
					blocks: [
						{
							type: 'chat',
							surface: 'outlook',
							title: 'Outlook · yanıt taslağı',
							messages: [
								{
									role: 'user',
									text: 'Can’a ve ekibe bir yanıt taslağı hazırla. Mekânı ve tarihi onaylıyorum; Can kapora sürecini başlatabilir. Burak davetiye metnini 12 Haziran’da paylaşacak; katering ve açılış konuşması hâlâ açık. Kısa, net ve teşekkür eden bir ton kullan.',
								},
								{
									role: 'copilot',
									text: 'Merhaba Can, merhaba ekip; değerlendirmeleriniz için teşekkürler. Toplantının 19 Eylül’de İstanbul’da yapılmasını onaylıyorum; Can, kapora sürecini başlatabilirsin. Burak, davetiye metnini 12 Haziran’a kadar paylaşman çok iyi olur. Açık kalan konular: katering teklifi ve açılış konuşması. Teşekkürler.',
									note: 'Örnek yanıt. Prompt’taki dört unsur (kime, ana mesaj, sonraki adımlar, ton) taslağa yansıdı.',
								},
							],
						},
						{
							type: 'list',
							style: 'check',
							title: 'Göndermeden önce',
							items: [
								'Tarih ve tutarlar zincirdekiyle aynı mı?',
								'Taslak, sizin vermediğiniz bir söz içeriyor mu?',
								'Alıcılar doğru mu? İç bilgi dış alıcılara gidiyor mu?',
							],
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Aynı bilgi, farklı tonlar',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Bir müşteriye teslimat gecikmesini bildireceksiniz. Tonları değiştirin ve **verilmesi gereken bilgiler** listesinin her taslakta korunup korunmadığına bakın. Son seçenek, kötü kurulmuş bir prompt’un neden olabileceği riskleri gösteriyor.',
						},
						{ type: 'interactive', component: 'toneSwitcher', taskId: 'outlook-2-ton' },
					],
					aside: [
						{
							tone: 'explain',
							title: 'Ton değişir, gerçekler değişmez',
							body: 'Resmîden samimiye geçerken kelimeler değişir; ama sipariş, tarih, neden ve telafi bilgileri aynı kalmalıdır.',
						},
						{
							tone: 'tip',
							title: 'Riskli prompt’un dersi',
							body: '“İkna et” gibi yalnızca sonuca odaklanan bir prompt, verilmemiş sözler ve yetkisiz teklifler üretebilir.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Göndermeden önce kontrol',
					blocks: [
						{
							type: 'spot',
							id: 'outlook-2-taslak-kontrol',
							prompt:
								'Copilot, bayi toplantısı zinciri için aşağıdaki yanıt taslağını hazırladı. Zincirle uyuşmayan veya sizin vermediğiniz bir taahhüt içeren satırları işaretleyin.',
							reference: {
								title: 'Zincirdeki bilgiler',
								lines: [
									'Tarih 19 Eylül, mekân İstanbul; opsiyon 14 Haziran’a kadar.',
									'Bütçe üst sınırı 850 bin ₺; İstanbul teklifi 780 bin ₺.',
									'Davetiye metni 12 Haziran’a kadar Burak’tan.',
									'Katering menü teklifi henüz alınmadı.',
								],
							},
							output: { title: 'Yanıt taslağı', surface: 'outlook' },
							lines: [
								{
									id: 'l1',
									text: 'Toplantının 19 Eylül’de İstanbul’da yapılmasını onaylıyorum.',
									reason: 'Zincirle uyumlu; onay sizden bekleniyordu.',
								},
								{
									id: 'l2',
									text: 'Gerekirse bütçe üst sınırını 950 bin ₺ seviyesine çıkarabileceğimizi de belirtmek isterim.',
									flawed: true,
									reason:
										'Zincirde böyle bir bilgi yok; üst sınır 850 bin ₺. Taslak, sizin vermediğiniz bir taahhüt içeriyor.',
								},
								{
									id: 'l3',
									text: 'Burak, davetiye metnini 12 Haziran’a kadar paylaşman harika olur.',
									reason: 'Zincirle uyumlu.',
								},
								{
									id: 'l4',
									text: 'Katering firması menüyü onayladı.',
									flawed: true,
									reason: 'Zincire göre menü teklifi henüz alınmadı.',
								},
								{
									id: 'l5',
									text: 'Opsiyonun 14 Haziran’da sona erdiğini hatırlatırım.',
									reason: 'Zincirle uyumlu.',
								},
							],
							explanation:
								'Taslaktaki her cümle **sizin adınıza** gönderilir. Zincirde olmayan taahhütleri ve durumları çıkarın.',
						},
						{
							type: 'choice',
							id: 'outlook-2-alici',
							prompt:
								'Copilot’ın hazırladığı yanıt taslağı finans ekibinin iç bütçe notlarına atıf yapıyor ve siz yanıtı **bayilere de** göndermeyi düşünüyorsunuz. Ne yapmalısınız?',
							options: [
								{
									id: 'a',
									text: 'Taslağı olduğu gibi bütün alıcılara göndermek',
									feedback: 'İç bütçe bilgisi dış alıcılara gitmemelidir.',
								},
								{
									id: 'b',
									text: 'Alıcı listesini ve içeriği gözden geçirip iç bilgileri dış alıcılara giden metinden çıkarmak',
									correct: true,
									feedback: 'Doğru. Kime neyin gideceğine siz karar verirsiniz.',
								},
								{
									id: 'c',
									text: 'Bütçe bilgisini kalın yazıp vurgulamak',
									feedback: 'Bu, iç bilgiyi daha da görünür kılar.',
								},
							],
							explanation:
								'Copilot taslağı hazırlar; **alıcıları ve içeriği** onaylamak sizin sorumluluğunuzdadır.',
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
							id: 'outlook-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Yanıt taslağında zincirde hiç konuşulmamış bir indirim teklifi var. Ne yapmalısınız?',
									options: [
										{ id: 'a', text: 'Müşteri memnun olacağı için bırakmak' },
										{
											id: 'b',
											text: 'Taslaktan çıkarmak; böyle bir teklif yapılacaksa önce yetkili kişilerle karar vermek',
										},
										{ id: 'c', text: 'Taslağı silip Copilot’ı bir daha kullanmamak' },
									],
									correct: 'b',
									explanation:
										'Taahhütler ve ticari teklifler yetki ve onay gerektirir; Copilot’ın önerisi bu kararın yerini tutmaz.',
								},
								{
									id: 'q2',
									prompt: 'Aynı bilgiyi resmî ve samimi tonda yazdırdığınızda ne değişmemelidir?',
									options: [
										{ id: 'a', text: 'Kelime seçimi' },
										{ id: 'b', text: 'Cümle uzunluğu' },
										{ id: 'c', text: 'Tarihler, rakamlar ve verilen taahhütler' },
									],
									correct: 'c',
									explanation: 'Ton bir üslup tercihidir; içerik ve taahhütler aynı kalmalıdır.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Yanıt taslağı isterken **kime, ana mesaj, sonraki adımlar ve ton** bilgisini verin.',
				'Ton değişebilir; **tarih, rakam ve taahhütler** değişmemelidir.',
				'Yalnızca sonuca odaklanan prompt’lar (“ikna et”) verilmemiş sözler üretebilir.',
				'Copilot taslak hazırlar; **göndermek, alıcıları ve içeriği onaylamak** sizin kararınızdır.',
			],
		},
	],
}

export default outlook
