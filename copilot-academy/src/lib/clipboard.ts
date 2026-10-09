// Copies text with the async Clipboard API, falling back to a hidden
// textarea + execCommand where the API is unavailable (older browsers,
// non-secure origins). Resolves to whether the copy succeeded.
export async function copyText(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text)
			return true
		}
	} catch {
		// fall through to the legacy path
	}
	try {
		const area = document.createElement('textarea')
		area.value = text
		area.setAttribute('readonly', '')
		area.style.position = 'fixed'
		area.style.opacity = '0'
		area.style.insetInlineStart = '-9999px'
		document.body.appendChild(area)
		area.select()
		const ok = document.execCommand('copy')
		document.body.removeChild(area)
		return ok
	} catch {
		return false
	}
}
