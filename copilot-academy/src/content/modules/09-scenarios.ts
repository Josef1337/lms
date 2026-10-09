import type { Lesson, Module } from '@/types/content'

/** The four stages every scenario moves through, shown before the learner plays it. */
const stages = (items: [string, string][]) => ({
	type: 'reveal' as const,
	surface: 'scenario' as const,
	intro:
		'Senaryoya başlamadan önce iş akışının aşamalarına bakın. Hangi uygulamayı ve prompt’u kullanacağınızı bir sonraki adımda siz seçeceksiniz.',
	steps: items.map(([title, body]) => ({ title, body })),
})

const lessonA: Lesson = {
	id: 'senaryo-a',
	title: 'Senaryo A: Yönetim toplantısına hazırlanma',
	summary:
		'Uzun bir raporu özetleyin, göstergeleri belirleyin, yönetici e-postası ve sunum akışı hazırlayın.',
	minutes: 14,
	objectives: [
		'Bir hazırlık işini dört adıma bölmek',
		'Her adım için doğru uygulamayı ve prompt’u seçmek',
		'Bir adımın çıktısını sonraki adımda kullanmak',
	],
	steps: [
		{
			id: 'ogren',
			phase: 'learn',
			title: 'Senaryo brifingi',
			blocks: [
				{
					type: 'text',
					lead: true,
					body: 'Yarın sabah yönetim toplantısı var ve elinizde 15 sayfalık bir müşteri deneyimi raporu bulunuyor. Bu senaryoda Copilot’ı farklı uygulamalarda **tek bir iş akışı** olarak kullanacaksınız.',
				},
				{
					type: 'concepts',
					items: [
						{
							icon: 'route',
							title: 'İşi adımlara bölün',
							body: 'Büyük hedef: “toplantıya hazır olmak”. Küçük adımlar: anla, ölç, bilgilendir, sun.',
						},
						{
							icon: 'layers',
							title: 'Doğru uygulamayı seçin',
							body: 'Her iş, yapıldığı uygulamada daha iyi bağlamla ilerler.',
						},
						{
							icon: 'wand',
							title: 'Etkili prompt’u seçin',
							body: 'Aynı uygulamada zayıf ve güçlü prompt’lar farklı sonuç verir.',
						},
						{
							icon: 'scan',
							title: 'Zinciri kontrol edin',
							body: 'Bir adımdaki hata sonraki adımlara taşınır; her çıktıyı kontrol edin.',
						},
					],
				},
			],
		},
		{
			id: 'gor',
			phase: 'see',
			title: 'İş akışının aşamaları',
			blocks: [
				stages([
					['Anla', 'Raporun ne söylediğini kısa ve kaynaklı bir özetle görün.'],
					['Ölç', 'Yönetimin izlemesi gereken göstergeleri mevcut değer ve hedefleriyle çıkarın.'],
					[
						'Bilgilendir',
						'Yöneticinize toplantı öncesinde kısa ve net bir e-posta taslağı hazırlayın.',
					],
					['Sun', 'Toplantı için 5 dakikalık, karar odaklı bir sunum akışı oluşturun.'],
				]),
			],
		},
		{
			id: 'kesfet',
			phase: 'explore',
			title: 'Senaryoyu oynayın',
			wide: true,
			blocks: [
				{
					type: 'interactive',
					component: 'scenarioRunner',
					taskId: 'senaryo-a-oyun',
					props: { scenarioId: 'yonetim' },
				},
			],
			aside: [
				{
					tone: 'tip',
					title: 'Yanlış seçim de öğreticidir',
					body: 'Hatalı bir seçim yaptığınızda nedenini okuyun ve başka bir seçenek deneyin. Puanınız ilk seçimlerinize göre hesaplanır.',
				},
				{
					tone: 'explain',
					title: 'Neden bu sıra?',
					body: 'İletişim (e-posta, sunum), anlamaya (özet, göstergeler) dayanır. Sırayı tersine çevirmek, doğrulanmamış bilgiyi yaymak demektir.',
				},
			],
		},
		{
			id: 'uygula',
			phase: 'practice',
			title: 'Akışı değerlendirin',
			blocks: [
				{
					type: 'choice',
					id: 'senaryo-a-risk',
					prompt: 'Bu senaryoda hangi adım atlanırsa en büyük risk doğar?',
					options: [
						{
							id: 'a',
							text: 'Sunum başlıklarını mesaj taşıyacak şekilde yazmak',
							feedback: 'Önemli bir kalite adımı, ama atlanması doğruluk riski yaratmaz.',
						},
						{
							id: 'b',
							text: 'Özet ve göstergelerdeki rakamları raporla karşılaştırmak',
							correct: true,
							feedback:
								'Doğrulanmamış bir rakam e-postaya ve sunuma taşınır; hata yönetime kadar ulaşır.',
						},
						{
							id: 'c',
							text: 'E-postayı 120 kelimeyle sınırlamak',
							feedback: 'Okunabilirliği artırır, ama atlanması büyük bir risk yaratmaz.',
						},
					],
					explanation:
						'Zincirleme iş akışlarında **ilk adımdaki doğrulama**, sonraki bütün adımların kalitesini belirler.',
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
					id: 'senaryo-a-sorular',
					questions: [
						{
							id: 'q1',
							prompt: 'Rapordaki göstergelerin hedefi raporda yazmıyorsa ne yapmalısınız?',
							options: [
								{ id: 'a', text: 'Copilot’tan sektör ortalamasına göre hedef üretmesini istemek' },
								{
									id: 'b',
									text: '“Hedef: Belirtilmedi” yazmak ve gerekirse hedefi ilgili ekipten öğrenmek',
								},
								{ id: 'c', text: 'Göstergeyi tablodan çıkarmak' },
							],
							correct: 'b',
							explanation: 'Kaynakta olmayan bir hedefi uydurmak yerine eksikliği görünür kılın.',
						},
					],
				},
			],
		},
	],
	takeaways: [
		'Büyük bir hazırlık işi **anla → ölç → bilgilendir → sun** adımlarına bölünebilir.',
		'Her adımı, işin yapıldığı uygulamada yürütmek bağlamı güçlendirir.',
		'İlk adımdaki doğrulama, zincirin geri kalanını korur.',
	],
}

