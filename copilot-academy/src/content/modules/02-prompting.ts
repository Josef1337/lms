import type { Module } from '@/types/content'

const prompting: Module = {
	id: 'prompt-atolyesi',
	number: 2,
	title: 'İyi Prompt Yazma Atölyesi',
	navLabel: 'Prompt Yazma Atölyesi',
	tagline: 'Net talimat, işe yarar sonuç',
	description:
		'Eğitimin merkezindeki bu atölyede amaç, bağlam, kaynak, beklenti ve kısıtlardan oluşan pratik bir başlangıç modeliyle etkili prompt yazmayı öğrenecek; Prompt Builder ile kendi prompt’larınızı oluşturacak ve zayıf prompt’ları güçlendireceksiniz.',
	visual: 'prompt',
	skills: ['prompting', 'verify'],
	objectives: [
		'İyi bir prompt’un beş bileşenini tanımak',
		'Prompt Builder ile okunabilir ve eksiksiz prompt’lar oluşturmak',
		'Zayıf bir prompt’taki eksikleri bulup gidermek',
		'Çıktıyı doğrulamak ve takip prompt’larıyla iyileştirmek',
	],
	lessons: [
		{
			id: 'prompt-1',
			title: 'İyi bir prompt’un beş bileşeni',
			summary: 'Amaç, bağlam, kaynak, beklenti ve kısıtlar: pratik bir başlangıç modeli.',
			minutes: 12,
			objectives: [
				'Beş bileşeni tanımlamak',
				'Bir prompt’taki bileşenleri ayırt etmek',
				'Eksik veya belirsiz bileşenleri fark etmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Pratik bir başlangıç modeli',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Copilot aklınızdan geçeni bilemez; yalnızca yazdığınızı bilir. İyi bir prompt, bir meslektaşınıza iş verirken söyleyeceklerinizi içerir: ne istediğinizi, neden istediğinizi, nelere dayanması gerektiğini ve sonucun nasıl görünmesi gerektiğini.',
						},
						{
							type: 'concepts',
							columns: 3,
							items: [
								{
									icon: 'target',
									title: '1. Amaç',
									body: '**Ne yapılmasını istiyorum?** Görevi açık bir fiille yazın: özetle, karşılaştır, taslak hazırla.',
									detail:
										'Zayıf: “Rapor.” Güçlü: “Son çeyrek satış performansını değerlendiren bir rapor hazırla.”',
								},
								{
									icon: 'compass',
									title: '2. Bağlam',
									body: '**Hangi bilgiler gerekli?** Durumu, nedeni ve arka planı anlatın.',
									detail:
										'Örnek: “Rapor, yönetim toplantısında bir sonraki çeyreğin hedeflerini belirlemek için kullanılacak.”',
								},
								{
									icon: 'file',
									title: '3. Kaynak',
									body: '**Hangi dosya, belge veya bilgiler kullanılmalı?** Copilot’ı doğru içeriğe yönlendirin.',
									detail:
										'Örnek: “Ekteki Q3 satış tablosunu kullan.” Kaynak belirtmezseniz Copilot genel bilgiye veya erişebildiği başka içeriklere dayanabilir.',
								},
								{
									icon: 'listChecks',
									title: '4. Beklenti',
									body: '**Nasıl bir çıktı istiyorum?** Biçimi, bölümleri ve uzunluğu tarif edin.',
									detail:
										'Örnek: “En önemli üç bulguyu, sapmaları ve önerileri ayrı başlıklarla sun.”',
								},
								{
									icon: 'filter',
									title: '5. Kısıtlar',
									body: '**Ton, uzunluk, hedef kitle veya format nedir?** Sınırları belirleyin.',
									detail:
										'Örnek: “Satış yöneticisi için, profesyonel bir dille, en fazla bir sayfa. Veride olmayan sonuçları varsayma.”',
								},
							],
						},
						{
							type: 'callout',
							tone: 'info',
							title: 'Bir kural değil, bir kontrol listesi',
							body: 'Her prompt’ta beş bileşenin hepsi gerekmez; kısa bir soru için amaç yeterli olabilir. Bu model, önemli işlerde bir şeyi unutmamak için kullanabileceğiniz pratik bir başlangıç noktasıdır.',
						},
					],
					aside: [
						{
							tone: 'example',
							title: 'Meslektaş testi',
							body: 'Prompt’unuzu, işi hiç bilmeyen yeni bir meslektaşa verdiğinizi düşünün. Ek soru sormadan işe başlayabiliyor mu? Başlayamıyorsa muhtemelen bir bileşen eksik.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Bileşenleri bir prompt üzerinde görün',
					blocks: [
						{
							type: 'text',
							body: 'Aşağıdaki prompt’ta her bileşen farklı renkle işaretlendi. Üstteki etiketlere tıklayarak bileşenleri tek tek vurgulayın.',
						},
						{
							type: 'promptAnatomy',
							caption:
								'Bileşenlerin sırası önemli değildir; önemli olan her birinin açıkça yazılmış olmasıdır.',
							segments: [
								{
									text: 'Son çeyrek satış performansını değerlendiren kısa bir rapor hazırla.',
									part: 'goal',
								},
								{ text: ' ' },
								{
									text: 'Rapor, gelecek haftaki bütçe toplantısında hedefleri güncellemek için kullanılacak.',
									part: 'context',
								},
								{ text: ' ' },
								{ text: 'Ekteki “Q3 Satış Sonuçları” tablosunu temel al.', part: 'source' },
								{ text: ' ' },
								{
									text: 'En önemli üç bulguyu, hedeflerden sapmaları ve uygulanabilir önerileri ayrı başlıklarla sun.',
									part: 'expectation',
								},
								{ text: ' ' },
								{
									text: 'Satış ekibinin yöneticisine hitap eden profesyonel bir dil kullan ve bir sayfayı geçme. Veride bulunmayan sonuçları varsayma; eksik bilgileri belirt.',
									part: 'constraints',
								},
							],
						},
						{
							type: 'list',
							style: 'cross',
							title: 'Bir bileşen çıkarıldığında ne olur?',
							items: [
								'**Amaç olmadan:** Copilot ne üreteceğini tahmin etmek zorunda kalır.',
								'**Bağlam olmadan:** Raporun kime ve neden yazıldığı bilinmez; sonuç genel kalır.',
								'**Kaynak olmadan:** Hangi rakamlara dayandığı belirsizleşir.',
								'**Beklenti olmadan:** Uzunluk ve yapı rastgele olur.',
								'**Kısıtlar olmadan:** Ton, uzunluk ve doğrulama talimatı eksik kalır.',
							],
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Renkleri hatırlayın',
							body: 'Prompt Builder’da da aynı renkleri göreceksiniz: mavi amaç, mor bağlam, turkuaz kaynak, amber beklenti, pembe kısıtlar.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Prompt merdiveni: bileşen ekledikçe ne değişir?',
					blocks: [
						{
							type: 'reveal',
							surface: 'copilot',
							intro:
								'Aynı isteği adım adım güçlendirelim. Her adımda prompt’a bir bileşen ekleniyor; olası sonucun nasıl değiştiğine bakın.',
							steps: [
								{
									title: 'Başlangıç: yalnızca bir istek',
									body: 'Copilot neyi, kimin için ve hangi veriye dayanarak yazacağını tahmin etmek zorunda.',
									prompt: 'Bir rapor hazırla.',
									output: {
										label: 'Olası sonuç',
										lines: [
											'Konusu belirsiz, genel bir rapor şablonu.',
											'Gerçek verinize dayanmayan örnek rakamlar içerebilir.',
										],
									},
								},
								{
									title: '+ Amaç',
									body: 'Görev netleşir: hangi konuda ne yapılacağı belli olur.',
									prompt: 'Son çeyrek satış performansını değerlendiren bir rapor hazırla.',
									output: {
										label: 'Olası sonuç',
										lines: [
											'Konu doğru; ancak hedef kitle ve uzunluk belirsiz.',
											'Hangi verilere dayandığı hâlâ belli değil.',
										],
									},
								},
								{
									title: '+ Bağlam ve kaynak',
									body: 'Copilot neden yazdığını ve neye dayanacağını bilir.',
									prompt:
										'Son çeyrek satış performansını değerlendiren bir rapor hazırla. Rapor, yönetim toplantısında hedefleri güncellemek için kullanılacak. Ekteki Q3 satış tablosunu temel al.',
									output: {
										label: 'Olası sonuç',
										lines: [
											'Rakamlar sizin tablonuzdan gelir.',
											'Toplantının amacına uygun bir odak oluşur.',
										],
									},
								},
								{
									title: '+ Beklenti ve kısıtlar',
									body: 'Çıktının biçimi, tonu ve sınırları belirlenir.',
									prompt:
										'… En önemli üç bulguyu, sapmaları ve önerileri ayrı başlıklarla sun. Satış yöneticisi için profesyonel bir dil kullan, bir sayfayı geçme; veride olmayan sonuçları varsayma.',
									output: {
										label: 'Olası sonuç',
										lines: [
											'Doğrudan kullanılabilir bir yapı ve uzunluk.',
											'Eksik bilgiler uydurulmak yerine belirtilir.',
											'Yine de rakamları kaynakla karşılaştırmanız gerekir.',
										],
									},
								},
							],
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Uzunluk değil, somutluk',
							body: 'Prompt uzadıkça daha iyi olmaz; **somutlaştıkça** daha iyi olur. Her ekleme, Copilot’ın tahmin etmesi gereken bir belirsizliği ortadan kaldırmalı.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Eksik bileşenleri bulun',
					blocks: [
						{
							type: 'choice',
							id: 'prompt-1-eksik',
							multiple: true,
							prompt:
								'Bir meslektaşınız Copilot’a şunu yazmış: **“Müşteriye bir e-posta yaz, toplantıyı ertelememiz gerekiyor.”** Bu prompt’ta hangi bileşenler eksik veya belirsiz?',
							options: [
								{
									id: 'amac',
									text: 'Amaç',
									feedback:
										'Amaç var: bir e-posta yazılması isteniyor. Daha ayrıntılı olabilir ama bu bileşen eksik sayılmaz.',
								},
								{
									id: 'baglam',
									text: 'Bağlam',
									correct: true,
									feedback:
										'Eksik. Toplantı neden erteleniyor, yeni tarih ne, müşteriyle ilişki nasıl? Copilot bunları bilmeden genel bir metin yazar.',
								},
								{
									id: 'kaynak',
									text: 'Kaynak',
									correct: true,
									feedback:
										'Eksik. Önceki yazışma veya toplantı daveti belirtilmemiş; Copilot doğru tarih ve kişi bilgisine dayanamaz.',
								},
								{
									id: 'beklenti',
									text: 'Beklenti',
									correct: true,
									feedback:
										'Eksik. E-postanın uzunluğu ve bölümleri (özür, yeni tarih önerisi, kapanış) tarif edilmemiş.',
								},
								{
									id: 'kisit',
									text: 'Kısıtlar',
									correct: true,
									feedback:
										'Eksik. Ton (resmî mi, samimi mi?), uzunluk ve kime hitap edileceği tanımlı değil.',
								},
							],
							explanation:
								'Prompt’ta yalnızca amaç var. Daha güçlü bir sürüm: **“Müşterimiz Ayşe Hanım’a, 14 Mart’taki proje toplantısını ekip içi bir planlama çakışması nedeniyle ertelemek istediğimizi bildiren kısa bir e-posta yaz. Son yazışmamızdaki toplantı bilgilerini kullan. Nazik ve profesyonel bir dil kullan, özür dile, iki alternatif tarih öner ve 120 kelimeyi geçme.”**',
						},
						{
							type: 'choice',
							id: 'prompt-1-beklenti',
							prompt: 'Aşağıdaki ifadelerden hangisi **beklenti** bileşenini en iyi tanımlıyor?',
							options: [
								{
									id: 'a',
									text: '“Bu konuda bir şeyler yaz.”',
									feedback: 'Ne amaç ne de beklenti tanımlanmış.',
								},
								{
									id: 'b',
									text: '“Sonucu üç başlık altında, her başlıkta en fazla üç maddeyle ve sonunda tek cümlelik bir öneriyle sun.”',
									correct: true,
									feedback: 'Biçim, yapı ve uzunluk net. Bu bir beklenti tanımıdır.',
								},
								{
									id: 'c',
									text: '“Bunu yöneticim için hazırla.”',
									feedback:
										'Bu ifade hedef kitleyi (kısıt) belirtir ama çıktının nasıl görüneceğini anlatmaz.',
								},
							],
							explanation:
								'Beklenti, çıktının **biçimini** tarif eder: liste mi, tablo mu, kaç başlık, ne uzunlukta?',
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Neden “belirsiz” de eksiktir?',
							body: 'Copilot belirsiz noktaları kendi tahminiyle doldurur. Tahmin bazen doğru çıkar; ancak önemli işlerde tahmine bırakmak, düzeltmeye daha çok zaman ayırmak demektir.',
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
							id: 'prompt-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Aşağıdakilerden hangisi bir **kaynak** bileşenidir?',
									options: [
										{ id: 'a', text: '“Kısa ve net yaz.”' },
										{
											id: 'b',
											text: '“Ekteki 2025 bütçe dosyasını ve son toplantı notlarını kullan.”',
										},
										{ id: 'c', text: '“Yeni çalışanlar için.”' },
									],
									correct: 'b',
									explanation:
										'Kaynak, Copilot’ın dayanması gereken dosya, belge veya bilgiyi belirtir. “Kısa ve net” bir kısıt, “yeni çalışanlar için” ise hedef kitledir.',
								},
								{
									id: 'q2',
									prompt: 'Beş bileşen modeli için hangisi doğrudur?',
									options: [
										{ id: 'a', text: 'Her prompt’ta beş bileşen de zorunludur.' },
										{
											id: 'b',
											text: 'Önemli işlerde eksik bir şey bırakmamak için kullanılan pratik bir başlangıç modelidir.',
										},
										{ id: 'c', text: 'Yalnızca Word’de geçerlidir.' },
									],
									correct: 'b',
									explanation:
										'Model bir kontrol listesidir; kısa sorularda bazı bileşenleri atlamak doğaldır.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'İyi bir prompt; **amaç, bağlam, kaynak, beklenti ve kısıtlar** sorularını yanıtlar.',
				'Bu model mutlak bir kural değil, önemli işlerde eksik bırakmamak için bir **kontrol listesidir**.',
				'Belirsiz bıraktığınız her nokta Copilot’ın tahminine kalır.',
				'**Meslektaş testi:** Prompt’u alan biri ek soru sormadan işe başlayabilmeli.',
			],
		},
		{
			id: 'prompt-2',
			title: 'Prompt Builder ile prompt oluşturun',
			summary: 'Alanları doldurun, ipuçlarını izleyin ve okunabilir bir Türkçe prompt oluşturun.',
			minutes: 15,
			objectives: [
				'Prompt Builder ile adım adım prompt oluşturmak',
				'İpuçlarını kullanarak eksik bilgiyi tamamlamak',
				'Oluşturulan prompt’u kopyalayıp kullanıma hazırlamak',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Prompt Builder nasıl çalışır?',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Prompt Builder, beş bileşeni sırayla düşünmenizi sağlayan bir çalışma alanıdır. Alanları doldurdukça okunabilir bir Türkçe prompt oluşur ve her cümle ait olduğu bileşenin rengini taşır.',
						},
						{
							type: 'list',
							style: 'number',
							items: [
								'**Görev** alanına ne yapılmasını istediğinizi yazın (amaç).',
								'**Bağlam** ve **hedef kitle** ile durumu ve okuyucuyu tarif edin.',
								'**Kaynak** alanında hangi dosya veya bilgiye dayanılacağını belirtin.',
								'**Çıktı formatı**, **ton** ve **ek kısıtlarla** sonucun nasıl görüneceğini tanımlayın.',
								'İpuçlarını okuyun, prompt’u kopyalayın ve Copilot’a yapıştırın.',
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							title: 'Örnek bilgilerle çalışın',
							body: 'Prompt Builder’a gerçek müşteri adı, kişisel veri veya gizli bilgi yazmayın. Bu eğitim ortamı yazdıklarınızı kaydetmez; yine de iyi bir alışkanlık olarak örnek bilgiler kullanın.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Örneklerle başlayın',
							body: 'İlk kez kullanıyorsanız “Örnek yükle” ile hazır bir prompt’u inceleyin, ardından alanları kendi işinize göre değiştirin.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Alanlar nasıl prompt’a dönüşür?',
					blocks: [
						{
							type: 'text',
							body: 'Aşağıdaki prompt, Prompt Builder’daki “Proje gecikmesi e-postası” örneğinden oluşturuldu. Her alan bir cümleye dönüşür ve ait olduğu bileşenin rengini taşır.',
						},
						{
							type: 'promptAnatomy',
							caption:
								'Hedef kitle, ton ve ek kısıtlar aynı bileşene (kısıtlar) aittir; bu yüzden aynı renkte görünürler.',
							segments: [
								{
									text: 'Müşteriye proje teslim tarihindeki değişikliği bildiren bir e-posta taslağı yaz.',
									part: 'goal',
								},
								{ text: ' ' },
								{
									text: 'Bağlam: entegrasyon testlerinde bulunan iki kritik hata nedeniyle teslim iki hafta ertelendi.',
									part: 'context',
								},
								{ text: ' ' },
								{ text: 'Hedef kitle: müşteri tarafındaki proje sponsoru.', part: 'constraints' },
								{ text: ' ' },
								{
									text: 'Kaynak olarak şunu kullan: son proje durum raporu ve 12 Mayıs toplantı notları.',
									part: 'source',
								},
								{ text: ' ' },
								{
									text: 'Çıktıyı şu biçimde sun: kısa bir giriş, gecikmenin nedeni, yeni takvim ve bir sonraki adımlar.',
									part: 'expectation',
								},
								{ text: ' ' },
								{
									text: 'Ton: şeffaf, sakin ve çözüm odaklı. Ayrıca şu kısıtlara uy: 150 kelimeyi geçmesin; suçlayıcı ifadeler kullanma.',
									part: 'constraints',
								},
							],
						},
						{
							type: 'list',
							style: 'bullet',
							title: 'Alan → cümle',
							items: [
								'**Görev** → ilk cümle (amaç)',
								'**Bağlam** → “Bağlam: …”',
								'**Kaynak** → “Kaynak olarak şunu kullan: …”',
								'**Çıktı formatı** → “Çıktıyı şu biçimde sun: …”',
								'**Hedef kitle, ton, ek kısıtlar** → kısıt cümleleri',
							],
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Neden etiketli cümleler?',
							body: '“Bağlam: …”, “Ton: …” gibi etiketler prompt’u hem sizin hem Copilot’ın okumasını kolaylaştırır; her bilginin ne işe yaradığı açıkça görünür.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Prompt Builder’ı deneyin',
					wide: true,
					blocks: [{ type: 'interactive', component: 'promptBuilder' }],
					aside: [
						{
							tone: 'explain',
							title: 'Kapsam göstergesi',
							body: 'Gösterge, prompt’unuzun kaç bileşeni kapsadığını sayar. Bir yazım kalitesi puanı değildir; içeriğin doğruluğuna ve uygunluğuna siz karar verirsiniz.',
						},
						{
							tone: 'tip',
							title: 'İpuçlarını sırayla izleyin',
							body: 'İpuçları en kritik eksikten başlar: önce görev, sonra bağlam, kaynak ve beklenti. “Alana git” ile ilgili alana atlayabilirsiniz.',
						},
						{
							tone: 'note',
							title: 'Kopyalama',
							body: '“Prompt’u kopyala” düğmesi metni panonuza kopyalar. Tarayıcınız izin vermezse metni seçip elle kopyalayabilirsiniz.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Kendi prompt’unuzu oluşturun',
					wide: true,
					blocks: [
						{
							type: 'interactive',
							component: 'promptBuilder',
							taskId: 'prompt-2-builder',
							props: {
								scenario:
									'Ekibiniz önümüzdeki ay yeni bir proje yönetim aracına geçiyor. Copilot’tan, çalışanlara geçişi duyuran ve ilk adımları anlatan bir e-posta taslağı isteyeceksiniz. Alanları bu senaryoya göre doldurun; en az dört bileşeni kapsayın.',
							},
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Senaryo için ipucu',
							body: [
								'**Bağlam:** Geçiş tarihi ve nedeni.',
								'**Kaynak:** Örneğin “geçiş planı belgesi”.',
								'**Beklenti:** Duyuru, ilk adımlar, destek kanalı.',
							],
						},
						{
							tone: 'note',
							title: 'Görevi tamamlama',
							body: 'Görev, en az dört bileşen kapsandığında tamamlanabilir. İsterseniz prompt’u kopyalayıp kendi Copilot ortamınızda deneyin.',
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
							id: 'prompt-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Prompt Builder, “Kaynak” alanı boş olduğunda neden ipucu gösterir?',
									options: [
										{ id: 'a', text: 'Kaynak olmadan prompt hiç çalışmaz.' },
										{
											id: 'b',
											text: 'Kaynak belirtilmezse Copilot genel bilgiye veya başka içeriklere dayanabilir; sonuç beklediğiniz veriye dayanmayabilir.',
										},
										{ id: 'c', text: 'Kaynak alanı yalnızca Excel için gereklidir.' },
									],
									correct: 'b',
									explanation:
										'Kaynak belirtmek, Copilot’ı doğru içeriğe yönlendirir ve sonucu doğrulamayı kolaylaştırır.',
								},
								{
									id: 'q2',
									prompt:
										'“Kaynakta bulunmayan bilgileri varsayma; eksikleri belirt.” cümlesi ne işe yarar?',
									options: [
										{ id: 'a', text: 'Uydurma bilgi riskini azaltır ve eksikleri görünür kılar.' },
										{ id: 'b', text: 'Copilot’ın hata yapmasını tamamen engeller.' },
										{ id: 'c', text: 'Çıktının tonunu belirler.' },
									],
									correct: 'a',
									explanation:
										'Bu tür bir kısıt riski azaltır ama ortadan kaldırmaz. Çıktıyı yine de kaynağıyla karşılaştırmanız gerekir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Prompt Builder, beş bileşeni **sırayla düşünmenizi** sağlar.',
				'İpuçları en kritik eksikleri önce gösterir: görev, bağlam, kaynak ve beklenti.',
				'Doğrulama talimatı (“varsayma, eksikleri belirt”) riski azaltır ama **kontrolün yerini tutmaz**.',
				'Prompt alanlarına gerçek kişisel veya gizli bilgi yazmayın.',
			],
		},
		{
			id: 'prompt-3',
			title: 'Zayıf prompt’tan güçlü prompt’a',
			summary:
				'İki prompt’u karşılaştırın, çıktıyı doğrulayın ve takip prompt’larıyla iyileştirin.',
			minutes: 16,
			objectives: [
				'Zayıf ve güçlü bir prompt’u karşılaştırmak',
				'Prompt iyileştirmenin çıktıya etkisini açıklamak',
				'Çıktıyı doğrulamak ve takip prompt’u yazmak',
			],
			steps: [
				{
					id: 'belirtiler',
					phase: 'learn',
					title: 'Zayıf prompt’un belirtileri',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Zayıf bir prompt genellikle kısa olduğu için değil, **belirsiz** olduğu için zayıftır. Aşağıdaki belirtilerden birini görüyorsanız, prompt’u güçlendirme zamanıdır.',
						},
						{
							type: 'list',
							style: 'cross',
							items: [
								'Tek fiilli, konusu belirsiz istekler: “Rapor hazırla.”',
								'Kimin için yazıldığı belli değil.',
								'Hangi kaynağa dayanacağı söylenmiyor.',
								'Çıktının biçimi ve uzunluğu tanımsız.',
								'“Mükemmel olsun”, “detaylı yaz” gibi ölçülemeyen sıfatlar.',
							],
						},
						{
							type: 'keyPoint',
							body: 'Prompt’u güçlendirmek, Copilot’ın **tahmin etmesi gereken alanı daraltmaktır**.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'İki prompt, iki farklı sonuç',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Aynı işi isteyen iki prompt’u karşılaştırın. Sekmeler arasında geçerek farkın nedenlerini inceleyin; ardından iki prompt’un üretebileceği örnek çıktılara bakın.',
						},
						{ type: 'interactive', component: 'promptCompare' },
					],
					aside: [
						{
							tone: 'note',
							title: 'Bağlam da eklenebilir',
							body: 'Geliştirilmiş prompt’ta bağlam bileşeni yok. Raporun hangi toplantıda ve hangi karar için kullanılacağını eklemek onu daha da güçlendirir.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Zayıf prompt’u kendiniz güçlendirin',
					wide: true,
					blocks: [
						{
							type: 'interactive',
							component: 'promptBuilder',
							props: {
								scenario:
									'Zayıf prompt: “Toplantı notlarını özetle.” Bu isteği Prompt Builder ile güçlendirin: notlar hangi toplantıya ait, özet kimin için, hangi bölümlerden oluşmalı ve eksik bilgi olduğunda ne yapılmalı?',
							},
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Kendinize sorun',
							body: [
								'Özeti kim okuyacak?',
								'Hangi başlıklar olmalı: kararlar, aksiyonlar, açık sorular?',
								'Sorumlu veya tarih yoksa ne yazılmalı?',
							],
						},
						{
							tone: 'note',
							title: 'İsteğe bağlı alıştırma',
							body: 'Bu adımda görev zorunlu değildir. Hazır olduğunuzda “Sonraki” ile devam edebilirsiniz.',
						},
					],
				},
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Çıktıyı doğrulamak ve yinelemek',
					blocks: [
						{
							type: 'text',
							body: 'Güçlü bir prompt bile ilk denemede mükemmel sonuç vermeyebilir. Prompt yazmak çoğu zaman bir sohbettir: sonuç gelir, değerlendirirsiniz, yönlendirirsiniz.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'scan',
									title: 'Kaynağa göre kontrol edin',
									body: 'Rakamları, isimleri, tarihleri ve alıntıları kaynak belgeyle karşılaştırın.',
								},
								{
									icon: 'target',
									title: 'Amaca göre kontrol edin',
									body: 'Çıktı gerçekten istediğiniz işi görüyor mu? Hedef kitleye uygun mu?',
								},
								{
									icon: 'message',
									title: 'Takip prompt’u yazın',
									body: 'Beğenmediğiniz kısmı tarif edin: “İkinci bulguyu rakamlarla destekle”, “Daha kısa yaz”.',
								},
								{
									icon: 'userCheck',
									title: 'Sahiplenin',
									body: 'Son metni kendi bilginizle tamamlayın; paylaşmadan önce baştan sona okuyun.',
								},
							],
						},
						{
							type: 'chat',
							title: 'Takip prompt’uyla iyileştirme',
							messages: [
								{
									role: 'user',
									text: 'Son çeyrek satış raporunu yönetici için üç bulguyla özetle.',
								},
								{
									role: 'copilot',
									heading: 'Üç önemli bulgu',
									bullets: [
										'Toplam satışlar hedefin %3 üzerinde gerçekleşti.',
										'Bazı bölgelerde performans beklentinin altında kaldı.',
										'Kurumsal segment en hızlı büyüyen alan oldu.',
									],
								},
								{
									role: 'user',
									text: 'İkinci bulgu çok genel. Hangi bölgenin ne kadar geride kaldığını rakamla yaz ve tek cümleyle sınırla.',
								},
								{
									role: 'copilot',
									text: '**Güncellenmiş 2. bulgu:** Güney bölgesi hedefin %9 altında kaldı; Kuzey ve Batı bölgeleri hedefi aştı.',
									note: 'Örnek yanıt. Rakamları kaynak tabloyla karşılaştırmanız gerekir.',
								},
							],
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Takip prompt’u kalıpları',
							body: [
								'“Şu kısmı daha kısa yaz…”',
								'“Bunu tablo olarak göster.”',
								'“Hangi kaynağa dayandığını belirt.”',
								'“Emin olmadığın noktaları ayrıca listele.”',
							],
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Prompt’u güçlendirin',
					blocks: [
						{
							type: 'choice',
							id: 'prompt-3-guclendir',
							context: 'Zayıf prompt: **“Toplantı notlarını özetle.”**',
							prompt: 'Bu prompt’un en iyi geliştirilmiş hâli hangisi?',
							options: [
								{
									id: 'a',
									text: '“Toplantı notlarını çok iyi ve detaylı bir şekilde özetle.”',
									feedback:
										'Sıfat eklemek prompt’u güçlendirmez; hedef kitle, biçim ve kaynak hâlâ belirsiz.',
								},
								{
									id: 'b',
									text: '“Ekteki 12 Mayıs proje toplantısı notlarını, toplantıya katılamayan ekip üyeleri için özetle. Kararları, sorumlu kişileri ve tarihleriyle aksiyonları ve açık soruları ayrı başlıklarla listele. Notlarda olmayan bilgileri ekleme; sorumlusu belirtilmeyen aksiyonlar için ‘Belirtilmedi’ yaz.”',
									correct: true,
									feedback:
										'Kaynak, hedef kitle, beklenen yapı ve doğrulama kısıtı açık. Copilot’ın tahmin etmesi gereken bir şey kalmıyor.',
								},
								{
									id: 'c',
									text: '“Toplantı notlarını özetle ve mutlaka doğru yap, hata yapma.”',
									feedback:
										'“Hata yapma” demek doğruluğu garanti etmez. Bunun yerine neye dayanacağını ve eksik bilgide ne yapacağını tarif edin.',
								},
							],
							explanation:
								'Güçlü prompt’lar **somut** bilgi içerir: hangi kaynak, kimin için, hangi yapıda ve hangi kurallarla.',
						},
						{
							type: 'order',
							id: 'prompt-3-dongu',
							prompt: 'Bir prompt’u iyileştirme döngüsünü doğru sıraya koyun.',
							items: [
								{ id: 'yaz', text: 'İlk prompt’u amaç ve bağlamla yazın', hint: 'Yazma adımı' },
								{
									id: 'degerlendir',
									text: 'Gelen çıktıyı okuyun ve amaca uygunluğunu değerlendirin',
									hint: 'Değerlendirme adımı',
								},
								{
									id: 'dogrula',
									text: 'Rakam, isim ve tarihleri kaynakla karşılaştırın',
									hint: 'Doğrulama adımı',
								},
								{
									id: 'yonlendir',
									text: 'Eksik veya hatalı kısmı takip prompt’uyla düzeltin',
									hint: 'Yönlendirme adımı',
								},
								{ id: 'paylas', text: 'Son metni sahiplenip paylaşın', hint: 'Paylaşım adımı' },
							],
							initial: ['dogrula', 'yaz', 'paylas', 'degerlendir', 'yonlendir'],
							explanation:
								'Önce yazın, sonra değerlendirin ve doğrulayın, ardından yönlendirin. Paylaşım her zaman en son adımdır.',
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
							id: 'prompt-3-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Zayıf bir prompt’a “çok detaylı ve mükemmel olsun” eklemek neden genellikle işe yaramaz?',
									options: [
										{
											id: 'a',
											text: 'Belirsiz sıfatlar, Copilot’a neye dayanacağını, kimin için ve hangi biçimde yazacağını söylemez.',
										},
										{ id: 'b', text: 'Copilot sıfatları hiç okumaz.' },
										{ id: 'c', text: 'Uzun prompt’lar her zaman daha kötü sonuç verir.' },
									],
									correct: 'a',
									explanation:
										'Önemli olan uzunluk değil, somutluktur: kaynak, hedef kitle, yapı ve kurallar.',
								},
								{
									id: 'q2',
									prompt:
										'Copilot’ın hazırladığı raporda bir rakam kaynakla uyuşmuyor. En iyi adım hangisi?',
									options: [
										{ id: 'a', text: 'Rakamı silip kimseye söylememek' },
										{
											id: 'b',
											text: 'Rakamın hangi kaynağa dayandığını sormak, kaynakla karşılaştırıp düzeltmek',
										},
										{ id: 'c', text: 'Raporu olduğu gibi paylaşmak' },
									],
									correct: 'b',
									explanation:
										'Takip prompt’u ve kaynak kontrolü birlikte, hatayı bulmanın ve düzeltmenin en hızlı yoludur.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Zayıf prompt’ta eksik olan genellikle **bağlam, kaynak ve beklenen biçimdir**.',
				'Güçlü prompt belirsizlikleri giderir; Copilot’ın tahmin etmesi gereken alan daralır.',
				'Prompt yazmak bir döngüdür: **yaz → değerlendir → doğrula → yönlendir → sahiplen**.',
				'Sıfat eklemek yerine somut bilgi ekleyin.',
			],
		},
	],
}

export default prompting
