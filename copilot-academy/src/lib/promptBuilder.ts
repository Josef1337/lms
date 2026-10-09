// Turns the Prompt Builder's fields into a readable Turkish prompt. Each
// field is written as a sentence whose wording does not depend on how the
// learner inflected their input (Turkish suffixes can't be added safely), and
// every sentence remembers which part of the prompt model it belongs to so
// the UI can colour it.
import type { PromptPart } from '@/types/content'

export interface PromptFields {
	task: string
	context: string
	audience: string
	source: string
	format: string
	tone: string
	constraints: string
	verify: boolean
}

export type FieldKey = Exclude<keyof PromptFields, 'verify'>

export interface PromptSegment {
	text: string
	part: PromptPart
	field: FieldKey | 'verify'
}

export interface PromptHint {
	field: FieldKey
	part: PromptPart
	message: string
}

export const emptyFields = (): PromptFields => ({
	task: '',
	context: '',
	audience: '',
	source: '',
	format: '',
	tone: '',
	constraints: '',
	verify: false,
})

export const PART_META: Record<PromptPart, { label: string; question: string }> = {
	goal: { label: 'Amaç', question: 'Ne yapılmasını istiyorum?' },
	context: { label: 'Bağlam', question: 'Hangi bilgiler gerekli?' },
	source: { label: 'Kaynak', question: 'Hangi dosya, belge veya bilgiler kullanılmalı?' },
	expectation: { label: 'Beklenti', question: 'Nasıl bir çıktı istiyorum?' },
	constraints: { label: 'Kısıtlar', question: 'Ton, uzunluk, hedef kitle veya format nedir?' },
}

export const PART_ORDER: PromptPart[] = ['goal', 'context', 'source', 'expectation', 'constraints']

export const FIELD_PART: Record<FieldKey, PromptPart> = {
	task: 'goal',
	context: 'context',
	audience: 'constraints',
	source: 'source',
	format: 'expectation',
	tone: 'constraints',
	constraints: 'constraints',
}

const VERIFY_SENTENCE =
	'Kaynakta bulunmayan bilgileri varsayma; emin olmadığın veya eksik olan noktaları ayrıca belirt.'

/** Trims, collapses whitespace and drops a trailing full stop or comma. */
function clean(value: string): string {
	return value
		.replace(/\s+/g, ' ')
		.trim()
		.replace(/[.,;:]+$/, '')
}

function sentenceCase(value: string): string {
	return value.charAt(0).toLocaleUpperCase('tr-TR') + value.slice(1)
}

export function buildSegments(fields: PromptFields): PromptSegment[] {
	const segments: PromptSegment[] = []
	const push = (field: FieldKey | 'verify', part: PromptPart, text: string) =>
		segments.push({ field, part, text })

	const task = clean(fields.task)
	const context = clean(fields.context)
	const audience = clean(fields.audience)
	const source = clean(fields.source)
	const format = clean(fields.format)
	const tone = clean(fields.tone)
	const constraints = clean(fields.constraints)

	if (task) push('task', 'goal', `${sentenceCase(task)}.`)
	if (context) push('context', 'context', `Bağlam: ${context}.`)
	if (audience) push('audience', 'constraints', `Hedef kitle: ${audience}.`)
	if (source) push('source', 'source', `Kaynak olarak şunu kullan: ${source}.`)
	if (format) push('format', 'expectation', `Çıktıyı şu biçimde sun: ${format}.`)
	if (tone) push('tone', 'constraints', `Ton: ${tone}.`)
	if (constraints) push('constraints', 'constraints', `Ayrıca şu kısıtlara uy: ${constraints}.`)
	if (fields.verify) push('verify', 'constraints', VERIFY_SENTENCE)

	return segments
}

export function buildPrompt(fields: PromptFields): string {
	return buildSegments(fields)
		.map((s) => s.text)
		.join(' ')
}

export function coveredParts(fields: PromptFields): Set<PromptPart> {
	return new Set(buildSegments(fields).map((s) => s.part))
}

const wordCount = (value: string) => clean(value).split(' ').filter(Boolean).length