const lessonB: Lesson = {
	id: 'senaryo-b',
	title: 'Senaryo B: Satış performansını değerlendirme',
	summary:
		'Excel verisini inceleyin, eğilimleri ve riskleri çıkarın, yönetici için öneri notu yazın.',
	minutes: 14,
	objectives: [
		'Veri analizini adım adım ilerletmek',
		'Bulgu, varsayım ve doğrulanması gereken kaydı ayırmak',
		'Bulgulardan karar odaklı bir not oluşturmak',
	],
	steps: [
		{
			id: 'ogren',
			phase: 'learn',
			title: 'Senaryo brifingi',
			blocks: [
				{
					type: 'text',
					lead: true,
					body: 'Bölge satış müdürüsünüz. Excel laboratuvarındaki Ocak–Nisan satış verisine dayanarak yönetim için kısa bir **öneri notu** hazırlayacaksınız.',
				},
				{
					type: 'list',
					style: 'check',
					title: 'Bu senaryoda dikkat edilecekler',
					items: [
						'Önce veriyi tanıyın; sonra sorgulayın.',
						'Veride olmayan nedenleri (fiyat, rakip, kampanya) yorumlamayın.',
						'Sıra dışı kayıtları kesin bilgi gibi değil, “doğrulanmalı” olarak aktarın.',
						'Not kişileri değil, veriyi ve önerileri ele alsın.',
					],
				},
			],
		},
		{
			id: 'gor',
			phase: 'see',
			title: 'İş akışının aşamaları',
			blocks: [
				stages([
					['Tanı', 'Verinin yapısını ve toplamlarını görün.'],
					['Sorgula', 'Zaman ve ürün kırılımında eğilimleri bulun.'],
					['Ayıkla', 'Hedefin altındaki alanları ve sıra dışı kayıtları belirleyin.'],
					['Öner', 'Bulgulara dayanan, karar odaklı bir not yazın.'],
				]),
			],
		},
		{
			id: 'kesfet',
			phase: 'explore',
			title: 'Senaryoyu oynayın',
			wide: true,
			blocks: [
				{
					type: 'interactive',
					component: 'scenarioRunner',
					taskId: 'senaryo-b-oyun',
					props: { scenarioId: 'satis' },
				},
			],
			aside: [
				{
					tone: 'tip',
					title: 'Rakamlar tanıdık mı?',
					body: 'Çıktılardaki rakamlar Excel laboratuvarında hesaplanan değerlerle aynı. İsterseniz Modül 6’ya dönüp karşılaştırabilirsiniz.',
				},
				{
					tone: 'explain',
					title: '“Neden” sorusu',
					body: 'Veri “ne oldu”yu gösterir; “neden oldu” sorusunun yanıtı genellikle verinin dışındadır ve insanlarla konuşarak bulunur.',
				},
			],
		},
		{
			id: 'uygula',
			phase: 'practice',
			title: 'Notu değerlendirin',
			blocks: [
				{
					type: 'choice',
					id: 'senaryo-b-not',
					prompt: 'Öneri notunuza hangi cümle **eklenmemelidir**?',
					options: [
						{
							id: 'a',
							text: '“Ege bölgesi hedefin %9,5 üzerinde.”',
							feedback: 'Veriden hesaplanan bir bulgu; eklenebilir.',
						},
						{
							id: 'b',
							text: '“İç Anadolu ekibi yeterince çalışmıyor.”',
							correct: true,
							feedback:
								'Veriye dayanmayan, kişileri hedef alan bir yargı. Performans değerlendirmesi insan kararıdır.',
						},
						{
							id: 'c',
							text: '“Şubat · İç Anadolu kaydı doğrulanmalı.”',
							feedback: 'Doğru biçimde ifade edilmiş bir doğrulama ihtiyacı; eklenebilir.',
						},
					],
					explanation:
						'Yönetici notunda **veri, varsayım ve yargı** ayrılmalıdır. Kişiler hakkındaki değerlendirmeler veri analizinden çıkarılamaz.',
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
					id: 'senaryo-b-sorular',
					questions: [
						{
							id: 'q1',
							prompt: 'Copilot’a “İç Anadolu neden kötü?” diye sormak neden zayıf bir ilk adımdır?',
							options: [
								{
									id: 'a',
									text: 'Çünkü veride neden bilgisi yok; Copilot ancak tahmin üretebilir.',
								},
								{ id: 'b', text: 'Çünkü Copilot bölge adlarını tanımaz.' },
								{ id: 'c', text: 'Çünkü soru çok kısadır.' },
							],
							correct: 'a',
							explanation:
								'Önce “ne kadar ve nerede?” sorusunu veriye sorun; “neden?” sorusunu ise ilgili ekiplere.',
						},
					],
				},
			],
		},
	],
	takeaways: [
		'Veri analizi **tanı → sorgula → ayıkla → öner** sırasıyla ilerler.',
		'“Ne oldu?” sorusunu veriye, “neden oldu?” sorusunu insanlara sorun.',
		'Not; bulgu, öneri ve doğrulama ihtiyacını ayırmalı, kişileri değil veriyi ele almalıdır.',
	],
}

