# Copilot Academy

**Work smarter. Create faster. Learn Copilot.**

Copilot Academy, Microsoft 365 Copilot’u sıfırdan, uygulayarak öğreten Türkçe ve interaktif bir eğitim uygulamasıdır. 10 modül ve 22 dersin yanı sıra uygulamalı laboratuvarlar, senaryolar, 15 soruluk final testi ve yazdırılabilir bir tamamlama özetinden oluşur. Dersler ve final testi toplam yaklaşık 6 saat sürer (ders sürelerinden hesaplanır: `src/content/index.ts` → `TOTAL_MINUTES`).

> **Önemli:** Bu uygulama eğitim amaçlı, bağımsız bir **simülasyondur**. Gerçek bir Microsoft 365 hesabına bağlanmaz, e-posta göndermez, dosyalara erişmez ve Copilot API’sini çağırmaz. Arayüz turundaki ekran görüntüsü dışında tüm şirketler, kişiler, e-postalar, toplantılar ve satış verileri kurgusaldır (bu görüntü gerçek bir kurumun Copilot uygulamasından alınmıştır; kişisel hesap bilgileri gizlenmiştir); “Copilot yanıtları” önceden hazırlanmış örneklerdir. Uygulama Microsoft ile bağlantılı değildir ve verdiği tamamlama özeti akredite bir sertifika ya da Microsoft sertifikası değildir.

## Hızlı başlangıç

Gereksinim: **Node.js 20.19 veya üzeri** (Vite 7 gereği).

```bash
cd copilot-academy
npm ci            # package-lock.json ile birebir kurulum (veya: npm install)
npm run dev       # geliştirme sunucusu → http://localhost:5173
```

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Vite geliştirme sunucusunu başlatır. |
| `npm run build` | Tip kontrolü (`vue-tsc`) yapar ve `dist/` klasörüne üretim çıktısı alır. |
| `npm run preview` | Üretim çıktısını yerelde sunar → http://localhost:4173 |
| `npm run build:embed` | Yazdırma penceresini engelleyen gömülü görüntüleyiciler için derler (yazdırma düğmesi gizlenir, `.env.embed`). |
| `npm test` | Vitest birim ve bileşen testlerini çalıştırır. |
| `npm run typecheck` | Yalnızca TypeScript/Vue tip kontrolü yapar. |

Üretim çıktısı tamamen statiktir (`base: './'` ve hash tabanlı yönlendirme), bu yüzden `dist/` klasörü herhangi bir statik sunucuya veya alt dizine kopyalanabilir; sunucu tarafı yönlendirme ayarı gerekmez.

`dist/` bir web sunucusu üzerinden (http veya https) açılmalıdır: IIS veya kurum içi web sunucusu, SharePoint ya da herhangi bir statik barındırma. `index.html` dosyasına çift tıklamak veya bir ağ paylaşımından (`\\sunucu\klasor`) açmak Edge ve Chrome'da boş sayfa verir; tarayıcılar `file://` üzerinden modül betiklerini engeller. Yerelde denemek için `npm run preview` yeterlidir.

## Tarayıcıda kullanım

Eğitim tamamen tarayıcıda çalışır; kurulum, hesap veya sunucu tarafı kod gerekmez.

- **Desteklenen tarayıcılar:** Chrome ve Edge 109+, Firefox ESR 115+, Safari ve iOS Safari 15.4+, Samsung Internet 20+. Derleme hedefi (`vite.config.ts` → `build.target`) ve CSS önekleri (`package.json` → `browserslist`) bu listeye göre ayarlıdır.
- **Gezinme:** Adres çubuğundaki `#/...` yolu her sayfayı temsil eder; tarayıcının Geri/İleri düğmeleri ve sayfa yenileme beklendiği gibi çalışır.
- **Kısa bağlantılar:** Adresin sonuna bir modül veya ders kimliği eklemek o sayfayı açar; örneğin `#excel` Excel modülünü, `#word-2` Word modülünün ikinci dersini açar. Kimlikler `src/content/modules/*.ts` dosyalarındaki `id` alanlarıdır. Sunumda katılımcıları doğrudan bir modüle yönlendirmek için kullanılabilir.

