// localStorage can be missing or throw (private windows, blocked site data,
// quota). Every access goes through here so the app keeps working in memory.
export function readJson<T>(key: string): T | null {
	try {
		const raw = globalThis.localStorage?.getItem(key)
		return raw ? (JSON.parse(raw) as T) : null
	} catch {
		return null
	}
}

export function writeJson(key: string, value: unknown): boolean {
	try {
		globalThis.localStorage?.setItem(key, JSON.stringify(value))
		return true
	} catch {
		return false
	}
}

export function removeKey(key: string): void {
	try {
		globalThis.localStorage?.removeItem(key)
	} catch {
		// nothing to clean up
	}
}