const lessonC: Lesson = {
	id: 'senaryo-c',
	title: 'Senaryo C: Proje toplantısı sonrası',
	summary:
		'Transkripti özetleyin, kararları ve aksiyonları çıkarın, takip e-postası ve gündem hazırlayın.',
	minutes: 13,
	objectives: [
		'Toplantı sonrası işleri doğru sırayla yürütmek',
		'Kararları, ertelenen konuları ve eksik bilgileri ayırmak',
		'Toplantı sonuçlarını takip ve gündemle eyleme dönüştürmek',
	],
	steps: [
		{
			id: 'ogren',
			phase: 'learn',
			title: 'Senaryo brifingi',
			blocks: [
				{
					type: 'text',
					lead: true,
					body: 'Proje yöneticisisiniz ve haftalık toplantı az önce bitti. Transkript hazır. Ekibin aynı bilgiyle çalışması için **takip e-postası** göndermeniz ve bir sonraki toplantının **gündemini** hazırlamanız gerekiyor.',
				},
				{
					type: 'keyPoint',
					body: 'Toplantı sonrası işlerin altın kuralı: **Transkriptte olmayan hiçbir karar, sorumlu veya tarih** takip mesajına girmez.',
				},
			],
		},
		{
			id: 'gor',
			phase: 'see',
			title: 'İş akışının aşamaları',
			blocks: [
				stages([
					['Özetle', 'Toplantıya katılamayanlar için kısa bir özet; ertelenen kararlar dahil.'],
					['Ayır', 'Kararları, aksiyonları ve eksik bilgileri listeleyin.'],
					['Paylaş', 'Katılımcılara kısa bir takip e-postası taslağı hazırlayın.'],
					['Planla', 'Açık konulara göre bir sonraki toplantının gündemini oluşturun.'],
				]),
			],
		},
		{
			id: 'kesfet',
			phase: 'explore',
			title: 'Senaryoyu oynayın',
			wide: true,
			blocks: [
				{
					type: 'interactive',
					component: 'scenarioRunner',
					taskId: 'senaryo-c-oyun',
					props: { scenarioId: 'toplanti' },
				},
			],
			aside: [
				{
					tone: 'tip',
					title: 'Tanıdık bir toplantı',
					body: 'Bu senaryo, Teams laboratuvarındaki toplantıyı kullanır. Çıktıları oradaki transkriptle karşılaştırabilirsiniz.',
				},
				{
					tone: 'note',
					title: 'Kullanılabilirlik',
					body: 'Toplantı özetleri ve notlara erişim; lisansa, toplantı ayarlarına ve izinlerinize bağlıdır.',
				},
			],
		},
		{
			id: 'uygula',
			phase: 'practice',
			title: 'Takibi değerlendirin',
			blocks: [
				{
					type: 'choice',
					id: 'senaryo-c-takip',
					prompt: 'Takip e-postasını göndermeden önce en önemli kontrol hangisidir?',
					options: [
						{
							id: 'a',
							text: 'E-postanın yazı tipini ve rengini kontrol etmek',
							feedback: 'Biçim önemlidir, ama içerik doğruluğu kadar değil.',
						},
						{
							id: 'b',
							text: 'Sorumluların ve tarihlerin transkriptle uyuştuğunu, eksiklerin “Belirtilmedi” olarak kaldığını kontrol etmek',
							correct: true,
							feedback:
								'Yanlış atanmış bir görev veya uydurulmuş bir tarih, ekipte karışıklığa yol açar.',
						},
						{
							id: 'c',
							text: 'E-postayı mümkün olduğunca uzun tutmak',
							feedback: 'Kısa ve yapılandırılmış takip mesajları daha etkilidir.',
						},
					],
					explanation:
						'Takip mesajı, toplantının resmî kaydı gibi okunur; doğruluğu bu yüzden kritiktir.',
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
					id: 'senaryo-c-sorular',
					questions: [
						{
							id: 'q1',
							prompt: 'Bir sonraki toplantının gündemi en iyi neye dayanır?',
							options: [
								{ id: 'a', text: 'Genel bir toplantı şablonuna' },
								{ id: 'b', text: 'Önceki toplantıdaki açık konulara ve ertelenen kararlara' },
								{ id: 'c', text: 'Katılımcı sayısına' },
							],
							correct: 'b',
							explanation:
								'Açık konular ve ertelenen kararlar, bir sonraki toplantının amacını belirler.',
						},
					],
				},
			],
		},
	],
	takeaways: [
		'Toplantı sonrası akış: **özetle → ayır → paylaş → planla**.',
		'Takip mesajı, transkriptte olmayan bilgiyi içermemelidir.',
		'Gündem, açık konulara ve ertelenen kararlara dayanmalıdır.',
	],
}