## Eğitim içeriği

| # | Modül | Öne çıkan etkileşim |
| --- | --- | --- |
| 1 | Copilot’a Giriş | Copilot arayüz turu (13 durak: 1–9 ve A–D), sınıflandırma alıştırması, 15 sayfalık rapor örneği |
| 2 | Prompt Yazma Atölyesi | 5 bileşenli model, Prompt Builder (kopyalama dahil), zayıf/güçlü prompt karşılaştırması |
| 3 | Copilot Chat | Çok turlu sohbet simülasyonu |
| 4 | Word | Taslak oluşturma, 5 seçenekli yeniden yazma ve karşılaştırma |
| 5 | Outlook | E-posta dizisi: özetle, yanıt hazırla, aksiyonları çıkar; ton değiştirici |
| 6 | Excel | 36 satırlık satış tablosu, 5 analiz türü, veriden üretilen grafikler |
| 7 | PowerPoint | Rapordan 5 slaytlık sunum taslağı, 3 sunum stili |
| 8 | Teams | Toplantı transkripti, 5 çıktı türü, “Belirtilmedi” kuralı |
| 9 | Uygulamalı Senaryolar | 3 uçtan uca iş senaryosu, adım adım seçim ve geri bildirim |
| 10 | Güvenli Kullanım | Karar alıştırmaları, doğrulama ve sorumluluk |

Modüllerin ardından iki ayrı bölüm gelir; bunlar modül sayılmaz:

- **Final Bilgi Testi:** 15 soru, soru başına geri bildirim, %80 geçme puanı.
- **Tamamlama Özeti ve Başarılarım:** rozetler, gelişim alanları ve yazdırılabilir eğitim tamamlama özeti. Özet kendi kendine tamamlanan bir simülasyonun, bu tarayıcıda kaydedilen ve doğrulanmamış ilerlemesini gösterir; sertifika veya resmî kayıt değildir.

Her ders Öğren’den Devam et’e uzanan kısa aşamalardan oluşur: **Öğren, Gör, Keşfet, Uygula, Pekiştir, Devam et.** Aşamaların sayısı ve sırası derse göre değişir (bazı derslerde bir aşama tekrar eder). “Kontrol et” ayrı bir aşama değil, Uygula’daki görevlerin anlık geri bildirimidir; “Devam et”, ders özeti ve sıradaki ders önerisidir. Bir adımdaki zorunlu görev tamamlanmadan “Sonraki” düğmesi açılmaz.

Özelliklerin kullanılabilirliği lisansa, uygulama sürümüne, yönetici ayarlarına ve erişim izinlerine göre değişebilir; içerik bu notları ilgili derslerde açıkça belirtir.

## Proje yapısı

```
src/
├── content/            # Tüm eğitim içeriği (arayüzden bağımsız, tipli veri)
│   ├── modules/        # 01-intro.ts … 10-responsible.ts — dersler ve adımlar
│   ├── datasets/       # Örnek veriler: satış tablosu, e-posta dizisi, transkript…
│   ├── quiz.ts         # Final testi soruları
│   ├── badges.ts       # Rozet tanımları ve kazanma koşulları
│   └── index.ts        # Modül listesi, ders sırası, süre ve sayılar
├── components/
│   ├── blocks/         # Metin, kavram kartları, karşılaştırma, açılır paneller…
│   ├── tasks/          # Seçim, sınıflandırma, sıralama, bulma görevleri ve soru setleri
│   ├── interactive/    # Prompt Builder, Excel laboratuvarı, sunum stüdyosu vb.
│   ├── lesson/         # Ders adımları, kenar paneli, alt kontrol çubuğu
│   ├── layout/         # Kenar menüsü, mobil menü, üst bar
│   └── dashboard/, ui/ # Panel kartları ve ortak arayüz parçaları
├── lib/                # Saf mantık: prompt oluşturma, satış analizi, grafikler, puanlama
├── stores/progress.ts  # Pinia ilerleme deposu (localStorage)
├── pages/              # Karşılama, panel, modül, ders, test, başarılar
└── tests/              # Vitest testleri
```

