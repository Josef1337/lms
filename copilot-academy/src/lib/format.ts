const nf = new Intl.NumberFormat('tr-TR')
const pf = new Intl.NumberFormat('tr-TR', { style: 'percent', maximumFractionDigits: 0 })
const pf1 = new Intl.NumberFormat('tr-TR', {
	style: 'percent',
	minimumFractionDigits: 1,
	maximumFractionDigits: 1,
})

export const formatNumber = (n: number) => nf.format(n)

/** 0.42 → "%42" (Turkish puts the sign first). */
export const formatPercent = (ratio: number, precise = false) => (precise ? pf1 : pf).format(ratio)

/** Signed change, e.g. +0.081 → "+%8,1". */
export function formatDelta(ratio: number): string {
	const sign = ratio > 0 ? '+' : ratio < 0 ? '−' : ''
	return sign + pf1.format(Math.abs(ratio))
}

/** Values in the sales sample are thousands of lira. */
export const formatKTL = (n: number) => `${nf.format(n)} bin ₺`

export function formatMinutes(total: number): string {
	if (total < 60) return `${total} dk`
	const h = Math.floor(total / 60)
	const m = total % 60
	return m ? `${h} sa ${m} dk` : `${h} sa`
}

const rtf = new Intl.RelativeTimeFormat('tr-TR', { numeric: 'auto' })

export function formatRelative(iso: string, now = Date.now()): string {
	const diff = (new Date(iso).getTime() - now) / 1000
	const abs = Math.abs(diff)
	if (abs < 45) return 'az önce'
	if (abs < 3600) return rtf.format(Math.round(diff / 60), 'minute')
	if (abs < 86400) return rtf.format(Math.round(diff / 3600), 'hour')
	if (abs < 86400 * 7) return rtf.format(Math.round(diff / 86400), 'day')
	return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })
}

export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('tr-TR', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	})
}
