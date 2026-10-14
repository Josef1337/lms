// Deterministic shuffling for answer options. The same seed always gives the
// same order, so a question keeps its layout through an attempt and across a
// reload, while a new seed (e.g. the next quiz attempt) gives a new order.
// Nothing random is stored.

/** 32-bit FNV-1a hash of a string. */
export function hashSeed(text: string): number {
	let h = 0x811c9dc5
	for (let i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i)
		h = Math.imul(h, 0x01000193)
	}
	return h >>> 0
}

/** Small seeded PRNG (mulberry32); returns floats in [0, 1). */
function mulberry32(seed: number): () => number {
	let a = seed
	return () => {
		a = (a + 0x6d2b79f5) | 0
		let t = Math.imul(a ^ (a >>> 15), 1 | a)
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296
	}
}

/** Returns a new array in an order fixed by `seed` (Fisher–Yates). */
export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
	const out = [...items]
	const next = mulberry32(hashSeed(seed))
	for (let i = out.length - 1; i > 0; i--) {
		const j = Math.floor(next() * (i + 1))
		;[out[i], out[j]] = [out[j], out[i]]
	}
	return out
}