/** Suggestions for what is missing, most important first. */
export function promptHints(fields: PromptFields): PromptHint[] {
	const hints: PromptHint[] = []
	const task = clean(fields.task)
	if (!task) {
		hints.push({
			field: 'task',
			part: 'goal',
			message:
				'Önce görevi yazın: Copilot’tan tam olarak ne yapmasını istiyorsunuz? Bir fiille başlayın (ör. “özetle”, “hazırla”, “karşılaştır”).',
		})
	} else if (wordCount(task) < 3) {
		hints.push({
			field: 'task',
			part: 'goal',
			message:
				'Görev çok kısa. Neyin, hangi konuda yapılacağını ekleyin: “rapor hazırla” yerine “son çeyrek satış sonuçlarını değerlendiren bir rapor hazırla”.',
		})
	}
	if (!clean(fields.context)) {
		hints.push({
			field: 'context',
			part: 'context',
			message:
				'Bağlam ekleyin: Bu çıktı neden ve hangi durum için gerekli? Örneğin “yarınki yönetim toplantısında karar alınacak”.',
		})
	}
	if (!clean(fields.source)) {
		hints.push({
			field: 'source',
			part: 'source',
			message:
				'Kaynağı belirtin: Copilot hangi dosyaya, e-postaya veya veriye dayanmalı? Kaynak yoksa genel bilgi kullanacağını unutmayın.',
		})
	}
	if (!clean(fields.format)) {
		hints.push({
			field: 'format',
			part: 'expectation',
			message:
				'Beklenen çıktıyı tarif edin: madde listesi mi, tablo mu, e-posta taslağı mı? Uzunluk veya başlık sayısı da yardımcı olur.',
		})
	}
	if (!clean(fields.audience) && !clean(fields.tone) && !clean(fields.constraints)) {
		hints.push({
			field: 'audience',
			part: 'constraints',
			message: 'Kısıt ekleyin: Kimin için yazılıyor, hangi tonda, ne uzunlukta olmalı?',
		})
	}
	return hints
}

export interface PromptQuality {
	covered: number
	total: number
	level: 'empty' | 'weak' | 'fair' | 'good' | 'strong'
	label: string
}

export function promptQuality(fields: PromptFields): PromptQuality {
	const covered = coveredParts(fields).size
	const total = PART_ORDER.length
	if (covered === 0) return { covered, total, level: 'empty', label: 'Henüz prompt yok' }
	if (covered <= 2) return { covered, total, level: 'weak', label: 'Başlangıç' }
	if (covered === 3) return { covered, total, level: 'fair', label: 'Gelişiyor' }
	if (covered === 4) return { covered, total, level: 'good', label: 'İyi' }
	return { covered, total, level: 'strong', label: 'Güçlü' }
}

export interface PromptExample {
	id: string
	title: string
	fields: PromptFields
}

export const PROMPT_EXAMPLES: PromptExample[] = [
	{
		id: 'satis-raporu',
		title: 'Çeyrek satış raporu',
		fields: {
			task: 'son çeyrek satış performansını değerlendiren kısa bir rapor hazırla',
			context:
				'rapor, yönetim toplantısında bir sonraki çeyreğin hedeflerini belirlemek için kullanılacak',
			audience: 'satış ekibinin yöneticisi',
			source: 'ekteki “Q3 Satış Sonuçları” tablosu',
			format: 'en önemli üç bulgu, hedeflerden sapmalar ve uygulanabilir öneriler ayrı başlıklarla',
			tone: 'profesyonel, net ve yargılayıcı olmayan',
			constraints: 'en fazla bir sayfa; teknik terimleri açıkla',
			verify: true,
		},
	},
	{
		id: 'proje-epostasi',
		title: 'Proje gecikmesi e-postası',
		fields: {
			task: 'müşteriye proje teslim tarihindeki değişikliği bildiren bir e-posta taslağı yaz',
			context:
				'entegrasyon testlerinde bulunan iki kritik hata nedeniyle teslim iki hafta ertelendi',
			audience: 'müşteri tarafındaki proje sponsoru',
			source: 'son proje durum raporu ve 12 Mayıs toplantı notları',
			format: 'kısa bir giriş, gecikmenin nedeni, yeni takvim ve bir sonraki adımlar',
			tone: 'şeffaf, sakin ve çözüm odaklı',
			constraints: '150 kelimeyi geçmesin; suçlayıcı ifadeler kullanma',
			verify: true,
		},
	},
	{
		id: 'egitim-sunumu',
		title: 'Yeni çalışan eğitimi',
		fields: {
			task: 'yeni çalışanlar için masraf beyan sürecini anlatan 6 slaytlık bir sunum taslağı oluştur',
			context: 'ilk haftasındaki çalışanlar süreci bilmediği için sık hata yapıyor',
			audience: 'finans dışı birimlerden yeni başlayan çalışanlar',
			source: 'şirketin güncel masraf politikası belgesi',
			format: 'her slayt için başlık, üç kısa madde ve konuşmacı notu',
			tone: 'samimi ve anlaşılır',
			constraints: 'jargon kullanma; her slaytta tek bir ana mesaj olsun',
			verify: false,
		},
	},
]

export const FIELD_SUGGESTIONS: Partial<Record<FieldKey, string[]>> = {
	audience: ['yönetim ekibi', 'müşteri', 'yeni başlayan çalışanlar', 'teknik olmayan paydaşlar'],
	format: [
		'madde işaretli kısa özet',
		'karşılaştırma tablosu',
		'e-posta taslağı',
		'başlıklar altında 1 sayfalık rapor',
	],
	tone: ['profesyonel ve net', 'samimi ve anlaşılır', 'resmî', 'ikna edici ama abartısız'],
	constraints: ['en fazla 200 kelime', 'jargon kullanma', 'en önemli 3 maddeyle sınırla'],
}
