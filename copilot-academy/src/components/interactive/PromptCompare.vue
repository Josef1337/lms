<script setup lang="ts">
import { computed, ref } from 'vue'
import {
	CircleAlert,
	CircleCheck,
	Highlighter,
	ScanSearch,
	Sparkles,
	TrendingUp,
} from 'lucide-vue-next'
import type { PromptPart } from '@/types/content'
import { PART_META, PART_ORDER } from '@/lib/promptBuilder'
import { PART_STYLE } from '@/components/ui/promptParts'
import RichText from '@/components/ui/RichText.vue'
import SimNotice from '@/components/ui/SimNotice.vue'

const WEAK = 'Bir rapor hazırla.'

const STRONG: { text: string; part?: PromptPart }[] = [
	{ text: 'Satış ekibinin yöneticisi için', part: 'constraints' },
	{ text: ', ' },
	{ text: 'sağlanan satış verilerini temel alarak', part: 'source' },
	{ text: ' ' },
	{ text: 'son çeyrek performansını değerlendiren kısa bir rapor hazırla', part: 'goal' },
	{ text: '. ' },
	{
		text: 'En önemli üç bulguyu, hedeflerden sapmaları ve uygulanabilir önerileri ayrı başlıklarla sun',
		part: 'expectation',
	},
	{ text: '. ' },
	{ text: 'Veride bulunmayan sonuçları varsayma; eksik bilgileri belirt', part: 'constraints' },
	{ text: '.' },
]

const TABS = [
	{
		id: 'missing',
		label: 'Hangi bilgi eksikti?',
		icon: CircleAlert,
		items: [
			'Raporun **konusu**: hangi dönem, hangi alan?',
			'**Hedef kitle**: raporu kim okuyacak?',
			'**Kaynak**: hangi veriye dayanacak?',
			'**Biçim**: kaç bölüm, ne uzunlukta?',
			'**Kurallar**: veride olmayan bilgi için ne yapılacak?',
		],
	},
	{
		id: 'resolved',
		label: 'Hangi belirsizlik giderildi?',
		icon: CircleCheck,
		items: [
			'Konu → “son çeyrek performansı”',
			'Okuyucu → “satış ekibinin yöneticisi”',
			'Dayanak → “sağlanan satış verileri”',
			'Yapı → “üç bulgu, sapmalar ve öneriler; ayrı başlıklarla”',
			'Sınır → “veride olmayanı varsayma, eksikleri belirt”',
		],
	},
	{
		id: 'quality',
		label: 'Kalite neden artabilir?',
		icon: TrendingUp,
		items: [
			'Copilot tahmin yerine talimatla çalışır; konu dışına çıkma ihtimali azalır.',
			'Kaynak belirtildiği için rakamların sizin verinizden gelmesi beklenir.',
			'Yapı tanımlı olduğu için çıktı, az düzeltmeyle kullanılabilir hâle yaklaşır.',
			'Doğrulama kısıtı, eksik bilginin uydurulması yerine görünür olmasını teşvik eder.',
			'Bu bir olasılıktır, garanti değildir: güçlü prompt da hatalı çıktı üretebilir.',
		],
	},
	{
		id: 'verify',
		label: 'Sonuç nasıl doğrulanmalı?',
		icon: ScanSearch,
		items: [
			'Üç bulgudaki rakamları satış tablosuyla tek tek karşılaştırın.',
			'Sapmaların doğru hedef değerlerine göre hesaplandığını kontrol edin.',
			'Önerilerin veriye dayandığını, varsayım içermediğini okuyun.',
			'“Eksik bilgi” olarak belirtilen noktaları ilgili ekipten tamamlayın.',
		],
	},
] as const

type TabId = typeof TABS[number]['id']
const tab = ref<TabId>('missing')
const activeTab = computed(() => TABS.find((t) => t.id === tab.value)!)
const highlight = ref(true)
const showOutputs = ref(false)

const strongParts = PART_ORDER.filter((p) => STRONG.some((s) => s.part === p))

