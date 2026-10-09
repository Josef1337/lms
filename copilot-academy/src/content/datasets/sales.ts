// Sample sales records used by the Excel lab and scenario B. Fictional data:
// values are thousands of lira, four months, three regions, three products.
export const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan'] as const
export const REGIONS = ['Marmara', 'Ege', 'İç Anadolu'] as const
export const PRODUCTS = ['Bulut Yedekleme', 'Siber Güvenlik', 'Veri Analitiği'] as const

export type Month = (typeof MONTHS)[number]
export type Region = (typeof REGIONS)[number]
export type Product = (typeof PRODUCTS)[number]

export interface SalesRow {
	month: Month
	product: Product
	region: Region
	/** Sales target, thousands of lira. */
	target: number
	/** Actual sales, thousands of lira. */
	actual: number
	customers: number
}

export const SALES_TITLE = 'Ocak–Nisan Satış Verileri'

// prettier-ignore
export const SALES_ROWS: SalesRow[] = [
	{ month: 'Ocak', product: 'Bulut Yedekleme', region: 'Marmara', target: 520, actual: 540, customers: 60 },
	{ month: 'Ocak', product: 'Bulut Yedekleme', region: 'Ege', target: 300, actual: 305, customers: 34 },
	{ month: 'Ocak', product: 'Bulut Yedekleme', region: 'İç Anadolu', target: 280, actual: 275, customers: 31 },
	{ month: 'Ocak', product: 'Siber Güvenlik', region: 'Marmara', target: 440, actual: 465, customers: 33 },
	{ month: 'Ocak', product: 'Siber Güvenlik', region: 'Ege', target: 260, actual: 285, customers: 20 },
	{ month: 'Ocak', product: 'Siber Güvenlik', region: 'İç Anadolu', target: 240, actual: 225, customers: 16 },
	{ month: 'Ocak', product: 'Veri Analitiği', region: 'Marmara', target: 300, actual: 280, customers: 14 },
	{ month: 'Ocak', product: 'Veri Analitiği', region: 'Ege', target: 180, actual: 175, customers: 9 },
	{ month: 'Ocak', product: 'Veri Analitiği', region: 'İç Anadolu', target: 160, actual: 140, customers: 7 },
	{ month: 'Şubat', product: 'Bulut Yedekleme', region: 'Marmara', target: 520, actual: 515, customers: 57 },
	{ month: 'Şubat', product: 'Bulut Yedekleme', region: 'Ege', target: 300, actual: 290, customers: 32 },
	{ month: 'Şubat', product: 'Bulut Yedekleme', region: 'İç Anadolu', target: 280, actual: 260, customers: 29 },
	{ month: 'Şubat', product: 'Siber Güvenlik', region: 'Marmara', target: 460, actual: 470, customers: 34 },
	{ month: 'Şubat', product: 'Siber Güvenlik', region: 'Ege', target: 270, actual: 290, customers: 21 },
	{ month: 'Şubat', product: 'Siber Güvenlik', region: 'İç Anadolu', target: 250, actual: 155, customers: 11 },
	{ month: 'Şubat', product: 'Veri Analitiği', region: 'Marmara', target: 310, actual: 275, customers: 14 },
	{ month: 'Şubat', product: 'Veri Analitiği', region: 'Ege', target: 185, actual: 175, customers: 9 },
	{ month: 'Şubat', product: 'Veri Analitiği', region: 'İç Anadolu', target: 165, actual: 135, customers: 7 },
	{ month: 'Mart', product: 'Bulut Yedekleme', region: 'Marmara', target: 520, actual: 555, customers: 62 },
	{ month: 'Mart', product: 'Bulut Yedekleme', region: 'Ege', target: 300, actual: 325, customers: 36 },
	{ month: 'Mart', product: 'Bulut Yedekleme', region: 'İç Anadolu', target: 280, actual: 275, customers: 31 },
	{ month: 'Mart', product: 'Siber Güvenlik', region: 'Marmara', target: 475, actual: 530, customers: 38 },
	{ month: 'Mart', product: 'Siber Güvenlik', region: 'Ege', target: 280, actual: 330, customers: 24 },
	{ month: 'Mart', product: 'Siber Güvenlik', region: 'İç Anadolu', target: 260, actual: 235, customers: 17 },
	{ month: 'Mart', product: 'Veri Analitiği', region: 'Marmara', target: 320, actual: 300, customers: 15 },
	{ month: 'Mart', product: 'Veri Analitiği', region: 'Ege', target: 190, actual: 275, customers: 14 },
	{ month: 'Mart', product: 'Veri Analitiği', region: 'İç Anadolu', target: 170, actual: 150, customers: 8 },
	{ month: 'Nisan', product: 'Bulut Yedekleme', region: 'Marmara', target: 520, actual: 550, customers: 61 },
	{ month: 'Nisan', product: 'Bulut Yedekleme', region: 'Ege', target: 300, actual: 330, customers: 37 },
	{ month: 'Nisan', product: 'Bulut Yedekleme', region: 'İç Anadolu', target: 280, actual: 270, customers: 30 },
	{ month: 'Nisan', product: 'Siber Güvenlik', region: 'Marmara', target: 495, actual: 545, customers: 39 },
	{ month: 'Nisan', product: 'Siber Güvenlik', region: 'Ege', target: 290, actual: 360, customers: 26 },
	{ month: 'Nisan', product: 'Siber Güvenlik', region: 'İç Anadolu', target: 270, actual: 250, customers: 18 },
	{ month: 'Nisan', product: 'Veri Analitiği', region: 'Marmara', target: 325, actual: 300, customers: 15 },
	{ month: 'Nisan', product: 'Veri Analitiği', region: 'Ege', target: 195, actual: 200, customers: 10 },
	{ month: 'Nisan', product: 'Veri Analitiği', region: 'İç Anadolu', target: 175, actual: 145, customers: 7 },
]