const scenarios: Module = {
	id: 'senaryolar',
	number: 9,
	title: 'Uçtan Uca İş Senaryoları',
	navLabel: 'Uygulamalı Senaryolar',
	tagline: 'Uygulamaları tek bir iş akışında birleştirin',
	description:
		'Gerçekçi üç iş senaryosunda Word, Excel, Outlook, PowerPoint, Teams ve Copilot Chat’i birlikte kullanın. Her adımda doğru uygulamayı ve doğru prompt’u seçin; hatalı seçimlerde nedenini öğrenin.',
	visual: 'scenario',
	skills: ['apps', 'prompting', 'data', 'meetings'],
	objectives: [
		'Bir iş hedefini uygulama adımlarına bölmek',
		'Her adım için doğru uygulamayı seçmek',
		'Her adımda etkili prompt’u seçmek',
		'Bir adımın çıktısını sonraki adımın girdisi olarak kullanmak',
	],
	availability:
		'Senaryolardaki uygulamaların ve Copilot özelliklerinin kullanılabilirliği lisansınıza, uygulama sürümlerine ve kurum ayarlarınıza bağlıdır. Uygulamalar arası geçişler örnek olarak gösterilmiştir.',
	lessons: [lessonA, lessonB, lessonC],
}

export default scenarios