function onTabKey(event: KeyboardEvent, index: number) {
	if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
	const dir = event.key === 'ArrowRight' ? 1 : -1
	const rtl = document.documentElement.dir === 'rtl' ? -1 : 1
	const next = TABS[(index + dir * rtl + TABS.length) % TABS.length]
	tab.value = next.id
	document.getElementById(`compare-tab-${next.id}`)?.focus()
}
</script>

<template>
	<div class="space-y-4">
		<div class="grid gap-3 md:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)]">
			<section class="rounded-2xl border border-dashed border-ink-300 bg-ink-50/70 p-4 sm:p-5">
				<p class="eyebrow">Zayıf prompt</p>
				<p class="mt-3 font-display text-2xl font-semibold text-ink-500">“{{ WEAK }}”</p>
				<p class="mt-3 text-[13px] text-ink-500">
					Yalnızca bir görev var; geri kalan her şey Copilot’ın tahminine kalıyor.
				</p>
				<div class="mt-3 flex flex-wrap gap-1.5">
					<span
						v-for="part in PART_ORDER"
						:key="part"
						:class="[
							'chip ring-1 ring-inset',
							part === 'goal'
								? PART_STYLE[part].chip
								: 'bg-white text-ink-400 ring-ink-200 line-through',
						]"
					>
						{{ PART_META[part].label }}
					</span>
				</div>
			</section>
			<section
				class="rounded-2xl border border-success-100 bg-white p-4 shadow-card ring-1 ring-success-100 sm:p-5"
			>
				<div class="flex items-center justify-between gap-2">
					<p class="eyebrow !text-success-700">Geliştirilmiş prompt</p>
					<button
						type="button"
						:aria-pressed="highlight"
						:class="['btn btn-sm', highlight ? 'btn-secondary' : 'btn-ghost']"
						@click="highlight = !highlight"
					>
						<Highlighter :size="14" aria-hidden="true" /> Vurgula
					</button>
				</div>
				<p class="mt-3 text-[15.5px] leading-[2] text-ink-800">
					<template v-for="(seg, i) in STRONG" :key="i">
						<mark
							v-if="seg.part && highlight"
							:class="[
								'rounded px-1 py-0.5 underline decoration-2 underline-offset-4 [box-decoration-break:clone]',
								PART_STYLE[seg.part].mark,
							]"
							>{{ seg.text }}</mark
						>
						<span v-else>{{ seg.text }}</span>
					</template>
				</p>
				<div class="mt-3 flex flex-wrap gap-1.5">
					<span
						v-for="part in PART_ORDER"
						:key="part"
						:class="[
							'chip ring-1 ring-inset',
							strongParts.includes(part)
								? PART_STYLE[part].chip
								: 'bg-white text-ink-400 ring-ink-200 line-through',
						]"
					>
						{{ PART_META[part].label }}
					</span>
				</div>
			</section>
		</div>

		<section class="card overflow-hidden">
			<div
				class="flex gap-1 overflow-x-auto border-b border-ink-100 bg-ink-50/60 p-1.5 scrollbar-thin"
				role="tablist"
				aria-label="Karşılaştırma"
			>
				<button
					v-for="(t, i) in TABS"
					:id="`compare-tab-${t.id}`"
					:key="t.id"
					type="button"
					role="tab"
					:aria-selected="tab === t.id"
					:aria-controls="`compare-panel-${t.id}`"
					:tabindex="tab === t.id ? 0 : -1"
					:class="[
						'flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-[13px] font-semibold transition',
						tab === t.id ? 'bg-white text-ink-900 shadow-card' : 'text-ink-500 hover:text-ink-800',
					]"
					@click="tab = t.id"
					@keydown="onTabKey($event, i)"
				>
					<component :is="t.icon" :size="15" aria-hidden="true" />
					{{ t.label }}
				</button>
			</div>
			<div
				:id="`compare-panel-${activeTab.id}`"
				:key="activeTab.id"
				role="tabpanel"
				:aria-labelledby="`compare-tab-${activeTab.id}`"
				class="animate-fade-in p-4 sm:p-5"
			>
				<ul class="space-y-2.5" role="list">
					<li
						v-for="(item, i) in activeTab.items"
						:key="i"
						class="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-700"
					>
						<span
							class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-success-600"
							aria-hidden="true"
						/>
						<RichText :text="item" />
					</li>
				</ul>
			</div>
		</section>

		<div>
			<button
				type="button"
				class="btn btn-secondary"
				:aria-expanded="showOutputs"
				@click="showOutputs = !showOutputs"
			>
				<Sparkles :size="16" class="text-iris-600" aria-hidden="true" />
				{{ showOutputs ? 'Örnek çıktıları gizle' : 'İki prompt’un örnek çıktılarını karşılaştır' }}
			</button>
		</div>

		<div v-if="showOutputs" class="animate-fade-up space-y-3">
			<SimNotice
				compact
				text="Örnek çıktılar eğitim amaçlı hazırlanmıştır; rakamlar kurgusaldır."
			/>
			<div class="grid gap-3 md:grid-cols-2">
				<article class="rounded-2xl border border-ink-200 bg-white p-4 sm:p-5">
					<p class="eyebrow">Zayıf prompt’un olası çıktısı</p>
					<h4 class="mt-2 text-[16px] font-semibold text-ink-700">Rapor</h4>
					<div class="mt-2 space-y-2 text-[14px] leading-relaxed text-ink-500">
						<p>Bu rapor, şirketin genel durumunu değerlendirmektedir.</p>
						<p>
							Satışlar genel olarak olumlu seyretmiştir. Bazı alanlarda iyileştirme fırsatları
							bulunmaktadır.
						</p>
						<p>Gelecek dönemde başarının sürmesi için çalışmalar devam ettirilmelidir.</p>
					</div>
					<p class="mt-3 rounded-lg bg-danger-50 px-3 py-2 text-[12.5px] text-danger-700">
						Genel, kaynaksız ve doğrulanamaz. Kim için ve neden yazıldığı belli değil.
					</p>
				</article>
				<article class="rounded-2xl border border-success-100 bg-white p-4 shadow-card sm:p-5">
					<p class="eyebrow !text-success-700">Geliştirilmiş prompt’un olası çıktısı</p>
					<h4 class="mt-2 text-[16px] font-semibold">Son Çeyrek Satış Performansı</h4>
					<div class="mt-2 space-y-3 text-[13.5px] leading-relaxed text-ink-700">
						<div>
							<p class="font-semibold text-ink-900">1. Önemli bulgular</p>
							<ul class="mt-1 list-disc space-y-0.5 ps-5">
								<li>Toplam satış hedefin %3 üzerinde gerçekleşti.</li>
								<li>Kuzey bölgesi hedefi %12 aştı; Güney bölgesi %9 geride kaldı.</li>
								<li>Kurumsal segment, toplam büyümenin yaklaşık %70’ini sağladı.</li>
							</ul>
						</div>
						<div>
							<p class="font-semibold text-ink-900">2. Hedeflerden sapmalar</p>
							<ul class="mt-1 list-disc space-y-0.5 ps-5">
								<li>Güney · yazılım lisansları: hedefin %18 altında.</li>
								<li>Eylül’de yeni müşteri sayısı hedefin %25 altında.</li>
							</ul>
						</div>
						<div>
							<p class="font-semibold text-ink-900">3. Öneriler</p>
							<ul class="mt-1 list-disc space-y-0.5 ps-5">
								<li>Güney bölgesi için müşteri bazlı bir takip planı hazırlanması.</li>
								<li>Kurumsal segmentteki satış yaklaşımının KOBİ ekibiyle paylaşılması.</li>
							</ul>
						</div>
						<p class="rounded-lg bg-warning-50 px-3 py-2 text-[12.5px] text-warning-700">
							<strong class="font-semibold">Eksik bilgi:</strong> Veride kâr marjı ve kampanya
							bilgisi bulunmuyor; önerilerin maliyet etkisi hesaplanamadı.
						</p>
					</div>
				</article>
			</div>
		</div>
	</div>
</template>
