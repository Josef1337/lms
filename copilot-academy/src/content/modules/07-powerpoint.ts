import type { Module } from '@/types/content'

const powerpoint: Module = {
	id: 'powerpoint',
	number: 7,
	title: 'Microsoft PowerPoint ile Copilot',
	navLabel: 'PowerPoint',
	tagline: 'Rapordan etkileyici bir hikâyeye',
	description:
		'Bir dokümandan sunum taslağı oluşturmayı, hedef kitleyi belirlemeyi, hikâye akışı tasarlamayı, slayt başlıkları ve konuşmacı notları üretmeyi, sunumu kısaltıp iyileştirmeyi ve mesaj netliğini sağlamayı öğrenin.',
	visual: 'powerpoint',
	skills: ['apps', 'prompting', 'verify'],
	objectives: [
		'Sunumun hedef kitlesini ve ana mesajını belirlemek',
		'Bir rapordan hikâye akışı kurmak',
		'Slayt başlıklarını, görsel önerilerini ve konuşmacı notlarını değerlendirmek',
		'Sunumu kısaltmak ve mesajı netleştirmek',
	],
	availability:
		'PowerPoint’teki Copilot özellikleri (dosyadan sunum oluşturma, slayt ekleme, özetleme, düzenleme) uygulama sürümüne, lisansınıza ve yönetici ayarlarına bağlıdır. Bir dosyadan sunum oluşturmak için dosyanın OneDrive veya SharePoint’te bulunması gerekebilir. Bu modüldeki stüdyo gerçek bir PowerPoint dosyası üretmez.',
	lessons: [
		{
			id: 'ppt-1',
			title: 'Hedef kitle ve hikâye akışı',
			summary:
				'Kimin dinleyeceğini ve ne karar vereceğini belirleyin; mesaj taşıyan başlıklarla akış kurun.',
			minutes: 14,
			objectives: [
				'Hedef kitleye göre sunumun amacını belirlemek',
				'Etkili bir hikâye akışı kurmak',
				'Mesaj taşıyan slayt başlıkları yazmak',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'İyi bir sunum bir hikâye anlatır',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Copilot birkaç saniyede slayt üretebilir; ama hangi hikâyenin anlatılacağına siz karar verirsiniz. Önce üç soruyu yanıtlayın: **Kim dinleyecek? Ne karar verecek? Ana mesaj tek cümleyle ne?**',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'users',
									title: 'Hedef kitle',
									body: 'Yönetim, ekip veya müşteri: her biri farklı ayrıntı düzeyi ve dil ister.',
								},
								{
									icon: 'target',
									title: 'Ana mesaj',
									body: 'Sunumun sonunda dinleyicinin aklında kalması gereken tek cümle.',
								},
								{
									icon: 'route',
									title: 'Hikâye akışı',
									body: 'Durum → sorun veya fırsat → öneri → sonraki adım. Her slayt bir öncekini taşır.',
								},
								{
									icon: 'quote',
									title: 'Mesaj taşıyan başlık',
									body: '“Satışlar” yerine “Satışlar hedefi %3 aştı; büyüme kurumsal segmentten geldi”.',
								},
								{
									icon: 'presentation',
									title: 'Görsel hiyerarşi',
									body: 'Her slaytta tek odak: güçlü başlık, az madde, destekleyici görsel.',
								},
								{
									icon: 'pen',
									title: 'Konuşmacı notları',
									body: 'Slayttaki kısa maddeleri sözlü anlatıma dönüştüren notlar.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'PowerPoint’teki Copilot özellikleri sürüme, lisansa ve yönetici ayarlarına göre farklılık gösterebilir; menü adları zaman içinde değişebilir.',
						},
					],
					aside: [
						{
							tone: 'example',
							title: 'Başlık testi',
							body: 'Yalnızca slayt başlıklarını okuyarak sunumun hikâyesi anlaşılıyor mu? Anlaşılıyorsa başlıklarınız mesaj taşıyor demektir.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Konu başlığı mı, mesaj başlığı mı?',
					blocks: [
						{
							type: 'beforeAfter',
							before: { label: 'Konu başlığı', text: 'Q3 Müşteri Memnuniyeti' },
							after: {
								label: 'Mesaj başlığı',
								text: 'Müşteri memnuniyeti 4,3’ten 3,9’a düştü; en büyük neden destek hızı',
							},
							notes: [
								'Dinleyici sonucu başlıktan okur.',
								'Rakam ve neden birlikte verilir.',
								'Slayt içeriği başlığı destekler.',
							],
						},
						{
							type: 'chat',
							surface: 'powerpoint',
							title: 'PowerPoint · Copilot',
							messages: [
								{
									role: 'user',
									text: 'Bu sunumdaki slayt başlıklarını, her biri tek bir mesaj taşıyacak şekilde yeniden yaz.',
								},
								{
									role: 'copilot',
									heading: 'Önerilen başlıklar',
									bullets: [
										'1. Müşteri kaybı bir çeyrekte %8’den %11’e çıktı',
										'2. Destek yanıt süresi 14 saate yükseldi; hedef 8 saat',
										'3. Yenileme dönemindeki KOBİ müşterileri en büyük risk',
										'4. Öneri: destek ekibine iki uzman ve proaktif yenileme aramaları',
										'5. Bu ay karar: yenileme kampanyası bütçesinin onayı',
									],
									note: 'Örnek yanıt; rakamlar Modül 1’deki kurgusal rapordan alınmıştır.',
								},
							],
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Başlıklar sırayla bir hikâye anlatıyor',
							body: 'Önerilen başlıkları alt alta okuyun: durum, neden, risk, öneri ve karar. Ayrıntıyı slayt içeriği ve konuşmacı notları taşır.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Uzun bir sunumu kısaltmak',
					blocks: [
						{
							type: 'reveal',
							surface: 'powerpoint',
							intro:
								'Elinizde 12 slaytlık bir proje sunumu var ve yönetim size yalnızca 10 dakika ayırdı. Copilot ile sunumu adım adım nasıl daraltabileceğinizi inceleyin.',
							steps: [
								{
									title: 'Ana mesajı bulun',
									body: 'Önce sunumun tek cümlelik ana mesajını netleştirin.',
									prompt: 'Bu sunumun ana mesajını tek cümleyle özetle.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Proje takvimin iki hafta gerisinde; ek bir geliştirici ile Temmuz hedefi korunabilir.',
										],
									},
								},
								{
									title: 'Slayt sayısını azaltın',
									body: 'Ana mesajı taşıyan slaytları seçin, diğerlerini eke taşıyın.',
									prompt:
										'Bu sunumu ana mesajı destekleyen 5 slayta indir; çıkan slaytları “Ek” bölümüne taşı.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'Kalan slaytlar: Durum · Gecikmenin nedeni · Seçenekler · Öneri · Karar.',
											'Eke taşınanlar: ayrıntılı sprint tabloları, ekip yapısı ve teknik mimari (7 slayt).',
										],
									},
								},
								{
									title: 'Konuşmacı notları ekleyin',
									body: 'Slaytlar kısaldıkça sözlü anlatımın önemi artar.',
									prompt: 'Her slayt için en fazla üç cümlelik konuşmacı notu ekle.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'“Seçenekler” slaytı için not: “Üç seçeneği maliyet ve risk açısından karşılaştırdık. Önerimiz ikinci seçenek; çünkü takvimi koruyan tek seçenek bu.”',
										],
									},
								},
								{
									title: 'Gözden geçirin',
									body: 'Eke taşınan slaytlarda kritik bir bilgi kalmadığından ve rakamların doğru olduğundan emin olun. Sunumu baştan sona bir kez prova edin.',
								},
							],
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Akışı kurun, başlığı seçin',
					blocks: [
						{
							type: 'order',
							id: 'ppt-1-akis',
							prompt:
								'Yönetim ekibi için hazırlanan bir öneri sunumunun slaytlarını en etkili hikâye sırasına koyun.',
							items: [
								{ id: 'amac', text: 'Amaç ve genel bakış', hint: 'Amaç slaytı' },
								{ id: 'durum', text: 'Mevcut durum', hint: 'Durum slaytı' },
								{ id: 'bulgu', text: 'Önemli bulgular', hint: 'Bulgular slaytı' },
								{ id: 'risk', text: 'Riskler ve fırsatlar', hint: 'Risk slaytı' },
								{ id: 'oneri', text: 'Öneriler ve sonraki adımlar', hint: 'Öneri slaytı' },
							],
							initial: ['bulgu', 'oneri', 'amac', 'risk', 'durum'],
							explanation:
								'Durumdan bulgulara, oradan risk ve fırsatlara, en sonda öneri ve karara ilerlemek dinleyicinin mantığını izler.',
						},
						{
							type: 'choice',
							id: 'ppt-1-baslik',
							prompt: 'Hangi slayt başlığı en çok mesaj taşır?',
							options: [
								{
									id: 'a',
									text: '“Satış Verileri”',
									feedback: 'Konu başlığı; dinleyiciye sonucu söylemiyor.',
								},
								{ id: 'b', text: '“Bölgesel Analiz”', feedback: 'Hâlâ bir konu başlığı.' },
								{
									id: 'c',
									text: '“Ege hedefi %9,5 aştı; İç Anadolu’da 295 bin ₺ açık var”',
									correct: true,
									feedback: 'Sonuç, rakam ve karşıtlık tek başlıkta veriliyor.',
								},
							],
							explanation: 'Mesaj başlığı, slayttaki **sonucu** söyler; ayrıntıyı içerik taşır.',
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
							id: 'ppt-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Copilot ile sunum oluşturmaya başlamadan önce hangi soruyu yanıtlamak en önemlidir?',
									options: [
										{ id: 'a', text: 'Hangi renk teması kullanılacak?' },
										{
											id: 'b',
											text: 'Sunumu kim dinleyecek ve ondan ne karar vermesi bekleniyor?',
										},
										{ id: 'c', text: 'Kaç animasyon eklenecek?' },
									],
									correct: 'b',
									explanation:
										'Hedef kitle ve beklenen karar, slayt sayısından başlık diline kadar her şeyi belirler.',
								},
								{
									id: 'q2',
									prompt: 'Konuşmacı notlarının amacı nedir?',
									options: [
										{ id: 'a', text: 'Slayttaki metnin aynısını tekrar etmek' },
										{
											id: 'b',
											text: 'Slayttaki kısa maddeleri sözlü anlatıma dönüştürmek ve sunucuya destek olmak',
										},
										{ id: 'c', text: 'Dinleyicilere dağıtılacak raporu oluşturmak' },
									],
									correct: 'b',
									explanation: 'Slayt kısa kalır; ayrıntı ve geçiş cümleleri notlarda yer alır.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Önce **hedef kitle, beklenen karar ve ana mesaj**; sonra slaytlar.',
				'Etkili akış: **amaç → durum → bulgular → riskler ve fırsatlar → öneri**.',
				'Başlıklar konu değil **mesaj** taşımalı.',
				'Uzun sunumu kısaltırken ayrıntıyı eke ve konuşmacı notlarına taşıyın.',
			],
		},
		{
			id: 'ppt-2',
			title: 'Rapordan sunuma: sunum stüdyosu',
			summary: 'Kısa bir iş raporundan üç farklı stilde 5 slaytlık sunum taslağı oluşturun.',
			minutes: 17,
			objectives: [
				'Kısa bir iş raporundan 5 slaytlık sunum taslağı oluşturmak',
				'Sunum stilini hedef kitleye göre seçmek',
				'Slaytları başlık, içerik, görsel ve not açısından değerlendirmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Bir dokümandan sunum oluşturmak',
					blocks: [
						{
							type: 'text',
							body: 'PowerPoint’te Copilot, bir belgeden sunum taslağı oluşturmanıza yardımcı olabilir. İyi bir sonuç için kaynağın yapısı ve prompt’taki yönlendirme belirleyicidir.',
						},
						{
							type: 'list',
							style: 'check',
							items: [
								'Kaynak belgede **net başlıklar** ve bölümler olsun.',
								'Prompt’ta **hedef kitleyi ve slayt sayısını** belirtin.',
								'Neyin öne çıkacağını söyleyin: “Önerilere ayrı bir slayt ayır.”',
								'Oluşan taslaktaki rakamları kaynak belgeyle karşılaştırın.',
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Bu modüldeki stüdyo bir simülasyondur ve gerçek bir PowerPoint dosyası üretmez. Gerçek üründe dosyadan sunum oluşturma özelliği sürüme, lisansa ve dosyanın konumuna bağlı olabilir.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Bir paragraf nasıl slayta dönüşür?',
					blocks: [
						{
							type: 'reveal',
							surface: 'powerpoint',
							intro:
								'Rapordaki tek bir paragrafın, adım adım nasıl bir slayta dönüştüğünü izleyin.',
							steps: [
								{
									title: 'Kaynak paragraf',
									body: '“İade sürecini “zor” bulan müşterilerin tekrar satın alma oranı %22, “kolay” bulanlarınki %41.”',
								},
								{
									title: 'Mesaj taşıyan başlık',
									body: 'Önce sonucu tek cümlede söyleyin.',
									prompt: 'Bu paragraf için mesaj taşıyan bir slayt başlığı öner.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: ['Kolay iade, tekrar satın almayı neredeyse ikiye katlıyor'],
									},
								},
								{
									title: 'Kısa maddeler',
									body: 'Başlığı destekleyen en fazla üç madde.',
									prompt: 'Başlığı destekleyen en fazla üç madde yaz.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: [
											'İadeyi kolay bulanlarda tekrar satın alma: %41',
											'Zor bulanlarda: %22',
											'Fark: 19 puan',
										],
									},
								},
								{
									title: 'Görsel önerisi',
									body: 'Görsel, mesajı desteklemeli; tekrar etmemeli.',
									prompt: 'Bu slayt için bir görsel öner.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: [
											'İki çubuklu karşılaştırma grafiği; %41 çubuğu vurgulu, %22 nötr renkte.',
										],
									},
								},
								{
									title: 'Konuşmacı notu',
									body: 'Notlar, slaytta yazmayan bağlamı ve uyarıları taşır.',
									prompt: 'Bu slayt için 2–3 cümlelik konuşmacı notu yaz.',
									output: {
										label: 'Copilot önerisi (örnek)',
										lines: [
											'Bu fark, iade sürecinin yalnızca maliyet değil gelir konusu da olduğunu gösteriyor.',
											'Not: Bu bir ilişki; tek başına neden-sonuç kanıtı değildir.',
										],
									},
								},
							],
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Sunum stüdyosu',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Kaynak raporu okuyun, bir sunum stili seçin ve taslağı oluşturun. Slaytlar sırayla görünür; her slaytta **başlık, kısa içerik, görsel önerisi ve konuşmacı notunu** inceleyin. Sonra başka bir stil deneyin.',
						},
						{ type: 'interactive', component: 'pptStudio', taskId: 'ppt-2-studyo' },
					],
					aside: [
						{
							tone: 'explain',
							title: 'Aynı rapor, üç farklı sunum',
							body: 'Yönetici sunumu karar ister, veri odaklı sunum ölçüm gösterir, eğitim sunumu ekiplere ne yapacaklarını anlatır. İçerik aynı, vurgu farklıdır.',
						},
						{
							tone: 'tip',
							title: 'Rakamları kontrol edin',
							body: 'Her slayttaki rakamı kaynak raporla karşılaştırın. Raporda olmayan hedefler “belirtilmedi” olarak bırakılmış.',
						},
						{
							tone: 'note',
							title: 'Sarı alanlar',
							body: 'Bazı slaytlarda [iletişim kişisi] gibi yer tutucular var; bunları gerçek sunumda siz doldurursunuz.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Stili seçin ve slaytı kontrol edin',
					blocks: [
						{
							type: 'choice',
							id: 'ppt-2-stil',
							context:
								'Raporu, depo ve müşteri hizmetleri ekiplerine yeni iade sürecini anlatmak için sunacaksınız.',
							prompt: 'Hangi stil en uygundur?',
							options: [
								{
									id: 'a',
									text: 'Yönetici sunumu',
									feedback: 'Karar odaklı ve kısa; ekiplerin günlük işte ne yapacağını anlatmaz.',
								},
								{
									id: 'b',
									text: 'Veri odaklı sunum',
									feedback:
										'Rakamlar önemli, ama ekipler öncelikle ne yapmaları gerektiğini bilmek ister.',
								},
								{
									id: 'c',
									text: 'Eğitim sunumu',
									correct: true,
									feedback:
										'Adım adım anlatım ve “sizin için ne değişiyor?” odağı ekipler için en uygunu.',
								},
							],
							explanation: 'Stil, **dinleyicinin sunumdan sonra ne yapacağına** göre seçilir.',
						},
						{
							type: 'spot',
							id: 'ppt-2-kontrol',
							prompt:
								'Copilot’ın oluşturduğu bir slayttaki maddeleri raporla karşılaştırın. Raporla uyuşmayan satırları işaretleyin.',
							reference: {
								title: 'Rapordaki bilgiler',
								lines: [
									'48.000 siparişin 4.300’ü iade edildi (%9).',
									'İadelerin %60’ı beden veya ölçü uyumsuzluğundan.',
									'Ölçü tablosu olan kategorilerde iade oranı %6.',
									'Çeyrekteki iade kargo maliyeti 1,9 milyon ₺.',
								],
							},
							output: { title: 'Slayt 2 · Mevcut durum', surface: 'powerpoint' },
							lines: [
								{
									id: 'l1',
									text: 'İade oranı %9 (48.000 siparişin 4.300’ü)',
									reason: 'Raporla uyumlu.',
								},
								{
									id: 'l2',
									text: 'İadelerin %60’ı beden veya ölçü uyumsuzluğundan',
									reason: 'Raporla uyumlu.',
								},
								{
									id: 'l3',
									text: 'Ölçü tablosu eklenen kategorilerde iade oranı %2’ye düştü',
									flawed: true,
									reason: 'Raporda oran %6 ve bir “düşüş” değil, mevcut durum olarak veriliyor.',
								},
								{
									id: 'l4',
									text: 'Çeyreklik iade kargo maliyeti 1,9 milyon ₺',
									reason: 'Raporla uyumlu.',
								},
								{
									id: 'l5',
									text: 'Rakiplerin ortalama iade süresi 3 gün',
									flawed: true,
									reason: 'Raporda rakiplere ait bir bilgi yok; bu satır kaynaktan gelmiyor.',
								},
							],
							explanation:
								'Sunum taslaklarında en sık iki hata görülür: **rakamın değişmesi** ve **kaynakta olmayan karşılaştırmaların eklenmesi**.',
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
							id: 'ppt-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Copilot ile oluşturduğunuz sunumda bir rakam kaynak raporla uyuşmuyor. Ne yapmalısınız?',
									options: [
										{ id: 'a', text: 'Görsel olarak daha iyi durduğu için bırakmak' },
										{
											id: 'b',
											text: 'Rakamı rapora göre düzeltmek ve diğer rakamları da kontrol etmek',
										},
										{ id: 'c', text: 'Rakamı silip kimseye söylememek' },
									],
									correct: 'b',
									explanation: 'Bir hata, diğerlerinin de kontrol edilmesi için bir işarettir.',
								},
								{
									id: 'q2',
									prompt:
										'Aynı rapordan yönetim kurulu için sunum hazırlarken hangi yaklaşım doğrudur?',
									options: [
										{ id: 'a', text: 'Bütün ayrıntıları 20 slayta yaymak' },
										{
											id: 'b',
											text: 'Kısa, karar odaklı bir akış kurmak; ayrıntıları eke veya konuşmacı notlarına taşımak',
										},
										{ id: 'c', text: 'Yalnızca grafik kullanmak, başlık yazmamak' },
									],
									correct: 'b',
									explanation: 'Karar vericiler sonucu ve beklenen kararı hızla görmek ister.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Kaynak belgedeki **yapı**, sunum taslağının kalitesini belirler.',
				'Aynı rapor, hedef kitleye göre **yönetici, veri odaklı veya eğitim** sunumuna dönüşebilir.',
				'Her slaytı **başlık, içerik, görsel ve not** açısından gözden geçirin.',
				'Rakamları kaynak raporla karşılaştırın; raporda olmayan bilgiyi çıkarın.',
			],
		},
	],
}

export default powerpoint