**Teknolojiler:** Vue 3 + TypeScript, Vite, Tailwind CSS, Pinia, Vue Router, Apache ECharts (yalnızca Excel laboratuvarında, gecikmeli yüklenir), lucide ikonları, Vitest. Bu seçimler deponun mevcut ön yüzüyle (Vue 3 + Tailwind) uyumlu olacak şekilde yapıldı.

## İçerik düzenleme

İçerik, arayüz kodundan ayrıdır. Bir dersi düzenlemek için ilgili `src/content/modules/*.ts` dosyasını açın. Her ders `steps` dizisinden oluşur; her adımın bir `phase` değeri (`learn`, `see`, `explore`, `practice`, `reinforce`) ve `blocks` listesi vardır. Ders özeti (“Devam et”) otomatik eklenir. Blok türleri `src/types/content.ts` içinde tanımlıdır; TypeScript, eksik veya hatalı alanları derleme sırasında yakalar.

- Metinlerde yalnızca `**kalın**` biçimi desteklenir (HTML yorumlanmaz).
- Görev blokları (`choice`, `classify`, `order`, `spot`, `questions`, `cases`) benzersiz bir `id` taşımalıdır; ilerleme bu kimliklerle saklanır.
- `src/tests/content.test.ts`, her dersin tüm öğrenme aşamalarını içerdiğini, kimliklerin benzersiz olduğunu, her görevin cevaplanabilir olduğunu ve test sorularının geçerli tek bir cevabı olduğunu doğrular. İçerik değiştirdikten sonra `npm test` çalıştırın.

## Veri ve gizlilik

- İlerleme yalnızca tarayıcıda, `localStorage` içindeki `copilot-academy:progress` anahtarında tutulur. Sunucu, hesap veya analitik yoktur.
- Kayıt cihaza ve tarayıcıya özeldir; başka bir cihazda veya tarayıcıda ilerleme görünmez. Safari ve iOS, siteyi yaklaşık bir hafta boyunca açmayan kullanıcıların sitede sakladığı verileri silebilir (Intelligent Tracking Prevention). Tamamlama takibi kurumsal olarak gerekiyorsa bir LMS (SCORM/xAPI) veya sunucu entegrasyonu gerekir.
- Aynı tarayıcıda birden fazla sekme açıksa ilerleme sekmeler arasında eşitlenir.
- Saklanan veriler: tamamlanan ders/görev kimlikleri, seçilen cevap seçenekleri, arayüz turunda açılan ve “denendi” olarak işaretlenen duraklar, rapor gezgininde seçilen hazır promptlar ve açılan sayfa numaraları, test puanları, rozetler ve son etkinlikler. Tur durakları ve rapor gezgini seçimleri, görev tamamlanmadan da o anda kaydedilir; böylece sayfa yenilense ya da önceki adıma dönülse bile kaybolmaz. Bunlar yalnızca kimlik ve numara olarak tutulur. Kullanıcının yazdığı serbest metinler (ör. Prompt Builder alanları) **saklanmaz**.
- Tamamlama özetinde isteğe bağlı olarak yazılan ad da kaydedilmez; yalnızca yazdırma için kullanılır.
- Panel sayfasındaki “İlerlemeyi sıfırla” bölümünden (iki adımlı onayla) tüm kayıtlar silinebilir.

## Testler

`npm test` şunları kapsar: prompt oluşturma ve kalite ipuçları, satış verisi analizleri (bölge/ürün/ay toplamları, hedef altı segmentler, aykırı değerler), test puanlama ve geçme eşiği, ilerleme deposu (kalıcılık, bozuk veri koruması, rozetler), içerik bütünlüğü ve temel bileşen etkileşimleri (seçim, sınıflandırma, Prompt Builder kopyalama).
