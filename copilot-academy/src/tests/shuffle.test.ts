import { describe, expect, it } from 'vitest'
import { seededShuffle } from '@/lib/shuffle'

describe('seededShuffle', () => {
	const items = ['a', 'b', 'c', 'd']

	it('keeps every item and gives the same order for the same seed', () => {
		const once = seededShuffle(items, 'q1:0')
		expect([...once].sort()).toEqual(items)
		expect(seededShuffle(items, 'q1:0')).toEqual(once)
		expect(items).toEqual(['a', 'b', 'c', 'd'])
	})

	it('spreads the first item over every position across seeds', () => {
		const firsts = new Set<number>()
		for (let i = 0; i < 40; i++) firsts.add(seededShuffle(items, `q${i}`).indexOf('a'))
		expect(firsts.size).toBe(4)
	})
})
