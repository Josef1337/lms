import type { Module } from '@/types/content'

const teams: Module = {
	id: 'teams',
	number: 8,
	title: 'Microsoft Teams ile Copilot',
	navLabel: 'Teams',
	tagline: 'Toplantıdan aksiyona',
	description:
		'Toplantı özetlerini, kararları, aksiyon maddelerini ve açık soruları çıkarmayı; toplantı sonrası takip mesajı hazırlamayı, uzun tartışmaları özetlemeyi ve toplantı içgörülerini düzenlemeyi öğrenin.',
	visual: 'teams',
	skills: ['meetings', 'verify', 'apps'],
	objectives: [
		'Toplantı içeriğinden özet, karar ve aksiyon çıkarmak',
		'Açık soruları ve riskleri belirlemek',
		'Toplantı sonrası takip mesajı hazırlamak',
		'Transkriptte olmayan bilgiyi ayırt etmek ve “Belirtilmedi” ile göstermek',
	],
	availability:
		'Teams’te toplantı özetleri ve toplantı sırasında Copilot’a soru sorma gibi özellikler; lisansa, yönetici ayarlarına ve toplantı koşullarına (ör. transkripsiyonun veya kaydın açık olması, düzenleyicinin ayarları) bağlıdır. Bazı özellikler yalnızca toplantı sırasında veya transkript varsa kullanılabilir.',
	lessons: [
		{
			id: 'teams-1',
			title: 'Toplantı özeti, kararlar ve aksiyonlar',
			summary: 'Bir transkriptten özet, karar, aksiyon ve risk çıkarın; transkriptle doğrulayın.',
			minutes: 17,
			objectives: [
				'Bir toplantı transkriptinden farklı çıktılar istemek',
				'Kararları, ertelenen kararları, aksiyonları ve riskleri ayırmak',
				'Transkriptte olmayan bilgiyi “Belirtilmedi” ile göstermek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Teams’te Copilot neler yapabilir?',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Teams’te Copilot toplantı içeriğini kullanarak ne konuşulduğunu özetleyebilir, kararları ve aksiyon maddelerini çıkarabilir, toplantıya geç katılanlara durumu anlatabilir ve uzun sohbet yazışmalarını özetleyebilir.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'mic',
									title: 'Toplantı sırasında',
									body: '“Şu ana kadar ne konuşuldu?”, “Hangi konularda farklı görüşler var?” gibi sorular.',
								},
								{
									icon: 'file',
									title: 'Toplantıdan sonra',
									body: 'Özet, kararlar, aksiyon maddeleri ve açık sorular.',
								},
								{
									icon: 'messages',
									title: 'Sohbet ve kanallar',
									body: 'Uzun yazışmaların özeti ve kaçırdığınız önemli noktalar.',
								},
								{
									icon: 'listChecks',
									title: 'Aksiyonlar ve sorumlular',
									body: 'Kimin neyi ne zamana yapacağını transkripte göre listeler.',
								},
								{
									icon: 'flag',
									title: 'Riskler ve açık sorular',
									body: 'Belirsiz kalan veya karar bekleyen konuları görünür kılar.',
								},
								{
									icon: 'scan',
									title: 'Doğrulama',
									body: 'Özet, transkriptle karşılaştırılmalıdır; konuşulmayan bilgi özete girmemelidir.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Toplantı özetleri ve toplantıda Copilot kullanımı; lisansa, yönetici ayarlarına ve toplantı koşullarına (ör. transkripsiyon) bağlıdır. Kurumunuzda hangi seçeneklerin açık olduğunu BT ekibinizden öğrenebilirsiniz.',
						},
						{
							type: 'keyPoint',
							body: 'Toplantı özeti, toplantıda **söylenenlerle** sınırlıdır. Konuşulmamış bir karar, sorumlu veya tarih özete girmemelidir; eksikse **“Belirtilmedi”** yazılmalıdır.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Toplantıyı netleştirin',
							body: [
								'Toplantı başında gündemi sözlü olarak paylaşın.',
								'Kararları açıkça söyleyin: “Karar: …”',
								'Aksiyonlarda kişi ve tarih belirtin: “Elif, cuma gününe kadar…”',
							],
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Transkriptten aksiyon çıkarmak',
					blocks: [
						{
							type: 'chat',
							surface: 'teams',
							title: 'Teams · toplantı sonrası Copilot',
							messages: [
								{
									role: 'user',
									text: 'Bu toplantıdaki aksiyon maddelerini sorumlu ve tarihleriyle listele. Belirtilmemişse “Belirtilmedi” yaz.',
								},
								{
									role: 'copilot',
									heading: 'Aksiyon maddeleri',
									bullets: [
										'**Test ortamı erişim talebi:** Onur Çelik · Perşembe',
										'**Demo senaryosu:** Kerem Şahin · Belirtilmedi',
										'**Demo provası:** Belirtilmedi · Belirtilmedi',
										'**Lisans teklifinin takibi:** Belirtilmedi · Belirtilmedi',
									],
									note: 'Örnek yanıt. Üç aksiyonda bilgi eksik; toplantı sahibinin bunları netleştirmesi gerekiyor.',
								},
							],
						},
						{
							type: 'list',
							style: 'check',
							title: 'İyi bir toplantı notunda',
							items: [
								'Kararlar ile öneriler ve ertelenen konular ayrılmıştır.',
								'Her aksiyonun sorumlusu ve tarihi vardır ya da eksikliği belirtilmiştir.',
								'Açık sorular ve riskler ayrı listelenmiştir.',
								'Transkriptte olmayan hiçbir bilgi eklenmemiştir.',
							],
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Toplantı notları laboratuvarı',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Aşağıda 20 dakikalık bir proje toplantısının transkripti ve bir notlar paneli var. Notlar panelinden Copilot’tan istenecek çıktıyı seçin: **toplantı özeti, kararlar, aksiyonlar ve sorumlular, riskler** veya **takip e-postası**. Zaman etiketlerine tıklayarak her bilginin transkriptte nerede geçtiğini görün.',
						},
						{ type: 'interactive', component: 'teamsLab', taskId: 'teams-1-lab' },
					],
					aside: [
						{
							tone: 'explain',
							title: 'Karar ve “ertelendi” farkı',
							body: 'Elif yayın tarihini değiştirmedi; yalnızca riskli olabileceğini söyledi ve kararı ertelemeyi önerdi. İyi bir not bu farkı korur.',
						},
						{
							tone: 'tip',
							title: 'Zaman etiketleri',
							body: 'Kaynak gösteren notlar doğrulamayı kolaylaştırır. Gerçek üründe kaynak gösterimi deneyime göre farklılık gösterebilir.',
						},
						{
							tone: 'note',
							title: 'Gönderim yok',
							body: 'Takip e-postası yalnızca bir taslaktır; bu laboratuvar hiçbir yere gönderim yapmaz.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Uydurma bilgiyi bulun',
					blocks: [
						{
							type: 'spot',
							id: 'teams-1-uydurma',
							prompt:
								'Bir toplantı özetinde transkriptte olmayan bilgiler var. Bu satırları işaretleyin.',
							reference: {
								title: 'Transkriptten önemli satırlar',
								lines: [
									'00:02 Zeynep: Regresyon testlerinin %80’i tamamlandı.',
									'00:06 Elif: Yayın tarihini 1 Temmuz olarak korumak riskli olabilir.',
									'00:08 Onur: Erişim talebini ben açarım, perşembeye kadar takip ederim.',
									'00:12 Elif: Demo, ödeme ekranı olmadan yapılacak.',
									'00:15 Deniz: Lisans teklifi gelmedi.',
									'00:17 Elif: Teklifi kimin takip edeceğini netleştirelim; yayın tarihi kararı bir sonraki toplantıda.',
								],
							},
							output: { title: 'Toplantı özeti', surface: 'teams' },
							lines: [
								{
									id: 'l1',
									text: 'Regresyon testlerinin %80’i tamamlandı.',
									reason: 'Transkriptle uyumlu (00:02).',
								},
								{
									id: 'l2',
									text: 'Ekip yayın tarihini 8 Temmuz’a erteledi.',
									flawed: true,
									reason:
										'Toplantıda yeni bir tarih belirlenmedi; karar bir sonraki toplantıya bırakıldı (00:17).',
								},
								{
									id: 'l3',
									text: 'Müşteri demosu ödeme ekranı olmadan yapılacak.',
									reason: 'Transkriptle uyumlu (00:12).',
								},
								{
									id: 'l4',
									text: 'Lisans teklifini Deniz Yurt takip edecek.',
									flawed: true,
									reason:
										'Teklifi kimin takip edeceği netleşmedi (00:17); Deniz yalnızca teklifin gelmediğini söyledi.',
								},
								{
									id: 'l5',
									text: 'Onur, test ortamı erişim talebini perşembeye kadar takip edecek.',
									reason: 'Transkriptle uyumlu (00:08).',
								},
							],
							explanation:
								'En sık görülen iki hata: **ertelenmiş bir kararı alınmış gibi göstermek** ve **sorumlusu belirsiz bir işi birine atamak**.',
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
							id: 'teams-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Transkriptte “Bir de prova yapalım ama tarihini henüz bilmiyorum” deniyor. Aksiyon listesinde prova tarihi ne olmalı?',
									options: [
										{ id: 'a', text: '20 Haziran' },
										{ id: 'b', text: 'Demodan bir gün önce' },
										{ id: 'c', text: 'Belirtilmedi' },
									],
									correct: 'c',
									explanation:
										'Tarih konuşulmadığı için tahmin edilmemeli; “Belirtilmedi” eksikliği görünür kılar.',
								},
								{
									id: 'q2',
									prompt:
										'“Bu durumda yayın tarihini korumak riskli olabilir” ifadesi özette nasıl yer almalı?',
									options: [
										{ id: 'a', text: 'Yayın tarihi ertelendi.' },
										{
											id: 'b',
											text: 'Yayın tarihi risk altında; karar bir sonraki toplantıya bırakıldı.',
										},
										{ id: 'c', text: 'Hiç yer almamalı.' },
									],
									correct: 'b',
									explanation:
										'Risk ve ertelenen karar doğru biçimde aktarılmalı; ne abartılmalı ne de atlanmalı.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Toplantı özeti **söylenenlerle sınırlıdır**; eksik bilgi “Belirtilmedi” ile gösterilir.',
				'Kararları, **ertelenen kararları**, aksiyonları ve riskleri ayrı listeleyin.',
				'Notlardaki her önemli bilgiyi transkriptle karşılaştırın.',
				'En sık hatalar: ertelenen kararı alınmış gibi göstermek ve sorumlu uydurmak.',
			],
		},
		{
			id: 'teams-2',
			title: 'Toplantı sonrası takip ve uzun tartışmalar',
			summary: 'Takip mesajı hazırlayın, uzun yazışmaları özetleyin, içgörüleri düzenleyin.',
			minutes: 13,
			objectives: [
				'Toplantı sonrası takip mesajı hazırlamak',
				'Uzun bir sohbet yazışmasını özetlemek',
				'Toplantı içgörülerini karar günlüğü ve gündeme dönüştürmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Takip mesajı neden önemli?',
					blocks: [
						{
							type: 'text',
							body: 'Toplantının değeri, sonrasında yapılanlarla ölçülür. Copilot ile hazırlanan bir takip mesajı; kararları, aksiyonları ve açık soruları herkesle aynı biçimde paylaşmanızı sağlar.',
						},
						{
							type: 'list',
							style: 'number',
							items: [
								'**Kısa özet:** Toplantının amacı ve sonucu',
								'**Kararlar:** Neye karar verildi, ne ertelendi?',
								'**Aksiyonlar:** Kim, ne, ne zaman?',
								'**Açık sorular:** Netleşmesi gerekenler ve bir sonraki toplantı',
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							body: 'Takip mesajı birden fazla kişiye gider. Sorumluların ve tarihlerin doğru olduğundan emin olun; yanlış atanmış bir görev ekipte karışıklığa yol açar.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Uzun bir kanal yazışmasını özetlemek',
					blocks: [
						{
							type: 'chat',
							surface: 'teams',
							title: 'Teams · proje kanalı',
							messages: [
								{
									role: 'user',
									text: 'Bu kanalda son iki günde konuşulanları özetle. Bana sorulan soruları ayrıca listele.',
								},
								{
									role: 'copilot',
									heading: 'Son iki gün',
									bullets: [
										'Müşteri, demo tarihini 20 Haziran’dan 21 Haziran’a almak istedi; ekip bunu uygun buldu.',
										'Test ortamındaki erişim sorunu çözüldü; Zeynep doğrulama testlerini tamamladı.',
										'Lisans maliyeti konusu hâlâ açık; finans ekibinin yanıtı bekleniyor.',
									],
								},
								{
									role: 'copilot',
									heading: 'Size sorulan sorular',
									bullets: [
										'Kerem: “Demo senaryosunu perşembeye kadar paylaşabilir misin?”',
										'Selin: “Müşteriye yeni tarihi kim bildirecek?”',
									],
									note: 'Örnek yanıt; kanal ve kişiler kurgusaldır.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'tip',
							body: '“Bana sorulan sorular” gibi kişisel bir filtre, uzun yazışmalarda sizden beklenenleri kaçırmamanızı sağlar.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Toplantı içgörülerini düzenlemek',
					blocks: [
						{
							type: 'reveal',
							surface: 'teams',
							intro:
								'Birkaç toplantının notları biriktiğinde Copilot, tekrar eden konuları ve kararları düzenlemenize yardımcı olabilir. Adımları izleyin.',
							steps: [
								{
									title: 'Tekrar eden konular',
									body: 'Birden fazla toplantıda açık kalan konular, gerçek darboğazlarınızdır.',
									prompt: 'Son üç proje toplantısının notlarında tekrar eden riskleri listele.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Lisans maliyeti üç toplantıda da açık kaldı.',
											'Test ortamı erişimi iki toplantıda gecikme nedeni olarak geçti.',
										],
									},
								},
								{
									title: 'Karar günlüğü',
									body: 'Kararları tek yerde toplamak, “bunu neden yapmıştık?” sorusunu yanıtlar.',
									prompt:
										'Bu toplantılarda alınan kararları tarih sırasıyla bir karar günlüğü tablosuna dönüştür.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'5 Haziran · Test kapsamına mobil bildirimler eklendi.',
											'12 Haziran · Demo ödeme ekranı olmadan yapılacak.',
										],
									},
								},
								{
									title: 'Gündem önerisi',
									body: 'Açık konular bir sonraki toplantının gündemini belirler.',
									prompt:
										'Açık konulara göre bir sonraki toplantı için 30 dakikalık bir gündem öner.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'1. Lisans maliyeti teklifi ve takip sorumlusu (10 dk · karar)',
											'2. Yayın tarihi: banka dokümanının durumu (10 dk · karar)',
											'3. Demo provası geri bildirimi (10 dk)',
										],
									},
								},
								{
									title: 'Kontrol edin',
									body: 'Karar günlüğündeki her kaydı ilgili toplantı notuyla karşılaştırın. Gündemi paylaşmadan önce süreleri ve sorumluları siz belirleyin.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Birden fazla toplantının notlarına birlikte erişim, lisansınıza, toplantı ayarlarına ve erişim izinlerinize bağlıdır.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Takip e-postasını düzenleyin',
					blocks: [
						{
							type: 'order',
							id: 'teams-2-takip',
							prompt: 'Toplantı sonrası takip e-postasının bölümlerini en okunaklı sıraya koyun.',
							items: [
								{ id: 'ozet', text: 'Kısa özet ve toplantının sonucu', hint: 'Özet bölümü' },
								{ id: 'karar', text: 'Alınan ve ertelenen kararlar', hint: 'Kararlar bölümü' },
								{ id: 'aksiyon', text: 'Aksiyonlar: kim, ne, ne zaman', hint: 'Aksiyonlar bölümü' },
								{ id: 'soru', text: 'Açık sorular', hint: 'Açık sorular bölümü' },
								{ id: 'kapanis', text: 'Bir sonraki toplantı ve kapanış', hint: 'Kapanış bölümü' },
							],
							initial: ['aksiyon', 'kapanis', 'ozet', 'soru', 'karar'],
							explanation:
								'Okuyucu önce sonucu ve kararları, sonra kendisinden beklenenleri görmek ister; açık sorular ve kapanış en sonda yer alır.',
						},
						{
							type: 'choice',
							id: 'teams-2-alici',
							context:
								'Toplantıda ekip, müşteriye sunulacak fiyat teklifini ve şirket içi maliyet hesaplarını konuştu. Copilot’ın hazırladığı takip e-postası bu iç hesapları da içeriyor.',
							prompt: 'E-postayı müşteriye de göndermek istiyorsunuz. Ne yapmalısınız?',
							options: [
								{
									id: 'a',
									text: 'E-postayı olduğu gibi müşteriyle paylaşmak',
									feedback: 'İç maliyet bilgileri müşteriyle paylaşılmamalıdır.',
								},
								{
									id: 'b',
									text: 'Müşteriye giden sürümden iç maliyet ve fiyat tartışmalarını çıkarmak; ekip için ayrı bir sürüm hazırlamak',
									correct: true,
									feedback: 'Doğru. Alıcıya göre içerik ayrıştırılmalıdır.',
								},
								{
									id: 'c',
									text: 'İç hesapları kalın yazarak vurgulamak',
									feedback: 'Bu, gizli bilgiyi daha görünür kılar.',
								},
							],
							explanation:
								'Copilot taslağı hazırlar; **kimin neyi göreceğine** siz karar verirsiniz.',
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
							id: 'teams-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Teams’teki toplantı özeti özellikleri hakkında hangisi doğrudur?',
									options: [
										{ id: 'a', text: 'Her toplantıda her zaman otomatik olarak açıktır.' },
										{
											id: 'b',
											text: 'Lisansa, yönetici ayarlarına ve toplantı koşullarına (ör. transkripsiyon) bağlıdır.',
										},
										{ id: 'c', text: 'Yalnızca dış katılımcı olduğunda çalışır.' },
									],
									correct: 'b',
									explanation:
										'Kullanılabilirlik kurumdan kuruma ve toplantıdan toplantıya değişebilir.',
								},
								{
									id: 'q2',
									prompt: 'Takip e-postasında bir aksiyonun tarihi belirtilmemişse ne yapılmalı?',
									options: [
										{ id: 'a', text: 'Makul bir tarih yazmak' },
										{ id: 'b', text: '“Tarih: Belirtilmedi” yazıp ilgili kişiden teyit istemek' },
										{ id: 'c', text: 'Aksiyonu e-postadan çıkarmak' },
									],
									correct: 'b',
									explanation:
										'Eksik bilgiyi görünür kılmak, onu uydurmaktan da gizlemekten de iyidir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Takip mesajı: **özet → kararlar → aksiyonlar → açık sorular → kapanış**.',
				'Uzun yazışmalarda “bana sorulan sorular” gibi odaklı istekler kullanın.',
				'Birikmiş notlardan **tekrar eden konular, karar günlüğü ve gündem** çıkarılabilir.',
				'İçeriği alıcıya göre ayrıştırın; iç bilgiler dış alıcılara gitmemelidir.',
			],
		},
	],
}

export default teams
