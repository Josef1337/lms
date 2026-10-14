import type { Module } from '@/types/content'

const chat: Module = {
	id: 'copilot-chat',
	number: 3,
	title: 'Copilot Chat',
	navLabel: 'Copilot Chat',
	tagline: 'Sorun, adımlara bölün, derinleşin',
	description:
		'Copilot Chat ile etkili soru sormayı, karmaşık işleri küçük adımlara bölmeyi, takip sorularıyla ilerlemeyi, kaynak ve dosyalarla çalışmayı, yanıtları doğrulamayı ve hassas bilgiyi korumayı öğrenin.',
	visual: 'chat',
	skills: ['prompting', 'verify', 'safety'],
	objectives: [
		'Copilot Chat’e net ve bağlamlı sorular sormak',
		'Karmaşık bir işi adımlara bölüp takip sorularıyla ilerlemek',
		'Kaynak ve dosyalarla çalışırken yanıtları doğrulamak',
		'Hassas bilgiyi paylaşırken kurumsal kurallara uymak',
	],
	availability:
		'Copilot Chat’in iş verilerinize (e-posta, dosya, toplantı) erişip erişemeyeceği, dosya ekleme seçenekleri ve kullanılabildiği yerler (Microsoft 365 Copilot uygulaması, web, Teams, Outlook) lisansınıza ve kurumunuzun ayarlarına bağlıdır.',
	lessons: [
		{
			id: 'chat-1',
			title: 'Soru sormak ve adım adım ilerlemek',
			summary: 'Bağlamlı soru sorun, büyük işleri bölün ve takip sorularıyla yanıtı geliştirin.',
			minutes: 16,
			objectives: [
				'Bağlamlı bir soruyla sohbete başlamak',
				'Karmaşık bir işi küçük adımlara bölmek',
				'Takip sorularıyla yanıtı geliştirmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Sohbetin gücü: bağlam birikir',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Copilot Chat’te her mesaj bir öncekinin üzerine kurulur. Aynı sohbette verdiğiniz bilgiler bağlam olarak kullanılır. Bu yüzden büyük bir işi tek seferde istemek yerine adım adım ilerlemek çoğu zaman daha iyi sonuç verir.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'message',
									title: 'Net bir soruyla başlayın',
									body: 'Ne istediğinizi ve neden istediğinizi bir iki cümleyle anlatın.',
									detail:
										'Örnek: “Yeni bir müşteri memnuniyeti anketi hazırlamak istiyorum. Önce hangi konuları ölçmemiz gerektiğini birlikte belirleyelim.”',
								},
								{
									icon: 'split',
									title: 'Büyük işi bölün',
									body: 'Önce özet, sonra analiz, sonra taslak. Her adımda sonucu kontrol edin.',
								},
								{
									icon: 'route',
									title: 'Takip sorularıyla yönlendirin',
									body: '“Daha kısa”, “tablo hâlinde”, “üçüncü maddeyi aç” gibi kısa yönlendirmeler çoğu zaman yeterlidir.',
								},
								{
									icon: 'pen',
									title: 'Üretin, yeniden yazın, özetleyin',
									body: 'Aynı sohbette yeni içerik üretebilir, var olan metni yeniden yazdırabilir veya özetletebilirsiniz.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'tip',
							body: 'Konu değiştiğinde yeni bir sohbet başlatın. Önceki sohbetin bağlamı, yeni konudaki yanıtları beklenmedik biçimde etkileyebilir.',
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Sohbet geçmişi',
							body: 'Copilot, sohbetin geçmişini belirli bir sınıra kadar dikkate alır. Çok uzun sohbetlerde önemli bilgileri kısa bir özetle yeniden hatırlatmak işe yarar.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Karmaşık bir işi adımlara bölmek',
					blocks: [
						{
							type: 'text',
							body: 'Bir yöneticinin yarım günlük bir eğitim planlarken Copilot Chat ile nasıl adım adım ilerlediğini inceleyin.',
						},
						{
							type: 'chat',
							title: 'Copilot Chat · eğitim planı',
							caption: 'Her yanıt bir sonraki sorunun temeli oluyor: hedefler → akış → materyal.',
							messages: [
								{
									role: 'user',
									text: 'Satış ekibi için yarım günlük bir müzakere becerileri eğitimi planlamam gerekiyor. Ekip yeni; çoğu ilk yılında. Önce eğitimin hedeflerini belirleyelim.',
								},
								{
									role: 'copilot',
									heading: 'Önerilen eğitim hedefleri',
									bullets: [
										'Müşteri ihtiyacını doğru sorularla ortaya çıkarmak',
										'Fiyat itirazlarına yapılandırılmış yanıt vermek',
										'Kazan-kazan seçenekleri oluşturmak',
										'Görüşmeyi net bir sonraki adımla kapatmak',
									],
									note: 'Hangi hedefe daha fazla zaman ayırmak istersiniz?',
								},
								{
									role: 'user',
									text: 'İkinci hedef en kritik olanı. Ona ağırlık veren 4 saatlik bir akış öner; her bölüm için süre ve yöntem yaz.',
								},
								{
									role: 'copilot',
									heading: 'Önerilen akış (4 saat)',
									bullets: [
										'**0:00–0:30** Açılış ve beklentiler · grup tartışması',
										'**0:30–1:30** İhtiyaç keşfi soruları · eşli alıştırma',
										'**1:30–3:00** Fiyat itirazları · vaka çalışması ve rol oyunu',
										'**3:00–3:40** Kazan-kazan seçenekleri · küçük grup çalışması',
										'**3:40–4:00** Kapanış ve kişisel aksiyon planı',
									],
								},
								{
									role: 'user',
									text: 'Rol oyunu için iki kısa müşteri senaryosu yaz: biri bütçe, biri rakip teklifi itirazı olsun.',
								},
								{
									role: 'copilot',
									bullets: [
										'**Senaryo 1 · Bütçe:** “Çözümünüzü beğendik ama bu yıl bütçemiz geçen yıla göre %20 daha düşük.”',
										'**Senaryo 2 · Rakip teklifi:** “Başka bir firma aynı hizmeti daha uygun fiyata teklif etti.”',
									],
									note: 'Örnek yanıt. Senaryoları ekibinizin gerçek müşteri profiline göre uyarlayın.',
								},
							],
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Neden işe yarıyor?',
							body: [
								'Her mesajda yalnızca **bir** şey istendi.',
								'Kullanıcı önceliği belirtti: “ikinci hedef kritik”.',
								'Biçim tarif edildi: “süre ve yöntem yaz”.',
							],
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Sohbet simülasyonu: proje güncellemesi',
					wide: true,
					blocks: [
						{
							type: 'text',
							body: 'Senaryo: Elinizde uzun bir proje güncellemesi var. Bu içeriği **yönetici özeti, riskler ve aksiyon maddelerine** dönüştürmeniz gerekiyor. Her adımda bir prompt seçin, simüle edilmiş yanıtı ve geri bildirimi okuyun, ardından sonraki adıma geçin.',
						},
						{ type: 'interactive', component: 'chatSimulator', taskId: 'chat-1-simulasyon' },
					],
					aside: [
						{
							tone: 'tip',
							title: 'Zayıf seçenekleri de deneyin',
							body: 'Simülasyonun amacı farkı görmek. Zayıf bir prompt’un ne ürettiğini görmek, etkili prompt’un neden işe yaradığını anlamayı kolaylaştırır.',
						},
						{
							tone: 'explain',
							title: 'Puanlama',
							body: 'Görev puanı, her adımdaki ilk seçiminize göre hesaplanır. Doğru prompt’u bulana kadar deneyebilirsiniz.',
						},
						{
							tone: 'note',
							title: 'Gerçek bir bağlantı yok',
							body: 'Yanıtlar önceden hazırlanmıştır. Gerçek Copilot yanıtları aynı prompt’a farklı ifadelerle yanıt verebilir.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Doğru takip sorusunu seçin',
					blocks: [
						{
							type: 'choice',
							id: 'chat-1-takip',
							context:
								'Copilot’tan bir ürün lansmanı için duyuru metni istediniz. Gelen metin doğru, ama **çok uzun ve fazla teknik**. Okuyucular satış ekibi.',
							prompt: 'En etkili takip prompt’u hangisi?',
							options: [
								{
									id: 'a',
									text: '“Bu metni beğenmedim, yeniden yaz.”',
									feedback:
										'Neyi beğenmediğinizi söylemiyor; Copilot yine tahmin etmek zorunda kalır.',
								},
								{
									id: 'b',
									text: '“Metni satış ekibi için sadeleştir: teknik terimleri çıkar, en fazla 120 kelime olsun ve müşteriye anlatabilecekleri üç faydayı madde olarak ekle.”',
									correct: true,
									feedback:
										'Sorunu (uzunluk ve teknik dil), hedef kitleyi ve beklenen yapıyı açıkça tarif ediyor.',
								},
								{
									id: 'c',
									text: '“Daha iyi yaz.”',
									feedback: '“Daha iyi” kişiye göre değişir; ölçütü sizin belirtmeniz gerekir.',
								},
							],
							explanation:
								'İyi bir takip prompt’u **neyin değişmesini istediğinizi** somut olarak söyler: uzunluk, ton, hedef kitle, yapı.',
						},
						{
							type: 'order',
							id: 'chat-1-adimlar',
							prompt:
								'Copilot Chat ile bir rakip analizi hazırlayacaksınız. Adımları doğru sıraya koyun.',
							items: [
								{
									id: 'kapsam',
									text: 'Amacı ve kapsamı belirtin: hangi rakipler, hangi ölçütler',
									hint: 'Kapsam adımı',
								},
								{
									id: 'kaynak',
									text: 'Kaynakları gösterin: ekteki pazar raporu ve rakiplerin kamuya açık bilgileri',
									hint: 'Kaynak adımı',
								},
								{ id: 'tablo', text: 'Karşılaştırma tablosu isteyin', hint: 'Tablo adımı' },
								{
									id: 'dogrula',
									text: 'Tablodaki iddiaları kaynaklarla doğrulayın',
									hint: 'Doğrulama adımı',
								},
								{ id: 'ozet', text: 'Yönetim için bir sayfalık özet isteyin', hint: 'Özet adımı' },
							],
							initial: ['tablo', 'kapsam', 'ozet', 'kaynak', 'dogrula'],
							explanation:
								'Önce çerçeve ve kaynak, sonra çıktı, sonra doğrulama. Yönetim özeti en sona kalır; çünkü doğrulanmış bilgiye dayanmalıdır.',
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
							id: 'chat-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt: 'Sohbetin konusunu tamamen değiştirdiğinizde ne yapmak daha doğrudur?',
									options: [
										{ id: 'a', text: 'Aynı sohbette devam etmek' },
										{ id: 'b', text: 'Yeni bir sohbet başlatmak' },
										{ id: 'c', text: 'Önceki mesajları kopyalayıp yeniden göndermek' },
									],
									correct: 'b',
									explanation:
										'Yeni konu için yeni sohbet, önceki bağlamın yanıtları beklenmedik şekilde etkilemesini önler.',
								},
								{
									id: 'q2',
									prompt: 'Karmaşık bir işi adımlara bölmenin en önemli faydası nedir?',
									options: [
										{ id: 'a', text: 'Copilot’ın daha uzun yanıtlar vermesi' },
										{ id: 'b', text: 'Her ara sonucu kontrol edip yönü düzeltebilmek' },
										{ id: 'c', text: 'Daha az prompt yazmak' },
									],
									correct: 'b',
									explanation:
										'Adım adım ilerlemek kontrolü sizde tutar: hatayı erken fark eder, sonraki adımı ona göre yönlendirirsiniz.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Sohbette **bağlam birikir**; büyük işi adımlara bölmek kontrolü sizde tutar.',
				'İyi bir takip prompt’u neyin değişmesini istediğinizi somut olarak söyler.',
				'Konu değiştiğinde **yeni bir sohbet** başlatın.',
				'Tahmin isteyen prompt’lar, kaynakta olmayan bilgi üretir; durum raporlarında kaynağa bağlı kalın.',
			],
		},
		{
			id: 'chat-2',
			title: 'Kaynaklar, doğrulama ve hassas bilgi',
			summary: 'Yanıtı doğru içeriğe dayandırın, kaynağında doğrulayın ve hassas bilgiyi koruyun.',
			minutes: 12,
			objectives: [
				'Dosya ve kaynaklarla çalışırken doğru yönlendirme yapmak',
				'Yanıtları kaynağında doğrulamak',
				'Hassas bilgiyi paylaşmadan önce değerlendirmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Kaynak ve dosyalarla çalışmak',
					blocks: [
						{
							type: 'text',
							body: 'Copilot Chat’te bir yanıtı belirli bir içeriğe dayandırmanın birkaç yolu vardır. Hangilerinin açık olduğu lisansınıza ve kurum ayarlarınıza bağlıdır.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'file',
									title: 'Dosyayı belirtmek veya eklemek',
									body: 'Bazı deneyimlerde bir dosyayı adıyla belirtebilir veya sohbete ekleyebilirsiniz. Yanıt o dosyaya dayanır.',
								},
								{
									icon: 'database',
									title: 'İş verileri',
									body: 'İş verilerine erişimi olan kullanımlarda Copilot; e-posta, toplantı ve belgelerinizden izinleriniz dahilinde yararlanabilir.',
								},
								{
									icon: 'globe',
									title: 'Web bilgileri',
									body: 'Web ile desteklenen yanıtlarda bilgiler internet kaynaklarından gelir; güncellik ve doğruluk kontrol edilmelidir.',
								},
								{
									icon: 'quote',
									title: 'Metni sohbete yapıştırmak',
									body: 'Kısa bir metni doğrudan yapıştırmak en basit yoldur. Hassas içerik yapıştırmadan önce kurum kurallarınızı kontrol edin.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Dosya ekleme, iş verisi ve web kullanımı gibi seçenekler kurumunuzun yapılandırmasına göre açık veya kapalı olabilir. Kurumsal hesapla kullanılan Copilot Chat için Microsoft, kurumsal veri koruma taahhütleri açıklamaktadır; kapsam ve ayarlar için BT ekibinize danışın.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Kaynağı adlandırın',
							body: '“Bu dosyaya göre…”, “yalnızca ekteki rapora dayanarak…” gibi ifadeler yanıtın kapsamını daraltır ve doğrulamayı kolaylaştırır.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Yanıtı kaynağında doğrulamak',
					blocks: [
						{
							type: 'text',
							body: 'İyi görünen bir yanıt da kontrol edilmelidir. Aşağıdaki örnekte Copilot bir politika belgesine dayanarak yanıt veriyor. Ardından kontrol listesini izleyin.',
						},
						{
							type: 'chat',
							title: 'Copilot Chat · seyahat politikası',
							messages: [
								{
									role: 'user',
									text: 'Ekteki seyahat politikasına göre yurt içi konaklama limiti ne kadar? Bilginin hangi bölümde yazdığını da belirt.',
								},
								{
									role: 'copilot',
									text: 'Politikaya göre yurt içi konaklamada gecelik limit 3.500 ₺ (Bölüm 4.2). Büyükşehirlerde bu limit %20 artırılabilir (Bölüm 4.3).',
									note: 'Örnek yanıt; politika ve rakamlar kurgusaldır.',
								},
							],
						},
						{
							type: 'list',
							style: 'check',
							title: 'Doğrulama kontrol listesi',
							items: [
								'Yanıtın gösterdiği bölümleri (4.2 ve 4.3) belgede açın.',
								'Rakamın ve koşulun belgedekiyle birebir aynı olduğunu kontrol edin.',
								'Belgenin **güncel sürüm** olduğundan emin olun.',
								'Yorum gerektiren durumlarda (ör. istisnalar) politika sahibine danışın.',
							],
						},
						{
							type: 'keyPoint',
							body: 'Copilot’a “Emin misin?” diye sormak doğrulama değildir. Doğrulama, bilgiyi **kaynağında** görmektir.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Hangi bilgiyi paylaşabilirim?',
					blocks: [
						{
							type: 'text',
							body: 'Copilot’a verdiğiniz her bilgi, kurumunuzun veri kurallarına tabidir. Aşağıdaki başlıkları açarak hangi bilgi türlerinin özel dikkat gerektirdiğini inceleyin.',
						},
						{
							type: 'disclosure',
							items: [
								{
									title: 'Kişisel veriler',
									body: [
										'Kimlik numarası, sağlık bilgisi, ev adresi ve maaş gibi bilgiler özel koruma gerektirir.',
										'Bu verileri yalnızca kurumunuzun izin verdiği araçlarda ve gerektiği kadar kullanın.',
									],
								},
								{
									title: 'Gizli kurum bilgileri',
									body: [
										'Birleşme planları, açıklanmamış finansal sonuçlar ve ihale fiyatları gibi bilgiler gizlilik etiketine tabi olabilir.',
										'Gizlilik etiketleri ve erişim izinleri, kurumunuzun yapılandırmasına göre Copilot’ın bu içerikle nasıl çalışacağını etkileyebilir.',
									],
								},
								{
									title: 'Müşteri ve iş ortağı bilgileri',
									body: 'Sözleşmelerle korunan bilgileri kullanmadan önce sözleşme ve politika kurallarını kontrol edin.',
								},
								{
									title: 'Onaylı ve onaysız araçlar',
									body: [
										'Kurumsal hesapla oturum açılan, kurumun onayladığı Copilot deneyimleri ile kişisel hesaplar veya üçüncü taraf yapay zekâ araçları aynı koruma seviyesine sahip değildir.',
										'İş içeriğini kişisel hesaplara veya onaylanmamış araçlara taşımayın.',
									],
								},
							],
						},
						{
							type: 'callout',
							tone: 'warning',
							body: 'Emin değilseniz paylaşmayın. Önce kurum politikanızı kontrol edin veya bilgi güvenliği ekibine danışın.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Paylaşmalı mı?',
					blocks: [
						{
							type: 'classify',
							id: 'chat-2-paylasim',
							prompt: 'Her durum için en uygun yaklaşımı seçin.',
							categories: [
								{
									id: 'ok',
									label: 'Kullanılabilir',
									description: 'Onaylı Copilot’ta, iş amacıyla kullanılabilir.',
									tone: 'good',
								},
								{
									id: 'check',
									label: 'Önce kontrol et',
									description: 'Politika, etiket veya izin kontrolü gerekir.',
									tone: 'warn',
								},
								{
									id: 'no',
									label: 'Paylaşma',
									description: 'Bu bağlamda paylaşılmamalı.',
									tone: 'stop',
								},
							],
							items: [
								{
									id: 'notlar',
									text: 'Kurumsal hesapla açtığınız Copilot Chat’te ekibinizin kendi toplantı notlarını özetletmek',
									category: 'ok',
									feedback:
										'İş amacıyla, onaylı bir araçta ve erişiminiz olan içerikle çalışıyorsunuz. Çıktıyı yine de kontrol edin.',
								},
								{
									id: 'kimlik',
									text: 'Müşterilerin kimlik numaralarını içeren bir listeyi kişisel bir yapay zekâ uygulamasına yapıştırmak',
									category: 'no',
									feedback: 'Kişisel veriler onaylanmamış bir araca taşınmamalıdır.',
								},
								{
									id: 'gizli',
									text: '“Gizli” etiketli bir birleşme planı belgesini özetletmek',
									category: 'check',
									feedback:
										'Etiketli belgeler kurum politikalarına tabidir. Erişim izniniz olsa bile kullanım kurallarını kontrol edin.',
								},
								{
									id: 'rapor',
									text: 'Kamuya açık bir sektör raporuna dayanarak rakip karşılaştırması istemek',
									category: 'ok',
									feedback:
										'Kamuya açık bilgi. Yine de kaynağın güncelliğini ve doğruluğunu kontrol edin.',
								},
								{
									id: 'saglik',
									text: 'Bir çalışanın sağlık raporunu genel bir sohbette özetletmek',
									category: 'no',
									feedback:
										'Sağlık bilgisi özel nitelikli kişisel veridir; yalnızca kurumun belirlediği süreç ve sistemlerle işlenebilir.',
								},
								{
									id: 'finansal',
									text: 'Henüz açıklanmamış çeyrek sonuçlarını bir sunum taslağı için kullanmak',
									category: 'check',
									feedback:
										'İçeriden bilgi niteliğinde olabilir. Kimin erişebileceği ve hangi araçta işlenebileceği politikayla belirlenir.',
								},
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
							id: 'chat-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Copilot bir politika belgesine dayanarak yanıt verdi ve bölüm numarası gösterdi. Ne yapmalısınız?',
									options: [
										{
											id: 'a',
											text: 'Bölüm numarası verildiği için yanıt doğrudur; kontrol gerekmez.',
										},
										{
											id: 'b',
											text: 'Belirtilen bölümü açıp bilgiyi ve belgenin güncel olduğunu kontrol etmek',
										},
										{ id: 'c', text: 'Aynı soruyu tekrar sorup yanıtların uyuşmasına bakmak' },
									],
									correct: 'b',
									explanation:
										'Bölüm numarası doğrulamayı kolaylaştırır ama doğrulamanın yerini tutmaz.',
								},
								{
									id: 'q2',
									prompt: 'Hassas bilgiyle çalışırken doğru yaklaşım hangisidir?',
									options: [
										{ id: 'a', text: 'İşi hızlandırıyorsa her aracı kullanmak' },
										{
											id: 'b',
											text: 'Kurumun onayladığı araçları, gerekli en az veriyle ve politikaya uygun kullanmak',
										},
										{ id: 'c', text: 'Bilgiyi kişisel hesaba aktarıp orada çalışmak' },
									],
									correct: 'b',
									explanation:
										'Onaylı araç, en az veri ve politikaya uygunluk: hassas bilginin temel kuralları.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Yanıtı belirli içeriğe dayandırmak için **kaynağı adlandırın** veya (ayarlarınız izin veriyorsa) ekleyin.',
				'Doğrulama, bilgiyi **kaynağında** görmektir; “Emin misin?” sorusu yeterli değildir.',
				'Kişisel veri ve gizli bilgiyi yalnızca **onaylı araçlarda**, gerektiği kadar ve politikaya uygun kullanın.',
				'Emin değilseniz paylaşmayın; bilgi güvenliği ekibinize danışın.',
			],
		},
	],
}

export default chat
