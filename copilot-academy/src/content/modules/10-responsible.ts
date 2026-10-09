import type { Module } from '@/types/content'

const responsible: Module = {
	id: 'guvenli-kullanim',
	number: 10,
	title: 'Güvenli ve Sorumlu Kullanım',
	navLabel: 'Güvenli Kullanım',
	tagline: 'Hız kazanın, kontrolü kaybetmeyin',
	description:
		'Copilot çıktılarını kontrol etmeyi, yanlış veya eksik sonuç ihtimalini yönetmeyi, hassas bilgileri korumayı, kurum politikalarına ve erişim izinlerine uymayı, kaynakları doğrulamayı ve insan değerlendirmesinin gerekli olduğu durumları tanımayı öğrenin.',
	visual: 'shield',
	skills: ['safety', 'verify'],
	objectives: [
		'Çıktıyı paylaşmadan önce sistemli biçimde kontrol etmek',
		'Hassas bilgiyi kurum politikalarına uygun kullanmak',
		'Dosya izinlerinin Copilot yanıtlarına etkisini anlamak',
		'İnsan değerlendirmesi gereken durumları tanımak',
	],
	availability:
		'Microsoft 365 Copilot’ın veri erişimi ve koruma davranışları; ürün yapılandırmasına, lisansa, gizlilik etiketlerine, veri kaybı önleme ayarlarına ve kurumunuzun politikalarına bağlıdır. Bu modül genel ilkeleri anlatır; kurumunuzdaki kesin kurallar için bilgi güvenliği ekibinize danışın.',
	lessons: [
		{
			id: 'guvenli-1',
			title: 'Çıktıları kontrol etmek ve doğrulamak',
			summary:
				'Uydurma, eksik ve güncel olmayan bilgiyi tanıyın; çıktıyı sistemli biçimde doğrulayın.',
			minutes: 14,
			objectives: [
				'Yanlış veya eksik sonuç türlerini tanımak',
				'Bir çıktıyı paylaşmadan önce sistemli olarak kontrol etmek',
				'Doğrulama yöntemlerini duruma göre seçmek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Neden kontrol ediyoruz?',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Copilot hızlıdır ve çoğu zaman yardımcıdır; ama hatasız değildir. Ürettiği içeriği kendi adınızla paylaştığınızda sorumluluk sizindir.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'scan',
									title: 'Uydurma bilgi',
									body: 'Kaynakta olmayan bir rakam, isim, tarih veya alıntı üretebilir.',
									detail:
										'Bu duruma sıklıkla “halüsinasyon” denir. Akıcı ve kendinden emin bir dil, bu riski fark etmeyi zorlaştırır.',
								},
								{
									icon: 'fileSearch',
									title: 'Eksik bilgi',
									body: 'Özetler önemli bir istisnayı, koşulu veya riski atlayabilir.',
								},
								{
									icon: 'history',
									title: 'Güncel olmayan bilgi',
									body: 'Eski bir belge sürümüne veya güncelliğini yitirmiş bir kaynağa dayanabilir.',
								},
								{
									icon: 'scale',
									title: 'Yanlış yorum',
									body: 'Bir öneriyi karar, bir olasılığı kesinlik gibi aktarabilir.',
								},
							],
						},
						{
							type: 'keyPoint',
							label: 'Paylaşmadan önce dört soru',
							body: '**Nereden geliyor? Doğru mu? Eksik bir şey var mı? Kime gidiyor?**',
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Bazı Copilot deneyimleri yanıtlarda kaynak veya referans gösterebilir; bu özellik uygulamaya ve yapılandırmaya göre değişir. Kaynak gösterilmesi, bilginin doğru yorumlandığı anlamına gelmez.',
						},
					],
					aside: [
						{
							tone: 'example',
							title: 'Akıcı ama yanlış',
							body: '“Proje 15 Temmuz’da canlıya alınmıştır.” Cümle düzgün; ancak toplantıda bu tarih yalnızca hedef olarak geçiyor. Fark küçük görünür, etkisi büyüktür.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Bir çıktıyı adım adım kontrol etmek',
					blocks: [
						{
							type: 'reveal',
							surface: 'copilot',
							intro:
								'Copilot’ın hazırladığı bir rapor özetini paylaşmadan önce nasıl kontrol edebileceğinizi adım adım izleyin.',
							steps: [
								{
									title: 'Kaynağı açın',
									body: 'Çıktının dayandığı belgeyi, e-postayı veya toplantıyı açın. Kaynak gösterilmişse ilgili bölüme gidin.',
								},
								{
									title: 'Rakam ve tarihleri karşılaştırın',
									body: 'Her rakamı ve tarihi kaynakta bulun. Bulamadığınız bilgi uydurma olabilir.',
									prompt: 'Bu özetteki her rakamın kaynakta hangi bölümde geçtiğini listele.',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: [
											'%11 kayıp oranı → s. 2',
											'14 saat yanıt süresi → s. 6',
											'“%25 bütçe artışı” → kaynakta bulunamadı; özetten çıkarılmalı',
										],
									},
								},
								{
									title: 'Eksikleri sorun',
									body: 'Özetin dışarıda bıraktıklarını görün.',
									prompt: 'Bu özetin dışarıda bıraktığı önemli konular neler?',
									output: {
										label: 'Copilot yanıtı (örnek)',
										lines: ['Rakip indirimleri (s. 9) özette yer almıyor.'],
									},
								},
								{
									title: 'Ton ve taahhütleri okuyun',
									body: 'Metin sizin adınıza bir söz veriyor mu? Bir öneriyi karar gibi mi aktarıyor?',
								},
								{
									title: 'Alıcıyı kontrol edin',
									body: 'Metin iç bilgi içeriyorsa, dış alıcılara gitmeyecek şekilde düzenleyin. Ancak bundan sonra paylaşın.',
								},
							],
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Doğrulama yöntemlerini karşılaştırın',
					blocks: [
						{
							type: 'text',
							body: 'Her doğrulama yöntemi aynı güveni sağlamaz. Aşağıdaki karşılaştırmayı inceleyin ve hangi durumda hangisinin gerektiğini düşünün.',
						},
						{
							type: 'comparison',
							columns: [
								{ title: '“Emin misin?” diye sormak', icon: 'message' },
								{ title: 'Kaynağı kendiniz açmak', icon: 'fileSearch', highlight: true },
								{ title: 'Uzmana danışmak', icon: 'userCheck' },
							],
							rows: [
								{
									label: 'Ne sağlar?',
									values: [
										'Copilot’ın yanıtını gözden geçirmesini ister; bazen hatayı fark eder.',
										'Bilgiyi doğrudan kaynağında görürsünüz.',
										'Yorum ve bağlam gerektiren konularda güvence sağlar.',
									],
								},
								{
									label: 'Ne zaman yeterli?',
									values: [
										'Tek başına yeterli değildir.',
										'Rakam, tarih, isim ve alıntılar için çoğu zaman yeterlidir.',
										'Hukuki, finansal, sağlık ve personel konularında gereklidir.',
									],
								},
								{
									label: 'Sınırı',
									values: [
										'Copilot aynı hatayı kendinden emin bir dille tekrarlayabilir.',
										'Kaynağın kendisi güncel olmayabilir.',
										'Zaman alır; önemli kararlar için ayırın.',
									],
								},
							],
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Riske göre doğrulama',
							body: 'Kendi notlarınızın özeti için hızlı bir okuma yeterli olabilir. Müşteriye, yönetime veya bir karara giden içerikte kaynak kontrolü; hukuki ve kişisel konularda uzman görüşü gerekir.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Hatalı çıktıyı yakalayın',
					blocks: [
						{
							type: 'spot',
							id: 'guvenli-1-hata',
							prompt:
								'Copilot, satış toplantısı notlarından yöneticiniz için bir özet hazırladı. Kaynakla uyuşmayan satırları işaretleyin.',
							reference: {
								title: 'Kaynak: Haziran satış toplantısı notları',
								lines: [
									'Haziran satışları hedefin %4 altında kaldı.',
									'Yeni bayi anlaşması için müzakereler sürüyor; imza tarihi belli değil.',
									'Kampanya bütçesi 250 bin ₺ ile sınırlı.',
									'Müşteri şikâyetleri bir önceki aya göre azaldı.',
								],
							},
							output: { title: 'Yöneticiye özet', surface: 'copilot' },
							lines: [
								{
									id: 'l1',
									text: 'Haziran satışları hedefin %4 altında kaldı.',
									reason: 'Kaynakla uyumlu.',
								},
								{
									id: 'l2',
									text: 'Yeni bayi anlaşması imzalandı; Temmuz’dan itibaren satışlara katkı sağlayacak.',
									flawed: true,
									reason: 'Müzakereler sürüyor; anlaşma imzalanmadı ve tarih belli değil.',
								},
								{
									id: 'l3',
									text: 'Kampanya bütçesi 250 bin ₺ ile sınırlı.',
									reason: 'Kaynakla uyumlu.',
								},
								{
									id: 'l4',
									text: 'Müşteri şikâyetleri yarı yarıya azaldı.',
									flawed: true,
									reason: 'Kaynakta yalnızca “azaldı” deniyor; “yarı yarıya” oranı uydurulmuş.',
								},
							],
							explanation:
								'Uydurma bilgi çoğu zaman küçük bir abartı veya kesinlik olarak görünür: “sürüyor” → “imzalandı”, “azaldı” → “yarı yarıya azaldı”.',
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
							id: 'guvenli-1-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Copilot’ın yanıtı çok kendinden emin bir dille yazılmış. Bu ne gösterir?',
									options: [
										{ id: 'a', text: 'Yanıtın doğru olduğunu' },
										{ id: 'b', text: 'Hiçbir şeyi; kendinden emin dil doğruluğun kanıtı değildir' },
										{ id: 'c', text: 'Kaynağın güncel olduğunu' },
									],
									correct: 'b',
									explanation:
										'Dil modelleri hatalı bilgiyi de akıcı ve kendinden emin biçimde yazabilir.',
								},
								{
									id: 'q2',
									prompt: 'Hangi durumda bir konu uzmanına danışmak gerekir?',
									options: [
										{ id: 'a', text: 'Bir e-postanın tonunu iyileştirirken' },
										{
											id: 'b',
											text: 'Bir sözleşme maddesinin hukuki sonuçlarını değerlendirirken',
										},
										{ id: 'c', text: 'Toplantı notlarını maddelere dönüştürürken' },
									],
									correct: 'b',
									explanation:
										'Hukuki, finansal, sağlık ve personel konularında son değerlendirme uzmanındır.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Copilot çıktısı **uydurma, eksik, güncel olmayan veya yanlış yorumlanmış** bilgi içerebilir.',
				'Paylaşmadan önce dört soru: **Nereden geliyor? Doğru mu? Eksik bir şey var mı? Kime gidiyor?**',
				'Doğrulama, bilgiyi kaynağında görmektir; kritik konularda uzman görüşü gerekir.',
				'Küçük abartılar ve “kesinleşmiş” ifadeler, en sık görülen uydurma türleridir.',
			],
		},
		{
			id: 'guvenli-2',
			title: 'Hassas bilgi, izinler ve kurum politikaları',
			summary:
				'İzinlerin, etiketlerin ve politikaların rolünü öğrenin; örnek olaylarda doğru kararı verin.',
			minutes: 16,
			objectives: [
				'Hassas ve gizli bilgiyi tanımak',
				'Dosya izinlerinin Copilot yanıtlarına etkisini anlamak',
				'Örnek olaylarda doğru kararı vermek',
			],
			steps: [
				{
					id: 'ogren',
					phase: 'learn',
					title: 'Copilot ve veri erişimi',
					blocks: [
						{
							type: 'text',
							lead: true,
							body: 'Microsoft’un açıklamalarına göre Microsoft 365 Copilot, kurumsal verilerde kullanıcının **erişim izni olan** içerikle çalışacak ve kurumun izin, gizlilik etiketi ve uyumluluk ayarlarını dikkate alacak şekilde tasarlanmıştır. Bu da kurumsal kuralların doğru yapılandırılmasını daha da önemli kılar.',
						},
						{
							type: 'concepts',
							items: [
								{
									icon: 'folderLock',
									title: 'İzinler belirleyicidir',
									body: 'Bir dosyaya erişebiliyorsanız, Copilot da sizin adınıza o içerikten yararlanabilir. Gereğinden geniş paylaşılmış dosyalar beklenmedik yanıtlara yol açabilir.',
								},
								{
									icon: 'lock',
									title: 'Gizlilik etiketleri',
									body: 'Kurumunuz belgeleri “Genel”, “Kuruma özel”, “Gizli” gibi etiketlerle sınıflandırabilir. Etiketler içeriğin nasıl kullanılabileceğini etkileyebilir.',
								},
								{
									icon: 'fingerprint',
									title: 'Kişisel veriler',
									body: 'Kimlik, sağlık, maaş ve iletişim bilgileri özel koruma gerektirir; yalnızca gerektiği kadar ve izin verilen amaçla kullanılır.',
								},
								{
									icon: 'shield',
									title: 'Kurum politikaları',
									body: 'Yapay zekâ kullanım politikası, onaylı araçlar listesi ve veri sınıflandırma kuralları ilk başvuru kaynağınızdır.',
								},
							],
						},
						{
							type: 'callout',
							tone: 'info',
							title: 'Veri kullanımı hakkında',
							body: 'Microsoft, kurumsal kullanımda prompt’ların, yanıtların ve Microsoft Graph üzerinden erişilen verilerin temel dil modellerini eğitmek için kullanılmadığını belirtmektedir. Kesin koşullar sözleşmenize, lisansınıza ve kurum yapılandırmanıza bağlıdır.',
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Gizlilik etiketlerinin adları, veri kaybı önleme kuralları ve Copilot’ın erişebildiği kaynaklar kurumdan kuruma değişir. Kesin kurallar için bilgi güvenliği ekibinize danışın.',
						},
					],
					aside: [
						{
							tone: 'tip',
							title: 'Fazla paylaşımı fark ederseniz',
							body: 'Erişmemeniz gereken bir içeriği Copilot yanıtında görürseniz kullanmayın, paylaşmayın ve BT veya bilgi güvenliği ekibine bildirin.',
						},
					],
				},
				{
					id: 'gor',
					phase: 'see',
					title: 'Bir izin sorununun anatomisi',
					blocks: [
						{
							type: 'chat',
							title: 'Copilot Chat · örnek olay',
							messages: [
								{
									role: 'user',
									text: 'Ekibimizin bu yılki maaş artışı oranları hakkında ne biliyorsun?',
								},
								{
									role: 'copilot',
									text: 'Erişebildiğim belgeler arasında “Ücret Planı – Taslak.xlsx” dosyası var. Bu dosyada ekip bazında artış oranları yer alıyor…',
									note: 'Örnek senaryo. Kullanıcının bu dosyaya erişimi olmamalıydı; dosya yanlışlıkla bütün şirketle paylaşılmış.',
								},
							],
						},
						{
							type: 'list',
							style: 'number',
							title: 'Doğru davranış',
							items: [
								'Bilgiyi kullanmayın ve başkalarıyla paylaşmayın.',
								'Durumu BT veya bilgi güvenliği ekibine bildirin.',
								'Dosyanın sahibi paylaşım ayarlarını düzeltsin.',
								'Benzer dosyaların erişim izinleri gözden geçirilsin.',
							],
						},
						{
							type: 'keyPoint',
							body: 'Copilot’ın erişim izinlerine göre çalışacak şekilde tasarlandığı belirtilir; bu yüzden yanlış ayarlanmış bir paylaşım, Copilot yanıtlarında **görünür hâle gelebilir**. Sorun Copilot’ta değil, paylaşım ayarındadır.',
						},
					],
				},
				{
					id: 'kesfet',
					phase: 'explore',
					title: 'Hassasiyet seviyelerini tanıyın',
					blocks: [
						{
							type: 'text',
							body: 'Pek çok kurum bilgiyi hassasiyet seviyelerine göre sınıflandırır. Aşağıdaki örnek seviyeleri açarak her birinde nelere dikkat edilmesi gerektiğini inceleyin.',
						},
						{
							type: 'disclosure',
							items: [
								{
									title: 'Genel',
									body: [
										'Kamuya açık veya herkesle paylaşılabilecek bilgiler: yayımlanmış duyurular, web sitesindeki ürün bilgileri.',
										'Copilot ile rahatça çalışılabilir; doğruluk kontrolü yine gereklidir.',
									],
								},
								{
									title: 'Kuruma özel',
									body: [
										'Çalışanların erişebileceği iç bilgiler: iç prosedürler, proje planları.',
										'Kurumsal Copilot’ta iş amacıyla kullanılabilir; dış alıcılara giden metinlerde dikkat edilmelidir.',
									],
								},
								{
									title: 'Gizli',
									body: [
										'Sınırlı bir grubun erişmesi gereken bilgiler: finansal sonuçlar, sözleşmeler, ihale fiyatları.',
										'Erişiminiz olsa bile kullanım kurallarını kontrol edin; çıktıları yalnızca yetkili kişilerle paylaşın.',
									],
								},
								{
									title: 'Kişisel ve özel nitelikli veri',
									body: [
										'Kimlik, sağlık, maaş, performans ve iletişim bilgileri.',
										'Yalnızca kurumun belirlediği süreç ve sistemlerle, gerekli en az veriyle işlenir.',
									],
								},
							],
						},
						{
							type: 'callout',
							tone: 'availability',
							body: 'Bu seviyeler örnektir. Kurumunuzdaki etiket adları, seviyeler ve her seviyenin kuralları farklı olabilir; güncel sınıflandırma için kurum politikanıza bakın.',
						},
					],
				},
				{
					id: 'uygula',
					phase: 'practice',
					title: 'Örnek olaylarda karar verin',
					blocks: [
						{
							type: 'cases',
							id: 'guvenli-2-olaylar',
							prompt: 'Beş olayın her birinde en doğru davranışı seçin.',
							cases: [
								{
									id: 'musteri',
									title: 'Müşteri listesi',
									situation:
										'Bir satış kampanyası için 2.000 müşterinin adını, telefonunu ve son siparişlerini içeren bir dosyayı Copilot’a özetletmek istiyorsunuz. Dosya kurumsal OneDrive’ınızda ve kampanya için kullanımı onaylı.',
									options: [
										{
											id: 'a',
											text: 'Dosyanın tamamını özetletirim; nasılsa erişimim var.',
											verdict: 'risky',
											feedback:
												'Erişiminizin olması verinin tamamını kullanmanız gerektiği anlamına gelmez; gerekli en az veriyle çalışın.',
										},
										{
											id: 'b',
											text: 'Kurumsal Copilot’ta, yalnızca kampanya için gereken alanlarla çalışırım ve çıktıyı ekip dışında paylaşmam.',
											verdict: 'best',
											feedback: 'Onaylı araç, iş amacı ve gerekli en az veri: doğru yaklaşım.',
										},
										{
											id: 'c',
											text: 'Dosyayı daha hızlı çalışan kişisel bir yapay zekâ uygulamasına yüklerim.',
											verdict: 'wrong',
											feedback: 'Kişisel veriler onaylanmamış bir araca taşınmamalıdır.',
										},
									],
								},
								{
									id: 'beklenmedik',
									title: 'Beklenmedik bir yanıt',
									situation:
										'Copilot’a proje bütçesini sordunuz; yanıtta, erişmemeniz gereken bir İK dosyasından çalışan maaşları da yer alıyor.',
									options: [
										{
											id: 'a',
											text: 'Bilgiyi kullanmam ve durumu BT veya bilgi güvenliği ekibine bildiririm.',
											verdict: 'best',
											feedback: 'Doğru. Bildirmek, dosyanın izinlerinin düzeltilmesini sağlar.',
										},
										{
											id: 'b',
											text: 'Bilgiyi not alırım ama kimseye söylemem.',
											verdict: 'risky',
											feedback:
												'Kullanmamak doğru; ancak bildirmemek sorunun devam etmesine ve başkalarının da erişmesine yol açar.',
										},
										{
											id: 'c',
											text: 'Ekip arkadaşlarımla paylaşırım; nasılsa erişilebilir durumda.',
											verdict: 'wrong',
											feedback:
												'Erişilebilir olması, paylaşılabilir olduğu anlamına gelmez. Bu bir veri ihlali olabilir.',
										},
									],
								},
								{
									id: 'ozet',
									title: 'Toplantı özeti',
									situation:
										'Copilot’ın hazırladığı toplantı özetini yöneticinize göndermek üzeresiniz. Özette bir müşterinin sözleşmeyi feshetme niyeti “kesinleşti” olarak geçiyor; toplantıda bu yalnızca bir olasılık olarak konuşulmuştu.',
									options: [
										{
											id: 'a',
											text: 'Özeti olduğu gibi gönderirim.',
											verdict: 'wrong',
											feedback:
												'Yanlış bir “kesinlik” yöneticinizi yanlış bir karara yönlendirebilir.',
										},
										{
											id: 'b',
											text: 'İfadeyi “olasılık olarak konuşuldu” şeklinde düzeltir, sonra gönderirim.',
											verdict: 'best',
											feedback: 'Bilgiyi doğru ifade ederek riski görünür bıraktınız.',
										},
										{
											id: 'c',
											text: 'Cümleyi tamamen silip gönderirim.',
											verdict: 'risky',
											feedback:
												'Silmek, yöneticinizi önemli bir riskten habersiz bırakabilir; doğru ifade etmek daha iyidir.',
										},
									],
								},
								{
									id: 'hukuk',
									title: 'Sadeleştirilmiş sözleşme maddesi',
									situation:
										'Copilot bir tedarikçi sözleşmesindeki sorumluluk maddesini sadeleştirdi. Bu sade metni tedarikçiye “mutabık kaldığımız madde” olarak göndermek istiyorsunuz.',
									options: [
										{
											id: 'a',
											text: 'Sade metni gönderirim; daha anlaşılır.',
											verdict: 'wrong',
											feedback:
												'Sadeleştirme hukuki anlamı değiştirebilir; bağlayıcı metinler hukuk onayı gerektirir.',
										},
										{
											id: 'b',
											text: 'Sade metni ve orijinali birlikte gönderirim.',
											verdict: 'risky',
											feedback:
												'Hangisinin geçerli olduğu konusunda belirsizlik yaratır; yine de hukuk onayı gerekir.',
										},
										{
											id: 'c',
											text: 'Hukuk ekibinin onayı olmadan göndermem; sade metni yalnızca iç anlayış için kullanırım.',
											verdict: 'best',
											feedback: 'Hukuki metinlerde son değerlendirme uzmanındır.',
										},
									],
								},
								{
									id: 'kisisel',
									title: 'Kişisel hesap',
									situation:
										'Akşam evde çalışırken, kurumsal bir sunumu kişisel e-postanıza gönderip ücretsiz bir yapay zekâ aracıyla düzenlemeyi düşünüyorsunuz.',
									options: [
										{
											id: 'a',
											text: 'Sunumdaki şirket adını silip kişisel araçta düzenlerim.',
											verdict: 'risky',
											feedback:
												'İçerik hâlâ kurumsal bilgi barındırabilir; bu bir politika ihlali olabilir.',
										},
										{
											id: 'b',
											text: 'Bir kerelik olduğu için sorun olmaz.',
											verdict: 'wrong',
											feedback: 'Tek seferlik bir paylaşım da veri sızıntısına yol açabilir.',
										},
										{
											id: 'c',
											text: 'Kurumun onayladığı araçları ve kurumsal hesabımı kullanırım.',
											verdict: 'best',
											feedback: 'Kurumsal içerik, kurumsal ve onaylı araçlarda kalmalıdır.',
										},
									],
								},
							],
						},
					],
					aside: [
						{
							tone: 'explain',
							title: 'Üç tür geri bildirim',
							body: '**En doğru yaklaşım**, **riskli** ve **yanlış**. Riskli seçenekler çoğu zaman iyi niyetlidir ama bir adımı eksik bırakır.',
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
							id: 'guvenli-2-sorular',
							questions: [
								{
									id: 'q1',
									prompt:
										'Bir dosyaya erişiminiz varsa Copilot da o içerikten yararlanabilir. Bu nedenle hangisi önemlidir?',
									options: [
										{ id: 'a', text: 'Dosyaları mümkün olduğunca geniş paylaşmak' },
										{ id: 'b', text: 'Dosya paylaşım izinlerini gerektiği kadar dar tutmak' },
										{ id: 'c', text: 'Hiçbir dosyayı paylaşmamak' },
									],
									correct: 'b',
									explanation:
										'“Gerektiği kadar erişim” ilkesi, hem güvenliği hem de Copilot yanıtlarının doğruluğunu korur.',
								},
								{
									id: 'q2',
									prompt: 'Gizlilik etiketleri hakkında hangisi doğrudur?',
									options: [
										{ id: 'a', text: 'Her kurumda aynı adlara ve kurallara sahiptir.' },
										{
											id: 'b',
											text: 'Kurumun yapılandırmasına göre içeriğin nasıl kullanılabileceğini etkileyebilir.',
										},
										{ id: 'c', text: 'Yalnızca Excel dosyalarında kullanılır.' },
									],
									correct: 'b',
									explanation: 'Etiket adları ve kuralları kurumdan kuruma değişir.',
								},
								{
									id: 'q3',
									prompt:
										'Copilot ile hazırladığınız bir metni dışarı göndermeden önceki son adım nedir?',
									options: [
										{ id: 'a', text: 'Hemen göndermek' },
										{ id: 'b', text: 'Okumak, doğrulamak, alıcıları ve içeriği onaylamak' },
										{ id: 'c', text: 'Copilot’a tekrar yazdırmak' },
									],
									correct: 'b',
									explanation: 'Gönderme kararı ve sorumluluğu her zaman sizdedir.',
								},
							],
						},
					],
				},
			],
			takeaways: [
				'Copilot’ın kurumsal verilere erişimi **izinlerinize** göre şekillenir; paylaşım izinlerini dar tutun.',
				'Hassas bilgiyi **onaylı araçlarda**, gerektiği kadar ve politikaya uygun kullanın.',
				'Beklenmedik bir erişim fark ederseniz **kullanmayın, bildirin**.',
				'Hukuki, finansal, sağlık ve personel kararlarında **insan değerlendirmesi** şarttır.',
			],
		},
	],
}

export default responsible
