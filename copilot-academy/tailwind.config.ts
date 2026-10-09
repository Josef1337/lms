import type { Config } from 'tailwindcss'

// Design tokens. Blue, violet and teal carry the brand; each Microsoft 365
// app keeps its own accent so every lesson has a recognisable identity.
// Layout uses logical utilities (ms-/me-/ps-/pe-/start-/end-) only, so the
// app mirrors correctly if it is ever served right-to-left.
export default {
	content: ['./index.html', './src/**/*.{vue,ts}'],
	theme: {
		extend: {
			colors: {
				brand: {
					50: '#eef5fd',
					100: '#dcebfb',
					200: '#b6d5f6',
					300: '#84b8ef',
					400: '#4f97e5',
					500: '#2381dc',
					600: '#0f6cbd',
					700: '#0c5aa0',
					800: '#0e4a82',
					900: '#0f3a63',
					950: '#0a2440',
				},
				iris: {
					50: '#f5f3ff',
					100: '#ebe7ff',
					200: '#d8cffe',
					300: '#bba9fd',
					400: '#9d80f9',
					500: '#825cf0',
					600: '#6b46db',
					700: '#5935b8',
					800: '#4a2e95',
					900: '#3d2a78',
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
				// Navigation accent. 500 is the reference orange used for icons and
				// thin strokes; 600 is the fill behind white text (4.6:1 contrast).
				flame: {
					50: '#fef3ee',
					100: '#fde3d8',
					200: '#f9c4ae',
					500: '#f1653c',
					600: '#cf4613',
					700: '#ae3a10',
				},
				line: '#ededed',
				ink: {
					50: '#f7f8fa',
					100: '#eff1f5',
					200: '#e2e6ec',
					300: '#cdd3dc',
					400: '#9aa3b2',
					500: '#6b7487',
					600: '#4e5668',
					700: '#394051',
					800: '#252b3a',
					900: '#161b27',
					950: '#0d111a',
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
				card: '0 1px 2px rgba(22, 27, 39, 0.04), 0 1px 3px rgba(22, 27, 39, 0.06)',
				raised: '0 6px 16px -4px rgba(22, 27, 39, 0.10), 0 2px 4px -2px rgba(22, 27, 39, 0.06)',
				float: '0 28px 56px -16px rgba(13, 17, 26, 0.28), 0 8px 18px -8px rgba(13, 17, 26, 0.12)',
				focus: '0 0 0 3px rgba(15, 108, 189, 0.35)',
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
