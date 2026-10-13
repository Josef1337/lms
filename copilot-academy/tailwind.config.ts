import type { Config } from 'tailwindcss'

// Design tokens. Vodafone red carries the brand, graphite is the secondary
// tone and the neutrals are warm greys; each Microsoft 365 app keeps its own
// accent so every lesson has a recognisable identity.
// Layout uses logical utilities (ms-/me-/ps-/pe-/start-/end-) only, so the
// app mirrors correctly if it is ever served right-to-left.
export default {
	content: ['./index.html', './src/**/*.{vue,ts}'],
	theme: {
		extend: {
			colors: {
				// Vodafone red. 600 is the brand red (white text 4.8:1), 800 the deep red.
				brand: {
					50: '#fdecec',
					100: '#fbd6d6',
					200: '#f6abab',
					300: '#ef7878',
					400: '#e94040',
					500: '#f02a2a',
					600: '#e60000',
					700: '#c30000',
					800: '#a80000',
					900: '#8a0000',
					950: '#4a0000',
				},
				// Graphite: the secondary tone next to the red.
				iris: {
					50: '#f4f4f5',
					100: '#e9e9eb',
					200: '#d4d5d8',
					300: '#b3b5b9',
					400: '#8a8d92',
					500: '#63666b',
					600: '#4a4d52',
					700: '#383b3f',
					800: '#2a2d30',
					900: '#1e2023',
				},
				lagoon: {
					50: '#ecfdfb',
					100: '#cff8f3',
					200: '#a2efe7',
					300: '#66e0d6',
					400: '#2cc7be',
					500: '#0faaa4',
					600: '#088985',
					700: '#0b6d6b',
					800: '#0e5756',
					900: '#0f4847',
				},
				// Navigation accent (sidebar cards), the same red as the brand.
				flame: {
					50: '#fdecec',
					100: '#fbd6d6',
					200: '#f6abab',
					500: '#e60000',
					600: '#e60000',
					700: '#a80000',
				},
				line: '#e3e3e5',
				// Warm neutral greys; 800 is the body text colour.
				ink: {
					50: '#f7f7f8',
					100: '#f0f0f1',
					200: '#e3e3e5',
					300: '#cdcecf',
					400: '#9b9da0',
					500: '#696c70',
					600: '#505357',
					700: '#3c3f43',
					800: '#25282b',
					900: '#1a1c1f',
					950: '#111214',
				},
				app: {
					word: '#185abd',
					outlook: '#0f6cbd',
					excel: '#107c41',
					powerpoint: '#c43e1c',
					teams: '#5b5fc7',
				},
				success: { 50: '#ecf8f0', 100: '#d3efdc', 600: '#118043', 700: '#0e6b38' },
				warning: { 50: '#fff7e8', 100: '#ffeac2', 600: '#a65d00', 700: '#8a4d00' },
				danger: { 50: '#fdf0f2', 100: '#fadbe0', 600: '#c4314b', 700: '#a3263d' },
			},
			fontFamily: {
				sans: [
					'"Segoe UI Variable Text"',
					'"Segoe UI"',
					'Inter',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'"Helvetica Neue"',
					'Arial',
					'sans-serif',
				],
				display: [
					'"Segoe UI Variable Display"',
					'"Segoe UI"',
					'"Inter Display"',
					'Inter',
					'system-ui',
					'-apple-system',
					'sans-serif',
				],
				mono: ['"Cascadia Code"', 'Consolas', '"SFMono-Regular"', 'Menlo', 'monospace'],
			},
			boxShadow: {
				card: '0 1px 2px rgba(20, 20, 22, 0.04), 0 1px 3px rgba(20, 20, 22, 0.06)',
				raised: '0 6px 16px -4px rgba(20, 20, 22, 0.10), 0 2px 4px -2px rgba(20, 20, 22, 0.06)',
				float: '0 28px 56px -16px rgba(20, 20, 22, 0.28), 0 8px 18px -8px rgba(20, 20, 22, 0.12)',
				focus: '0 0 0 3px rgba(230, 0, 0, 0.35)',
				red: '0 10px 22px -12px rgba(190, 0, 0, 0.75)',
			},
			borderRadius: {
				'4xl': '2rem',
			},
			keyframes: {
				'fade-up': {
					from: { opacity: '0', transform: 'translateY(6px)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				'fade-in': {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				pop: {
					'0%': { opacity: '0', transform: 'scale(.92)' },
					'60%': { opacity: '1', transform: 'scale(1.03)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				float: {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-6px)' },
				},
				caret: {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0' },
				},
			},
			animation: {
				'fade-up': 'fade-up .28s cubic-bezier(.2,.7,.3,1) both',
				'fade-in': 'fade-in .2s ease-out both',
				pop: 'pop .42s cubic-bezier(.2,.7,.3,1) both',
				float: 'float 7s ease-in-out infinite',
				caret: 'caret 1s steps(1) infinite',
			},
		},
	},
	plugins: [],
	// Touch screens keep :hover after a tap; only apply hover styles where a
	// mouse or trackpad can actually hover.
	future: { hoverOnlyWhenSupported: true },
} satisfies Config
